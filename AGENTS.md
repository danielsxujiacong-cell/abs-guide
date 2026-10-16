# ABS GUIDE 项目规则

- Step 1 仅维护 Markdown 书籍，不安装前端依赖、不部署、不连接数据库。
- `src/content/docs/` 是唯一正文来源。使用 UTF-8、LF 与含 `title`、`description`、`sidebar.order` 的 YAML frontmatter，兼容后续 Astro Starlight。
- 核心为街头健身、自重训练。允许安全单杠、双杠；不引入外部负重或必须购买的器材，不推荐危险家具替代。
- 面向一般健康成年人，用简体中文白话解释。区分证据和实践建议，不编造作者经历或文献，不承诺短期身材。
- 发布章节同步更新 README、总目录及分册目录；未发布章节仅标“计划中”，不创建占位正文或不存在的链接。
- 原创内容 CC BY-SA 4.0，代码 MIT；第三方权利单独标注。不要提交健康隐私、凭据、缓存或本地配置。
- 最小验收：核对三十二章规划、正式文章完整性、相对链接、frontmatter、参考资料、`git diff --check`。本阶段无构建或前端测试。
- 本仓库远程为 `danielsxujiacong-cell/abs-guide`，经用户明确授权公开。保留历史与本地工作，干净时安全同步，验收后审查暂存内容再提交和推送。
