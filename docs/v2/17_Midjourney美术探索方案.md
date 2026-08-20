# Midjourney 美术探索方案

## 首要规则

本项目不是一幅“松阳村落大全”式效果图，而是由三个彼此独立的村落章节组成。每个章节再由独立观察站承载。一次生图只能服务于一个观察站，不能为了画面丰富而拼入其他站、其他村庄的人物、物件或建筑。

`村庄 -> 观察站 -> 观察者 -> 实拍证据 -> 展示形式` 是不可打乱的链条。

## 首发观察站总表

| 村庄 | 编号 | 观察者 | 站内内容 | 主要呈现 |
| --- | --- | --- | --- | --- |
| 杨家堂 | YJ-01 | 夫妻树 | 树根、树洞、青苔、石阶 | 知识卡 + 夫妻树数字标本 |
| 杨家堂 | YJ-02 | 白猫屋脊雕塑 | 屋顶、梅干菜、门洞影子、调研队让路趣事 | 创作化观察短场景 |
| 松庄村 | SZ-01 | 瓦片乌龟 | 溪中桃子、撩水趣事、红鲤鱼故事 | 趣事 + 待核验故事卡 |
| 松庄村 | SZ-02 | 木鸟 | 村民艺术创作、手艺与实践 | 研究摘要 + 创作化观察 |
| 板桥畲族乡 | BQ-01 | 木头蜂箱 | 古树、石砌台基、蜂箱群 | 树下观察短场景 |
| 板桥畲族乡 | BQ-02 | 畲族布带 | 编织、畲歌老师分享；头饰为数字标本 | 图像档案 + 对话 |
| 板桥畲族乡 | BQ-03 | 万年青条状纹样 | 夯土黄泥房、石基、板桥实体桥 | 空间观察 + 双数字标本 |

## 绝对禁止混用

- 杨家堂的夫妻树、白猫屋脊、梅干菜、门洞影子，不进入松庄或板桥画面。
- 松庄的瓦片乌龟、桃子、红鲤鱼、水槽蘑菇、草本实验室、木鸟，不进入杨家堂或板桥画面。
- 板桥的木头蜂箱、畲族布带/头饰、万年青纹样、夯土石基、实体桥，只能出现在板桥章节。
- 板桥内部也不可混用：BQ-01 不放畲歌老师和布带；BQ-02 不放蜂箱古树；BQ-03 不放蜂箱或人物访谈。
- 视觉小说 UI 是可复用的界面语言，不是可以混装不同地点内容的理由。每次 UI 中的肖像、证据图、数字标本必须全部来自当前站。

## Midjourney 使用方法

先在网页上传每站指定的实拍图，复制 URL 并放到提示词开头。每次最多 2 至 3 张参考图；第一张始终是该站最关键的材料或空间证据。

通用尾缀：

```text
--ar 16:9 --stylize 100 --chaos 6 --no generic Chinese fantasy village, white plaster walls, smooth yellow stucco, glossy plastic, photorealistic people, readable text, watermark, logo
```

## 七个独立生图任务

### YJ-01 根下的停驻

参考：`28，27，50N 119，32，34E/3.jpg`、`4.jpg`、`6.jpg`。

```text
[image URLs]
low-poly observation-station concept for Yangjiatang, Songyang: two ancient embracing camphor trees, visible old bark, hollow at the trunk junction, restrained moss, cool gray stone steps and roots. The paired trees are the silent observer; give no face and no human limbs, communicate presence only through composition, root direction and light. A small paper museum knowledge card is hinted at with a digital specimen preview of bark and hollow. Handcrafted faceted 2.5D field-exhibition stage, quiet and grounded, not fantasy.
```

### YJ-02 屋脊白影

参考：`28，27，50N 119，32，34E/2.jpg`、`7.jpg`；可补 `28，27，46N  119，32，35E/1.jpg`。

```text
[image URLs]
low-poly 2.5D observation scene in Yangjiatang: a real small white cat sculpture on an aged roof ridge watches a narrow village passage below. Include only local clues from the references: roof line, dried preserved vegetables, a cool doorway shadow and a modest fieldwork-team passing-by moment. The cat remains a fixed roof sculpture with only a tiny blink or glance implied; no cartoon body, no fantasy cat character. Handmade visual-novel stage, warm earth and gray tile, restrained field diary feeling.
```

### SZ-01 龟背的慢行者

参考：`28，27，8N 119，34，13E/11.jpg`、`14.jpg`；可补 `28，27，5N 119，34，11E/9.jpg`。

```text
[image URLs]
low-poly 2.5D creek observation station in Songzhuang village. A wooden turtle sculpture with roof tiles as its shell is the observer; it watches several peaches caught between stream stones and a small fieldwork splash moment. Preserve creek stones, moving water and mottled old village surfaces. The turtle remains a wooden art object, with a minimal attentive tilt only, not an animal mascot. Include a quiet paper story-card hint for a local red-carp story marked as unverified, with no readable text.
```

### SZ-02 木鸟停在手边

参考：`28，27，8N 119，34，13E/12.jpg`、`13.jpg`，可补 `1.jpg` 或 `3.jpg`。

```text
[image URLs]
an intimate low-poly visual-novel observation station inside Songzhuang's art-making context. A real carved wooden bird is the observer, looking over handmade work surfaces and small traces of village art practice. Show mottled whitewashed earthen material, old wood, paper, vines only when they belong to the interior evidence. The wooden bird retains its carving form and texture, no limbs, no mascot expression. A research-summary paper panel and one object specimen preview share the frame, no readable text.
```

### BQ-01 树下的蜂箱

参考：`28，27，14N 119，39，21E/12.jpg`、`13.jpg`。

```text
[image URLs]
low-poly observation station in Banqiao She ethnic township: an old tree above a mossy irregular stone base, ringed by real weathered wooden beehives. One wooden hive is the quiet observer, retaining stacked box form, roof and wood slats; use only two tiny recessed eyes and a barely perceptible lean. No teacher, woven band, headwear, bridge or house facade. Handcrafted faceted 2.5D stage, tactile old wood, rough stone and deep green shade, calm field museum atmosphere.
```

### BQ-02 织带的回声

参考：`28，27，14N 119，39，21E/14.jpg`、`15.jpg`、`17.jpg`。头饰 `16.jpg` 或 `19.jpg` 只作为数字标本参考。

```text
[image URLs]
a low-poly visual-novel archive encounter for Banqiao She ethnic township. The observer is a narrow woven fabric band, preserving real woven fibers, color rhythm and hand-made form; it subtly curves toward an elder craftsperson's hands as a research team listens. The composition is about weaving and exchange, not a village panorama. A respectful headwear specimen appears only in a separate small archival preview, never anthropomorphized. Paper dialogue panels, textile close-up, warm indoor field-recording light, no readable text, no invented ethnic symbols.
```

### BQ-03 沿着青线过桥

参考：`28，27，14N 119，39，21E/4.jpg`、`5.jpg`、`8.jpg` 或 `9.jpg`。

```text
[image URLs]
low-poly spatial observation station for Banqiao She ethnic township. Follow the small blue evergreen stripe detail across a weathered ochre rammed-earth house, its thick irregular stone foundation and the real Banqiao bridge. The stripe is the observer, shown as a restrained architectural line leading the eye; it does not become a creature. Preserve compacted earth layers, cracks, holes, aged dark-gray roof tiles, old timber and gray-brown stones. No beehives, no tree, no people, no woven band. Browser-feasible Three.js geometry, a paper research card plus two small digital specimen previews for wall and bridge, no readable text.
```

## 选择顺序

先完成 7 张“单站空间图”，每张只按本站通过标准筛选；确认后再分别做对应的 UI 合成图。不得把不同站的优选图重新合并成一张综合效果图。
