import {
  afterRenderEffect, ChangeDetectionStrategy, Component, computed, inject, input, signal, viewChild, viewChildren, ElementRef,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { IconComponent } from '../icon.component';
import { ThemeService } from '../../services/theme.service';
import Chart from 'chart.js/auto';
import { LogDetail } from '../../interfaces';
import { PREPARED_COLORS } from './const';
import { DetailsComponent } from '../details/details.component';
import { Item } from './interface';

@Component({
  selector: 'app-chart',
  imports: [DecimalPipe, IconComponent, DetailsComponent],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent {
  items = input.required<LogDetail[]>();

  totalMinutes = computed(() => this.items().reduce((total, item) => total + item.time, 0));
  totalHours = computed(() => Math.ceil(this.totalMinutes() / 60 * 100) / 100);
  chartItems = computed(() => this.items().map(this.calculateItem, this));
  entryCount = computed(() => this.items().reduce((total, item) => total + item.deps.length, 0));
  copyLabel = signal('Copy summary');

  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chart');
  private detailGroups = viewChildren<ElementRef<HTMLDetailsElement>>('detailGroup');
  private theme = inject(ThemeService);
  private chart: Chart<'doughnut', number[], string>;

  constructor() {
    afterRenderEffect((onCleanup) => {
      this.chart = new Chart(this.canvas().nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.chartItems().map((item) => item.name || item.key),
          datasets: [{
            data: this.chartItems().map((item) => item.hours),
            backgroundColor: this.chartItems().map((item) => item.color),
            borderWidth: 0,
            hoverOffset: 5,
          }],
        },
        options: { cutout: '66%', layout: { padding: 6 }, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
      onCleanup(() => this.chart.destroy());
    });
  }

  setActive(index: number): void {
    this.chart?.setActiveElements([{ datasetIndex: 0, index }]);
    this.chart?.tooltip?.setActiveElements([{ datasetIndex: 0, index }], { x: 150, y: 150 });
    this.chart?.update();
  }

  toggleDetails(index: number): void {
    const detail = this.detailGroups()[index]?.nativeElement;

    if (detail) {
      detail.open = !detail.open;
    }
  }

  async copySummary(): Promise<void> {
    const lines = this.chartItems().map((item) =>
      `${item.name || item.key}: ${item.hours} h (${item.percent}%)`,
    );
    try {
      await navigator.clipboard.writeText([
        `Total: ${this.totalHours()} h · ${this.entryCount()} entries · ${this.chartItems().length} groups`,
        ...lines,
      ].join('\n'));
      this.copyLabel.set('Copied!');
    } catch {
      this.copyLabel.set('Copy failed — try again');
    }
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

    return (key === 'develop' ? (this.theme.dark() ? '#7953ff' : '#3155ed') : PREPARED_COLORS[key]) || `hsl(${Math.abs(hash) % 360}, 60%, 60%)`;
  }
}
