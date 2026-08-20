# 🐙 What Was That（那是啥）

<p>
<a href="https://github.com/topics/dsh-plugin"><code>dsh-plugin</code></a>
<a href="https://github.com/SH-9999/what-was-that"><code>DeepSeek Harness 插件</code></a>
<a href="https://github.com/SH-9999/what-was-that/blob/main/LICENSE"><code>MIT License</code></a>
<a href="https://github.com/SH-9999/what-was-that"><code>静态插件</code></a>
</p>

**一个可爱的小章鱼桌面宠物插件，自动帮你"看懂" AI 回复里的术语和黑话。**

当 AI 助手的回答里出现你不认识的技术词（比如 `RAG`、`LoRA`、`MCP`）时，右下角的小章鱼会亮起红色角标；点一下，它就用"大白话 + 生活比喻"给你讲清楚。想再深挖，还能让 AI 再解释几轮。

---

## 🆕 本仓库：静态插件（第二阶段）

这是**第一阶段的正式移植**：把原型用的临时动态插件（粘贴 JS），重写成了规范的 **TypeScript 静态插件包**。

### 相对第一阶段（原型）的改进
- ✅ **TypeScript 源码**（`src/`），不再是一大段粘贴的字符串
- ✅ **可移植**：资源（词库 / 宠物 SVG）随包内置，通过 `import.meta.url` 相对解析，**不再依赖写死的绝对路径**
- ✅ **一键安装**：构建产物 `lib/` 提交，用户无需编译直接安装
- ✅ **不污染环境**：只依赖 DSH 运行时提供的接口，无全局安装

### 目录结构
```
what-was-that/
├── src/
│   ├── index.ts          # host：词库加载 + 术语匹配 + AI 解释 + 宠物SVG
│   └── client/
│       └── index.ts      # client：章鱼UI + 气泡解释 + 拖动
├── assets/
│   ├── lexicon.json      # 词库（255 条）
│   └── idle/question/thinking/happy.svg  # 四态透明形象
├── lib/                  # 构建产物（提交，免编译安装）
├── dsh.plugin.json       # 插件声明
├── cordis.patch.yml      # 挂载点
├── build.mjs             # esbuild 构建脚本
└── package.json
```

### 安装（给 DSH 用户）
在 DSH 的插件配置里挂载 `cordis.patch.yml` 声明的 `what-was-that` 插件即可（`lib/` 已含全部产物，无需构建）。

### 本地构建（给开发者）
```bash
pnpm install        # 装 esbuild / typescript（仅 devDependencies）
node build.mjs      # 打包 lib/index.js + lib/client.js，并复制 assets
```

---

## ✨ 功能

- 🐙 **四状态章鱼宠物**：呆萌 / 疑惑 / 思考 / 开心，可拖动，深浅色主题自适应
- 🔍 **自动扫描**：AI 回复正文里出现词库中的术语时，红点角标 + 气泡轻提示
- 💬 **小白式解释**：本地词库（零消耗、不联网）先用大白话解释
- ⚡ **AI 深挖**：点"再讲深一点点"，多轮（短解释 → 换个说法 → 长解释 → 到底线）
- 🖱️ **对话区选词**：在页面上直接框选一个不认识的词（10 字以内），就在选区旁弹出大白话解释卡片；点卡片外任意处即关（静态插件专属、需要 DOM 的功能）
- ⚙️ **可设置**：给"小章鱼"解释用哪个模型（默认跟随对话、可固定选一个已配置模型，重启保持、仅当该模型消失才退回默认），以及是否在选到词库外的词时弹"帮我解释"提示
- 🎨 **透明 SVG 形象**：四态透明 SVG，深浅背景自然融入
- 🔒 **隐私友好**：**绝不把完整回复发回模型**，只发送你点中的词 + 前后各 80 字，且带缓存

---

## 🪶 设计哲学：最小权限 + 轻量优先

### 最小权限
- 🔇 **不注册任何模型工具（Tool）**——只观察 + 展示
- 🤐 **绝不读取模型"思考中"的内部过程**——只关心最终回答正文
- 🔒 **隐私红线**：不把完整回复发回模型；AI 深挖只发点中的词 ±80 字，带缓存

### 轻量优先
- 🪶 **零运行时依赖**——只用 DSH 自带接口
- 🧾 **极小透明 SVG**（每张 15–20 KB）
- ⚡ **启动快、占用小**
- ✅ **可回滚、可清理**——插件可随时停止/删除

---

## 👤 作者

**作者是编码小白**。想法来自作者本人，实现借助 **DeepSeek Harness（DSH）** 协作完成，主要使用：
- **deepseek-v4-flash** —— 主力编码
- **glm-5.3** —— 方案对比 / 复核
- **豆包生图模型 + doubao-seed-evolving** —— 形象设计与 AI 生图（doubao-seed-evolving 负责创作/理解，生图走豆包生图模型）

---

## 📄 许可

[MIT](LICENSE)

---

## 💌 反馈

欢迎提 [Issue](https://github.com/SH-9999/what-was-that/issues) 或直接 PR。
