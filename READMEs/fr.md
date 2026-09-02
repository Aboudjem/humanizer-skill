<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer. Humaniseur et détecteur d'écriture IA. Se lit comme si une personne l'avait écrit. 55 motifs, 5 voix, aucune configuration, et rien ne quitte votre machine." src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=00D4FF" alt="GitHub stars"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <a href="zh-CN.md">简体中文</a> · <a href="ja.md">日本語</a> · <a href="es.md">Español</a> · <b>Français</b>
</p>

<p align="center"><b>Humanizer est un humaniseur et détecteur d'écriture IA, gratuit et open source.</b></p>

<p align="center">
  <a href="#ce-quil-fait">Ce qu'il fait</a> · <a href="#installation">Installation</a> · <a href="#comment-lutiliser">Comment l'utiliser</a> · <a href="#dans-votre-éditeur">Dans votre éditeur</a> · <a href="#pour-aller-plus-loin">Pour aller plus loin</a>
</p>

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

## Ce qu'il fait

L'écriture IA laisse une empreinte. Les phrases font toutes à peu près la même longueur, les mêmes mots prudents reviennent sans cesse, et du remplissage du type "in today's landscape" bouche les trous. Humanizer donne un nom à 55 de ces habitudes, compte celles que contient votre texte, et le réécrit dans la voix que vous choisissez.

Deux termes à expliquer. La *burstiness* mesure à quel point la longueur de vos phrases varie, et un *AI tell* est l'une de ces habitudes qui vous trahissent.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="Graphique de longueur des phrases. La ligne IA est plate et uniforme. La ligne humaine va de 3 à 31 mots. Humanizer rétablit cette variation." src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

## Installation

Dans Claude Code, via la place de marché 10x :

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

Dans n'importe quel autre agent, une seule ligne. Le [CLI skills](https://github.com/vercel-labs/skills) copie la skill dans le dossier que lit votre agent :

```bash
npx skills add Aboudjem/humanizer-skill
```

<details>
<summary>Installer sans l'installeur (curl, ou un chemin par éditeur)</summary>

Dans le projet, pour que ça voyage avec votre dépôt :

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Pour un autre éditeur, changez de dossier : `.cursor/skills/`, `.github/skills/` pour Copilot, `.codex/skills/`, `.gemini/skills/`, `.windsurf/skills/`, `.continue/skills/`. Utilisez `~/.claude/skills/` pour une installation globale. Les chemins complets par agent sont dans [docs/editors.md](../docs/editors.md).

</details>

## Comment l'utiliser

**1. Notez un texte que vous avez déjà écrit.** La commande analyse seulement, elle ne modifie pas le fichier :

```bash
node cli/index.js score examples/blog-post/before.md
```

```text
examples/blog-post/before.md
Score: 46/100  (Mixed)
  Signal breakdown (points out of 100):
    lexical     40.0   weight 0.4   vocabTellDensity 0.0818
    repetition  6.0    weight 0.14  trigramRepetition 0.077
    burstiness  0.0    weight 0.28  burstiness 0.798
    diversity   0.0    weight 0.18  mattr 0.866
  words:                        391
  sentences:                    11
  mean sentence length:         35.55
  ... plus 9 more metric lines
```

Plus le score est bas, plus le texte est humain. Le détail par signal dit lequel a coûté les points, donc vous savez quoi corriger en premier.

**2. Réécrivez-le dans une voix.** Dans votre éditeur, appelez la skill sur votre propre brouillon :

```text
/humanizer --file draft.md --voice technical
```

> **Avant :** This comprehensive guide delves into the intricacies of our authentication system.
>
> **Après :** The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days.

**3. Vérifiez que la réécriture a gardé les faits.** Le vrai risque, c'est qu'un chiffre disparaisse sans bruit :

```bash
node cli/index.js compare --before examples/blog-post/before.md \
  --after examples/blog-post/after.md --check-facts
```

La commande sort en code 1 et nomme ce qui a été perdu : un chiffre, un nom, une URL, une date ou une version.

## Ce que vous obtenez

- **Un score de 0 à 100** de traces d'IA, avec un verdict en cinq paliers, de Pristine à Pure AI smell.
- **Un détail par signal** à chaque score, pour qu'un mauvais chiffre pointe une cause précise.
- **Une réécriture dans l'une des cinq voix** : `casual`, `professional`, `technical`, `warm`, `blunt`.
- **Une vérification des faits** qui échoue si la réécriture a perdu un chiffre, un nom, une URL, une date ou une version.
- **Un code de sortie** pour la CI, et un [hook pre-commit](../docs/pre-commit.md) qui ne note que les fichiers que vous avez mis en staging.

<details>
<summary>Les 55 motifs, par catégorie</summary>

| IDs | Catégorie | Exemples |
|:----|:---------|:---------|
| P1-P8 | Contenu | Gonflage de l'importance, langage promotionnel, vocabulaire IA ("delve", "leverage") |
| P9-P18 | Langue et style | Parallélismes négatifs, tiret cadratin en excès, syndrome de la liste structurée |
| P19-P21 | Communication | Restes de chatbot, avertissements de date de coupure, ton flatteur |
| P22-P30 | Remplissage et flou | Formules de remplissage, conclusions passe-partout, phrases toutes de même longueur |
| P31-P43 | Émergents | Variation élégante, texte de remplacement, fuites de balisage de chat, accroches de téléachat |
| P44-P55 | Métier et analyse forensique | Fausse agentivité, formules d'aphorisme, obfuscation unicode, prudences oratoires oubliées |

Chaque motif a son explication, ses déclencheurs et un exemple avant/après dans
[`SKILL.md`](../skills/humanizer/SKILL.md) et [`references/patterns.md`](../skills/humanizer/references/patterns.md).
Le catalogue principal (P1-P30) s'appuie sur
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (CC BY-SA).

</details>

## Dans votre éditeur

Fonctionne dans Claude Code, Cursor, Codex, Copilot, Gemini CLI et plus de 70 autres agents via `npx skills add`.

| Agent | Commande en une ligne |
|:--|:--|
| Claude Code | `claude plugin install humanizer@10x` |
| N'importe lequel de plus de 70 agents | `npx skills add Aboudjem/humanizer-skill` |
| Un agent précis (Cursor, Codex, Copilot, Gemini CLI, OpenCode, Zed) | ajoutez `-a <agent>` à cette ligne |
| Tout le reste | le tableau dans [docs/editors.md](../docs/editors.md) |

La skill est du Markdown, donc elle tourne sur le modèle que vise votre éditeur.

## Bon à savoir

> [!IMPORTANT]
> Rien ne quitte votre machine. La skill est un seul fichier Markdown que votre éditeur lit en local, et le CLI de métriques optionnel est du Node simple, sans dépendance ni appel réseau. Pas de télémétrie, pas de compte, pas de clé d'API.

- **Le but est de mieux écrire**, pas de tromper un détecteur. Une prose propre ne contient déjà plus les habitudes paresseuses que les détecteurs cherchent, donc corriger l'écriture règle la détection toute seule.
- **Les faux positifs existent.** Les détecteurs se trompent sur l'anglais écrit par des non-anglophones ([Liang et al.](https://arxiv.org/abs/2304.02819)), et écrire des phrases de longueur régulière est simplement l'habitude de certaines personnes. Un garde-fou protège le détail vécu et l'imperfection volontaire.
- **Le chiffre est un substitut**, pas un verdict. Il est reproductible, ce qui en fait un contrôle utilisable, mais il lit des signaux et non du sens. 64 tests figent son comportement.

## Pour aller plus loin

- [La skill elle-même](../skills/humanizer/SKILL.md) et les [analyses de chaque motif](../skills/humanizer/references/patterns.md)
- [Ce que mesure le score](../docs/science.md), la recherche derrière les règles de réécriture
- [Installer dans votre éditeur](../docs/editors.md), [contrôler les commits](../docs/pre-commit.md), [FAQ](../docs/faq.md), [comparatif](../docs/comparison.md)
- [Le CLI de métriques](../cli/README.md), le [CHANGELOG](../CHANGELOG.md), la [LICENCE](../LICENSE)

<p align="center">
  <sub>Réalisé par <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · Licence MIT · Pas de télémétrie, pas de collecte de données</sub>
</p>

<sub>Cette traduction a été réalisée avec l'aide d'une machine à partir de l'anglais ; en cas de doute, la <a href="../README.md">version anglaise</a> fait foi.</sub>
