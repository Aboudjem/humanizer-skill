<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer. Humaniseur d'écriture IA. Ça sonne IA ? Voyez exactement pourquoi. 55 motifs nommés, un score de 0 à 100, une réécriture dans une voix que vous choisissez. Aucun appel réseau propre." src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <a href="zh-CN.md">简体中文</a> · <a href="ja.md">日本語</a> · <a href="es.md">Español</a> · <b>Français</b>
</p>

**Repérez ce qui fait sonner votre brouillon comme une IA. Corrigez-le.**

Humanizer repère les habitudes qui font lire un texte comme écrit par une IA, puis le réécrit dans une voix que vous choisissez.

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

Tapez ensuite `/humanizer --file draft.md` dans votre éditeur, où `draft.md` est n'importe quel fichier Markdown à vous. Par défaut, la réécriture s'affiche dans le chat et le fichier reste tel quel. Ajoutez `--mode edit` pour modifier le fichier sur place.

Voici l'exemple fourni, avant et après, noté par le CLI :

```text
Before   57/100  Mixed
  In today's rapidly evolving technological landscape, artificial intelligence
  is reshaping how we think about creativity and artistic expression.

After     6/100  Pristine
  Stable Diffusion 1.4 was released on 22 August 2022.

Fact check: OK. All 7 fact(s) in the original survive the rewrite.
```

Plus le score est bas, plus le texte est humain. Les deux lignes ouvrent [la paire d'exemple](../examples/blog-post/README.md), et la section [Preuves](#preuves) donne la commande qui affiche ces chiffres.

Votre README sonne comme un chatbot, et vous ne savez pas dire quels mots coincent. Les formules toutes faites s'empilent, et chaque phrase fait à peu près la même longueur. Humanizer nomme chaque habitude et note le brouillon de 0 à 100. Puis il le réécrit.

## Pourquoi l'utiliser

- **Savoir quoi changer.** 55 motifs numérotés, et une liste « Fix first » qui cite les mots qui coûtent des points. La section [Ce que vous obtenez](#ce-que-vous-obtenez) en montre une.
- **Garder vos faits.** `compare --check-facts` fait échouer une réécriture qui a perdu un nombre, une date, une version ou une URL. L'exemple ci-dessus garde ses 7 faits.
- **Bloquer en CI.** `scan --fail-above 40` sort en code 1 sur un brouillon au score trop haut. Un [hook pre-commit](../docs/pre-commit.md) ne vérifie que les fichiers indexés.

Il ne cherche pas à tromper un détecteur d'IA, et ce n'en est pas un. Il corrige l'écriture.

## Ce que vous obtenez

Un rapport qui commence par le verdict, puis dit quoi corriger. Voici le CLI optionnel sur l'exemple :

```bash
node cli/index.js score examples/blog-post/before.md
```

```text
examples/blog-post/before.md
Score: 57/100  (Mixed)
Fix first:
  1. Cut the stock AI words: 19 found ("it is worth noting", "it is important to note", "in today's", "rapidly evolving", ...). Costs 40.0 points (lexical).
  2. Vary the sentence lengths: they run from 13 to 37 words (mean 24.4). Split a long one and add a short one. Costs 16.8 points (burstiness).
  3. Rewrite it with the skill (/humanizer --file examples/blog-post/before.md), then run "compare --check-facts" on the pair.
Detail:
  Signal breakdown (points out of 100):
    lexical     40.0   weight 0.4   vocabTellDensity 0.0697
    burstiness  16.8   weight 0.28  burstiness 0.263
    repetition  0.3    weight 0.14  trigramRepetition 0.004
    diversity   0.0    weight 0.18  mattr 0.843
  ... then 12 metric lines
```

- **Un score de 0 à 100** avec l'un des cinq verdicts, de Pristine à Pure AI smell.
- **Une liste « Fix first »** qui nomme les mots et les phrases qui coûtent les points.
- **Une réécriture dans l'une des cinq voix** : `casual`, `professional`, `technical`, `warm`, `blunt`.
- **Une vérification des faits** qui fait échouer une réécriture ayant perdu un nombre, une date, une version, une URL ou un sigle.
- **Un code de sortie** pour la CI, et un [hook pre-commit](../docs/pre-commit.md) qui ne note que les fichiers indexés.

## Installation

Dans Claude Code, via la place de marché 10x :

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

Dans tout autre agent, une seule ligne avec le [CLI skills](https://github.com/vercel-labs/skills) :

```bash
npx skills add Aboudjem/humanizer-skill
```

Ajoutez `-a codex`, `-a cursor` ou un autre code d'agent pour viser un seul agent. Les codes sont dans [docs/editors.md](../docs/editors.md).

<details>
<summary>Installer sans installeur (curl)</summary>

Cette commande copie dans votre projet le seul fichier dont la skill a besoin :

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Remplacez `.claude/skills/` par le dossier que lit votre agent. Utilisez `~/.claude/skills/` pour une installation globale.

</details>

## Utilisation

**1. Réécrivez un brouillon.** Dans votre éditeur, appelez la skill sur votre propre fichier :

```text
/humanizer --file draft.md --voice technical
```

> **Avant :** This comprehensive guide delves into the intricacies of our authentication system.
>
> **Après :** This guide explains how our authentication system works.

La réécriture retire les tics. Elle n'ajoute jamais un fait absent de la source.

**2. Notez un fichier.** Le CLI est optionnel et tourne depuis un clone. Il lit le fichier et ne change rien :

```bash
git clone https://github.com/Aboudjem/humanizer-skill && cd humanizer-skill
node cli/index.js score examples/blog-post/before.md
```

La sortie est le rapport de [Ce que vous obtenez](#ce-que-vous-obtenez). Mettez à la place le chemin de votre propre fichier.

**3. Vérifiez que la réécriture a gardé les faits.** Le vrai risque, c'est une réécriture qui perd un chiffre sans bruit :

```bash
node cli/index.js compare --before examples/blog-post/before.md --after examples/blog-post/after.md --check-facts
```

```text
Score: 57 -> 6  (delta -51)
  ... then 6 metric lines

Fact check:
  OK. All 7 fact(s) in the original survive the rewrite.
```

La commande sort en code 1 et nomme tout ce qui a été perdu.

**4. Contrôlez un dossier.** Une ligne pour la CI. La première ligne de la sortie est `Result: PASS` ou `Result: FAIL` :

```bash
node cli/index.js scan docs --fail-above 40
```

## Comment ça marche

Un texte écrit par une IA a des habitudes mesurables. Les phrases font à peu près la même longueur, les mêmes mots prudents reviennent, et du remplissage bouche les trous.

| Partie   | Ce qu'elle fait                                                               | Où elle tourne             |
| :------- | :---------------------------------------------------------------------------- | :------------------------- |
| La skill | Nomme 55 motifs, les repère dans votre texte, et réécrit dans la voix choisie | Le modèle de votre éditeur |
| Le CLI   | Calcule le score de 0 à 100 à partir de quatre signaux                        | Node sur votre machine     |

La skill est un seul fichier Markdown, [`SKILL.md`](../skills/humanizer/SKILL.md). Votre éditeur le lit quand vous tapez `/humanizer`.

Le score du CLI est de l'arithmétique simple, donc un même fichier obtient toujours le même chiffre :

| Signal     | Poids | Ce qui coûte des points                                              |
| :--------- | :---- | :------------------------------------------------------------------- |
| lexical    | 0.40  | Mots et formules IA toutes faites, comme « delve » ou « in today's » |
| burstiness | 0.28  | Des phrases qui font toutes à peu près la même longueur              |
| diversity  | 0.18  | Un petit vocabulaire qui se répète                                   |
| repetition | 0.14  | Les mêmes groupes de trois mots qui reviennent                       |

La _burstiness_ mesure à quel point la longueur de vos phrases varie. Un _AI tell_ est l'une de ces habitudes qui trahissent l'IA.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="Graphique de longueur des phrases. La ligne IA est plate et uniforme. La ligne humaine va de 3 à 31 mots. Humanizer rétablit cette variation." src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

<details>
<summary>Les 55 motifs, par catégorie</summary>

| IDs     | Catégorie                    | Exemples                                                                                      |
| :------ | :--------------------------- | :-------------------------------------------------------------------------------------------- |
| P1-P8   | Contenu                      | Gonflage de l'importance, langage promotionnel, vocabulaire IA (« delve », « leverage »)      |
| P9-P18  | Langue et style              | Parallélismes négatifs, abus de tirets, syndrome de la liste structurée                       |
| P19-P21 | Communication                | Restes de chatbot, avertissements de date de coupure, ton flatteur                            |
| P22-P30 | Remplissage et prudence      | Formules de remplissage, conclusions passe-partout, phrases de longueur uniforme              |
| P31-P43 | Émergents                    | Variation élégante, texte de remplacement, fuites de balisage de chat, accroches de téléachat |
| P44-P55 | Métier et analyse forensique | Fausse agentivité, formules d'aphorisme, obfuscation unicode, restes de prudences oratoires   |

Chaque motif a sa liste de déclencheurs dans [`SKILL.md`](../skills/humanizer/SKILL.md). Les analyses détaillées sont dans [`references/patterns.md`](../skills/humanizer/references/patterns.md).
Le catalogue principal (P1-P30) s'appuie sur [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (CC BY-SA).

</details>

## Compatibilité

| Agent               | Installation                                            | Vérification faite                                                           | Testé      |
| :------------------ | :------------------------------------------------------ | :--------------------------------------------------------------------------- | :--------- |
| Claude Code 2.1.326 | `claude plugin install humanizer@10x`                   | Installé depuis la place de marché 10x et validé en mode strict              | 2026-11-17 |
| Codex CLI 0.169.0   | `npx skills add Aboudjem/humanizer-skill -a codex`      | Installé, et la skill a réécrit une phrase                                   | 2026-11-17 |
| Gemini CLI          | `npx skills add Aboudjem/humanizer-skill -a gemini-cli` | Installation seule. Le fichier de la skill est arrivé dans `.agents/skills/` | 2026-11-17 |
| Cursor              | `npx skills add Aboudjem/humanizer-skill -a cursor`     | Installation seule. Le fichier de la skill est arrivé dans `.agents/skills/` | 2026-11-17 |
| OpenCode            | `npx skills add Aboudjem/humanizer-skill -a opencode`   | Installation seule. Le fichier de la skill est arrivé dans `.agents/skills/` | 2026-11-17 |

Documentés, non testés : Copilot, Windsurf, Zed, Kimi Code CLI et les autres agents de [docs/editors.md](../docs/editors.md).

La skill est du Markdown, donc elle tourne sur le modèle que vise votre éditeur.

## Preuves

Chaque chiffre de cette page vient d'une commande que vous pouvez lancer dans un clone.

| Affirmation                                | Commande                                                                           | Ce qu'elle affiche                  |
| :----------------------------------------- | :--------------------------------------------------------------------------------- | :---------------------------------- |
| 90 tests passent                           | `npm test`                                                                         | `# pass 90` et `# fail 0`           |
| 55 motifs                                  | `grep -cE '^\*\*P[0-9]+: ' skills/humanizer/SKILL.md`                              | `55`                                |
| Le dépôt passe son propre contrôle         | `npm run selfcheck`                                                                | `Result: PASS` trois fois           |
| L'exemple passe de 57 à 6 et garde 7 faits | la commande `compare` de [Utilisation](#utilisation)                               | `Score: 57 -> 6` et `All 7 fact(s)` |
| Le CLI n'a aucune dépendance               | `node -p "Object.keys(require('./cli/package.json').dependencies \|\| {}).length"` | `0`                                 |

- La CI lance les tests sur Node 18 et 20, à chaque push et chaque pull request.
- La CI lance aussi les deux voies d'installation : `npx skills add . --list` et `claude plugin validate . --strict`.
- `npm run selfcheck` note ce dépôt avec son propre CLI. Il refuse aussi tout tiret cadratin dans un document.

## FAQ

### Est-ce que quelque chose quitte ma machine ?

Pas depuis Humanizer lui-même. La skill et le CLI ne font aucun appel réseau propre. Pas de télémétrie, pas de compte, pas de clé d'API.

La réécriture tourne sur le modèle de votre éditeur. Si ce modèle est hébergé, votre texte lui est envoyé, comme pour toute requête. Le score du CLI est calculé sur votre machine seulement.

### Mon texte passera-t-il un détecteur d'IA ?

C'est le mauvais objectif, et aucun outil honnête ne peut le promettre. Les détecteurs changent souvent, et leur précision sur un texte réécrit est contestée. Une écriture variée et concrète se lit mieux pour des humains.

### Il a signalé un texte que j'ai écrit moi-même. Est-il cassé ?

Probablement pas, mais il peut se tromper sur vous. Certaines personnes écrivent des phrases régulières par habitude. Les détecteurs se trompent aussi sur l'anglais écrit par des non-anglophones ([Liang et al.](https://arxiv.org/abs/2304.02819)). Prenez le score comme un signal.

### Sur quels modèles tourne-t-il ?

Celui que vise votre éditeur. Les essais de cette page ont utilisé Claude Sonnet dans Claude Code et le modèle par défaut de Codex CLI.

### Ai-je besoin du CLI ?

Non. La skill seule réécrit le texte et estime un score. Le CLI sert à obtenir un chiffre qui ne change jamais d'un lancement à l'autre. C'est ce dont un contrôle en CI a besoin.

### Le CLI est-il sur npm ?

Non. Lancez-le depuis un clone avec `node cli/index.js`. Il demande Node 18 ou plus récent, sans étape d'installation.

L'installeur `npx skills` est un outil séparé. Il demande Node 22 ou plus récent.

D'autres réponses sont dans [docs/faq.md](../docs/faq.md).

## Limites

- **Ce n'est pas un détecteur.** Le score lit quatre signaux du texte. Il ne peut pas prouver qui a écrit un texte.
- **Il ne promet pas de passer un détecteur.** Il corrige l'écriture, rien de plus.
- **Les métriques du CLI sont faites pour l'anglais.** L'annexe des motifs en chinois est un brouillon provisoire.
- **Le `--score` de la skill est une estimation du modèle.** Seul le chiffre du CLI est identique à chaque lancement.
- **La vérification des faits compare des tokens, pas le sens.** Elle rate deux nombres inversés et une affirmation changée sans nombre.
- **Un échantillon de moins de 40 mots est peu fiable.** `scan` le liste et n'échoue jamais dessus.
- **La réécriture dépend de votre modèle.** Un modèle plus faible suit les règles de moins près.

## Pour aller plus loin

- [La skill elle-même](../skills/humanizer/SKILL.md) et les [analyses de chaque motif](../skills/humanizer/references/patterns.md)
- [Ce que mesure le score](../docs/science.md), la recherche derrière les règles de réécriture
- [Installer dans votre éditeur](../docs/editors.md), [contrôler les commits](../docs/pre-commit.md), [comparatif](../docs/comparison.md)
- [Le CLI de métriques](../cli/README.md), le [CHANGELOG](../CHANGELOG.md), la [LICENCE](../LICENSE)

<p align="center">
  <sub>Réalisé par <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · Licence MIT · Pas de télémétrie, pas de collecte de données</sub>
</p>

<sub>Traduction faite avec l'aide d'une machine à partir de l'anglais. En cas de doute, la <a href="../README.md">version anglaise</a> fait foi.</sub>
