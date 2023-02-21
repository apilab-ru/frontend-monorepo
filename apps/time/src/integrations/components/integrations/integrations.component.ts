import {
  ChangeDetectionStrategy,
  Component, Input,
} from '@angular/core';
import { IntegrationsService } from "../../services/integrations.service";
import { MatDialog } from "@angular/material/dialog";
import { IntegrationEditComponent } from "../integration-edit/integration-edit.component";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from "rxjs/operators";
import { Calc } from "../../../board/models/calc";
import { IntegrationClockify } from "../../interfase";
import { IntegrationProcessComponent } from "../integration-process/integration-process.component";

@UntilDestroy()
@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsComponent {
  @Input() calc: Calc[];

  integrations$ = this.integrationsService.integrations$;

  constructor(
    private integrationsService: IntegrationsService,
    private matDialog: MatDialog,
  ) {
  }

  addIntegration(): void {
    this.matDialog.open(IntegrationEditComponent).afterClosed().pipe(
      take(1),
      filter(data => !!data),
      untilDestroyed(this)
    ).subscribe(data => {
      this.integrationsService.addIntegrations(data);
    })
  }

  removeIntegration(index: number): void {
    this.integrationsService.removeIntegrations(index);
  }

  export(integration: IntegrationClockify): void {
    this.matDialog.open(IntegrationProcessComponent, {
      data: {
        integration,
        calc: this.calc
      }
    })
  }
}
