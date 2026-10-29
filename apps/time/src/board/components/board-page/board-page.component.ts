import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import * as fromRoot from '../../store/reducers';
import { Store } from '@ngrx/store';
import { TaskMappingComponent } from '../task-mapping/task-mapping.component';
import { IntegrationsComponent } from '../../../integrations/components/integrations/integrations.component';
import { TimeBoardComponent } from '../time-board/time-board.component';

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskMappingComponent, IntegrationsComponent, TimeBoardComponent],
})
export class BoardPageComponent {
  private store = inject(Store);
  calculated = this.store.selectSignal(fromRoot.getCalcList);
}
