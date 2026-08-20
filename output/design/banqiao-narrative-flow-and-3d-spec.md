# 板桥叙事流程与后续 3D 地图导览规格 v1

## 当前核心判断

板桥段不应该做成“站点目录 + 图片展览”，而应该做成一条由丝线串联的剧情路径：

1. 用户先通过编织交互理解“线如何被挑起、穿入、压紧”。
2. 镜头向右移动，展示布带完整纹样，让“交互结果”变成“文化物件”。
3. 布带的线散开，缠绕到兰老师编织画面四周，进入畲族布带信息页。
4. 继续转场到兰老师人物页，由物件知识转入人的讲述。
5. 板桥讲述结束后，切到蜂箱外景。
6. 蜂箱飞出瓶贴风格化蜜蜂，作为领路交互，进入板桥地图导览页。
7. 地图导览页提供 3D 模型入口：板桥、畲族头饰、夯土黄泥屋。

## 页面流程

### BQ-00 编织交互

目标：让用户亲手完成“挑线、穿纬、压紧”的动作，建立后续叙事的身体经验。

视觉层级：

- 底层：米白纸布背景、底部未被挑起的横向经线。
- 中层：竖向纬线，位于底部经线上方。
- 上层：被竹片挑起的同色经线，遮挡纬线。
- 工具层：竖直竹片，从屏幕底部进入，长度超过屏幕高度，不露出尾部。
- 结果层：右侧横向布带纹样，由被压紧的线自然收束出现。

交互：

- 第一步：上下拖动竹片，用尖端挑起同色纱线。
- 第二步：纬线从上方进入，初始松垮弯曲。
- 第三步：左右拖动竹片，竹片主动推动纬线和经线，纬线被动绷直并贴近织带。
- 完成后：触发镜头向右移动。

素材要求：

- 纱线必须毛茸茸、哑光、柔软。
- 纬线必须比当前参考图更细，不能像粗绳。
- 布带纹样参考：`D:\codex_sy\sucai\28，27，14N 119，39，21E\布带纹样.png`
- 纹样必须保留：蓝色几何主体、白色负形、上下红色 X 边线、上下蓝色横线。

### BQ-01 布带完整纹样镜头

目标：把用户刚才完成的“动作”转译成“完整布带”。

动效：

- 竹片推紧完成后，画面不是硬切。
- 镜头向右缓慢平移，横向布带纹样占据画面中心。
- 左侧散线逐渐退出，右侧完整纹样变清晰。
- 布带边缘的几根线松开，成为下一页的转场线。

实现建议：

- 这段可以用代码做平移和遮罩。
- 如果要更高级，可以用 AI 视频生成“布带从线阵压紧成完整纹样”的 2-3 秒过渡视频，再在网页中作为桥接片段播放。

### BQ-02 畲族布带信息页

主图：`D:\codex_sy\wutonger-sunyang\output\imagegen\ke\bq-02-lan-teacher-weaving.png`

目标：从“我刚刚做了一个编织动作”进入“这个物件是什么、怎么被讲述”。

画面：

- ke 图作为全屏底图组件，不做卡片。
- 零散丝线缠绕在图像四周，形成边框、引导线和文字容器。
- 文字浮现在 ke 图留白处，不遮挡手部和编织主体。

文字内容来源：

- 兰老师关于彩带、婚恋信物、畲歌传承、学校教学、三月三活动的整理。
- 报告中关于文化实践兼具生活性、展示性、社区参与和身份认同的结论。
- 所有口述内容保持“整理稿边界”，不虚构原话。

动效：

- 线从上一页布带边缘散开。
- 线绕过画面四周后固定成文字框架。
- 文字不是一次出现，而是按“物件说明 → 口述整理 → 研究发现”逐层浮现。

### BQ-03 兰老师人物讲述页

主图：`D:\codex_sy\wutonger-sunyang\output\imagegen\ke\bq-02-teacher-v10.png`

目标：从物件转入人。兰老师不是背景人物，而是讲述中心。

画面：

- 兰老师位于有视线方向的一侧。
- 文字出现在她视线方向的留白处。
- 前一页的丝线变成轻微的声波/讲述路径，连接人物与文本。

内容：

- “她带我们粗略游览板桥”的实际发生过程。
- 彩带、畲歌、教学、活动传承的讲述整理。
- 不把她做成旅游宣传角色，而是一个真实的沟通对象。

### BQ-04 蜂箱外景与地图导览入口

主图：`D:\codex_sy\wutonger-sunyang\output\imagegen\ke\bq-01-beehive-v9.png`

目标：从室内/人物讲述切换到板桥外景，并把用户带入可探索地图。

动效：

- 兰老师页面的线逐渐淡出。
- 蜂箱外景浮现。
- 蜂箱中飞出几只“瓶贴风格化蜜蜂”。
- 蜜蜂不是装饰，而是交互入口。

交互：

- 用户点击蜜蜂。
- 蜜蜂飞向地图节点。
- 地图导览页展开。

### BQ-05 板桥地图导览页

目标：作为板桥段的自由探索入口，不再是列表目录，而是“游戏地图式导览”。

结构：

- 中央：板桥 3D 模型，可旋转观察。
- 周围：三个模型入口。
  1. 板桥整体 3D 模型。
  2. 畲族头饰 3D 模型。
  3. 夯土黄泥屋 3D 模型。
- 蜜蜂作为光标/引导物，飞到对应节点。

板桥 3D 模型额外功能：

- 默认真实材质版。
- 预设数字艺术按钮，一键切换视觉风格。

## Rodin / AI 3D 生成要求

### 模型 1：板桥整体

用途：地图导览主模型。

建议 Prompt：

```text
A stylized compact 3D diorama of Banqiao She Ethnic Township, Zhejiang rural village, with earthen yellow walls, dark tiled roofs, small public building volume, stone and wood textures, subtle woven blue thread path through the village. Isometric game-map style, clean topology, low-to-mid poly, suitable for web real-time display, no people, no text, no signs, no random tourist decorations.
```

要求：

- 不要做成真实大场景，优先“小型可旋转沙盘”。
- 保留夯土、木、瓦、石、织带蓝线这几类材料。
- 不要加入没有素材来源的牌坊、游客、摊位、灯笼。

### 模型 2：畲族头饰

用途：文化物件节点。

建议 Prompt：

```text
A respectful stylized 3D model of a She ethnic traditional headdress, based on textile craft and silver ornament language, museum-object presentation, handmade woven fabric details, subtle blue-red-white pattern accents, clean silhouette, suitable for web rotation, no face, no mannequin, no text, no fantasy crown exaggeration.
```

要求：

- 如果后续你能提供具体头饰参考图，必须以参考图为准。
- 不能幻想成泛化少数民族王冠。
- 重点是材质：织物、银饰、纹样、手工痕迹。

### 模型 3：夯土黄泥屋

用途：建筑与材料节点。

建议 Prompt：

```text
A stylized 3D model of a rural rammed-earth yellow mud house from Songyang / Banqiao context, dark gray tiled roof, timber beams, stone base, warm earthen wall texture, handmade architectural miniature, clean web-ready mesh, no modern signage, no people, no fantasy decoration.
```

要求：

- 重点是墙体、瓦、木梁、石基。
- 模型需要适合近距离旋转，不能只是贴图盒子。

## 板桥 3D 模型的数字艺术预设

这些预设不是换滤镜，而是点击后改变材质系统、线框、光照和信息层。

### Preset A：织线地图

视觉：

- 建筑材质淡化成纸面。
- 路径和屋檐边缘变成蓝白织线。
- 节点由小红 X 纹样标记。

适合解释：

- 板桥如何被“路线、讲述、手艺”串起来。

### Preset B：夯土记忆

视觉：

- 所有墙体强化夯土层理。
- 木梁和瓦片保持深色。
- 蓝色织线只保留为很细的引导线。

适合解释：

- 建筑材料和日常空间。

### Preset C：非遗声纹

视觉：

- 模型边缘出现轻微声波线。
- 织带纹样在地面/墙面上以投影方式闪现。
- 适合连接畲歌、讲述和教学。

适合解释：

- 文化不是静态物件，而是通过讲述、歌和教学传播。

### Preset D：数字拓印

视觉：

- 模型转成蓝白红三色拓印风格。
- 几何纹样变成信息图层。
- 边缘带轻微半调和纸张颗粒。

适合解释：

- 传统纹样进入数字展示。

## 下一步制作顺序

1. 先把 BQ-00 编织交互做顺，尤其是纬线张力和布带纹样。
2. 用 `布带纹样.png` 生成一个高质量横向布带素材，替代代码临时纹样。
3. 做 BQ-01 镜头右移和布带完整展示。
4. 做 BQ-02 兰老师编织信息页。
5. 做 BQ-03 兰老师人物讲述页。
6. 做 BQ-04 蜂箱蜜蜂入口。
7. 等 3D 模型准备好后，再做 BQ-05 地图导览页和数字艺术预设。

