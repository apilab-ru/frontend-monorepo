import {
  afterRenderEffect, ChangeDetectionStrategy, Component, computed, inject, input, viewChild, ElementRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import Chart from 'chart.js/auto';
import { LogDetail } from '../../interfaces';
import { PREPARED_COLORS } from './const';
import { DetailsComponent } from '../details/details.component';
import { Item } from './interface';

@Component({
  selector: 'app-chart',
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  items = input.required<LogDetail[]>();

  totalMinutes = computed(() => this.items().reduce((total, item) => total + item.time, 0));
  totalHours = computed(() => Math.ceil(this.totalMinutes() / 60 * 100) / 100);
  chartItems = computed(() => this.items().map(this.calculateItem, this));

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');
  private dialog = inject(MatDialog);
  private chart: Chart<'pie', number[], string>;

  constructor() {
    afterRenderEffect((onCleanup) => {
      this.chart = new Chart(this.canvas().nativeElement, {
        type: 'pie',
        data: {
          labels: this.chartItems().map((item) => item.name || item.key),
          datasets: [{
            data: this.chartItems().map((item) => item.hours),
            backgroundColor: this.chartItems().map((item) => item.color),
          }],
        },
        options: { maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
      onCleanup(() => this.chart.destroy());
    });
  }

  setActive(index: number): void {
    this.chart?.setActiveElements([{ datasetIndex: 0, index }]);
    this.chart?.tooltip?.setActiveElements([{ datasetIndex: 0, index }], { x: 150, y: 150 });
    this.chart?.update();
  }

  openDetails(item: Item): void {
    this.dialog.open(DetailsComponent, { data: { item, total: this.totalMinutes() } });
  }

  private calculateItem(item: LogDetail): Item {
    return {
      ...item,
      color: this.generateColor(item.key),
      percent: this.totalMinutes() ? Math.round(item.time / this.totalMinutes() * 10000) / 100 : 0,
      hours: Math.round(item.time / 60 * 100) / 100,
    };
  }

  private generateColor(key: string): string {
    // Keep category colors stable across recalculation.
    let hash = 0;
    for (const character of key) {
      hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
    }

    return PREPARED_COLORS[key] || `hsl(${Math.abs(hash) % 360}, 60%, 60%)`;
  }
}
