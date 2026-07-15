[English](./README.md) | **简体中文**

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1f3a5f?style=flat-square" alt="License"></a>
  <a href="skills/humanizer/SKILL.md"><img src="https://img.shields.io/badge/patterns-53-1f3a5f?style=flat-square" alt="53 个 AI 模式"></a>
  <a href="#语音风格"><img src="https://img.shields.io/badge/voices-5-1f3a5f?style=flat-square" alt="5 种语音风格"></a>
  <a href="#"><img src="https://img.shields.io/badge/dependencies-0-1f3a5f?style=flat-square" alt="零依赖"></a>
  <a href="https://github.com/Aboudjem/humanizer-skill/stargazers"><img src="https://img.shields.io/github/stars/Aboudjem/humanizer-skill?style=flat-square&color=c0952f" alt="Stars"></a>
</p>

<p align="center">
  <b>AI 写的英文，每句话都差不多长，用词千篇一律。真人不这么写。</b><br/>
  Humanizer 把这道差距补回来。53 个模式，5 种语音，一个 Markdown 文件，零 API 调用。
</p>

<p align="center">
  <a href="https://humanizer-skill.vercel.app"><b>在浏览器里试一下 →</b></a>
  &nbsp;&middot;&nbsp;
  <a href="#快速开始">5 秒安装</a>
  &nbsp;&middot;&nbsp;
  <a href="skills/humanizer/SKILL.md">读源码</a>
</p>

---

## 这个 skill 是给谁的

**给写英文的中文开发者。** 你的 README、技术文档、论文、LinkedIn 帖子、冷启动邮件，只要是用 AI 起草的英文，就带着一股「机翻+客服腔」的味道：每句话一样长，满屏 `delve into`、`it's important to note`、`leverage`、`seamless`。招英语母语审稿人一眼就能看出来。

Humanizer 专门去掉**你写的英文**里的 AI 痕迹（去英文 AI 味 / 人味写作），把它改写成一个具体的、有观点的人写出来的样子。

> **和 op7418/Humanizer-zh 的区别？** 那个 skill 是润色**中文**的，做得很好，要处理中文就用它。这个 skill 反过来，专治**你写的英文**里的 AI 味。两者互补，不是竞品。中文原生模式的实验性附录见文末的[中文写作支持](#中文写作支持实验性)。

和其它同类相比，这个仓库的差异点：**53 个编号模式**（目前开源目录里最全）、**5 种命名语音风格**、以 **burstiness（句长波动）+ perplexity（用词可预测性）** 为核心的方法论、以及**一条 curl 命令、零依赖**的安装方式。

---

## 快速开始

### 用 skills CLI 安装（任意 agent）

一条命令，通过 [vercel-labs/skills](https://github.com/vercel-labs/skills) 支持 Claude Code、Cursor、Codex、opencode 等 70+ agent：

```bash
npx skills add Aboudjem/humanizer-skill
npx skills add Aboudjem/humanizer-skill -a claude-code   # 只装到 Claude Code
```

不想用工具？下面的 curl 一行安装同样可用。

### 安装（一条命令）

项目内安装（跟着仓库走）：

```bash
mkdir -p .claude/skills/humanizer && curl -sL \
  https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o .claude/skills/humanizer/SKILL.md
```

全局安装（每个项目都能用）：

```bash
mkdir -p ~/.claude/skills/humanizer && curl -sL \
  https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o ~/.claude/skills/humanizer/SKILL.md
```

没了。无需配置，无需依赖。Claude Code 会自动识别。

### 在你的 AI 编辑器里用

Humanizer 就是一个纯 Markdown 的 skill 文件。把它放进编辑器的 skill 目录，然后用 `/humanizer` 命令。

<details>
<summary><b>Claude Code</b></summary>

上面的 curl 命令装完就能用：
```
/humanizer "Your AI-generated text here"
```
</details>

<details>
<summary><b>其它编辑器（Cursor / VS Code + Copilot / Codex CLI / Gemini CLI / Windsurf / Continue.dev / OpenClaw）</b></summary>

原理一样，只是换一下目标目录。以 Cursor 为例：
```bash
mkdir -p .cursor/skills/humanizer && curl -sL \
  https://raw.githubusercontent.com/Aboudjem/humanizer-skill/main/skills/humanizer/SKILL.md \
  -o .cursor/skills/humanizer/SKILL.md
```
把 `.cursor/` 换成 `.github/`、`.codex/`、`.gemini/`、`.windsurf/`、`.continue/` 即可。OpenClaw 用户可直接 `clawhub install humanizer-skill`。完整的 8 编辑器安装清单见[英文 README](./README.md#quickstart)。
</details>

> **说明：** Claude Code 会自动识别 `.claude/skills/`、`~/.claude/skills/` 或任意插件的 `skills/` 目录里的 skill，无需重启。其它编辑器可能需要在系统提示或配置里引用该文件。

---

## 用法

```bash
/humanizer "你要润色的英文文本"                       # 用默认语音改写
/humanizer "text" --voice casual                      # 指定语音风格
/humanizer "text" --mode detect                       # 只扫描，不改写
/humanizer "text" --score                             # 附带 0-100 AI 痕迹评分
/humanizer --file docs/README.md --voice technical    # 原地编辑文件
/humanizer "text" --aggressive --iterate 3            # 重度改写，迭代收敛到零模式
/humanizer "text" --purpose marketing --voice warm    # 场景规则 + 语音
```

三种模式，各司其职：

| 模式 | 作用 | 什么时候用 |
|:-----|:-----|:-----------|
| `rewrite` | 完整改写并注入语音风格 | 写内容、博客、社媒帖子 |
| `detect` | 只出报告，列出命中的模式 | 审查已有内容，学习该改什么 |
| `edit` | 原地改文件，改动最小 | 清理文档、打磨 README |

`rewrite` 是默认模式，不用特意指定。

### 5 秒给自己打个分

对任意文本跑 `detect` 加上 `--score`，你会拿到一个可以直接引用的数字：

```text
$ /humanizer "In today's rapidly evolving landscape, AI is reshaping how we think about creativity..." --mode detect --score

[Score: 87/100, Pure AI smell]

Patterns found: 9
| #   | Pattern              | Text                              |
| P4  | Promotional          | "rapidly evolving landscape"      |
| P7  | AI Vocabulary        | "reshaping"                       |
| P22 | Filler               | "In today's"                      |
| P29 | Comprehensive Opening| meta-commentary about the article |
| P30 | Uniform Length       | sentences avg 19 words            |
| ...
```

改写之后再跑一次，同一段文本大约会掉到 12/100。这个落差就是全部的意义。

### 带上你自己的品牌语音

在项目根目录放一个 `humanizer-context.md`，写上你的品牌样例和禁用词。skill 会自动加载它，当作 `--voice` 的个人化扩展，改写出来的东西听起来像 **你**，而不是某个预设。

---

## 它解决什么问题

你用 AI 写作。输出读起来像个聊天机器人：每句话一样长，用词可以预测，`delve into`、`it's important to note` 满天飞。

Humanizer 检测 53 个具体的 AI 写作模式，然后用真实的人类节奏、词汇和语音把文本重写一遍。它不是换同义词，而是**重建句子结构**，注入让文字读起来像真人写的那种 burstiness 和不可预测性。

> **提示：** 这是关于**写作质量**，不是关于**规避检测**。好的写作不会触发 AI 检测器，因为它没有检测器盯着找的那些偷懒模式。把写作本身改好，检测的问题自然就解决了。（如果你在关注 降AIGC率 / 过朱雀检测：思路一致 —— 与其去骗检测器，不如把偷懒的痕迹删干净。）

---

## 改写前后对比

下面的例子都是**英文输入**（你写的英文），这正是这个 skill 的主场。

### 技术文档

> **改写前：**
> This comprehensive guide delves into the intricacies of our authentication system. The platform leverages cutting-edge JWT technology to provide a seamless, secure, and robust authentication experience. Additionally, it features a pivotal role-based access control system that serves as a testament to our commitment to security.

> **改写后**（`--voice technical`）：
> The auth system uses JWTs. Tokens expire after 15 minutes; refresh tokens last 7 days. Role-based access control restricts API endpoints by user role: admin, editor, and viewer each see different data. The token rotation logic is in `src/auth/refresh.ts` if you need to change the expiry windows.

*干掉 9 个 AI 模式，补上真实细节，字数砍掉 40%。*

### 博客

> **改写前：**
> In today's rapidly evolving technological landscape, artificial intelligence is reshaping how we think about creativity. This groundbreaking shift represents a pivotal moment in human history, one that underscores the intricate interplay between innovation and artistic expression.

> **改写后**（`--voice casual`）：
> I've been messing around with AI image generators for about six months now, and I still can't decide if I love them or if they make me uneasy. The outputs are technically impressive. I got a portrait last week that looked better than anything I could paint in a year. But there's something missing. It's like eating a perfect-looking meal that has no flavor.

*用亲身经历换掉空洞评论。句长依次是 8、31、22、4、13 个词。这就是 burstiness。*

### LinkedIn 帖子

> **改写前：**
> Excited to announce that I've taken on a pivotal new role at TechCorp! This incredible opportunity represents a significant milestone in my professional journey. I'm deeply grateful to my amazing network for their unwavering support. #NewBeginnings #Innovation #Leadership #Grateful

> **改写后**（`--voice professional`）：
> Started a new job at TechCorp this week. I'm leading their developer tools team, 12 engineers building internal tooling that currently serves about 400 developers. First week has been drinking from the firehose: new codebase, new faces, new coffee machine I can't figure out. Nervous and excited in roughly equal measure.

*没有 emoji，没有话题标签。用真实细节替代「pivotal milestone」。那句咖啡机比任何感恩表态都更像人写的。*

---

## 语音风格

每种语音都会改变 skill 的改写方式，不只是选词，还包括句子结构、节奏和注入的性格。

| 语音 | 性格 | 适合 |
|:-----|:-----|:-----|
| `casual` | 缩写、第一人称、句子片段、用 "And" 开头 | 博客、社媒、社区文档 |
| `professional` | 选择性缩写、冷幽默、具体例子 | 商务沟通、报告、正式文档 |
| `technical` | 精确术语、代码般清晰、面无表情的幽默 | API 文档、README、架构文档 |
| `warm` | "We/our" 口吻、共情、更短的段落 | 教程、上手引导、支持内容 |
| `blunt` | 最短的句子、不铺垫、只用主动语态 | 评审、内部沟通、直接反馈 |

---

## 工作原理

一套 4 遍编辑系统。每一遍只干一件事，绝不越界。

```mermaid
graph LR
    A["第 1 遍：检测<br/><sub>扫描 53 个 AI 模式<br/>横跨 5 个类别</sub>"] --> B["第 2 遍：剥离<br/><sub>删掉意义拔高、<br/>AI 词汇、废话</sub>"]
    B --> C["第 3 遍：注入<br/><sub>套用语音风格、<br/>burstiness、perplexity</sub>"]
    C --> D["第 4 遍：核验<br/><sub>句长方差检查、<br/>黑名单扫描、终检</sub>"]

    style A fill:#fffdf7,stroke:#c0952f,color:#1f3a5f
    style B fill:#f6f1e6,stroke:#c0952f,color:#1f3a5f
    style C fill:#efe6d3,stroke:#1f3a5f,color:#1f3a5f
    style D fill:#1f3a5f,stroke:#16304f,color:#f0e9d8
```

文本进去，干净、像人写的文字出来。skill 会自动识别文中有哪些模式，只做必要的最小改动。第 1 遍是非破坏性的：跑 `--mode detect` 就能只拿报告，什么都不改。

---

## 科学原理

AI 检测器不靠魔法。它主要量两样东西，两样都有公开发表的研究支撑。

**Burstiness（句长波动）** 就是句子长度的变化。人类写一句 3 个词的，接一句 40 个词的，再来一句 12 个词的。AI 每句话都在 18 个词上下。检测器量的就是这个方差。方差低 = 大概率是 AI。

**Perplexity（可预测性）** 就是用词有多好猜。AI 每次都挑统计上最可能的下一个词。人不会。我们会用意外的词、别扭的措辞、私人的引用。perplexity 高 = 大概率是人。

QuillBot 那类换词工具只改单个词，句子的节奏和可预测性原封不动，所以它们没用。你需要的是结构性改写，而不是同义词替换。

> **诚实声明：** burstiness 和 perplexity 这套方法论、以及全部 53 个编号模式，都是针对**英文**（以词为单位的语言）设计和验证的，这也正是这个 skill 的定位。中文以字为单位、不用空格，句长方差的意义完全不同，四字成语的密度往往比词长波动更重要。中文原生模式仍是**实验性**的，见[中文写作支持](#中文写作支持实验性)。

| 技术 | 来源 | 结论 |
|:-----|:-----|:-----|
| Burstiness 注入 | GPTZero | 人类句长波动很大，AI 不会。 |
| Perplexity 提升 | GPTZero | AI 每次都挑统计上最可能的下一个词。 |
| 词汇多样性 | SSRN 文体学研究 | 人类 TTR：55.3；AI：45.5 |
| 消灭否定式排比 | 华盛顿邮报 | 「It's not X, it's Y」在 32.8 万条消息里被确认为头号 AI 痕迹 |
| 结构性改写 | RAID benchmark，ACL 2024 | 把 DetectGPT 准确率从 70.3% 打到 4.6% |
| 内在维度 | NeurIPS 2023 | 人类文本约 9 维，AI 约 7.5 维 |

---

## 对比其它方案

| 特性 | **Humanizer** | QuillBot | Undetectable.ai | 手工改 |
|:-----|:------------:|:--------:|:----------------:|:------:|
| 开源 | 是 | 否 | 否 | 不适用 |
| 模式检测 | **53** | 0 | 0 | 0 |
| 语音风格 | **5** | 0 | 3 | 手动 |
| 离线可用 | 是 | 否 | 否 | 是 |
| Burstiness 注入 | 是 | 否 | 部分 | 否 |
| 文件原地编辑 | 是 | 否 | 否 | 否 |
| 解释改动 | 是 | 否 | 否 | 否 |
| 价格 | **免费** | $20/月 | $10/月 | 免费 |

---

## 全部 53 个模式

模式分为 5 个类别：内容（P1–P8）、语言与风格（P9–P18）、沟通（P19–P21）、废话与含糊（P22–P30）、新兴模式（P31–P53，2026 社区发现）。每个模式都有编号、触发词和改写方法。

完整目录（含每个模式的触发词与前后对比）见 [SKILL.md](skills/humanizer/SKILL.md)。英文 README 里也有[可展开的模式速查表](./README.md#more)。

---

## 中文写作支持（实验性）

这个 skill 的核心是英文。但如果你也想给**中文**去 AI 味，仓库里有一份实验性的原生中文模式附录：

> [`skills/humanizer/references/patterns.zh.md`](skills/humanizer/references/patterns.zh.md) —— 约 15 个原生中文 AI 痕迹模式（四字词语堆砌、首先/其次/最后、在当今…的时代、赋能/抓手/闭环 等词黑名单、破折号 与全角半角标点混用、设问-回答套路、口号式乐观结尾……）。

**这份附录是临时的、未经中文母语写手校验的**，从竞品分析中提取而来，尚未与英文目录达到同等成熟度。burstiness / perplexity 这套指标也**不能直接套用**到以字为单位的中文上。想认真做中文，直接用 op7418/Humanizer-zh 更靠谱。

---

## 为什么不直接……

**「……写个更好的 prompt？」**
prompt 有帮助，但没法稳定地执行 53 条具体的模式规则。这个 skill 带一张检查清单，能抓到你改到第 50 遍都会漏的东西。

**「……用 QuillBot 或 Undetectable.ai？」**
它们换词。节奏照样机械，句长照样均匀，结构照样可预测。检测器不在乎单个词，它在乎模式。

**「……自己改？」**
完全可以。但你记得住全部 53 个模式吗？能一眼认出「copula avoidance」或「意义拔高」吗？这个 skill 是个永远不累、永远不漏的狠编辑。

---

## 信任

无遥测，无数据采集，无 API 调用，无任何云端。

整个 skill 就是一个 Markdown 文件（`SKILL.md`），由 Claude Code 在本地读取。你的文本永远不离开你的机器。没什么好审计的，因为根本没有东西在运行。

> **说明：** 纯 Markdown skill。没有 JavaScript，没有二进制文件，没有网络请求。源码你自己读：就一个文件。

---

## 贡献

发现了新的 AI 模式？有更好的改法？欢迎 PR。

1. Fork 仓库
2. 把你的模式加进 `SKILL.md`（沿用 P1–P53 的格式）
3. 附一个前后对比的例子
4. 提 PR

细节见 [CONTRIBUTING.md](CONTRIBUTING.md)，包括三处联动更新（badge 数字、CI 阈值、CHANGELOG）。中文模式相关的贡献尤其欢迎中文母语写手参与，帮我们把 [`patterns.zh.md`](skills/humanizer/references/patterns.zh.md) 从实验性推向正式。

---

## 传承与致谢

这个 skill 属于一个更大的 humanizer 工具家族。直接的传承：

- [@blader/humanizer](https://github.com/blader/humanizer)：命名了这个品类的原版 Claude skill。模式不同、没有语音风格、没有编辑模式，但它点亮了这条路。op7418/Humanizer-zh 就是它的中文本地化版本。
- [@softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit)：证明了 Markdown skill 文件是正确分发格式的 humanizer 插件。
- [Wikipedia：Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)：一份公开、开放、有引用支撑的参考清单，P1–P30 里约 70% 源自它。

这个 fork 新增了：53 个编号模式（最大的开源目录）、5 个命名语音风格、三种运行模式（`detect`/`rewrite`/`edit`）、8 编辑器安装矩阵、会强制执行自身规则的 CI（禁用破折号的 skill 自己也不许出现破折号），以及一份为每条主张都引用一手来源的、研究导向的 README。

---

<p align="center">
  如果这个 skill 救了你的写作、让它不再像聊天机器人，考虑点个 star。<br/>
  能帮更多人找到它。
</p>

---

<p align="center">
  <a href="https://www.linkedin.com/in/adam-boudjemaa/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://x.com/AdamBoudj"><img src="https://img.shields.io/badge/X-000000?style=flat-square&logo=x&logoColor=white" alt="X"></a>
  <a href="https://adam-boudjemaa.com/"><img src="https://img.shields.io/badge/Website-1f3a5f?style=flat-square&logo=googlechrome&logoColor=white" alt="Website"></a>
</p>

<p align="center">
  <sub>由 <a href="https://github.com/Aboudjem">Adam Boudjemaa</a> 打造 · MIT License · 无遥测 · 无数据采集</sub>
</p>
