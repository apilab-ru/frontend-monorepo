import { Observable } from "rxjs";
import { Integration } from "../interfase";
import { Calc } from "../../board/models/calc";

export abstract class ProviderAbstract {
  abstract init(integration: Integration): Observable<boolean>;

  abstract export(calc: Calc[], date: string): Observable<boolean>;
}

