import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntegrationData } from './interface';
import { ProviderAbstract } from '../../services/povider-abstract';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INTEGRATION_MAP_CONFIG } from '../../const';
import { filter } from 'rxjs/operators';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-integration-process',
  templateUrl: './integration-process.component.html',
  styleUrls: ['./integration-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinner, NgxMaskDirective, FormsModule, MatButton],
})
export class IntegrationProcessComponent implements OnInit {
  private data = inject<IntegrationData>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<IntegrationData>>(MatDialogRef);
  private injector = inject(Injector);
  private snackBar = inject(MatSnackBar);

  private destroyRef = inject(DestroyRef);
  private provider: ProviderAbstract;

  ready = signal(false);
  processing = signal(false);
  date: string;

  ngOnInit(): void {
    const [date] = new Date().toISOString().split('T');
    this.date = date;

    const integration = this.data.integration;
    const config = INTEGRATION_MAP_CONFIG[integration.type];

    this.provider = this.injector.get(config.provider);
    this.provider
      .init(this.data.integration)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.ready.set(true);
      });
  }

  start(): void {
    this.processing.set(true);
    this.provider
      .export(this.data.calc, this.date)
      .pipe(
        filter(Boolean),
        finalize(() => {
          this.processing.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Complete', 'Close', {
            duration: 20_000,
          });
          this.dialogRef.close({ done: true });
        },
        error: (error) => {
          this.snackBar.open(error.toString(), 'Hide');
        },
      });
  }
}
