# AGENTS.md — What Was That 项目工作约定

> 本文件由 agent 在每次新会话自动读取，用于延续项目上下文，无需用户重复交待。

## 项目一句话
**What Was That（那时啥）**：一个可爱的橙色小章鱼桌面宠物 dsh-plugin，自动把你 AI 回复里的技术黑话（RAG、LoRA、MCP…）用大白话+生活比喻解释出来。

仓库：https://github.com/SH-9999/what-was-that （公开）
本地目录：`D:\dsh-plugin-things\what-was-that`（静态插件项目）

---

## 🤝 分工约定（重要，务必遵守）

**Agent 负责（我）：**
- 写代码、改配置、构建（`node build.mjs`）、测试（`node --test tests/`）、typecheck
- `git add` + `git commit`（把一切准备成"就差 push"）
- 输出给用户清晰的推送命令

**用户负责（你）：**
- 在**自己的 PowerShell 终端**执行 `git push`（GCM 已在用户终端配好，免 token）
- GitHub 网页操作（topic 设置、token 管理等）

**不要**由 agent 在 DSH 沙箱里 push——沙箱无法用 GCM/交互认证（schannel SEC_E_NO_CREDENTIALS + 无法读 Username），之前成功都是靠内嵌 token，现已废弃该方式。**推送一律交给用户在自己的终端执行。**

### 推送命令（给用户，用户复制到自己 PowerShell 执行）
```powershell
cd D:\dsh-plugin-things\what-was-that
git push origin HEAD:main
```

---

## 📋 项目当前状态（阶段）

### ✅ 已完成
1. **v1 动态插件原型** → 已废弃（临时粘贴 JS 形态）
2. **阶段1：静态 TypeScript 插件**（已发布在 main）：
   - `src/index.ts`（host）：词库加载/术语匹配/AI 解释/宠物 SVG
   - `src/core.ts`：核心纯逻辑（可测）
   - `src/client/index.ts`：四状态章鱼/气泡解释/拖动
   - `assets/`：词库(255条 lexicon.json) + 4 张透明 SVG
   - `lib/`：esbuild 构建产物（提交，用户免编译安装）
   - `tests/core.test.mjs`：6 个单元测试（node:test，全绿）
   - `dsh.plugin.json` / `cordis.patch.yml` / `package.json` / `build.mjs` / `tsconfig.json`
   - README 已加 dsh-plugin Topic + 原生文字徽章
   - typecheck（tsc --noEmit）通过、build 通过、测试 6/6 全绿

### ⏳ 待做
- **阶段2：选词解释功能**——在静态 client 里加浏览器选区监听（`document.getSelection()` / `selectionchange`），用户选中文字后在旁边弹出解释小卡片。**这是动态插件做不到、静态插件才能做的功能**，是阶段2 的核心目标。
- 阶段3（可选）：GitHub Actions CI、npm/插件市场发布、词库扩充

---

## 🛠️ 常用命令（在 `D:\dsh-plugin-things\what-was-that` 下执行）

```bash
# 构建（esbuild 打包 lib/，复制 assets）
node build.mjs

# 类型检查
node node_modules/typescript/bin/tsc --noEmit

# 单元测试（node:test）
node --test tests/core.test.mjs

# 安装 dev 依赖（esbuild/typescript，仅项目局部，不污染系统）
node D:\dsh-plugin-things\.corepack\v1\pnpm\10.18.3\bin\pnpm.cjs install
```

> ⚠️ 沙箱注意：esbuild build 和 node --test 需要在 `danger-full-access` 权限下运行（它们需 spawn 子进程/原生二进制，受限沙箱会 EPERM）。

---

## 📌 关键连接与设计约束（避免再踩坑）

- **不污染系统环境**：所有依赖只装项目局部 node_modules，绝不动全局 PATH / 全局 npm / 系统 Python。用户对装乱系统环境有强烈抵触，务必保守。
- **隐私红线**（项目核心卖点）：**绝不把 AI 完整回复发回模型**。AI 深挖只发用户点的词 ± 前后 80 字，且带缓存（aiCache LRU 100）。
- **最小权限**：插件不注册任何模型 Tool，只观察+展示；client 无 JSX（用 React.createElement）、无 DOM/useRef。
- **git：本地分支 `master`，远程 `main`**。push 用 `git push origin HEAD:main`；用户终端已 `push.default upstream` + GCM 认证 + Topic 设置全部就绪。
- **词库格式**：`lexicon.json` 每条 `{ t, a(别名), c(分类), e(解释) }`；`e` 里的英文双引号要写成 `\"`。
- 当前运行/校验过的模型相关说明：作者是编码小白，实现借 DeepSeek Harness 协作；形象与 AI 生图用"豆包生图模型 + doubao-seed-evolving"（doubao-seed-evolving 本身不能生图，生图走豆包生图模型）——README 里已按此写，勿再改成错的。

---

## 📄 文档留存
- 源码、资产、构建产物都在本目录，完整可重建。
- 词条库整理说明见历史（255 条已在 assets/lexicon.json）。
