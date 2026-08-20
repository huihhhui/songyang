# 杨家堂内层交互｜四种画风方案

四图锁定同一空间关系：一棵占主画面的古樟主树、右后较小的伴树、交叠树冠、紧贴根系的石阶、夯土墙与旧瓦檐。所有底部纸带均为空白，正式页面文字由数据层渲染。

| 方案 | 文件 | 特征 | 建议用途 |
| --- | --- | --- | --- |
| A 石青重彩田野绘卷 | `A_mineral_painting_field_scroll.png` | 墨线与矿物色块平衡，空间与材料可读 | **观察舞台首选**、章节转场 |
| B 木刻套色标本剧场 | `B_woodcut_specimen_theater.png` | 黑色雕刻轮廓最强、叙事最有力度 | 趣事分镜、短场景 |
| C 水粉田野日记 | `C_gouache_field_diary.png` | 柔和干刷、最接近田野手帐 | 证据 / 旁注页 |
| D 剪纸低多边形舞台 | `D_paper_cut_geometric_stage.png` | 结构最清晰，纸材层次明显 | 需要高性能的 R3F 互动场景 |

生成方式：项目隔离 API，经 bundled `image_gen.py` 调用 `gpt-image-2`。提示词与源文件位于 `tmp/imagegen/yangjiatang-interaction-style-options.jsonl`。
