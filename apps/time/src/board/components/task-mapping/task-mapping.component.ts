import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TaskMapService } from '../../services/task-map.service';
import { TaskMapItem } from '../../models/task-map-item';
import { TaskMapItemComponent } from '../task-map-item/task-map-item.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-task-mapping',
  templateUrl: './task-mapping.component.html',
  styleUrls: ['./task-mapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskMapItemComponent, MatButton],
})
export class TaskMappingComponent {
  private taskMapService = inject(TaskMapService);
  taskMapList = this.taskMapService.taskMapList;

  addMapItem(): void {
    this.taskMapService.addItem();
  }

  deleteItem(index: number): void {
    this.taskMapService.deleteItem(index);
  }

  updateItem(item: TaskMapItem, index: number): void {
    this.taskMapService.updateItem(item, index);
  }
}
