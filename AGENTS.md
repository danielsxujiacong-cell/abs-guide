# ABS GUIDE 项目规则

- 当前 Step 2 使用 Astro 5 / Starlight 0.37 静态网站，目标为 EdgeOne Makers GitHub 集成部署；无需数据库。
- `src/content/docs/` 是唯一正文来源。使用 UTF-8、LF 与含 `title`、`description`、`sidebar.order` 的 YAML frontmatter，兼容后续 Astro Starlight。
- 核心为街头健身、自重训练。允许安全单杠、双杠；不引入外部负重或必须购买的器材，不推荐危险家具替代。
- 面向一般健康成年人，用简体中文白话解释。区分证据和实践建议，不编造作者经历或文献，不承诺短期身材。
- 发布章节同步更新 README、总目录及分册目录；未发布章节仅标“计划中”，不创建占位正文或不存在的链接。
- 原创内容 CC BY-SA 4.0，代码 MIT；第三方权利单独标注。不要提交健康隐私、凭据、缓存或本地配置。
- `src/data/books.json` 统一维护规划章节与发布状态，已发布还须对应真实 Markdown 文件。不得复制正文。总目录 Markdown 使用 `slug: read`，首页在 `src/pages/index.astro`。
- 命令：`npm ci`、`npm run dev`、`npm run check`、`npm run build`、`npm run verify`、`npm run preview`。缓存位于项目 `cache/npm`；不提交缓存、dist 或 node_modules。
- 验收：正文与 Step 1 基线一致、32 章/5 篇、Markdown 与产物链接、目录状态、类型检查与构建；浏览器实测 320/375/390px 与桌面、搜索、主题、目录和阅读记录。部署及 Git 自动同步必须分别取得实际证据。
- 本仓库远程为 `danielsxujiacong-cell/abs-guide`，经用户明确授权公开。保留历史与本地工作，干净时安全同步，验收后审查暂存内容再提交和推送。
