<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer: AI っぽく聞こえる理由を見る。2 枚のターミナルカード: Before は 100 点中 57 点で決まり文句に下線、After は 6 点。事実チェック OK、7 つの事実はすべて残る。" src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <a href="zh-CN.md">简体中文</a> · <b>日本語</b> · <a href="es.md">Español</a> · <a href="fr.md">Français</a>
</p>

**下書きが AI っぽく聞こえる理由を見て、直す。**

Humanizer は機械っぽく聞こえる語を引用し、下書きを書き直します。

| どの語かわかる | 人間らしく読める | 事実が残る |
|:--|:--|:--|
| AI っぽい語を一つずつ引用します。CLI はそれを「Fix first」リストに並べます。 | 同梱の例は 100 点中 57 点から 6 点に下がります。低いほど人間らしい文章です。 | CLI の `compare --check-facts` は、数字、日付、バージョン、URL を失った書き直しを失敗にします。 |

**対応:** スキルを読むすべてのエージェント。特定のモデルに縛られません。スキルは 1 つの Markdown ファイルで、エージェントのモデルが実行します。

テスト済み: Codex CLI。インストールのみテスト済み: Claude Code、Cursor、Gemini CLI、GitHub Copilot、OpenCode。

すべてのプロジェクトにインストールします:

```bash
npx skills add Aboudjem/humanizer-skill -g
# then, in your agent: /humanizer --file draft.md --voice casual
```

リポジトリに同梱の[例](../examples/blog-post/README.md)の、書き直し前と後を CLI で採点した結果です:

```text
Before   57/100  Mixed
  In today's rapidly evolving technological landscape, artificial intelligence
  is reshaping how we think about creativity and artistic expression.

After     6/100  Pristine
  Stable Diffusion 1.4 was released on 22 August 2022.

Fact check: OK. All 7 fact(s) in the original survive the rewrite.
```

スコアは低いほど人間らしい文章です。数字を出すコマンドは[根拠](#根拠)にあります。

**これは何か:** 文章の中の AI っぽい語を見つけて書き直すスキルです。

**いつ使うか:** AI の助けで書いた README、ブログ記事、メールを公開する前です。

**何が得られるか:** 5 つのボイスのどれかで書き直した文章がチャットに出ます。ファイルが変わるのは `--mode edit` を付けたときだけです。

AI 検出器ではなく、検出器を通ることも約束しません。

## 得られるもの

まず判定を示し、次に直す点を挙げるレポートです。例に対して任意の CLI を実行するとこうなります。

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

- **0 から 100 のスコア**と、Pristine から Pure AI smell までの 5 段階の判定。
- **「Fix first」リスト**。点数を下げている語と文を名指しします。
- **5 つのボイスから選ぶ書き直し**：`casual`、`professional`、`technical`、`warm`、`blunt`。
- **事実チェック**。数値、日付、バージョン、URL、略語を落とした書き直しを失敗にします。
- **CI 用の終了コード**と、ステージしたファイルだけを採点する [pre-commit フック](../docs/pre-commit.md)。

## インストール

**おすすめ: Vercel の skills CLI。** `npx skills` は、エージェントスキル用の Vercel のオープンなインストーラーです。

```bash
npx skills add Aboudjem/humanizer-skill -g
```

78 のエージェントで動きます。メニューで自分のものを選んでください ([対応エージェント](https://github.com/vercel-labs/skills#supported-agents))。すべてのプロジェクトにインストールします。

ターミナルでは、このコマンドがエージェントのメニューを表示します。対話できるターミナルがないと、すべてのエージェントのフォルダにインストールします。スクリプトでは `-a <agent>` を使ってください。

<a href="https://skills.sh/aboudjem/humanizer-skill"><img src="https://img.shields.io/badge/skills.sh-000000?style=flat-square&logo=vercel&logoColor=white" alt="skills.sh" height="24"></a> Humanizer のページ: [skills.sh/aboudjem/humanizer-skill](https://skills.sh/aboudjem/humanizer-skill).

**または、1 つのエージェントに直接インストールする。** どのコマンドも、すべてのプロジェクトにインストールします。

<p align="center">
  <a href="#install-codex"><img src="https://img.shields.io/badge/Codex-000000?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyBmaWxsPSJ3aGl0ZSIgcm9sZT0iaW1nIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%2BPHRpdGxlPk9wZW5BSTwvdGl0bGU%2BPHBhdGggZD0iTTIyLjI4MTkgOS44MjExYTUuOTg0NyA1Ljk4NDcgMCAwIDAtLjUxNTctNC45MTA4IDYuMDQ2MiA2LjA0NjIgMCAwIDAtNi41MDk4LTIuOUE2LjA2NTEgNi4wNjUxIDAgMCAwIDQuOTgwNyA0LjE4MThhNS45ODQ3IDUuOTg0NyAwIDAgMC0zLjk5NzcgMi45IDYuMDQ2MiA2LjA0NjIgMCAwIDAgLjc0MjcgNy4wOTY2IDUuOTggNS45OCAwIDAgMCAuNTExIDQuOTEwNyA2LjA1MSA2LjA1MSAwIDAgMCA2LjUxNDYgMi45MDAxQTUuOTg0NyA1Ljk4NDcgMCAwIDAgMTMuMjU5OSAyNGE2LjA1NTcgNi4wNTU3IDAgMCAwIDUuNzcxOC00LjIwNTggNS45ODk0IDUuOTg5NCAwIDAgMCAzLjk5NzctMi45MDAxIDYuMDU1NyA2LjA1NTcgMCAwIDAtLjc0NzUtNy4wNzI5em0tOS4wMjIgMTIuNjA4MWE0LjQ3NTUgNC40NzU1IDAgMCAxLTIuODc2NC0xLjA0MDhsLjE0MTktLjA4MDQgNC43NzgzLTIuNzU4MmEuNzk0OC43OTQ4IDAgMCAwIC4zOTI3LS42ODEzdi02LjczNjlsMi4wMiAxLjE2ODZhLjA3MS4wNzEgMCAwIDEgLjAzOC4wNTJ2NS41ODI2YTQuNTA0IDQuNTA0IDAgMCAxLTQuNDk0NSA0LjQ5NDR6bS05LjY2MDctNC4xMjU0YTQuNDcwOCA0LjQ3MDggMCAwIDEtLjUzNDYtMy4wMTM3bC4xNDIuMDg1MiA0Ljc4MyAyLjc1ODJhLjc3MTIuNzcxMiAwIDAgMCAuNzgwNiAwbDUuODQyOC0zLjM2ODV2Mi4zMzI0YS4wODA0LjA4MDQgMCAwIDEtLjAzMzIuMDYxNUw5Ljc0IDE5Ljk1MDJhNC40OTkyIDQuNDk5MiAwIDAgMS02LjE0MDgtMS42NDY0ek0yLjM0MDggNy44OTU2YTQuNDg1IDQuNDg1IDAgMCAxIDIuMzY1NS0xLjk3MjhWMTEuNmEuNzY2NC43NjY0IDAgMCAwIC4zODc5LjY3NjVsNS44MTQ0IDMuMzU0My0yLjAyMDEgMS4xNjg1YS4wNzU3LjA3NTcgMCAwIDEtLjA3MSAwbC00LjgzMDMtMi43ODY1QTQuNTA0IDQuNTA0IDAgMCAxIDIuMzQwOCA3Ljg3MnptMTYuNTk2MyAzLjg1NThMMTMuMTAzOCA4LjM2NCAxNS4xMTkyIDcuMmEuMDc1Ny4wNzU3IDAgMCAxIC4wNzEgMGw0LjgzMDMgMi43OTEzYTQuNDk0NCA0LjQ5NDQgMCAwIDEtLjY3NjUgOC4xMDQydi01LjY3NzJhLjc5Ljc5IDAgMCAwLS40MDctLjY2N3ptMi4wMTA3LTMuMDIzMWwtLjE0Mi0uMDg1Mi00Ljc3MzUtMi43ODE4YS43NzU5Ljc3NTkgMCAwIDAtLjc4NTQgMEw5LjQwOSA5LjIyOTdWNi44OTc0YS4wNjYyLjA2NjIgMCAwIDEgLjAyODQtLjA2MTVsNC44MzAzLTIuNzg2NmE0LjQ5OTIgNC40OTkyIDAgMCAxIDYuNjgwMiA0LjY2ek04LjMwNjUgMTIuODYzbC0yLjAyLTEuMTYzOGEuMDgwNC4wODA0IDAgMCAxLS4wMzgtLjA1NjdWNi4wNzQyYTQuNDk5MiA0LjQ5OTIgMCAwIDEgNy4zNzU3LTMuNDUzN2wtLjE0Mi4wODA1TDguNzA0IDUuNDU5YS43OTQ4Ljc5NDggMCAwIDAtLjM5MjcuNjgxM3ptMS4wOTc2LTIuMzY1NGwyLjYwMi0xLjQ5OTggMi42MDY5IDEuNDk5OHYyLjk5OTRsLTIuNTk3NCAxLjQ5OTctMi42MDY3LTEuNDk5N1oiLz48L3N2Zz4%3D" alt="Codex" height="24"></a>
  <a href="#install-claude-code"><img src="https://img.shields.io/badge/Claude_Code-D97757?style=flat-square&logo=claude&logoColor=white" alt="Claude Code" height="24"></a>
  <a href="#install-cursor"><img src="https://img.shields.io/badge/Cursor-3B3B3B?style=flat-square&logo=cursor&logoColor=white" alt="Cursor" height="24"></a>
  <a href="#install-gemini-cli"><img src="https://img.shields.io/badge/Gemini-1A73E8?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini CLI" height="24"></a>
  <a href="#install-github-copilot"><img src="https://img.shields.io/badge/Copilot-24292F?style=flat-square&logo=githubcopilot&logoColor=white" alt="GitHub Copilot" height="24"></a>
  <a href="#install-opencode"><img src="https://img.shields.io/badge/OpenCode-4A4A4A?style=flat-square&logo=opencode&logoColor=white" alt="OpenCode" height="24"></a>
</p>

<a id="install-codex"></a>**Codex**、テスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a codex
```

<a id="install-claude-code"></a>**Claude Code**、インストールのみテスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a claude-code
```

<a id="install-cursor"></a>**Cursor**、インストールのみテスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a cursor
```

<a id="install-gemini-cli"></a>**Gemini CLI**、インストールのみテスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a gemini-cli
```

<a id="install-github-copilot"></a>**GitHub Copilot**、インストールのみテスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a github-copilot
```

<a id="install-opencode"></a>**OpenCode**、インストールのみテスト済み:

```bash
npx skills add Aboudjem/humanizer-skill -g -a opencode
```

**Claude Code プラグイン。** 同じスキルを 10x マーケットプレイスから入れます。コマンドやフックは追加しません:

```bash
claude plugin marketplace add Aboudjem/10x && claude plugin install humanizer@10x
```

このプロジェクトだけなら `-g` を外します。ほかのエージェントの `-a` コードは [docs/editors.md](../docs/editors.md) にあります。

<details>
<summary>インストーラーなしでインストール (curl)</summary>

スキルに必要な 1 つのファイルをプロジェクトにコピーします:

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

`.claude/skills/` はエージェントが読むフォルダに置き換えてください。グローバルにインストールするなら `~/.claude/skills/` を使います。

</details>

## 使い方

**1. 下書きを書き直す。** エージェントで、自分のファイルにスキルを呼び出します:

```text
/humanizer --file draft.md --voice technical
```

> **Before:** This comprehensive guide delves into the intricacies of our authentication system.
>
> **After:** This guide explains how our authentication system works.

書き直しは AI のクセを取り除きます。元の文章にない事実は決して足しません。
標準では書き直しをチャットに表示し、ファイルはそのままです。ファイルを直接変えるには `--mode edit` を付けます。

**2. ファイルを採点する。** CLI は任意で、クローンから動かします。ファイルを読むだけで、何も変えません:

```bash
git clone https://github.com/Aboudjem/humanizer-skill && cd humanizer-skill
node cli/index.js score examples/blog-post/before.md
```

出力は[得られるもの](#得られるもの)のレポートです。自分のファイルのパスに置き換えてください。

**3. 書き直しが事実を残したか確かめる。** 本当の危険は、数字を落とす書き直しです:

```bash
node cli/index.js compare --before examples/blog-post/before.md --after examples/blog-post/after.md --check-facts
```

```text
Score: 57 -> 6  (delta -51)
  ... then 6 metric lines

Fact check:
  OK. All 7 fact(s) in the original survive the rewrite.
```

終了コード 1 で終わり、失われたものを示します。

**4. 悪い下書きを CI で止める** (自動チェック)。`scan --fail-above 40` はスコアが高すぎる下書きで終了コード 1 を返します。出力の 1 行目は `Result: PASS` か `Result: FAIL` です:

```bash
node cli/index.js scan docs --fail-above 40
```

## 仕組み

README がチャットボットの書いたように読める。でも、どの語が原因かは言えない。
AI が書いた文章には測れるクセがあります。どの文もだいたい同じ長さです。同じ無難な言い回しが何度も出てきます。

| 部分   | 役割                                                            | 動く場所            |
| :----- | :-------------------------------------------------------------- | :------------------ |
| スキル | 55 パターンに名前を付け、文章から見つけ、5 つのボイスのどれかで書き直す | エージェントのモデル |
| CLI    | 4 つのシグナルから 0 から 100 のスコアを計算する                | 手元のマシンの Node |

スキルは 1 枚の Markdown ファイル、[`SKILL.md`](../skills/humanizer/SKILL.md) です。`/humanizer` と入力すると、エージェントがこれを読みます。

CLI のスコアは単純な計算なので、同じファイルはいつも同じ数字になります。

| シグナル   | 重み | 減点の対象                                        |
| :--------- | :--- | :------------------------------------------------ |
| lexical    | 0.40 | 「delve」や「in today's」のような AI の決まり文句 |
| burstiness | 0.28 | どれもほぼ同じ長さの文                            |
| diversity  | 0.18 | 同じ語ばかり繰り返す狭い語彙                      |
| repetition | 0.14 | 何度も戻ってくる同じ 3 語の並び                   |

_burstiness_ は文の長さのばらつきのことです。_AI tell_ はそうした AI らしさが出るクセのことです。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="文の長さのグラフ。AI の線は平らで均一。人間の線は 3 語から 31 語まで変化する。Humanizer はこのばらつきを取り戻す。" src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

<details>
<summary>55 パターンの一覧（カテゴリ別）</summary>

| ID      | カテゴリ           | 例                                                                                 |
| :------ | :----------------- | :--------------------------------------------------------------------------------- |
| P1-P8   | 内容               | 重要性の誇張、宣伝調、AI 語彙（「delve」「leverage」）                             |
| P9-P18  | 言葉と文体         | 否定の並列、ダッシュの多用、箇条書き症候群                                         |
| P19-P21 | コミュニケーション | チャットボットの名残、知識の期限の断り書き、へつらう口調                           |
| P22-P30 | つなぎと予防線     | つなぎの言い回し、ありきたりな結論、そろった文の長さ                               |
| P31-P43 | 新しいもの         | 言い換えの連鎖、プレースホルダー文、チャットのマークアップ漏れ、通販番組風のつかみ |
| P44-P55 | 技巧と痕跡         | 偽の主体、格言の型、Unicode による難読化、消し忘れた予防線                         |

各パターンの発動条件は [`SKILL.md`](../skills/humanizer/SKILL.md) にあります。詳しい解説は [`references/patterns.md`](../skills/humanizer/references/patterns.md) にあります。
中核のカタログ（P1-P30）は [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)（CC BY-SA）に基づきます。

</details>

## 対応エージェント

| エージェント | インストール | 実施した確認 | テスト日 |
| :-- | :-- | :-- | :-- |
| Claude Code 2.1.326 | `claude plugin install humanizer@10x` | 10x マーケットプレイスからユーザー向けにインストールし、strict モードで検証 | 2026-11-17 |
| Codex CLI 0.169.0 | `npx skills add Aboudjem/humanizer-skill -g -a codex` | インストールし、スキルが 1 文を書き直した (プロジェクトへのインストール) | 2026-11-17 |
| Gemini CLI | `npx skills add Aboudjem/humanizer-skill -g -a gemini-cli` | インストールのみ。スキルのファイルが `~/.agents/skills/` に入った | 2026-11-17 |
| Cursor | `npx skills add Aboudjem/humanizer-skill -g -a cursor` | インストールのみ。スキルのファイルが `~/.agents/skills/` に入った | 2026-11-17 |
| GitHub Copilot | `npx skills add Aboudjem/humanizer-skill -g -a github-copilot` | インストールのみ。スキルのファイルが `~/.agents/skills/` に入った | 2026-11-17 |
| OpenCode | `npx skills add Aboudjem/humanizer-skill -g -a opencode` | インストールのみ。スキルのファイルが `~/.agents/skills/` に入った | 2026-11-17 |

どのグローバルインストールも、2026-11-17 に空のホームフォルダで実行しました。文書化のみで未検証のもの：Windsurf、Zed、Kimi Code CLI、そのほか [docs/editors.md](../docs/editors.md) にあるエージェント。

スキルは Markdown なので、エージェントが使うモデルで動きます。特定のモデルには縛られません。

## 根拠

このページの数字はすべて、クローンで実行できるコマンドから出ています。

| 主張                                    | コマンド                                                                           | 出力                                |
| :-------------------------------------- | :--------------------------------------------------------------------------------- | :---------------------------------- |
| 90 個のテストが通る                     | `npm test`                                                                         | `# pass 90` と `# fail 0`           |
| 55 パターン                             | `grep -cE '^\*\*P[0-9]+: ' skills/humanizer/SKILL.md`                              | `55`                                |
| リポジトリが自分のゲートを通る          | `npm run selfcheck`                                                                | `Result: PASS` が 3 回              |
| 例が 57 から 6 になり、7 つの事実を保つ | [使い方](#使い方)の `compare` コマンド                                             | `Score: 57 -> 6` と `All 7 fact(s)` |
| CLI に依存パッケージがない              | `node -p "Object.keys(require('./cli/package.json').dependencies \|\| {}).length"` | `0`                                 |

- CI は push と pull request のたびに、Node 18 と 20 でテストを実行します。
- CI は 2 つの導入経路も実行します：`npx skills add . --list` と `claude plugin validate . --strict`。
- `npm run selfcheck` はこのリポジトリを自身の CLI で採点します。文書中の em ダッシュも拒否します。

## FAQ

### 何かがマシンの外に出ますか

Humanizer 自身からは出ません。スキルと CLI は独自のネットワーク呼び出しをしません。テレメトリも、アカウントも、API キーもありません。

書き直しはエージェントのモデルで動きます。そのモデルがホストされていれば、ほかのプロンプトと同じく文章はそこへ送られます。CLI のスコアは手元のマシンだけで計算します。

### AI 検出器を通るようになりますか

それは目標として間違っていて、誠実なツールなら約束できません。検出器はよく変わり、書き直した文章での精度には異論があります。本物の変化と具体的な細部のある文章は、人にとって読みやすくなります。

### 自分で書いた文章が指摘されました。壊れていますか

おそらく壊れてはいませんが、あなたについて間違えることはあります。文の長さをそろえて書く癖の人もいます。検出器は英語を母語としない人の英文でも誤作動します（[Liang ほか](https://arxiv.org/abs/2304.02819)）。スコアは一つのシグナルとして扱ってください。

### どのモデルで動きますか

エージェントが使っているモデルです。このページの実行では、Claude Code の Claude Sonnet と Codex CLI の既定モデルを使いました。

### CLI は必要ですか

いいえ。スキルだけで書き直しとスコアの見積もりができます。CLI は、実行のたびに変わらない数字のためにあります。CI のゲートにはそれが必要です。

### CLI は npm にありますか

いいえ。クローンから `node cli/index.js` で実行します。Node 18 以上が必要で、インストール手順はありません。

`npx skills` のインストーラは別のツールです。Node 22 以上が必要です。

ほかの回答は [docs/faq.md](../docs/faq.md) にあります。

## 限界

- **検出器ではありません。** スコアは文章の 4 つのシグナルを読みます。誰が書いたかは証明できません。
- **検出器を通ることは約束しません。** 文章を直すだけです。
- **CLI の指標は英語向けです。** 中国語のパターン付録は暫定の草稿です。
- **スキルの `--score` はモデルの見積もりです。** 毎回同じになるのは CLI の数字だけです。
- **事実チェックが比べるのはトークンで、意味ではありません。** 2 つの数値の入れ替えや、数値を含まない主張の変更は見逃します。
- **40 語未満のサンプルは信頼度が低くなります。** `scan` は一覧に出しますが、それで失敗にはしません。
- **書き直しの質はモデル次第です。** 弱いモデルほどルールに従う精度が落ちます。

## もっと知る

- [スキル本体](../skills/humanizer/SKILL.md)と[パターンの詳解](../skills/humanizer/references/patterns.md)
- [スコアが測っているもの](../docs/science.md)、書き直しルールの根拠になった研究
- [エディタへの導入](../docs/editors.md)、[コミットのゲート化](../docs/pre-commit.md)、[比較](../docs/comparison.md)
- [指標 CLI](../cli/README.md)、[CHANGELOG](../CHANGELOG.md)、[LICENSE](../LICENSE)

<p align="center">
  <sub>制作: <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> · MIT ライセンス · テレメトリなし、データ収集なし</sub>
</p>

<sub>この文書は英語版からの機械支援翻訳です。差異がある場合は<a href="../README.md">英語版</a>が優先されます。</sub>
