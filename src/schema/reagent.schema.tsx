interface createReagentSchema {
  chemLab: string;
  chemName: string;
  chemCas: string;
  place: string;
  stock: number;
  cabinet: string;
  unit: string;
  producer: string;
  mfgDate: string;
  msdsUrl: string;
  other: string;
  reagentNum: number;
}

interface getReagentsSchema {
  page: number;
  size: number;
}

interface getReagentsResponseSchema {
  id: string;
  chemLab: string;
  chemName: string;
  chemCas: string;

  reagentNum: number;
  batchNum: string;

  existingStock: number;
  producer: string;

  place: string;
  cabinet: string;

  mfgDate: string;
  msdsUrl: string;
  other: string;
}

export type {
  createReagentSchema,
  getReagentsSchema,
  getReagentsResponseSchema,
};
