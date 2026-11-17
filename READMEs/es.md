<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer. Humanizador de escritura con IA. ¿Suena a IA? Mira exactamente por qué. 55 patrones con nombre, una puntuación de 0 a 100, una reescritura en la voz que elijas. Sin llamadas de red propias." src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <a href="zh-CN.md">简体中文</a> · <a href="ja.md">日本語</a> · <b>Español</b> · <a href="fr.md">Français</a>
</p>

<p align="center"><b>Descubre qué hace que tu borrador suene a IA. Arréglalo.</b></p>

<p align="center">
  <a href="#qué-hace">Qué hace</a> · <a href="#instalación">Instalación</a> · <a href="#cómo-usarlo">Cómo usarlo</a> · <a href="#funciona-en-tu-editor">Funciona en tu editor</a> · <a href="#más-información">Más información</a>
</p>

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

Humanizer encuentra las costumbres que hacen que un texto se lea como escrito por una IA, y luego lo reescribe en la voz que elijas.

Después escribe `/humanizer --file draft.md` en tu editor. La skill reescribe el archivo. La reescritura se ejecuta en el modelo de tu editor.

Tu README suena a chatbot, y no sabes señalar qué palabras fallan. Las frases hechas se acumulan, y todas las frases miden más o menos lo mismo. Humanizer nombra cada costumbre y puntúa el borrador de 0 a 100. Luego lo reescribe.

## Por qué usarlo

- **Saber qué cambiar.** 55 patrones numerados, y una lista "Fix first" que cita las palabras que restan puntos.
- **Conservar tus datos.** `compare --check-facts` falla si una reescritura pierde un número, una fecha, una versión o una URL. El ejemplo incluido conserva sus 7 datos.
- **Bloquear en CI.** `scan --fail-above 40` sale con código 1 si un borrador puntúa demasiado alto. Un [hook de pre-commit](../docs/pre-commit.md) revisa solo los archivos preparados.

No es un detector y no intenta burlar uno. Arregla la escritura.

## Qué hace

La escritura de la IA deja huella. Todas las frases miden más o menos lo mismo, las mismas palabras seguras vuelven una y otra vez, y el relleno tipo "in today's landscape" tapa los huecos. Humanizer pone nombre a 55 de esas costumbres, encuentra las que hay en tu texto y lo reescribe en la voz que elijas. El CLI puntúa el texto de 0 a 100 a partir de cuatro señales medibles, no contando cuántos de los 55 patrones aparecen.

Dos términos que conviene aclarar. La *burstiness* es cuánto varía la longitud de tus frases, y un *AI tell* es una de esas costumbres delatoras.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="Gráfico de longitud de frase. La línea de la IA es plana y uniforme. La línea humana va de 3 a 31 palabras. Humanizer devuelve esa variación." src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

## Instalación

En Claude Code, a través del marketplace 10x:

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

En más de 70 agentes, una línea. El [CLI de skills](https://github.com/vercel-labs/skills) enlaza la skill en el directorio que lee tu agente, o la copia con `--copy`:

```bash
npx skills add Aboudjem/humanizer-skill
```

<details>
<summary>Instalar sin el instalador (curl, o una ruta por editor)</summary>

Dentro del proyecto, para que viaje con tu repositorio:

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

Para otro editor, cambia la carpeta: `.cursor/skills/`, `.github/skills/` para Copilot, `.codex/skills/`, `.gemini/skills/`, `.windsurf/skills/`, `.continue/skills/`. Usa `~/.claude/skills/` para una instalación global. Las rutas completas por agente están en [docs/editors.md](../docs/editors.md).

</details>

## Cómo usarlo

**1. Puntúa algo que ya hayas escrito.** Solo analiza, no modifica el archivo:

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
  ... signal breakdown, then 12 metric lines
```

Cuanto más bajo, más humano. El desglose indica qué señal costó los puntos, así sabes qué corregir primero.

**2. Reescríbelo en una voz.** En tu editor, llama a la skill sobre tu propio borrador:

```text
/humanizer --file draft.md --voice technical
```

> **Antes:** This comprehensive guide delves into the intricacies of our authentication system.
>
> **Después:** This guide explains how our authentication system works.

La reescritura recorta los tics. Nunca añade un dato que no estuviera en el original.

**3. Comprueba que la reescritura conservó los datos.** El riesgo real es que un número desaparezca sin avisar:

```bash
node cli/index.js compare --before examples/blog-post/before.md \
  --after examples/blog-post/after.md --check-facts
```

Sale con código 1 y nombra lo que se perdió: un número, un porcentaje, una URL, una fecha, una versión o una sigla en mayúsculas.

## Qué obtienes

- **Una puntuación de 0 a 100** de rastros de IA, con un veredicto de cinco bandas, de Pristine a Pure AI smell.
- **Un desglose por señal** del comando `score`, para que un número malo apunte a una causa concreta.
- **Una reescritura en una de cinco voces**: `casual`, `professional`, `technical`, `warm`, `blunt`.
- **Una verificación de datos** que falla si la reescritura perdió un número, porcentaje, URL, fecha, versión o sigla en mayúsculas.
- **Un código de salida** para CI y un [hook de pre-commit](../docs/pre-commit.md) que puntúa solo los archivos que preparaste.

<details>
<summary>Los 55 patrones, por categoría</summary>

| IDs | Categoría | Ejemplos |
|:----|:---------|:---------|
| P1-P8 | Contenido | Inflación de importancia, lenguaje publicitario, vocabulario de IA ("delve", "leverage") |
| P9-P18 | Lengua y estilo | Paralelismos negativos, abuso de la raya, síndrome de lista estructurada |
| P19-P21 | Comunicación | Restos de chatbot, avisos de fecha de corte, tono adulador |
| P22-P30 | Relleno y vaguedad | Frases de relleno, conclusiones genéricas, frases todas iguales de largas |
| P31-P43 | Emergentes | Variación elegante, texto de marcador, fugas de marcado de chat, ganchos de teletienda |
| P44-P55 | Oficio y forense | Agencia falsa, fórmulas de aforismo, ofuscación unicode, matices que sobraron |

Cada patrón tiene su explicación y sus disparadores en [`SKILL.md`](../skills/humanizer/SKILL.md). En
[`references/patterns.md`](../skills/humanizer/references/patterns.md), 34 de los 55 llevan además un
par de antes y después, uno por patrón que lo aprovecha.
El catálogo principal (P1-P30) se apoya en
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (CC BY-SA).

</details>

## Funciona en tu editor

Funciona en Claude Code, Cursor, Codex, Copilot, Gemini CLI y más de 70 agentes a través de `npx skills add`.

| Agente | Comando de una línea |
|:--|:--|
| Claude Code | `claude plugin install humanizer@10x` |
| Cualquiera de más de 70 agentes | `npx skills add Aboudjem/humanizer-skill` |
| Un agente concreto (Cursor, Codex, Copilot, Gemini CLI, OpenCode, Zed) | añade `-a <agent>` a esa línea |
| Todo lo demás | la tabla en [docs/editors.md](../docs/editors.md) |

La skill es Markdown, así que corre sobre el modelo al que apunte tu editor.

## Conviene saber

> [!IMPORTANT]
> Humanizer no hace llamadas de red propias. La skill es un archivo Markdown que tu editor lee en local, y el CLI de métricas opcional es Node puro, sin dependencias ni llamadas de red. Sin telemetría, sin cuenta, sin clave de API. La reescritura se ejecuta en el modelo de tu editor: si ese modelo está alojado en la nube, tu texto va a él, como cualquier prompt.

- **El objetivo es escribir mejor**, no burlar a un detector. La prosa limpia ya no trae las costumbres perezosas que buscan los detectores, así que al arreglar la escritura la detección se resuelve sola.
- **Los falsos positivos ocurren.** Los detectores fallan con la escritura en inglés de personas no nativas ([Liang et al.](https://arxiv.org/abs/2304.02819)), y escribir frases de longitud parecida es simplemente la costumbre de algunas personas. Una guarda contra falsos positivos protege el detalle vivido y la imperfección deliberada.
- **El número es un sustituto**, no un veredicto. Es reproducible, que es lo que lo hace útil como control, pero lee señales y no significado. 77 pruebas fijan su comportamiento.

## Más información

- [La skill en sí](../skills/humanizer/SKILL.md) y los [análisis de cada patrón](../skills/humanizer/references/patterns.md)
- [Qué mide la puntuación](../docs/science.md), la investigación detrás de las reglas de reescritura
- [Instalar en tu editor](../docs/editors.md), [controlar los commits](../docs/pre-commit.md), [preguntas frecuentes](../docs/faq.md), [comparativa](../docs/comparison.md)
- [El CLI de métricas](../cli/README.md), el [CHANGELOG](../CHANGELOG.md), la [LICENCIA](../LICENSE)

<p align="center">
  <sub>Hecho por <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · Licencia MIT · Sin telemetría, sin recogida de datos</sub>
</p>

<sub>Esta traducción se hizo con ayuda automática a partir del inglés; en caso de duda, manda la <a href="../README.md">versión en inglés</a>.</sub>
