# 板桥沉浸式叙事效果图提示词包 v1

用途：先用 image2 / MJ / nanobanana 生成“网页最终效果图与关键帧”，审核后再拆成背景层、主体层、文字层和交互动效层实现。  
共同风格：沿用 `ke` 文件夹已审核图的 gathered zine / 实景拼贴 / 影像蒸馏方向，横版网页全屏构图，主体与留白共同服务叙事，不做展览卡片。

## 全局负面约束

- 不要普通展览网页、不要卡片目录、不要顶部导航栏、不要按钮 UI、不要伪文字。
- 不要金属质感纱线、不要玻璃/塑料/科技感、不要发光霓虹。
- 不要新增无来源的村落元素、游客、装饰植物、墙绘、商业招牌。
- 不要把参考照片直接铺成背景；参考图只提供主体关系、材料、色彩和构图线索。
- 中文正文后期由网页排版实现，效果图里可以留出阅读区或用极少量可替换的版式占位。

## BQ-K1 编织交互关键帧：挑线到压紧

参考图：`D:\codex_sy\sucai\28，27，14N 119，39，21E\22.jpg`  
输出：横版 16:9 网页关键帧，适合拆成背景、竹片、横向经线、竖向纬线、右侧织带图案。

Prompt:

```text
Use case: stylized-concept
Asset type: full-screen interactive web keyframe, 16:9 horizontal
Primary request: Design a poster-quality keyframe for a Banqiao She weaving interaction. The left side contains many separate fuzzy horizontal yarn threads stretched across the screen. A very long flat bamboo strip rises from below the screen, vertical, with a triangular pointed tip and a flat tail hidden outside the bottom edge. Several same-color threads are physically lifted and stacked on top of the bamboo surface. A soft vertical weft yarn has just entered from above, slightly loose and naturally curved, passing through the horizontal threads. The bamboo strip is about to push the weft yarn to the right. On the right side, the separated yarns gradually become a blue-white-black woven band pattern, causally connected to the left threads, not a pasted decoration.
Input image role: reference only for the real weaving material and pattern direction, not a composition to copy.
Style/medium: gathered zine, tactile paper collage, photo-distilled textile illustration, hand-torn edges, halftone fiber texture, quiet editorial poster.
Composition/framing: clean beige paper-cloth background; threads span left to right; bamboo vertical in the left-middle; right woven band is integrated into the same yarn system; no large text area in this interaction frame, only small hint space.
Materials/textures: fuzzy silk/cotton yarn fibers, matte bamboo grain, woven thread compression, soft cloth, handmade paper.
Color palette: warm rice paper beige, indigo blue, off-white, charcoal black, tiny muted red only if needed.
Constraints: the vertical yarn must be soft, slack and curved; bamboo must visibly drive the compression; lifted yarns must cover the bamboo where they touch; right woven band must be made from the same threads; the bamboo is taller than the screen and bottom tail is not visible.
Avoid: metal rods, glossy strings, straight ruler-like vertical line, autonomous moving yarn, UI components, random decoration, realistic photo background, unrelated village elements.
```

## BQ-F1 板桥总叙事首屏：兰老师带路

参考图：`D:\codex_sy\wutonger-sunyang\output\imagegen\ke\bq-02-teacher-v10.png`、`bq-01-public-building-v13.png`、`bq-01-earthen-house-v13.png`

Prompt:

```text
Use case: ui-mockup
Asset type: full-screen immersive web page effect frame, 16:9 horizontal
Primary request: Create a poster-quality web effect frame for the Banqiao chapter of a fieldwork narrative. The scene should feel like entering a story with Lan teacher leading the research group through Banqiao, not like an exhibition gallery. Use the approved ke-style images as full-screen component inspiration: teacher portrait presence, earthen wall/public building texture, and a faint route-like thread. Leave readable blank spaces for real fieldwork text on the side toward Lan teacher's gaze.
Style/medium: gathered scenes zine, editorial fieldwork game-like chapter opening, tactile paper, image distillation, quiet collage, high taste web art direction.
Composition/framing: Lan teacher as a calm human anchor, placed so her gaze creates empty narrative space; background uses simplified Banqiao building/earthen textures; a thread line enters from the bottom and indicates the path through scenes.
Text layout placeholder: leave 2-3 calm text zones, no actual Chinese body text rendered.
Mood: intimate, guided, slow, grounded in conversation.
Avoid: museum wall, card grid, generic travel poster, tourists, fictional props, heavy UI chrome, unreadable pseudo-Chinese.
```

## BQ-F2 兰老师讲述页：对话与研究结果进入留白

参考图：`D:\codex_sy\wutonger-sunyang\output\imagegen\ke\bq-02-lan-teacher-weaving.png`

Prompt:

```text
Use case: ui-mockup
Asset type: full-screen immersive web page effect frame, 16:9 horizontal
Primary request: Design a webpage frame where the approved weaving image becomes a full-screen layered base. The photographic/stylized weaving subject remains visible and respected, while its blank paper areas are filled with elegant narrative typography blocks that will later contain fieldwork notes, Lan teacher's organized interview, and report findings. The image should feel like a scene in a narrative game: the user just completed the weaving interaction and now arrives at a quiet conversation page.
Style/medium: gathered zine editorial, matte paper, woven thread textures, refined Chinese typography layout zones, not literal UI.
Composition/framing: preserve the main weaving action as the emotional center; place text only in existing quiet/blank areas; use thin thread lines and small woven marks to guide reading order; create depth with foreground thread fragments.
Content zones: 1 field observation paragraph, 1 oral-account quote zone, 1 report-evidence note zone. Use empty typographic blocks, no final text.
Avoid: covering the hands or main subject, cards, black translucent overlays, generic captions, invented text, exhibition labels.
```

## BQ-F3 板桥文化实践页：生活、展示与社区参与

参考图：`bq-01-public-building-v13.png`、`bq-01-beehive-v9.png`、`D:\codex_sy\sucai\28，27，14N 119，39，21E\23.jpg`

Prompt:

```text
Use case: ui-mockup
Asset type: full-screen immersive web page effect frame, 16:9 horizontal
Primary request: Create an immersive Banqiao scene about culture continuing in daily life and public space. Use a full-screen ke-style base combining simplified public building texture, earthen material, and a faint beehive/wood structure trace. On the right or lower quiet area, reserve text blocks for research report findings: cultural practice is both daily life and display, with community participation and identity, not only tourism promotion.
Style/medium: tactile gathered zine, fieldwork editorial, warm earth pigment, woodcut contour, muted textile blue accent.
Composition/framing: not a gallery, not cards; one continuous scene that follows from the weaving thread. A thread or woven band should travel through the page and connect to the next transition.
Avoid: propaganda poster, tourist attraction layout, random festivals unless clearly treated as contextual background, fake statistics, unreadable pseudo-Chinese.
```

