# 松庄溪中桃子水线观察站：风格化生成方案

## 推荐路线

采用 K2 为主：Kena 的柔和 3D 环境体块 + 旧村落模型的斑驳材料。外部场景保持立体，内部 UI 再用 K4 的绘画化纸质层。

当前结构底图：

`D:\\codex_sy\\wutonger-sunyang\\output\\imagegen\\songzhuang-v2\\01_creek-peaches_observation-stage_image2_v3_left.png`

## 风格参考图包

上传到 MJ 的 `--sref`，建议每组只选 2 张，避免风格冲突：

### K2 主参考（推荐）

- Kena: Bridge of Spirits 环境美术：https://www.artstation.com/search?q=Kena%20Bridge%20of%20Spirits%20environment&sort_by=relevance
- RiME 环境美术：https://www.artstation.com/search?q=RiME%20environment%20art&sort_by=relevance

提取：柔和 3D 体块、手绘贴图、自然光、低饱和旧材料。

### K1 光影参考

- Kena: Bridge of Spirits：https://store.steampowered.com/app/1954200/Kena_Bridge_of_Spirits/
- Journey：https://store.steampowered.com/app/638230/Journey/

提取：空气透视、树影、水面高光和电影式构图；不要复制角色或奇幻生物。

### K4 UI／内层参考

- The Last Campfire：https://store.steampowered.com/app/990630/The_Last_Campfire/
- GRIS：https://store.steampowered.com/app/683320/GRIS/

提取：水粉色块、留白、纸质旁注和绘画化界面，不改变外部结构。

## 路线 A：image2 直接风格化

适合先快速确认整体美感。输入结构底图，要求只改变材质和渲染语言。

提示词：

```text
Edit the supplied Songzhuang creek observation-stage image.
Keep the exact camera, composition and object relationships unchanged:
shallow creek in foreground, one uneven row of rounded stones splitting the water into two channels,
three small peaches physically trapped against the central stones,
worn stone steps entering from the left, leafy canopy above,
only a cropped old gray tile eave and mottled vine-covered whitewashed wall behind.

Transform the rendering into a Kena-inspired stylized 3D rural diorama,
soft hand-painted environment textures, matte materials, gentle cinematic daylight,
slightly simplified forms, tactile wet stone, moss and aged tile,
muted jade water with restrained peach-orange accents.
Keep Songzhuang weathering and asymmetry; no tourist reconstruction.
No people, no turtle, no extra fruit, no complete village, no text, no signs, no UI,
no neon, no fantasy waterfall, no glossy CGI, no watermark.
```

建议：`gpt-image-2`、`1536x1024`、`quality medium`。若结构漂移，退回原底图，不连续重绘。

## 路线 B：image2/Nano Banana 底图 + MJ 风格化（推荐最终路线）

### 第 1 步：底图

使用现有 image2 方案 B。若需要补修，用 Nano Banana 只修正：

- 桃子必须与中央分流石接触；
- 水线必须明确分成两股；
- 左侧保留 3–5 级旧石阶；
- 背景只出现局部旧瓦檐和藤蔓斑驳墙；
- 不加入乌龟、人物、文字或完整村落。

### 第 2 步：MJ v7／v8.1

把结构底图 URL 放在最前面，风格参考图 URL 放在 `--sref` 后。

```text
[STRUCTURE_IMAGE_URL]
Songzhuang, Songyang, China, fixed 2.5D observation stage beside a rural creek.
Preserve the exact reference geometry and object count.
Stylized cinematic 3D environment art, soft hand-painted textures,
weathered rural materials, mottled whitewash over earthen wall,
aged curved gray roof tiles, dark vines, wet cool-gray stones,
quiet jade-green water, three restrained peach-orange accents.
The scene feels like a carefully crafted fieldwork diorama,
not a tourist village and not a fantasy game level.
Readable silhouettes, matte surfaces, gentle atmospheric light,
subtle painterly simplification, no photorealistic lens effects.
No people, no turtle, no extra peaches, no complete building,
no text, no signs, no invented writing, no UI, no neon, no watermark.

--ar 3:2 --iw 2 --stylize 180 --chaos 0 --weird 0
--sref [KENA_REF_URL] [RIME_REF_URL] --sw 180
--no glossy CGI, oversaturated colors, clean white walls, fantasy waterfall
```

如果账号支持 v8.1，先用 `--v 8.1`；若报错，改为 `--v 7`。不要在第一轮同时使用 3 张以上 `--sref`。

### 第 3 步：局部修正

如果 MJ 改坏桃子或分流石，用 Vary Region 只框选背景墙、树影和屋檐；中央水线区域不要重绘。参数保持 `--chaos 0`。

## 三轮参数

| 轮次 | 目的 | 参数 |
| --- | --- | --- |
| 结构保真 | 确认溪流、桃子、石阶 | `--iw 2.2 --stylize 100 --chaos 0` |
| K2 风格 | 形成柔和 3D 旧村落模型 | `--iw 2 --stylize 180 --sw 180` |
| 绘画化 | 为 UI／证据展开准备 | `--iw 1.8 --stylize 260 --sw 220` |

## 禁止漂移

泛江南白墙、完整旅游村、瀑布、桥、人物、瓦片乌龟进入溪流、额外桃子、霓虹点云、游戏跑图界面、伪中文、水印、过度镜头虚化、塑料或 glossy CGI。
