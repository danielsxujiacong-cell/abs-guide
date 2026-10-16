# 部署配置与验收

## 配置

- 平台：腾讯云 EdgeOne Makers，现有 GitHub 集成。
- 仓库：`danielsxujiacong-cell/abs-guide`；生产分支：`main`。
- 根目录：`./`；安装：`npm ci`；构建：`npm run build`；输出：`dist`。
- `edgeone.json` 使用官方 `installCommand`、`buildCommand`、`outputDirectory`、`nodeVersion` 字段，Node 22.11.0。
- Astro `output: static`，目录式路由、尾斜杠；不使用 SSR、数据库或 SPA 全路径首页重写。
- 预定正式域名：`abs.danielxu.cn`。在绑定成功前不把它标为已上线。

## 当前验收

本地类型检查、生产构建和源码/产物校验已通过；浏览器实测记录见 HANDOFF.md。

- EdgeOne 项目：`abs-guide`，ID `makers-kkh5gbcm0cii`，全球可用区（不含中国大陆）。
- 首次部署：`dpuw0igggr5i`，提交 `b7bad63`，平台显示“成功”，Node v22.11.0，构建用时 38 秒。
- 平台默认域名：`abs-guide-1qfatmta.edgeone.dev`。未登录 HTTP 检查返回 401，因此不能作为无需账户的正式阅读入口。
- 自定义域名 `abs.danielxu.cn` 已加入生产环境；DNS、证书及公网访问仍在验收。
- v0.2.1 是首次部署成功后用于真实自动同步验收的版本更新；结果待核对平台与线上内容。

## 自动同步验收方式

首次部署成功后，再提交一次真实无害的版本或更新信息修改并推送 main；核对平台自动触发的新构建、对应提交 SHA，以及线上新内容。只 Push 或只返回 HTTP 200 均不能证明自动同步成功。

## 官方资料

- [构建配置](https://pages.edgeone.ai/document/build-guide)
- [edgeone.json 字段](https://pages.edgeone.ai/document/edgeone-json)
- [Astro 静态部署说明](https://pages.edgeone.ai/document/framework-astro)

核对日期：2026-10-16。控制台 UI 与实际构建结果优先；不保存或提交平台凭据。
