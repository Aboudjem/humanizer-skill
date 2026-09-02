<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/hero-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/hero-light.svg">
  <img alt="humanizer。AI 写作人性化工具与检测器。读起来像真人写的。55 个模式，5 种语音，零配置，任何内容都不会离开你的机器。" src="../.github/assets/hero-light.svg" width="100%">
</picture>

<p align="center">
  <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="License: MIT"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Aboudjem/humanizer-skill/ci.yml?branch=main&style=flat-square&label=CI" alt="CI status"></a>
  <a href="../skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-55-FF006E?style=flat-square" alt="55 AI writing patterns"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=00D4FF" alt="GitHub stars"></a>
</p>

<p align="center">
  <a href="../README.md">English</a> · <b>简体中文</b> · <a href="ja.md">日本語</a> · <a href="es.md">Español</a> · <a href="fr.md">Français</a>
</p>

<p align="center"><b>Humanizer 是一个免费开源的 AI 写作人性化工具与检测器。</b></p>

<p align="center">
  <a href="#它做什么">它做什么</a> · <a href="#安装">安装</a> · <a href="#怎么用">怎么用</a> · <a href="#在你的编辑器里使用">在你的编辑器里使用</a> · <a href="#延伸阅读">延伸阅读</a>
</p>

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

## 它做什么

AI 写出来的文字有指纹。句子长度几乎都差不多，同一批安全词反复出现，还会用「in today's landscape」这类填充语撑场面。Humanizer 给其中 55 种习惯命了名，在你的文字里找出它们，然后按你选定的语音风格重写。CLI 另外给文字打一个 0 到 100 的分数，依据四个可测量的信号，而不是数这 55 个模式命中了几个。

两个词值得先解释一下。*突发性（burstiness）*指的是句子长度的变化幅度，*AI 痕迹（AI tell）*指的就是上面那类一眼可辨的习惯。

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../.github/assets/demo-burstiness-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../.github/assets/demo-burstiness-light.svg">
  <img alt="句长图表。AI 那条线又平又均匀。真人那条线在 3 到 31 个词之间起伏。Humanizer 把这种变化还回来。" src="../.github/assets/demo-burstiness-light.svg" width="100%">
</picture>

## 安装

在 Claude Code 里，通过 10x 插件市场安装：

```bash
claude plugin marketplace add Aboudjem/10x
claude plugin install humanizer@10x
```

在另外 70 多个 agent 里只要一行。[skills CLI](https://github.com/vercel-labs/skills) 会把这个 skill 链接到你的 agent 会读取的目录，加上 `--copy` 则改为复制：

```bash
npx skills add Aboudjem/humanizer-skill
```

<details>
<summary>不用安装器也能装（curl，或按编辑器指定路径）</summary>

装在项目里，跟着仓库一起走：

```bash
mkdir -p .claude/skills/humanizer && curl -sL https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md -o .claude/skills/humanizer/SKILL.md
```

换成别的编辑器就换目录：`.cursor/skills/`、Copilot 用 `.github/skills/`、`.codex/skills/`、`.gemini/skills/`、`.windsurf/skills/`、`.continue/skills/`。想全局安装就用 `~/.claude/skills/`。每个 agent 的完整路径见 [docs/editors.md](../docs/editors.md)。

</details>

## 怎么用

**1. 给你已经写好的东西打个分。** 这一步只做扫描，不会改文件：

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

分数越低越像真人写的。分项明细会告诉你分数扣在哪个信号上，你就知道先改什么。

**2. 用一种语音风格重写。** 在编辑器里对着你自己的草稿调用这个 skill：

```text
/humanizer --file draft.md --voice technical
```

> **改之前：** This comprehensive guide delves into the intricacies of our authentication system.
>
> **改之后：** This guide explains how our authentication system works.

重写只删掉痕迹，绝不会添加原文里没有的事实。

**3. 确认重写没把事实弄丢。** 重写时悄悄漏掉一个数字才是真正的风险：

```bash
node cli/index.js compare --before examples/blog-post/before.md \
  --after examples/blog-post/after.md --check-facts
```

它会以状态码 1 退出，并列出丢掉的东西：一个数字、一个百分比、一个 URL、一个日期、一个版本号，或者一个全大写缩写。

## 你得到什么

- **一个 0 到 100 的 AI 痕迹分数**，配五档结论，从 Pristine 到 Pure AI smell。
- **`score` 命令给出分项明细**，分数难看时能直接指向具体原因。
- **五种语音风格的重写**：`casual`、`professional`、`technical`、`warm`、`blunt`。
- **一次事实核对**，重写若丢了数字、百分比、URL、日期、版本号或全大写缩写就判定失败。
- **一个可用于 CI 的退出码**，外加一个只给你暂存的文件打分的 [pre-commit 钩子](../docs/pre-commit.md)。

<details>
<summary>全部 55 个模式，按类别</summary>

| 编号 | 类别 | 例子 |
|:----|:---------|:---------|
| P1-P8 | 内容 | 意义拔高、广告腔、AI 词汇（"delve"、"leverage"） |
| P9-P18 | 语言与文体 | 否定式排比、em dash 滥用、结构化列表病 |
| P19-P21 | 沟通 | 聊天机器人痕迹、知识截止声明、谄媚语气 |
| P22-P30 | 填充与模糊 | 填充语、套路化结尾、句长整齐划一 |
| P31-P43 | 新出现 | 同义词轮换、占位文本、聊天标记泄漏、电视购物式钩子 |
| P44-P55 | 手艺与取证 | 虚假主体、格言公式、Unicode 混淆、遗留的模糊限定词 |

每个模式在 [`SKILL.md`](../skills/humanizer/SKILL.md) 里都有说明和触发词。
[`references/patterns.md`](../skills/humanizer/references/patterns.md) 里，55 个模式中有 34 个另外配了一组前后对照例子，
适合配例子的模式各一组。
核心目录（P1-P30）参考了
[Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)（CC BY-SA）。

</details>

## 在你的编辑器里使用

通过 `npx skills add`，可以在 Claude Code、Cursor、Codex、Copilot、Gemini CLI 以及另外 70 多个 agent 里使用。

| Agent | 一行命令 |
|:--|:--|
| Claude Code | `claude plugin install humanizer@10x` |
| 70 多个 agent 中的任意一个 | `npx skills add Aboudjem/humanizer-skill` |
| 指定某一个 agent（Cursor、Codex、Copilot、Gemini CLI、OpenCode、Zed） | 在上面那行后面加 `-a <agent>` |
| 其他所有情况 | 见 [docs/editors.md](../docs/editors.md) 里的表格 |

这个 skill 就是 Markdown，所以你的编辑器指向哪个模型，它就跑在哪个模型上。

## 需要知道的事

> [!IMPORTANT]
> 任何内容都不会离开你的机器。这个 skill 只是编辑器在本地读取的一个 Markdown 文件，可选的指标 CLI 是纯 Node 实现，没有依赖，也不发任何网络请求。没有遥测，不需要账号，不需要 API key。

- **目标是把文字写好**，不是骗过检测器。干净的文字本来就不带检测器盯着的那些懒惰习惯，所以把写作修好，检测这件事自然就顺了。
- **误判是会发生的。** 检测器在非英语母语者的英文上会误报（[Liang 等人](https://arxiv.org/abs/2304.02819)），而句长变化小本来就是有些人的写作习惯。误判防护会保护真实的细节和有意为之的不完美。
- **这个数字是替代指标**，不是判决。它可复现，所以适合做门禁，但它读的是信号而不是含义。64 个测试锁定了它的行为。

## 延伸阅读

- [skill 本身](../skills/humanizer/SKILL.md)，以及[模式详解](../skills/humanizer/references/patterns.md)
- [分数量的是什么](../docs/science.md)，改写规则背后的研究
- [在你的编辑器里安装](../docs/editors.md)、[给提交加门禁](../docs/pre-commit.md)、[常见问题](../docs/faq.md)、[横向对比](../docs/comparison.md)
- [指标 CLI](../cli/README.md)、[CHANGELOG](../CHANGELOG.md)、[LICENSE](../LICENSE)

<p align="center">
  <sub>由 <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> 制作 · MIT 许可证 · 无遥测，不收集数据</sub>
</p>

<sub>本文档由机器辅助翻译自英文版，如有出入以 <a href="../README.md">英文版</a> 为准。</sub>
