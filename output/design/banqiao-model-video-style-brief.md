# 板桥 3D 模型、数字艺术切换与 MiniMax H3 视频生成简报 v1

## 1. Rodin / AI 3D 模型交付规格

### 推荐交付格式

网页端优先级：

1. `glb`：首选。单文件，包含网格、材质和贴图，适合 Three.js / React Three Fiber 直接加载。
2. `gltf + bin + textures`：适合需要手动替换贴图或压缩贴图时使用。
3. `fbx`：保留给 Blender / C4D / Maya 再编辑。
4. `obj + mtl + textures`：兼容性强，但网页材质恢复麻烦，不作为最终网页首选。
5. `stl`：只适合 3D 打印或纯几何，不适合网页展示。

Rodin/Hyper3D 官方 API 文档提到可输出 GLB、OBJ、FBX 等格式，并可能生成三角或四边面网格；第三方 Rodin V2 资料也列出 GLB、USDZ、FBX、OBJ、STL 等导出格式。网页项目里我们统一收敛到 `glb`。

### 面数建议

为了网页能流畅运行，建议不是追求最高面数，而是分层控制：

| 模型 | 网页展示目标 | 建议三角面数 | 贴图 | 备注 |
|---|---:|---:|---|---|
| 板桥整体沙盘 | 可旋转地图主模型 | 25k-80k tris | 1-2 张 2K | 不要做成超大真实村庄，做紧凑沙盘 |
| 畲族头饰 | 可近距离查看物件 | 40k-120k tris | 2K，必要时 4K | 细节集中在银饰、织物、纹样 |
| 夯土黄泥屋 | 建筑材料节点 | 20k-70k tris | 1-2 张 2K | 重点是墙体层理、瓦片、木梁、石基 |
| 蜂箱 | 外景节点 | 10k-35k tris | 1K-2K | 蜜蜂不做 3D，改用 2D sprite |

如果 Rodin 只能先导出高模：先保留高模源文件，然后做一次网页优化：

- Draco 压缩 `glb`。
- 贴图转 WebP / KTX2。
- 合并材质，减少 draw calls。
- 给复杂模型做 LOD：远景低模、近景高模。

### 模型命名建议

放到：

```text
public/assets/models/banqiao/
```

建议命名：

```text
banqiao-diorama-v1.glb
she-headdress-v1.glb
rammed-earth-house-v1.glb
guide-bee-sprite-v1.png
```

### Rodin 生成 Prompt 建议

#### 板桥整体沙盘

```text
A compact stylized 3D diorama of Banqiao She Ethnic Township in Songyang, Zhejiang. Rural village map object, earthen yellow walls, dark gray tiled roofs, timber beams, stone bases, small public building, rammed-earth texture, subtle blue-white-red woven thread path connecting spaces. Isometric game-map feeling, handcrafted museum miniature, clean topology, web-ready GLB, no people, no text, no tourist signs, no random lanterns or fantasy decorations.
```

#### 畲族头饰

```text
A respectful stylized 3D model of a She ethnic traditional headdress, museum object presentation, woven textile base, silver ornament details, blue-red-white woven pattern accents, handmade craft texture, clean silhouette, web-ready GLB, no face, no mannequin, no fantasy crown exaggeration, no text.
```

#### 夯土黄泥屋

```text
A stylized 3D model of a Songyang / Banqiao rural rammed-earth yellow mud house, dark gray tiled roof, timber beams, stone foundation, warm earth wall texture with layered rammed-earth marks, handmade architectural miniature, clean web-ready mesh, no modern signage, no people, no fantasy decoration.
```

#### 瓶贴风格蜜蜂

不走 Rodin。用 image2 / nanobanana 生成 2D 透明 PNG 或 sprite sheet。

```text
A small stylized guide bee sprite for an interactive cultural map, vintage bottle-label illustration style, flat paper-cut shape, warm yellow and dark brown body, translucent simple wings, tactile paper grain, readable silhouette, cute but not cartoonish, no text, no logo, no background, suitable for web PNG sprite animation.
```

## 2. 数字艺术风格切换方案

你可以把板桥 3D 模型做成一个“真实基础模型 + 四个数字艺术材质预设”。用户点击按钮时，不换模型，只换材质、后期、线框和信息层。

### 可点开的实现参考

下面这些不是让我们照抄视觉，而是用来确认“这种技术效果网页里有人做过，可以实现”。

| 可选风格 | 成品 / 示例 | GitHub 源码 | 我们借用什么 |
|---|---|---|---|
| 数字拓印 / 半调 | [Three.js Halftone example](https://threejs.org/examples/#webgl_postprocessing_halftone) | [webgl_postprocessing_halftone.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_halftone.html) | 半调、纸面颗粒、拓印感 |
| 像素织物 | [Three.js Pixel example](https://threejs.org/examples/#webgl_postprocessing_pixel) | [webgl_postprocessing_pixel.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_pixel.html) | 像素化/织物格点感 |
| 蓝白线描 / 档案模式 | [Three.js Outline example](https://threejs.org/examples/#webgl_postprocessing_outline) | [webgl_postprocessing_outline.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_outline.html) | 模型描边、节点高亮 |
| 手绘卡通材质 | [Three.js Toon materials](https://threejs.org/examples/#webgl_materials_variations_toon) | [webgl_materials_variations_toon.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_variations_toon.html) | 低真实度、插画化材质 |
| React Three Fiber 实现生态 | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) | [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | 项目里接 3D 模型的主框架 |
| 后期特效封装 | [react-postprocessing](https://github.com/pmndrs/react-postprocessing) | [pmndrs/react-postprocessing](https://github.com/pmndrs/react-postprocessing) | 在 React 里切换 Bloom、Noise、Outline、Pixel 等后期 |
| 手绘/素描质感 | [Sketchy Pencil Effect demo](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_sobel.html) | [webgl_postprocessing_sobel.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_postprocessing_sobel.html) | 边缘检测，可转成拓印/线稿 |
| 字符编码 / ASCII | [Three.js ASCII effect](https://threejs.org/examples/#webgl_effects_ascii) | [webgl_effects_ascii.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_effects_ascii.html) | 把模型明暗转成字符矩阵 |
| 数字点云 | [Three.js Points waves](https://threejs.org/examples/#webgl_points_waves) | [webgl_points_waves.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_points_waves.html) | 点云、粒子阵列、数字采样感 |
| 点阵精灵 | [Three.js Points sprites](https://threejs.org/examples/#webgl_points_sprites) | [webgl_points_sprites.html](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_points_sprites.html) | 用贴图点表现蜂群/尘埃/扫描点 |

我的判断：

- “织线地图”没有一个现成模板能完全套上，需要我们组合路径线、模型描边和节点标记。
- “数字拓印”最有现成技术基础，Three.js Halftone + 纸张噪声就能起步。
- “夯土记忆”不是后期特效，主要靠模型材质和贴图，所以要在 Rodin 生成/Blender 清理阶段把墙体材质做好。
- 蜜蜂按你的新要求改成 2D，不放进 3D 模型清单，只作为网页贴纸 Sprite / PNG 序列 / Lottie 动画。

### 推荐让你挑的 6 个方向

#### A. 织线地图

参考逻辑：Three.js 线框、路径线、描边。  
效果：建筑变成浅纸面，路径和屋檐变成蓝白织线，节点用红色 X 纹样标记。  
适合板桥：最贴合布带叙事。

实现：

- `MeshBasicMaterial` / `MeshStandardMaterial` 淡化底色。
- 增加蓝白曲线路径。
- 模型边缘加细描边。
- 节点悬浮红色 X 纹样。

#### B. 夯土记忆

参考逻辑：材质强化，而不是强滤镜。  
效果：黄泥墙层理增强，瓦片和木梁保留暗色，蓝色织线只作为轻引导。  
适合板桥：最稳、最文化现场，不容易变成赛博装饰。

实现：

- 土黄/灰瓦/木色三套材质。
- 法线贴图或噪声纹理增强夯土。
- 低饱和环境光。

#### C. 非遗声纹

参考逻辑：声音可视化 + 空间叙事。  
效果：模型外缘出现轻微声波线，畲歌/讲述相关节点泛起波纹，织带纹样以投影浮现。  
适合板桥：连接兰老师讲述、畲歌、教学。

实现：

- Shader 或 Canvas 叠加声波线。
- 节点点击时出现波纹。
- 可和音频素材联动。

#### D. 数字拓印

参考逻辑：版画、拓片、半调印刷。  
效果：模型转为蓝白红三色拓印，边缘颗粒化，纹样像印在纸上。  
适合板桥：和当前 `ke` 的 zine/拼贴视觉最统一。

实现：

- 后处理 HalftonePass。
- 限制调色板：蓝、红、米白、炭黑。
- 叠加纸张噪声纹理。

#### E. 字符编码档案

参考逻辑：ASCII / 字符矩阵 / 编码可视化。  
效果：模型表面被转换成字符和编码点阵，比如 `0 1 / SHE / BQ / 纹样编号` 等微字符，远看是形体，近看是数字档案。  
适合板桥：适合“数字化记录、非遗档案、研究数据”段落。

实现：

- Three.js ASCII effect 或自定义 shader。
- 字符不要随机乱码，建议用有限字符集：`0 1 B Q SHE LAN 织 带`。
- 只在模型暗部/边缘出现，避免变成黑客风。

#### F. 数字点云

参考逻辑：Points / particles / sampled geometry。  
效果：模型由蓝白红和土黄色点云组成，旋转时点阵聚散，像被扫描成数字样本。  
适合板桥：适合地图导览页作为“数字艺术模式”，科技感强但还能保持轻盈。

实现：

- 把模型顶点或表面采样成 points。
- 点大小随距离和光照变化。
- 可叠加少量漂浮文字编码，但不做满屏赛博。

#### G. 蓝白线描

参考逻辑：Toon / Outline / blueprint。  
效果：模型成为蓝白线描结构图，像数字档案里的可旋转草图。  
适合板桥：适合“研究/档案”段落，但情绪会偏冷。

实现：

- `MeshToonMaterial`。
- Outline pass。
- 背景米白，不做纯科技蓝。

#### H. 像素织物

参考逻辑：Pixelation pass / 像素化后处理。  
效果：模型像被转译成织物像素，边缘变成小格点。  
适合板桥：有趣，但风险是太游戏化，可能冲淡田野感。

实现：

- Pixelation pass。
- 低分辨率 render target。
- 只在按钮切换时短暂使用，不建议作为默认。

### 我建议先选的 4 个

优先：

1. 织线地图
2. 夯土记忆
3. 数字拓印 / 半调
4. 字符编码档案
5. 数字点云
6. 非遗声纹

暂缓：

- 蓝白线描：可以作为档案模式备选。
- 像素织物：除非你想强化游戏感，否则先不作为主风格。

### 来自用户视频的新增方向：青蓝编码扫描

视频参考：

```text
D:\xwechat_files\wxid_4okmcu214u6f22_18dc\msg\video\2026-08\33440486dfdada0bddc770acc9e0c1af.mp4
```

已抽帧：

```text
D:\codex_sy\wutonger-sunyang\output\video_refs\33440486_style\
```

风格特征：

- 黑色背景。
- 青蓝发光扫描线。
- 物体由像素、字符、网格方块逐步构成。
- 局部有白色框选/检测框，像数字识别界面。
- 不是赛博霓虹，而是“数字生命标本 / 编码考古”。

用于板桥时的改造：

- 不直接套抖音 UI。
- 把青蓝扫描线换成“织线扫描”。
- 字符集使用 `0 1 BQ SHE LAN 织 带` 等有限字符。
- 网格框可以作为“数字采样框”，用于标注屋顶、蜂箱、布带纹样，不作为装饰乱堆。
- 黑底模式只用于 3D 数字艺术切换，不用于主叙事页面，避免和当前 zine 视觉断裂太大。

建议命名：

```text
Preset E：青蓝编码扫描
```

实现方式：

- Three.js ASCII effect + Points。
- 模型边缘加青蓝 emission。
- 背景加稀疏星点/采样噪声。
- 叠加少量矩形检测框，跟随模型关键部件。


## 3. MiniMax H3 视频生成 API

### 官方工作流

MiniMax 文档说明，视频生成是异步流程：

1. 创建生成任务，获得 `task_id`。
2. 用 `task_id` 查询任务状态。
3. 成功后从响应里的 `content.url` 下载视频。

### 创建任务接口

```text
POST https://api.minimax.io/v2/video_generation
Authorization: Bearer <token>
Content-Type: application/json
```

核心字段：

| 字段 | 类型 | 作用 |
|---|---|---|
| `model` | string | 当前 H3 用 `MiniMax-H3` |
| `content` | array | 多模态输入，包含 text / image_url / video_url / audio_url |
| `resolution` | string | `768P` 或 `2K` |
| `duration` | integer | 常用 4-15 秒 |
| `ratio` | string | 文生视频比例，如 `16:9`、`9:16`、`1:1` 等 |
| `callback_url` | string | 可选，任务状态回调地址 |
| `aigc_watermark` | boolean | 是否添加 AIGC 标识水印，默认 false |

`content` 常见结构：

```json
[
  {
    "type": "text",
    "text": "视频提示词"
  },
  {
    "type": "image_url",
    "url": "https://example.com/first-frame.png",
    "role": "first_frame"
  }
]
```

常见 `role`：

- `first_frame`：首帧图。
- `last_frame`：尾帧图。
- `reference_image`：参考图。
- `reference_video`：参考视频。
- `reference_audio`：参考音频。

注意：本地路径如 `D:\...` 不能直接给 API。图片/视频/音频需要公网 URL。可以先把关键帧上传到可访问地址，或后续我帮你做一个临时上传流程。

### 查询任务接口

```text
GET https://api.minimax.io/v2/query/video_generation/{task_id}
Authorization: Bearer <token>
```

H3 v2 状态：

- `queued`
- `running`
- `succeeded`
- `failed`
- `cancelled`

成功后读取：

```json
{
  "task": {
    "status": "succeeded",
    "content": {
      "url": "https://..."
    }
  }
}
```

### 本项目脚本

已添加：

```text
D:\codex_sy\wutonger-sunyang\tools\minimax_h3_video.py
```

脚本会默认读取：

```text
E:\userfile\desktop\APIkey\minimaxh3-松阳.txt
```

不会打印 API key。

#### 文生视频

```powershell
python tools/minimax_h3_video.py create `
  --prompt "A woven ribbon smoothly transforms into floating thread lines..." `
  --duration 5 `
  --resolution 768P `
  --ratio 16:9
```

#### 首帧图生视频

```powershell
python tools/minimax_h3_video.py create `
  --prompt "The completed blue-white-red She woven ribbon slowly pans to the right, loose thread ends drift into the next scene..." `
  --first-frame-url "https://example.com/banqiao-ribbon-frame.png" `
  --duration 5 `
  --resolution 768P
```

#### 查询

```powershell
python tools/minimax_h3_video.py query --task-id <task_id>
```

#### 等待

```powershell
python tools/minimax_h3_video.py wait --task-id <task_id>
```

#### 下载

```powershell
python tools/minimax_h3_video.py download --task-id <task_id> --out output/video/banqiao-transition-v1.mp4
```

## 4. 板桥可用的视频转场候选

### V-01 布带镜头右移

用途：编织交互完成后进入布带完整纹样。

Prompt：

```text
The completed blue-white-red She ethnic woven ribbon fills the center of the frame. The camera slowly pans to the right along the ribbon pattern. Loose thread ends at the left edge tighten and merge into the woven band. Tactile zine paper texture, soft natural fiber, matte colors, calm fieldwork mood, no text, no UI, no hands, no new objects.
```

建议：

- 首帧：网页交互完成后的布带画面。
- 时长：4-5 秒。
- 分辨率：先 768P 审核，满意后再 2K 或再生成。

### V-02 布带散线到兰老师编织页

用途：布带纹样转入 `bq-02-lan-teacher-weaving.png` 页面。

Prompt：

```text
Loose thread ends from a blue-white-red woven ribbon drift outward and curl around the edges of a quiet fieldwork image. The threads form a soft paper-collage frame around the weaving scene. Gentle camera drift, tactile gathered zine style, matte paper, textile fibers, no readable text, no UI, no invented people.
```

建议：

- 首帧：完整布带纹样。
- 尾帧：兰老师编织页效果图。

### V-03 兰老师讲述到蜂箱外景

用途：人物讲述结束，切换到蜂箱地图入口。

Prompt：

```text
Thin blue and red threads fade from a portrait-style fieldwork page and become flight paths. The scene softly transitions into a stylized beehive exterior image. A few small bottle-label style bees emerge from the beehive and hover as guide markers. Tactile paper collage, gentle motion, no cartoon exaggeration, no text, no UI.
```

建议：

- 这段适合用视频，因为“线变成蜜蜂飞行轨迹”代码实现成本高。

## 5. 当前决策建议

我建议你现在先挑两个东西：

1. 数字艺术预设从 A-F 里挑 3-4 个。
2. 视频转场先做 V-01 还是 V-02。

我的个人推荐是：

- 数字艺术预设：A 织线地图、B 夯土记忆、D 数字拓印、C 非遗声纹。
- 视频先做 V-01，因为它直接承接当前正在做的编织交互，最容易验证效果。
