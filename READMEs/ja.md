<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer。AI 文章のヒューマナイザーと検出器。人が書いたように読めます。55 個のパターン、5 種類のボイス、設定不要、そして何もマシンの外に出ません。" src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=00D4FF" alt="GitHub stars"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <a href="zh-CN.md">简体中文</a> · <b>日本語</b> · <a href="es.md">Español</a> · <a href="fr.md">Français</a>
</p>

<p align="center"><b>Humanizer は無料でオープンソースの、AI 文章のヒューマナイザーと検出器です。</b></p>

<p align="center">
  <a href="#できること">できること</a> · <a href="#インストール">インストール</a> · <a href="#使い方">使い方</a> · <a href="#エディタで使う">エディタで使う</a> · <a href="#もっと知る">もっと知る</a>
</p>

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

## できること

AI の文章には指紋があります。どの文もだいたい同じ長さで、同じ無難な語が何度も出てきて、「in today's landscape」のような埋め草が隙間を埋めます。Humanizer はそうしたクセを 55 個に名前を付け、あなたの文章にいくつあるかを採点し、選んだボイスで書き直します。

用語をふたつだけ。*バースティネス（burstiness）*は文の長さがどれだけばらつくかで、*AI テル（AI tell）*はいま挙げたような分かりやすいクセのことです。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="文の長さのグラフ。AI の線は平坦で均一。人間の線は 3 語から 31 語まで動く。Humanizer はこのばらつきを取り戻す。" src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

## インストール

Claude Code では、10x マーケットプレイス経由で:

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

ほかのエージェントなら 1 行です。[skills CLI](https://github.com/vercel-labs/skills) が、あなたのエージェントが読むディレクトリにスキルをコピーします:

```bash
npx skills add Aboudjem/humanizer-skill
```

<details>
<summary>インストーラを使わない方法（curl、またはエディタごとのパス）</summary>

プロジェクト内に置けば、リポジトリと一緒に持ち運べます:

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

別のエディタならフォルダを変えるだけです: `.cursor/skills/`、Copilot は `.github/skills/`、`.codex/skills/`、`.gemini/skills/`、`.windsurf/skills/`、`.continue/skills/`。全体で使うなら `~/.claude/skills/` を使ってください。エージェントごとの完全なパスは [docs/editors.md](../docs/editors.md) にあります。

</details>

## 使い方

**1. すでに書いたものを採点する。** これはスキャンするだけで、ファイルは変更しません:

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

低いほど人間らしい、という向きです。内訳がどのシグナルで点を失ったかを示すので、どこから直すか分かります。

**2. ボイスを選んで書き直す。** エディタで、自分の下書きに対してスキルを呼びます:

```text
/humanizer --file draft.md --voice technical
```

> **前:** This comprehensive guide delves into the intricacies of our authentication system.
>
> **後:** The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days.

**3. 書き直しが事実を落としていないか確かめる。** 数字が静かに消えることこそ本当のリスクです:

```bash
node cli/index.js compare --before examples/blog-post/before.md \
  --after examples/blog-post/after.md --check-facts
```

終了コード 1 で終わり、失われたものを挙げます: 数字、名前、URL、日付、バージョンのいずれかです。

## 得られるもの

- **0 から 100 の AI テルスコア**。Pristine から Pure AI smell までの 5 段階の判定つき。
- **毎回のスコアに付くシグナル別の内訳**。悪い数字が具体的な原因を指します。
- **5 種類のボイスでの書き直し**: `casual`、`professional`、`technical`、`warm`、`blunt`。
- **ファクトチェック**。数字、名前、URL、日付、バージョンを落とした書き直しを失敗と判定します。
- **CI 用の終了コード**と、ステージしたファイルだけを採点する [pre-commit フック](../docs/pre-commit.md)。

<details>
<summary>55 個のパターン、カテゴリ別</summary>

| ID | カテゴリ | 例 |
|:----|:---------|:---------|
| P1-P8 | 内容 | 意義の水増し、宣伝的な言い回し、AI 語彙（"delve"、"leverage"） |
| P9-P18 | 言語とスタイル | 否定の対句、em dash の多用、箇条書き症候群 |
| P19-P21 | コミュニケーション | チャットボットの痕跡、知識カットオフの断り書き、へつらう口調 |
| P22-P30 | 埋め草とぼかし | 埋め草表現、定型の締め、文の長さが揃いすぎ |
| P31-P43 | 新しいもの | 同義語の言い換え、プレースホルダ、チャット記法の漏れ、通販的なフック |
| P44-P55 | 技巧と鑑識 | 偽の主体、格言の型、Unicode の難読化、消し忘れたぼかし表現 |

各パターンの解説、トリガー、前後の例は
[`SKILL.md`](../skills/humanizer/SKILL.md) と [`references/patterns.md`](../skills/humanizer/references/patterns.md) にあります。
中核のカタログ（P1-P30）は
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)（CC BY-SA）に基づいています。

</details>

## エディタで使う

`npx skills add` を通じて、Claude Code、Cursor、Codex、Copilot、Gemini CLI、そのほか 70 以上のエージェントで動きます。

| エージェント | 1 行コマンド |
|:--|:--|
| Claude Code | `claude plugin install humanizer@10x` |
| 70 以上のエージェントのどれでも | `npx skills add Aboudjem/humanizer-skill` |
| 特定のエージェント（Cursor、Codex、Copilot、Gemini CLI、OpenCode、Zed） | 上の行に `-a <agent>` を足す |
| そのほか全部 | [docs/editors.md](../docs/editors.md) の表を参照 |

スキルは Markdown なので、エディタが向いているモデルがそのまま動作するモデルになります。

## 知っておきたいこと

> [!IMPORTANT]
> 何もマシンの外に出ません。スキルはエディタがローカルで読む Markdown ファイル 1 枚で、任意の指標 CLI は依存もネットワーク呼び出しもない素の Node です。テレメトリなし、アカウント不要、API キー不要。

- **目的は良い文章を書くこと**であって、検出器を出し抜くことではありません。整った文章はそもそも検出器が探す怠けたクセを含まないので、書き方を直せば検出の話は自然に片づきます。
- **誤検知は起こります。** 検出器は英語を母語としない書き手の文章で誤作動することが知られており（[Liang ほか](https://arxiv.org/abs/2304.02819)）、文の長さが揃うのは単なる書き癖のこともあります。誤検知ガードが、実体験の細部や意図的な不揃いを守ります。
- **この数字は代理指標**であって判決ではありません。再現できるからゲートとして使えますが、読んでいるのは意味ではなくシグナルです。64 個のテストがその挙動を固定しています。

## もっと知る

- [スキル本体](../skills/humanizer/SKILL.md) と[パターンの詳解](../skills/humanizer/references/patterns.md)
- [スコアが測っているもの](../docs/science.md)、書き直しルールの根拠になった研究
- [エディタへの導入](../docs/editors.md)、[コミットのゲート化](../docs/pre-commit.md)、[FAQ](../docs/faq.md)、[比較](../docs/comparison.md)
- [指標 CLI](../cli/README.md)、[CHANGELOG](../CHANGELOG.md)、[LICENSE](../LICENSE)

<p align="center">
  <sub>制作: <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · MIT ライセンス · テレメトリなし、データ収集なし</sub>
</p>

<sub>この文書は英語版からの機械支援翻訳です。差異がある場合は<a href="../README.md">英語版</a>が優先されます。</sub>
