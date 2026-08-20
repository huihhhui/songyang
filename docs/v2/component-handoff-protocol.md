# v2 组件制作与整合协议

这份协议用于后续把板桥、诉土、溪中桃子、灯、花链等交互组件分到不同对话制作，再回到主项目统一拼接。

## 1. 每个新对话只负责一个组件

新对话不要直接“继续做整个网页”，而是明确一个组件 ID，例如：

- `banqiao-weaving-transition`
- `songzhuang-lamp-pull`
- `songzhuang-flower-chain`
- `yangjiatang-couple-tree`

开场必须附上：

1. 组件目标与叙事作用。
2. 素材目录和哪些文件是“定稿素材”、哪些只是“参考素材”。
3. 交互状态和完成后的转场去向。
4. 禁止新增的元素。
5. 验收截图尺寸与浏览器路径。

## 2. 每个组件的固定交付物

每个组件对话结束时必须产出：

```text
docs/v2/components/<component-id>/brief.md
docs/v2/components/<component-id>/manifest.json
public/assets/components/<component-id>/*
output/review/<component-id>/*
```

其中：

- `brief.md`：最终视觉说明、叙事节奏、状态变化、禁用项。
- `manifest.json`：代码整合所需的机器可读接口。
- `public/assets/components/<component-id>/`：只放该组件自己的素材。
- `output/review/<component-id>/`：首帧、中间帧、尾帧和验收截图。

## 3. manifest 最低接口

```json
{
  "id": "banqiao-weaving-transition",
  "route": "/village/banqiao",
  "entryState": "idle",
  "exitState": "camera-shift",
  "states": [
    "idle",
    "pick",
    "weft",
    "push",
    "rebound",
    "material-swap",
    "camera-shift",
    "complete"
  ],
  "assets": {
    "background": "…",
    "interactive": ["…"],
    "transition": ["…"],
    "nextScene": "…"
  },
  "interaction": {
    "pointerAxis": "vertical-then-horizontal",
    "completionThreshold": 0.96
  },
  "handoff": {
    "nextRoute": "/village/banqiao",
    "nextAnchor": "lan-teacher-weaving"
  }
}
```

## 4. 本次编织组件的状态契约

本次不再把“代码线直接接布带”当成最终画面，而是分成两层：

1. `pick / weft / push`：代码负责交互和物理反馈。
2. `rebound / material-swap`：竹片短暂遮挡接缝后，切换到自然松线—布带桥接素材。
3. `camera-shift`：不是布带自己平移，而是镜头向右，画面整体向左位移，竹片始终贴在竖线左侧。

桥接素材必须满足：

- 左侧松线的数量、颜色和高度能与交互线对齐。
- 中间没有额外的竖向装饰线。
- 右侧直接进入已编织纹样，不出现白色矩形边界。
- 竹片遮挡时可以完全盖住缝口，回弹后自然露出。

## 5. 最终整合对话怎么开

新开一个“整合对话”，不要让它重新设计任何组件。开场直接给：

```text
请只做组件整合，不重新设计视觉。
项目：D:\codex_sy\wutonger-sunyang
组件协议：docs/v2/component-handoff-protocol.md
待整合组件：
- docs/v2/components/banqiao-weaving-transition/manifest.json
- docs/v2/components/songzhuang-lamp-pull/manifest.json
...
要求：
1. 先读取所有 manifest 和 brief。
2. 检查路由、状态名、素材路径是否冲突。
3. 只在 src/app/ 中做编排和转场接线。
4. 不修改组件素材，不擅自补写研究文字。
5. 运行 build、e2e，并输出整合后的验收路径和截图。
```

## 6. 防止上下文记忆模糊

- 事实只写入 `brief.md`，不要只留在聊天里。
- 视觉定稿只认 `public/assets/components/<id>/` 中的版本。
- 每次修改必须递增 `v2 / v3`，不覆盖旧图。
- 每个组件都必须有“禁止新增元素”列表。
- 整合对话只读 manifest 和 brief，不依赖前面对话的隐含记忆。

