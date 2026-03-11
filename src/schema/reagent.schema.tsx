interface ReagentSchema {
  chemLab: string;
  chemName: string;
  chemCas: string;
  place: string;
  cabinet: string;
  stock: string;
  reagentNum: string;
  unit: string;
  producer: string;
  mfgDate: string;
  msdsUrl: string;
  other: string;
}

interface CreateReagentSchema {
  chemLab: string;
  chemName: string;
  chemCas: string;
  place: string;
  cabinet: string;
  stock: number;
  reagentNum: number;
  unit: string;
  producer: string;
  mfgDate: string;
  msdsUrl: string;
  other: string;
}

interface GetReagentsSchema {
  page: number;
  size: number;
  chemLab: string;
  chemName: string;
  chemCas: string;
  cabinet: string;
  place: string;
}

class DeleteReagentSchema {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }
}

interface GetReagentsResponseSchema {
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

interface UploadFileModalProps {
  title: string;
  open: boolean;
  onOk: () => void;
  onCancle: () => void;
}

export type { UploadFileModalProps };

export type {
  CreateReagentSchema,
  ReagentSchema,
  GetReagentsSchema,
  GetReagentsResponseSchema,
};

export { DeleteReagentSchema };
