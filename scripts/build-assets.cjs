const sharp = require('../node_modules/sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  
  // 1. Generate apple-touch-icon.png (180x180)
  const iconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="36" fill="#1c221e"/>
    <text x="90" y="122" text-anchor="middle" font-size="94" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif">💪</text>
  </svg>
  `;
  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 2. Generate og-share.png (1200x630) for social sharing
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c221e" />
        <stop offset="100%" stop-color="#141815" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)" />
    
    <!-- Top badge -->
    <rect x="80" y="80" width="64" height="64" rx="14" fill="#294833" />
    <text x="112" y="126" text-anchor="middle" font-size="38" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">💪</text>
    <text x="165" y="124" font-size="28" font-weight="bold" fill="#e6e9df" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif" letter-spacing="2">ABS GUIDE · 薄肌指南</text>
    <text x="1120" y="124" text-anchor="end" font-size="20" fill="#94ad99" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">全书四册 32 篇完结版</text>

    <!-- Main Title -->
    <text x="80" y="260" font-size="64" font-weight="bold" fill="#ffffff" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">好身材，不必从健身房开始。</text>

    <!-- Subtitle / Value proposition -->
    <text x="80" y="340" font-size="32" fill="#b1bcaf" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">免费开源的中文街头健身与自重训练指南</text>
    <text x="80" y="390" font-size="24" fill="#9aaa98" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">从吃好家常一日三餐，到完成人生第一个引体向上</text>

    <!-- Highlights pills -->
    <g transform="translate(80, 460)">
      <rect x="0" y="0" width="220" height="52" rx="26" fill="#283e2d" stroke="#3b473d" />
      <text x="110" y="33" text-anchor="middle" font-size="20" fill="#d5ebd5" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">零会员卡·零门槛</text>

      <rect x="240" y="0" width="240" height="52" rx="26" fill="#283e2d" stroke="#3b473d" />
      <text x="360" y="33" text-anchor="middle" font-size="20" fill="#d5ebd5" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">贴合国人家常三餐</text>

      <rect x="500" y="0" width="230" height="52" rx="26" fill="#283e2d" stroke="#3b473d" />
      <text x="615" y="33" text-anchor="middle" font-size="20" fill="#d5ebd5" font-family="PingFang SC, Microsoft YaHei, system-ui, sans-serif">12 周极简防放弃课表</text>
    </g>

    <!-- Bottom URL -->
    <text x="80" y="575" font-size="22" fill="#718778" font-family="system-ui, sans-serif">https://abs.danielxu.cn</text>
  </svg>
  `;
  const imagesDir = path.join(publicDir, 'images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  await sharp(Buffer.from(ogSvg))
    .png()
    .toFile(path.join(imagesDir, 'og-share.png'));
  console.log('Created images/og-share.png');
}

main().catch(console.error);
