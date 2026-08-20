# 素材双风格对照 v7

本目录全部以 `D:\codex_sy\sucai` 中的原始照片为输入。每个主题包含：

- `originals/`：原始素材复制件，仅用于对照，不作为网页成品。
- `gathered-scenes/`：`scenes-gathered-zine-v1-3` 实景拼贴版。约 15–20% 真实影像，其余为来源形状扩散、纸张、半调和留白。
- `photo-distill/`：`photo-distill` 影像蒸馏版。由本地 HTML/SVG 代码绘制，不保留照片像素。

| 主题 | 原始素材 | 画面承载内容 | 留白用途 | 对照结论 |
|---|---|---|---|---|
| `bq-02-teacher` | `sucai/28，27，14N 119，39，21E/18.jpg` | 兰老师口述、调研成员与老师的对话 | 人物左侧的对话与旁注 | 拼贴版可作为人物对话主图；蒸馏版可作为章节索引 |
| `bq-02-weaving` | `sucai/28，27，14N 119，39，21E/17.jpg` | 编织动作、织带方向和手艺观察 | 织带向左延展形成的阅读带 | 拼贴版更适合沉浸观看；蒸馏版适合动作转场 |
| `sz-01-peach` | `sucai/28，27，5N 119，34，11E/9.jpg` | 溪水、石头、石拱桥；桃子作为后续生成主体 | 水流方向上的趣事和声音提示 | 当前拼贴版未出现桃子，不能定稿；蒸馏版只表达溪流结构 |
| `sz-02-owner` | `sucai/28，27，8N 119，34，13E/8.jpg` | 诉土店主的到来、观察和对话入口 | 人物视线前方的对话区 | 拼贴版保留人物身份且有网页留白；蒸馏版偏海报索引 |
| `sz-02-worktable` | `sucai/28，27，8N 119，34，13E/3.jpg` | 工作台、陶、纸、木、灯光作为进入对话的材料关系 | 右侧大面积对话区 | 拼贴版目前最适合网页主图；蒸馏版适合材料章节开场 |

## 文件路径

实景拼贴：`D:\codex_sy\wutonger-sunyang\output\imagegen\station-comparison-v7\gathered-scenes`

影像蒸馏：`D:\codex_sy\wutonger-sunyang\output\imagegen\station-comparison-v7\photo-distill`

原始素材：`D:\codex_sy\wutonger-sunyang\output\imagegen\station-comparison-v7\originals`

## 当前审核建议

优先比较 `bq-02-teacher`、`bq-02-weaving`、`sz-02-owner` 和 `sz-02-worktable`。如果网页需要“人物/对话沉浸感”，建议以拼贴版为主；如果需要“章节导航/资料索引/转场符号”，建议使用蒸馏版。`sz-01-peach` 需要重新生成一次，明确要求桃子必须是画面中可识别的主体。
