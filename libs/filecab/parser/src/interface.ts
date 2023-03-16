import { SearchId } from "../../models/src";

export interface SchemaFuncRes extends SearchId {
  title: string;
  type?: string | undefined;
}