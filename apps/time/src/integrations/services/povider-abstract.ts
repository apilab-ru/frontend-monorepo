import { Observable } from "rxjs";
import { Integration } from "../interfase";
import { Calc } from "../../board/models/calc";
import { FormGroup } from "@angular/forms";

export abstract class ProviderAbstract<T = Integration> {
  abstract buildForm(): FormGroup;

  abstract validate(form: object): Observable<boolean>;

  abstract init(integration: Integration): Observable<boolean>;

  abstract export(calc: Calc[], date: string): Observable<boolean>;
}

