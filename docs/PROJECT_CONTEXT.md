# 项目背景与边界

- 名称：《薄肌最终指南》ABS GUIDE；仓库 `danielsxujiacong-cell/abs-guide`。
- 用户明确指定本地目录 `D:\_Codex project\04_Web\abs-guide`，优先于默认新项目目录；初始目录为空，无现有文件被覆盖。
- 采用全局项目模板的 `.gitignore` 与 `.gitattributes`，其余必需文档按项目实际编写，未复制模板 Git 历史。
- 用户明确授权本项目为 Public 开源仓库，优先于默认私有仓库规则。
- Step 1：四册三十二章规划、五篇完整原创文章、GitHub 阅读、贡献规范、许可、提交与推送。
- Step 2：在原仓库增加 Astro 5.18.2 / Starlight 0.37.7 静态网站、出版物首页、四册书架及专业阅读器；正文仍是 `src/content/docs/`。无数据库或账户系统，不扩写剩余章节。
- 为兼容 EdgeOne 文档列出的 Node 22.11.0，使用兼容的框架版本；实际依赖锁定于 package-lock.json。最新 Astro 7 的 Node 要求与该版本不符，未采用。
- 总目录 `index.md` 仅添加 `slug: read`，不移动文件；五篇文章不改动。统一目录与发布状态在 `src/data/books.json`，构建期确认真实文件存在，GitHub 链接在渲染时转换为网站路由。
- 网站视觉使用米白与灰绿，原创 CSS 封面。阅读记录和主题仅存当前浏览器 localStorage，无追踪服务或主动滚动恢复。
- 目标为 EdgeOne Makers GitHub main 自动部署及 `abs.danielxu.cn`，实际状态见 DEPLOYMENT.md，不能用本地构建或 Push 替代部署证明。
- 科学资料核实与限制见 `sources/references.md`。视频访问受限，不作为正文证据。
- 内容 CC BY-SA 4.0，代码及技术操作文件 MIT，第三方权利不再授权。
- 验证包括目录数目、正文汉字数、相对链接、frontmatter、占位检查、差异检查和远程提交一致性；不把完整三十二章写作或十二周全课程宣称为已完成。
