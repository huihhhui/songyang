export const ui = {
  brand: '巫通儿：松阳寻踪',
  subtitle: '一份由物件带路的田野档案',
  archiveLabel: '田野档案 / v2',
  overviewTitle: '从三座村落开始，听见现场',
  overviewIntro: '这里不把村庄整理成景点清单，而是把对话、停顿和材料留下来。选择一座村落，沿着观察站自由行走。',
  enterVillage: '进入村落',
  returnOverview: '返回档案总览',
  stationIndex: '观察站',
  stationPending: '资料整理中',
  startStation: '进入观察',
  evidence: '现场证据',
  fieldNote: '调研旁注',
  source: '来源状态',
  rights: '公开范围',
  mute: '静音',
  unmute: '恢复声音',
  stageHint: '沿图像向下阅读',
  chapterNotice: '部分站点仍在整理。当前页面只呈现已有来源支持的内容。',
}

export const sourceLabels = {
  'field-note': '现场观察',
  'oral-account': '访谈整理',
  report: '报告摘录',
  creative: '叙事转译',
  pending: '待核验',
}

export const rightsLabels = {
  pending: '待确认，不公开原始素材',
  cleared: '可在本项目内展示',
}

const asset = (name, alt, position = 'center') => ({ src: `${import.meta.env.BASE_URL}assets/ke/${name}`, alt, position })

export const villages = [
  { id: 'yangjiatang', name: '杨家堂', englishName: 'YANGJIATANG', index: '01', palette: 'yang', intro: '沿着石阶上行，在夫妻树和瓦片门洞之间放慢脚步。', stations: ['yangjiatang-couple-tree', 'yangjiatang-tile-door'] },
  { id: 'songzhuang', name: '松庄', englishName: 'SONGZHUANG', index: '02', palette: 'song', intro: '溪水、桃子与工作台，把一次次交流留在材料的光里。', stations: ['songzhuang-peach-stream', 'songzhuang-sutuhu', 'songzhuang-craft-witness'] },
  { id: 'banqiao', name: '板桥畲族乡', englishName: 'BANQIAO', index: '03', palette: 'banqiao', intro: '从兰老师的编织和讲述出发，听见文化如何在日常里继续。', stations: ['banqiao-lan-teacher', 'banqiao-materials'] },
]

export const stations = [
  {
    id: 'yangjiatang-couple-tree', villageId: 'yangjiatang', status: 'ready', kicker: '杨家堂 / 观察站 01', title: '在夫妻树下停一会儿',
    observer: { displayName: '调研小组', sourceObjectName: '夫妻树与树冠' },
    visual: { accent: 'yang', images: [asset('yj-01-couple-tree-detail-v13.png', '杨家堂夫妻树的树冠与树干', 'center'), asset('yj-02-tile-door-v9.png', '杨家堂一处瓦片门洞', 'center')] },
    content: [
      { type: 'field-note', sourceStatus: 'field-note', body: '我先注意到的不是树有多大，而是人经过树根时，脚步会自然放慢。', authorDisplayName: '调研小组' },
      { type: 'observer-line', sourceStatus: 'creative', body: '树冠把村路的视线收拢，又把停留交还给每个人。' },
    ],
    evidence: { label: '树冠与门洞', sourceStatus: 'field-note', rightsStatus: 'cleared', description: '两张图像只承担空间定位，叙事中心仍是经过、停留和身体感受。' },
  },
  {
    id: 'yangjiatang-tile-door', villageId: 'yangjiatang', status: 'ready', kicker: '杨家堂 / 观察站 02', title: '门洞里的光线', observer: { displayName: '调研小组', sourceObjectName: '瓦片门洞' },
    visual: { accent: 'yang', images: [asset('yj-02-tile-door-v9.png', '杨家堂瓦片门洞的光影', 'center'), asset('yj-01-couple-tree-detail-v13.png', '夫妻树的局部纹理', 'center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '门洞留下阴影，树根留下方向。村庄不是背景，而是身体经过时不断调整的尺度。', authorDisplayName: '调研小组' }], evidence: { label: '门洞光影', sourceStatus: 'field-note', rightsStatus: 'cleared', description: '这是空间观察，不对建筑年代和功能做未核验的推断。' },
  },
  {
    id: 'songzhuang-peach-stream', villageId: 'songzhuang', status: 'ready', kicker: '松庄 / 观察站 01', title: '溪中桃子', observer: { displayName: '调研小组', sourceObjectName: '溪水、桃子与石拱桥' },
    visual: { accent: 'song', images: [asset('sz-01-peach-v8.png', '溪水中的桃子与石拱桥', 'center'), asset('sz-01-peach-v8.png', '桃子贴近水面的局部', '60% center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '水面把声音放轻。桃子不是风景的结论，而是一次短暂、松弛的相遇。', authorDisplayName: '调研小组' }, { type: 'observer-line', sourceStatus: 'creative', body: '当信息密度降下来，肌理、光影和水的流动替我们继续叙述。' }], evidence: { label: '溪水与石拱桥', sourceStatus: 'field-note', rightsStatus: 'cleared', description: '画面只保留来源支持的三种元素：溪水、桃子、石拱桥。' },
  },
  {
    id: 'songzhuang-sutuhu', villageId: 'songzhuang', status: 'ready', kicker: '松庄 / 观察站 02', title: '在诉土工作台边', observer: { displayName: '诉土店主', sourceObjectName: '陶土、纸、木与灯光' },
    visual: { accent: 'song', images: [asset('sz-02-lamp-v10.png', '诉土工作台与枯叶灯罩', 'center'), asset('sz-02-clay-cat-v8.png', '工作台边的陶土小猫', 'center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '我们先从工作台聊起。陶、纸、木和一盏灯，把一次交流托在了材料之间。', authorDisplayName: '调研小组' }, { type: 'oral-account', sourceStatus: 'oral-account', body: '诉土店主的讲述将以访谈整理稿呈现。页面不替她补写对白，只保留对话发生的线索。' }], evidence: { label: '工作台与枯叶灯', sourceStatus: 'field-note', rightsStatus: 'cleared', description: '店主形象来自已授权照片的风格化重绘，作品细节只在资料核验后展开。' },
  },
  {
    id: 'songzhuang-craft-witness', villageId: 'songzhuang', status: 'ready', kicker: '松庄 / 观察站 03', title: '物件如何把人带进来', observer: { displayName: '村民参与', sourceObjectName: '花绳、木鸟与瓦片龟' },
    visual: { accent: 'song', images: [asset('sz-03-flower-rope-v10.png', '花绳作品的局部', 'center'), asset('sz-03-wood-bird-v9.png', '木鸟公共艺术见证', 'center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '木鸟和瓦片龟不是故事的主角，它们见证了村民如何被邀请参与，也见证了传播如何发生。', authorDisplayName: '调研小组' }], evidence: { label: '参与的见证物', sourceStatus: 'field-note', rightsStatus: 'cleared', description: '物件退到叙事边缘，用来连接村民参与和文化传播的观察。' },
  },
  {
    id: 'banqiao-lan-teacher', villageId: 'banqiao', status: 'ready', kicker: '板桥畲族乡 / 观察站 01', title: '兰老师把彩带递给我们', observer: { displayName: '兰老师', sourceObjectName: '畲族彩带与编织' },
    visual: { accent: 'banqiao', images: [asset('bq-02-teacher-v10.png', '兰老师的风格化人物形象，左侧留出视线方向', 'left center'), asset('bq-02-teacher-v10.png', '编织与讲述的现场线索', '70% center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '手指把线一根根拨开，讲述也从动作里展开。我们听见彩带、畲歌和婚恋信物如何连到今天。', authorDisplayName: '调研小组' }, { type: 'oral-account', sourceStatus: 'oral-account', body: '兰老师的访谈将围绕畲族彩带、婚恋信物、畲歌传承、学校教学与三月三活动分段呈现。' }], evidence: { label: '人物与编织', sourceStatus: 'oral-account', rightsStatus: 'cleared', description: '人物是叙事中心，编织手部负责把阅读带回现场。' },
  },
  {
    id: 'banqiao-materials', villageId: 'banqiao', status: 'ready', kicker: '板桥畲族乡 / 观察站 02', title: '文化在日常里继续', observer: { displayName: '板桥村民', sourceObjectName: '夯土、公共空间与蜂箱' },
    visual: { accent: 'banqiao', images: [asset('bq-01-public-building-v13.png', '板桥公共建筑的风格化图像', 'center'), asset('bq-01-beehive-v9.png', '板桥蜂箱与环境纹理', 'center')] },
    content: [{ type: 'field-note', sourceStatus: 'field-note', body: '报告提醒我们，文化实践常常同时是生活也是展示。真正重要的是谁在调整、谁仍然拥有决定的空间。', authorDisplayName: '调研小组' }, { type: 'report', sourceStatus: 'report', body: '本次观察样本显示，小规模参与和日常微调比完整展演更常见。结论只适用于本次样本，不外推为所有村落的共同经验。' }], evidence: { label: '公共空间与日常', sourceStatus: 'report', rightsStatus: 'cleared', description: '报告数据用于限定观察范围，不将统计结果包装成景区宣传口号。' },
  },
]

export const getVillage = (id) => villages.find((village) => village.id === id)
export const getStations = (villageId) => stations.filter((station) => station.villageId === villageId)
