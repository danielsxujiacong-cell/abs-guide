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
- 平台默认域名：`abs-guide-1qfatmta.edgeone.dev`。直接访问返回 401；控制台说明必须通过其三小时限时预览链接进入。因此不将裸域名作为公开阅读入口，不在仓库记录临时校验参数。
- 第二次部署：`dpqnd8wj0vq4`，提交 `19f0ca8`，由 Push main 自动触发，平台状态“成功”，构建用时 36 秒。
- 已在平台提供的真实线上预览读取 `data-release="0.2.1"` 以及“中文搜索与本地续读已加入”更新文案，四册封面正常；点击“开始阅读”进入第一篇文章，正文与参考资料可见。
- 这证明 GitHub → Astro 构建 → EdgeOne 预览内容自动更新；正式域名公开访问尚未验收，不把限时预览等同于正式上线。
- 自定义域名首次绑定从“部署中”进入“请添加 CNAME”后，平台弹窗明确提示“记录值异常，建议删除域名后重新添加”，没有提供可用记录值。DNS 查询返回名称不存在。
- 经用户授权仅重建本次新绑定后，已生成有效目标 `abs.danielxu.cn.pages.dnsoe5.com`，列表曾出现“一键添加”。没有改动其他域名、项目或套餐。
- 已按用户要求进入 HTTPS → 边缘 HTTPS 证书 → 申请免费证书 → 自动验证并保存。平台确认“证书类型：免费证书”“证书申请中”。没有购买证书、申请付费套餐或新增凭据。
- 当前域名状态仍为“部署中”，证书“申请中”，HTTPS 配置与域名操作暂时被平台禁用，“一键添加”入口尚未恢复。DNS 查询仍返回名称不存在，正式 HTTPS 暂未通过。
- 下一步：平台解除配置下发状态后，优先使用其“一键添加”自动配置本域名 CNAME；验证自动签发免费证书，再测试无需登录的 HTTPS 首页、书架、正文、搜索及 HTTP 跳转。不要把“证书申请中”写成“已签发”。若持续不解锁，需要在腾讯云核查本项目域名的下发状态。

## 自动同步验收方式

首次部署成功后，再提交一次真实无害的版本或更新信息修改并推送 main；核对平台自动触发的新构建、对应提交 SHA，以及线上新内容。只 Push 或只返回 HTTP 200 均不能证明自动同步成功。

## 官方资料

- [构建配置](https://pages.edgeone.ai/document/build-guide)
- [edgeone.json 字段](https://pages.edgeone.ai/document/edgeone-json)
- [Astro 静态部署说明](https://pages.edgeone.ai/document/framework-astro)
- [免费证书与自动验证](https://pages.edgeone.ai/zh/document/apply-for-free-certificate)

核对日期：2026-10-16。控制台 UI 与实际构建结果优先；不保存或提交平台凭据。

## 暂停交接

2026-10-16 用户要求停止 DNS/HTTPS 反复检查并结束任务。DNSPod 新增表单未提交，abs CNAME 尚未实际写入；免费证书最后已知为“申请中”，未在暂停后重新检查。以 HANDOFF.md 的暂停交接为最新状态，前述等待“一键添加”的下一步已由用户授权的单条 DNSPod 添加方式替代，但尚未执行保存。正式域名仍未验收。
