import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Work } from '../interfaces/work';
import { provideTranslation } from '../../libs/translate';
import differenceInDays from "date-fns/differenceInDays";

@Component({
  selector: 'app-item-work',
  templateUrl: './item-work.component.html',
  styleUrls: ['./item-work.component.scss'],
  // @ts-ignore
  providers: [provideTranslation('itemWork', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemWorkComponent implements OnChanges {
  @Input() work: Work;

  durationsInMonths: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.work) {
      this.durationsInMonths = Math.round(differenceInDays(
        this.work.dateTo ? new Date(this.work.dateTo) : new Date(),
        new Date(this.work.dateFrom),
      ) / 30);
    }
  }
}
