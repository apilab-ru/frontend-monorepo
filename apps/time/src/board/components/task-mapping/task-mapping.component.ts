import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskMapService } from '../../services/task-map.service';
import { Observable } from 'rxjs';
import { TaskMapItem } from '../../models/task-map-item';

@Component({
  selector: 'app-task-mapping',
  templateUrl: './task-mapping.component.html',
  styleUrls: ['./task-mapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMappingComponent implements OnInit {
  taskMapList$: Observable<TaskMapItem[]>;

  constructor(
    private taskMapService: TaskMapService
  ) {
  }

  ngOnInit(): void {
    this.taskMapList$ = this.taskMapService.taskMapList$;
  }

  addMapItem(): void {
    this.taskMapService.addItem();
  }

  deleteItem(index: number): void {
    this.taskMapService.deleteItem(index);
  }

  updateItem(item: TaskMapItem, index: number): void {
    this.taskMapService.updateItem(item, index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
