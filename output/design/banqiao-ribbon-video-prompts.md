# 板桥布带转场视频提示词 v1

## 目标

从网页编织交互完成态，进入“布带镜头右移并散线到兰老师编织页”的转场。

## 已生成关键帧

首帧建议：

```text
D:\codex_sy\wutonger-sunyang\public\assets\imagegen\banqiao-assets\banqiao-woven-ribbon-transition-v1.png
```

过程图：

```text
D:\codex_sy\wutonger-sunyang\output\imagegen\banqiao-transition\bq-ribbon-to-threads-mid-v1.png
```

尾帧：

```text
D:\codex_sy\wutonger-sunyang\output\imagegen\banqiao-transition\bq-ribbon-to-lan-tail-v1.png
```

## MiniMax H3 推荐参数

先低成本审核：

```text
model: MiniMax-H3
resolution: 768P
duration: 5
ratio: 16:9
```

通过后再考虑：

```text
resolution: 2K
duration: 6-8
```

注意：MiniMax 需要公网 URL，不能直接传 `D:\...` 本地路径。需要先把关键帧上传到公网可访问地址。

## 版本 A：首帧到过程图

用途：布带镜头右移，右侧开始散线。

Prompt：

```text
The blue-white-red She woven ribbon fills the center of the frame. The camera slowly pans to the right along the ribbon texture. The loose yarns and the tight woven pattern must stay physically connected. At the right edge, several off-white, indigo blue, and muted red threads begin to loosen and drift outward, while the woven band still remains recognizable. Tactile paper collage, matte textile fibers, gathered zine style, quiet fieldwork mood. No text, no UI, no hands, no people, no new objects. The motion should be slow, smooth, and grounded, like a camera sliding across a real woven strip.
```

负面约束：

```text
Do not create unrelated patterns. Do not add green or black yarn. Do not make the ribbon dissolve into smoke. Do not make the threads look metallic or glossy. Do not add Chinese text, labels, buttons, phone UI, watermark, or extra decorations.
```

## 版本 B：过程图到兰老师编织页

用途：散线缠绕到兰老师编织画面四周，形成下一页的纸面框架。

Prompt：

```text
Loose off-white, indigo blue, and muted red threads from the She woven ribbon drift outward and curl around the edges of a quiet fieldwork weaving scene. The threads form a soft tactile frame around the Lan teacher weaving page, leaving large calm warm-paper blank areas for future text. The weaving hands remain visible and are not covered. The motion feels like textile fibers becoming a page composition. Gathered zine paper collage, matte woven fiber, quiet conversation mood, slow camera drift. No readable text, no UI, no fake labels, no invented new people, no random objects.
```

负面约束：

```text
Do not cover the weaving hands. Do not invent a new teacher portrait. Do not turn the threads into vines, smoke, ribbons, wires, or neon. No museum cards, no captions, no interface buttons, no pseudo-Chinese text.
```

## 版本 C：一次生成完整转场

如果只想一次生成，可以用：

```text
Start with a blue-white-red She woven ribbon made of off-white, indigo, and muted red textile fibers. The camera pans slowly to the right along the ribbon. The tight woven pattern remains connected to the loose yarns. As the camera moves, the right edge of the ribbon loosens into separate threads. These threads drift outward and become a soft paper-collage frame around a Lan teacher weaving fieldwork page. The final frame has the weaving hands visible, warm blank paper areas for later text, and loose threads around the edges. Tactile gathered zine style, matte fiber, quiet fieldwork mood, smooth grounded motion. No text, no UI, no people added, no new objects, no green or black yarn, no metallic shine, no smoke dissolve.
```

建议：

- 如果 MiniMax 支持首尾帧：首帧用 `banqiao-woven-ribbon-transition-v1.png`，尾帧用 `bq-ribbon-to-lan-tail-v1.png`。
- 如果只能首帧：首帧用 `banqiao-woven-ribbon-transition-v1.png`，Prompt 写完整转场。
- 如果可以参考图：附加过程图 `bq-ribbon-to-threads-mid-v1.png` 作为 reference image。

