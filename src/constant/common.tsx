const appLinks = [
  { idx: 1, title: "首页", href: "/" },
  { idx: 2, title: "试剂管理", href: "/reagent" },
];

const apps = [{ title: "试剂管理", href: "/reagent" }];

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
  "214试剂仓库",
  "110实验室自留",
  "111实验室自留",
  "119实验室自留",
  "210实验室自留",
  "221实验室自留",
  "223实验室自留",
  "225实验室自留",
];

export { apps, appLinks, labs, reagentTableColumns, units };
