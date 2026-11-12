import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Item } from '../chart/interface';
import { Log } from '../../interfaces';

interface ViewItem extends Log {
  percentLocal: number;
  percentGlobal: number;
  hours: number;
}

@Component({
  selector: 'app-details',
  imports: [MatTooltipModule, DecimalPipe],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  data = input.required<{ item: Item; total: number }>();
  items = computed(() => this.data().item.deps
    .map(this.calculateItem, this)
    .sort((a, b) => b.time - a.time));

  private calculateItem(item: Log): ViewItem {
    return {
      ...item,
      percentLocal: this.data().item.time ? Math.ceil(item.time / this.data().item.time * 10000) / 100 : 0,
      percentGlobal: this.data().total ? Math.ceil(item.time / this.data().total * 10000) / 100 : 0,
      hours: Math.ceil(item.time / 60 * 100) / 100,
    };
  }
}
