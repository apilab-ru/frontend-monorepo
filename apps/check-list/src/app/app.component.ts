import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { GroupPoints } from './interface';
import { DataService } from './services/data.service';
import { FormatExampleComponent } from './components/format-example/format-example.component';
import {
  ChecklistContentComponent,
  ChecklistItemToggle,
} from './components/checklist-content/checklist-content.component';
import { parseSpreadsheetUrl } from './spreadsheet-url';

const STORAGE_KEY = 'check-list.spreadsheet-url';
interface ChecklistState {
  points: GroupPoints[];
  loading: boolean;
  error: string;
}
const LOADING_STATE: ChecklistState = { points: [], loading: true, error: '' };

@Component({
  selector: 'app-root',
  imports: [FormatExampleComponent, ChecklistContentComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private dataService = inject(DataService);
  private loadRequests = new Subject<string>();

  exampleUrl = `https://docs.google.com/spreadsheets/d/${environment.doc}/edit#gid=${environment.gridId}`;
  sheetUrl: FormControl<string>;
  showExample = signal(false);
  state: Signal<ChecklistState>;
  points = computed(() => this.state().points);
  checked = linkedSignal(() => {
    this.points();

    return new Set<string>();
  });
  totalCount = computed(() =>
    this.points().reduce((total, group) => total + group.list.length, 0),
  );
  checkedCount = computed(() => this.checked().size);
  allChecked = computed(
    () => this.totalCount() > 0 && this.checkedCount() === this.totalCount(),
  );
  partiallyChecked = computed(() => this.checkedCount() > 0 && !this.allChecked());
  error = computed(() => this.state().error);

  constructor() {
    this.sheetUrl = new FormControl(this.readSavedUrl() || this.exampleUrl, {
      nonNullable: true,
      validators: [this.validateSpreadsheetUrl],
    });
    this.state = toSignal(
      this.loadRequests.pipe(
        startWith(this.sheetUrl.value),
        switchMap((url) =>
          this.dataService.loadPoints(url).pipe(
            map((points): ChecklistState => ({ points, loading: false, error: '' })),
            catchError(() =>
              of<ChecklistState>({
                points: [],
                loading: false,
                error:
                  'Could not load this spreadsheet. Check the link and make sure anyone with the link can view it.',
              }),
            ),
            startWith(LOADING_STATE),
          ),
        ),
      ),
      { initialValue: LOADING_STATE },
    );
  }

  load(event: Event): void {
    event.preventDefault();
    this.sheetUrl.markAsTouched();

    if (this.sheetUrl.invalid) {
      return;
    }

    const url = this.sheetUrl.value.trim();
    this.sheetUrl.setValue(url);
    try {
      localStorage.setItem(STORAGE_KEY, url);
    } catch {
      // Loading still works when browser storage is unavailable.
    }
    this.loadRequests.next(url);
  }

  toggleItem({ key, checked }: ChecklistItemToggle): void {
    this.checked.update((current) => {
      const next = new Set(current);

      if (checked) next.add(key);
      else next.delete(key);

      return next;
    });
  }

  toggleAll(): void {
    if (this.allChecked()) {
      this.reset();

      return;
    }

    this.checked.set(
      new Set(
        this.points().flatMap((group, groupIndex) =>
          group.list.map((_, itemIndex) => `${groupIndex}:${itemIndex}`),
        ),
      ),
    );
  }

  reset(): void {
    this.checked.set(new Set());
  }

  private validateSpreadsheetUrl(
    control: AbstractControl<string>,
  ): ValidationErrors | null {
    try {
      parseSpreadsheetUrl(control.value);

      return null;
    } catch (error) {
      return { spreadsheetUrl: (error as Error).message };
    }
  }

  private readSavedUrl(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        parseSpreadsheetUrl(saved);

        return saved;
      }
    } catch {
      // Ignore unavailable storage or an invalid saved link.
    }

    return '';
  }
}
