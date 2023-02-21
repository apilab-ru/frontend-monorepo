import {
  ChangeDetectionStrategy,
  Component, Injector,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import {
  INTEGRATION_MAP_CONFIG,
  IntegrationConfig,
  IntegrationConfigField,
  IntegrationHelp,
  IntegrationType
} from '../../const';
import { Integration } from "../../interfase";
import { BehaviorSubject, delay, finalize, Observable, of, startWith, takeUntil } from "rxjs";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { map } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ProviderAbstract } from "../../services/povider-abstract";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";

@UntilDestroy()
@Component({
  selector: 'app-integration-edit',
  templateUrl: './integration-edit.component.html',
  styleUrls: ['./integration-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationEditComponent implements OnInit {
  formGroup = new FormGroup({});
  types = [IntegrationType.clockify, IntegrationType.jira];

  type$ = new BehaviorSubject<IntegrationType>(this.types[0]);
  fields$: Observable<IntegrationConfigField[]>;
  loading$ = new BehaviorSubject(false);
  config$: Observable<IntegrationConfig>;

  private provider: ProviderAbstract;

  constructor(
    private dialogRef: MatDialogRef<Integration, Integration>,
    private sanitizer: DomSanitizer,
    private injector: Injector,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.config$ = this.type$.pipe(
      map(type => INTEGRATION_MAP_CONFIG[type])
    );

    this.fields$ = this.config$.pipe(
      delay(100),
      map(config => config.fields),
    );

    this.config$.pipe(
      untilDestroyed(this)
    ).subscribe(config => {
      this.provider = this.injector.get(config.provider);
      this.formGroup = this.provider.buildForm();
    })
  }

  onTabChange(event: MatTabChangeEvent): void {
    const type = this.types[event.index];
    this.type$.next(type);
  }

  makeHelp(help: IntegrationHelp): Observable<SafeHtml> {
    if (typeof help === 'string') {
      return of( this.sanitizer.bypassSecurityTrustHtml(help) );
    }

    return this.formGroup.valueChanges.pipe(
      startWith(this.formGroup.value),
      map(form => this.sanitizer.bypassSecurityTrustHtml(help(form)))
    );
  }

  save(): void {
    this.loading$.next(true);
    const form = this.formGroup.getRawValue();
    this.provider.validate(form).pipe(
      finalize(() => this.loading$.next(false)),
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        this.snackBar.open('Sucess', 'Hide', {
          duration: 15_000
        });
        this.dialogRef.close({
          type: this.type$.getValue(),
          ...form
        } as Integration);
      },
      error: (error) => {
        this.snackBar.open(error.toString(), 'Hide');
      }
    })
  }
}
