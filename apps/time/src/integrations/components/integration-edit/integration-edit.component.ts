import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { INTEGRATION_MAP_CONFIG, IntegrationHelp, IntegrationType } from '../../const';
import { Integration } from '../../interfase';
import { finalize, Observable, of, startWith } from 'rxjs';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-integration-edit',
  templateUrl: './integration-edit.component.html',
  styleUrls: ['./integration-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatProgressSpinner,
    MatButton,
    AsyncPipe,
  ],
})
export class IntegrationEditComponent {
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private sanitizer = inject(DomSanitizer);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<IntegrationEditComponent, Integration>);

  types = [IntegrationType.clockify, IntegrationType.jira];
  type = signal(this.types[0]);
  loading = signal(false);
  config = computed(() => INTEGRATION_MAP_CONFIG[this.type()]);
  private provider = computed(() => this.injector.get(this.config().provider));
  formGroup = computed(() => this.provider().buildForm());
  fields = computed(() =>
    this.config().fields.map((field) => ({ ...field, help$: this.makeHelp(field.help) }))
  );

  onTabChange(event: MatTabChangeEvent): void {
    this.type.set(this.types[event.index]);
  }

  makeHelp(help: IntegrationHelp): Observable<SafeHtml> {
    if (typeof help === 'string') {
      return of(this.sanitizer.bypassSecurityTrustHtml(help));
    }

    return this.formGroup().valueChanges.pipe(
      startWith(this.formGroup().value),
      map((form) => this.sanitizer.bypassSecurityTrustHtml(help(form)))
    );
  }

  save(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    const type = this.type();
    const form = this.formGroup().getRawValue();
    this.provider()
      .validate(form)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Sucess', 'Hide', {
            duration: 15_000,
          });
          this.dialogRef.close({
            type,
            ...form,
          } as Integration);
        },
        error: (error) => {
          this.snackBar.open(error.toString(), 'Hide');
        },
      });
  }
}
