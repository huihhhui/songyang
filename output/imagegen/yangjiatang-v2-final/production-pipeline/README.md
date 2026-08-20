# 杨家堂方案效果图｜Image 2 → Midjourney → Nano Banana 工作流

## 目标

生成两张同一场景的方案效果图：

1. **观察态**：树根绘画切景占满画面，只有最少导航。
2. **展开态**：右侧证据 / 田野旁注纸质面板展开，场景退到左侧 64%，不使用全宽底部纸带。

流程将“元素准确、风格化、UI 合成”分离。不要让任何一个模型同时承担三项。

## 输入素材与顺序

先准备以下本地图片，并在整个流程中保留相同顺序：

1. `D:\codex_sy\sucai\28，27，50N 119，32，34E\3.jpg`：夫妻树，主树形态参考。
2. `D:\codex_sy\sucai\28，27，50N 119，32，34E\4.jpg`：夫妻树侧面，主／次树相对关系参考。
3. `D:\codex_sy\sucai\28，27，49N 119，32，32E\6.jpg`：冷灰石阶、水沟、土墙相邻关系。
4. `D:\codex_sy\sucai\28，27，50N 119，32，34E\1.jpg`：密集旧瓦与坡地屋群参考。

除非做证据层，否则不要把原始实拍直接嵌进最终舞台画面。

---

## 阶段 1｜Image 2：元素母版（只锁空间）

### 建议参数

- 模型：`gpt-image-2`
- 尺寸：`2048×1152`（16:9）
- 质量：`high`
- 输入：上述 1–4 张实拍，作为结构和材质参考。
- 输出：`yangjiatang-tree-stage-structure.png`

### 提示词

```text
Use case: stylized-concept.
Asset type: structure-accurate visual master for an interactive Yangjiatang observation station.
Input images: 1 main camphor tree shape reference; 2 side view for companion-tree relationship; 3 stone steps, drainage channel and wall adjacency reference; 4 roof-cluster reference.

Create a structure-accurate, restrained scene for Yangjiatang, Songyang, China. A dominant old camphor tree occupies the left foreground; it has a wide, uneven root plate. A smaller companion camphor stands behind-right; it is visibly smaller and partly occluded, their canopies overlap naturally but are not mirrored. Uneven cool-gray stone steps rise diagonally from lower center toward upper right. A narrow damp stone drainage channel runs beside the steps. Low weathered earth-yellow rammed-earth walls and tightly layered old dark-gray tile eaves sit close to the roots. The village is compact and uphill, not an open valley.

Camera: 3/4 side-front view at human eye height; foreground root is cropped at the extreme left; the stair is the leading line; one old tiled eave enters from upper right. Composition only, clear daylight, neutral material color, plain unobtrusive background, no UI, no people, no signs, no text, no invented writing, no whitewashed Jiangnan houses, no neon, no fantasy tree features, no watermark.
```

### 审查门槛

不满足以下任一项就不要进入 MJ：主树明显更大；次树处于右后；石阶与水沟同向；土墙和瓦檐紧贴树根；不存在白墙。

---

## 阶段 2｜Midjourney：只做风格化

上传阶段 1 的单张元素母版，并将其 URL 放在提示词最前。**不要再上传四张实拍**，避免 MJ 在构图时重新拼场景。

### 建议参数

```text
--ar 16:9 --v 7 --raw --stylize 90 --chaos 4 --iw 1.6 --seed 42017
```

- 先用 `--stylize 60` 生成 4 张检查结构；选中一张后固定 `--seed 42017` 再升至 `--stylize 90`。
- 若画面被重构，升 `--iw 1.8`、降 `--stylize 50`；不要先加复杂负面词。
- 若 MJ 界面不支持 `--v 7` 或 `--raw`，移除不被识别的参数，保留画幅、`--stylize`、`--chaos`、`--iw` 与 `--seed`。

### 提示词

```text
[STAGE-1-IMAGE-URL]

premium mature game environment concept art, preserve the input composition and every spatial relationship exactly. A low-saturation mineral-gouache painting over a physical stage: opaque earth-yellow wall planes, cool gray stone blocks, deep camphor-green canopy as one heavy shadow mass, old gray tiled eaves as sharp rhythmic accents. Controlled dry-brush paint texture and selective charcoal ink edges only at the foreground root, stair edge and wet drainage channel. Strong value hierarchy: foreground root dark, sunlit wall secondary, background compressed and quiet. Tangible but simplified, art-directed, atmospheric, no generic watercolor softness, no photorealistic bark, no plastic low-poly.

--no people --no text --no letters --no Chinese characters --no signs --no symmetrical twin trees --no white plaster houses --no neon --no game HUD --no watermark
```

输出：`yangjiatang-tree-stage-mj.png`

---

## 阶段 3｜Nano Banana：修元素、合成 UI

Nano Banana 用两张输入图：

1. `yangjiatang-tree-stage-mj.png`：作为**视觉风格母版**。
2. `yangjiatang-tree-stage-structure.png`：作为**结构校正参考**。

如果使用的平台提供 `image strength / reference strength`，建议：风格母版 `0.70–0.80`，结构参考 `0.85–0.95`；如果没有参数，就在提示词中使用“preserve exactly”。

### A. 观察态（Minimal UI）

```text
Use image 1 as the visual style master and image 2 as the non-negotiable spatial-structure reference. Preserve the dominant left foreground camphor root, smaller right-rear companion tree, diagonal cool-gray stone steps, narrow wet drainage channel, earth-yellow rammed-earth walls and old gray roof eaves exactly.

Create a polished desktop interactive-exhibition observation state at 1536 by 1024. Keep the painted scene dominant, occupying at least 88% of the view. Add only a minimal edge UI: a small dark charcoal breadcrumb tab at upper-left, one thin vertical source-status tab at far right, and a small circular sound control at upper-right. All UI fields are blank shapes with no letters, no numbers, no symbols and no pseudo-writing. UI should feel like quiet paper-and-ink tools, not glassmorphism and not a game HUD. Do not add a bottom paper ribbon. No people, no watermark.
```

输出：`yangjiatang-tree-stage-ui-minimal.png`

### B. 证据 / 田野旁注展开态（Expanded UI）

```text
Use image 1 as the visual style master and image 2 as the exact structural reference. Preserve the landscape on the left 64% of the frame; do not change trees, steps, water channel, walls or tiled eaves.

Create a polished desktop interactive-exhibition expanded state at 1536 by 1024. On the right 36%, add a vertically stacked, warm rice-paper evidence and field-note panel. It has: one large blank image-crop rectangle, two small blank contact-print rectangles, one muted dark-red source-status seal shape, a small anonymous silhouette medallion, and blank ruled note areas. The panel overlaps the scene softly from the right edge and is clearly secondary to the painted landscape. It must contain absolutely no readable text, no fake Chinese, no glyphs, no letters, no numbers. The UI uses paper fibers, charcoal ink rules, aged gray, and a small muted dark-red accent. No glassmorphism, no neon, no full-width bottom ribbon, no watermark.
```

输出：`yangjiatang-tree-stage-ui-expanded.png`

---

## 最终网页再补真实 UI

不要让任何生图模型生成中文。最终通过 DOM / React 叠加真实内容：

- 顶部路径：`杨家堂 / 夫妻树`
- 右侧状态：`field-note`、`creative` 等来源数据
- 展开面板标题：`根系与让路的石阶`
- 旁注：使用已审核第一人称文案

这样文字可读、可访问、可替换，也不会污染视觉图的材料真实性。
