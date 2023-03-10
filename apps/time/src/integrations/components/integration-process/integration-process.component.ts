import {
  ChangeDetectionStrategy,
  Component, Inject, Injector, OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IntegrationData } from "./interface";
import { ProviderAbstract } from "../../services/povider-abstract";
import { BehaviorSubject, finalize } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSnackBar } from "@angular/material/snack-bar";
import { INTEGRATION_MAP_CONFIG } from "../../const";
import { filter } from "rxjs/operators";

@UntilDestroy()
@Component({
  selector: 'app-integration-process',
  templateUrl: './integration-process.component.html',
  styleUrls: ['./integration-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationProcessComponent implements OnInit {
  private provider: ProviderAbstract;

  ready$ = new BehaviorSubject<boolean>(false);
  process$ = new BehaviorSubject<boolean>(false);
  date: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: IntegrationData,
    private dialogRef: MatDialogRef<IntegrationData>,
    private injector: Injector,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    const [date] = new Date().toISOString().split('T');
    this.date = date;

    const integration = this.data.integration;
    const config = INTEGRATION_MAP_CONFIG[integration.type];

    this.provider = this.injector.get(config.provider);
    this.provider.init(this.data.integration).pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.ready$.next(true);
    })
  }

  start(): void {
    this.process$.next(true);
    this.provider.export(this.data.calc, this.date).pipe(
      filter(Boolean),
      finalize(() => {
        this.process$.next(false);
      }),
      untilDestroyed(this)
    ).subscribe({
      next: () => {
        this.snackBar.open('Complete', 'Close', {
          duration: 20_000
        });
        this.dialogRef.close({ done: true });
      },
      error: (error) => {
        this.snackBar.open(error.toString(), 'Hide');
      }
    })
  }

}
