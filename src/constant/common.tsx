const msdsDownloadPrefix = "https://whpdj.mem.gov.cn";

const appLinks = [
  { idx: 1, title: "首页", href: "/" },
  { idx: 2, title: "试剂管理", href: "/reagent" },
];

const apps = [{ title: "试剂管理", href: "/reagent", desc: "试剂台账" }];

const reagentTableColumns = [
  { idx: 1, title: "实验室", dataIndex: "chemLab" },
  {
    idx: 2,
    title: "化学名称",
    dataIndex: "chemName",
  },
  {
    idx: 3,
    title: "试剂柜",
    dataIndex: "cabinet",
  },
  { idx: 4, title: "具体方位", dataIndex: "place" },

  { idx: 5, title: "CAS", dataIndex: "chemCas" },
  { idx: 6, title: "数量", dataIndex: "reagentNum" },
  { idx: 7, title: "试剂存量", dataIndex: "stock" },
  { idx: 8, title: "计量单位", dataIndex: "unit" },
  { idx: 9, title: "生产厂商", dataIndex: "producer" },
  { idx: 10, title: "生产日期", dataIndex: "mfgDate" },
];

const units = ["ml", "L", "g", "kg"];

const labs = [
  {
    lab: "214试剂仓库",
    cabinets: [
      { name: "111号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      { name: "114号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      {
        name: "117号试剂柜",
        places: ["试剂柜A上层", "试剂柜A下层", "试剂柜B", "试剂柜C", "试剂柜D"],
      },
      { name: "119号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      { name: "210号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      { name: "221号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      { name: "223号试剂柜", places: ["试剂柜上层", "试剂柜下层"] },
      { name: "217-219号试剂柜", places: ["试剂柜上层"] },
      { name: "308号试剂柜", places: ["试剂柜上层-1", "试剂柜下层-2"] },
      { name: "314-1号试剂柜", places: ["上层", "试剂柜顶", "下层"] },
      { name: "314-2号试剂柜", places: ["上层", "下层-1", "下层-2"] },
    ],
  },
  { lab: "110实验室自留", cabinets: [] },
  { lab: "111实验室自留", cabinets: [] },
  { lab: "119实验室自留", cabinets: [] },
  { lab: "210实验室自留", cabinets: [] },
  { lab: "221实验室自留", cabinets: [] },
  { lab: "223实验室自留", cabinets: [] },
  { lab: "225实验室自留", cabinets: [] },
];

const producers = [
  "Adamas",
  "General Reagent",
  "TCI",
  "阿拉丁",
  "安耐吉",
  "奥普奇医药",
  "百灵威",
  "白亚试剂",
  "北京化工厂",
  "毕得医药",
  "长隆科技",
  "达森",
  "大茂",
  "风船",
  "富宇",
  "高纯科技",
  "工业",
  "光复",
  "广成",
  "国药",
  "海斯福",
  "宏程",
  "沪试",
  "湖北可赛",
  "华上翔洋",
  "卡尔玛",
  "凯利",
  "科密欧",
  "乐研",
  "罗恩试剂",
  "麦克林",
  "山东化工研究院",
  "山东鲁红",
  "山师试验场",
  "上海飞祥化工厂",
  "上海试剂二厂",
  "上海五四农场",
  "赛默飞",
  "太阳",
  "陶湾",
  "铁塔",
  "天津奥普升化工有限公司",
  "天津鼎盛鑫",
  "天津试剂",
  "天津致远",
  "沃凯",
  "西亚",
  "西陇",
  "芯硅谷",
  "兴亚",
  "烟台远东",
  "伊诺凯",
  "永大试剂",
  "源叶生物",
  "兢林",
  "江苏迅凯",
  "九鼎化学",
  "自制",
];

export {
  apps,
  appLinks,
  labs,
  msdsDownloadPrefix,
  producers,
  reagentTableColumns,
  units,
};
