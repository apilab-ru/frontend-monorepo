import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UiListComponent } from '../../../../../libs/filecab/ui-kit/src/list/components/list/list.component';
import { UiListIteratorDirective } from '../../../../../libs/filecab/ui-kit/src/list/list-iterator-directive';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <filecab-list [list]="items" [limitList]="[10]" [orderFields]="[]">
      <ng-template
        listIterator
        [listIteratorOf]="items"
        [listIteratorTrackBy]="trackById"
        let-item
        let-index="index"
        let-count="count"
        let-first="first"
        let-last="last"
        let-even="even"
        let-odd="odd"
        let-list="ngForOf"
      >
        <span class="row"
          >{{ item.name }}:{{ index }}:{{ count }}:{{ first }}:{{ last }}:{{ even }}:{{ odd }}:{{ list.length }}</span
        >
      </ng-template>
    </filecab-list>
  `,
})
class ListHostComponent {
  items = [
    { id: 1, name: 'First' },
    { id: 2, name: 'Second' },
  ];
  trackById = (_index: number, item: { id: number }) => item.id;
}

describe('Filecab projected list rows', () => {
  it('preserves row context and identity, and shows the empty state', async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ListHostComponent, UiListComponent, UiListIteratorDirective],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    const fixture = TestBed.createComponent(ListHostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const rows = Array.from(element.querySelectorAll('.row'));
    expect(rows.map((row) => row.textContent?.trim())).toEqual([
      'First:0:2:true:false:true:false:2',
      'Second:1:2:false:true:false:true:2',
    ]);

    fixture.componentInstance.items = [...fixture.componentInstance.items].reverse();
    fixture.detectChanges();
    expect(element.querySelectorAll('.row')[0]).toBe(rows[1]);
    expect(element.querySelectorAll('.row')[1]).toBe(rows[0]);

    fixture.componentInstance.items = [];
    fixture.detectChanges();
    expect(element.querySelectorAll('.row')).toHaveLength(0);
    expect(element.querySelector('.message')?.textContent).toContain('Нет данных');
  });
});
