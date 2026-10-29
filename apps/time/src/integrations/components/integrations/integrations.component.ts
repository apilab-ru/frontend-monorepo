import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IntegrationsService } from '../../services/integrations.service';
import { MatDialog } from '@angular/material/dialog';
import { IntegrationEditComponent } from '../integration-edit/integration-edit.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { Calc } from '../../../board/models/calc';
import { Integration } from '../../interfase';
import { IntegrationProcessComponent } from '../integration-process/integration-process.component';
import { IntegrationItemComponent } from '../integration-item/integration-item.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IntegrationItemComponent, MatButton],
})
export class IntegrationsComponent {
  private integrationsService = inject(IntegrationsService);
  private matDialog = inject(MatDialog);

  private destroyRef = inject(DestroyRef);
  calc = input.required<Calc[]>();

  integrations = this.integrationsService.integrations;

  addIntegration(): void {
    this.matDialog
      .open(IntegrationEditComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter((data) => !!data),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.integrationsService.addIntegrations(data);
      });
  }

  removeIntegration(index: number): void {
    this.integrationsService.removeIntegrations(index);
  }

  export(integration: Integration): void {
    this.matDialog.open(IntegrationProcessComponent, {
      data: {
        integration,
        calc: this.calc(),
      },
    });
  }
}
