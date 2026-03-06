interface createReagentSchema {
  chemLab: string;
  chemName: string;
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

  msdsUrl: string;
  other: string;
}

export type {
  createReagentSchema,
  getReagentsSchema,
  getReagentsResponseSchema,
};
