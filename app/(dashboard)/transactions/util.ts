export enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

export const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
};

export const options = ["amount", "date", "payee", "notes"];
export const requiredOptions = ["amount", "date", "payee"];
