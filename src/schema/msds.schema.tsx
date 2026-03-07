interface ChemInfoRequestBodySchema {
  status: number;
  chemName: string;
  chemCas: string;
  chemEnglishName: string;
  isFuzzy: number;
  page: {
    current: number;
    size: number;
  };
}

interface ChemRecordSchema {
  idenDataId: string;
  chemName: string;
  chemCas: string;
  chemAlias: string;
  chemEnglishName: string;
  un: null;
  updateTime: null;
  riskCategory: null;
  riskDesc: null;
  warnWord: null;
  ghsResource: null;
  pictograms: null;
  pictogramCodes: null;
  recordList: null;
  apperanceShape: null;
  ph: null;
  meltPoint: null;
  boilPoint: null;
  relativeDensity: null;
  relativeVaporDensity: null;
  vaporPressure: null;
  combustionHeat: null;
  limitTemp: null;
  limitPress: null;
  octMatModulus: null;
  flashPoint: null;
  autoIgnitionTemp: null;
  exploLowerLimit: null;
  exploUpperLimit: null;
  breakdownTemp: null;
  viscosity: null;
  solubilty: null;
  density: null;
  specialDanger: null;
  physcialChemDanger: null;
  healthHazard: null;
  careerContactLimit: null;
  environmentHazard: null;
  firstMeasure: null;
  leakageMeasure: null;
  adviceProjectExtinguish: null;
  status: string;
  statusName: string;
  isSDS: string;
  isSDSName: string;
  parameterFeatures: null;
  parameterFeaturesArr: null;
  chemUseNotuse: null;
  avoidMater: null;
  invasionRoute: null;
  acuteToxicity: null;
  companyCount: number;
  directoryName: null;
  safetyFileId: string;
  safetyFileName: string;
  safetyFileUrl: string;
  isShowPdf: string;
}

interface ChemInfoSchema {
  code: number;
  message: string;
  obj: {
    records: ChemRecordSchema[];
  };
  total: number;
  size: number;
  current: number;
  orders: [];
  optimizeCountSql: boolean;
  searchCount: boolean;
  maxLimit: number;
  countId: number;
  pages: number;
}

export type { ChemRecordSchema, ChemInfoSchema, ChemInfoRequestBodySchema };
