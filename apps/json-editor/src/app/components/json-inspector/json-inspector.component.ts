import type { InspectorParseResult } from '../../interface';
import type { Signal, WritableSignal } from '@angular/core';
import type { InspectorChange, InspectorDraft } from '../../interface';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'je-json-inspector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './json-inspector.component.html',
  styleUrls: ['./json-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonInspectorComponent {
  value = input<unknown>();
  path = input<string[]>([]);
  canRename = input(false);
  error = input('');

  resetError = output<void>();
  applyChange = output<InspectorChange>();

  draft = linkedSignal(() => this.initialDraft());
  validationRequested = this.createValidationRequested();
  parsed = this.createParsed();
  validationError = this.createValidationError();

  updateKey(key: string): void {
    this.draft.update((draft) => ({ ...draft, key }));
  }

  updateJson(json: string): void {
    this.draft.update((draft) => ({ ...draft, json }));
  }

  reset(): void {
    this.draft.set(this.initialDraft());
    this.validationRequested.set(false);
    this.resetError.emit();
  }

  apply(): void {
    this.validationRequested.set(true);
    const parsed = this.parsed();

    if (!parsed.error)
      this.applyChange.emit({ key: this.draft().key, value: parsed.value });
  }

  private createValidationRequested(): WritableSignal<boolean> {
    return linkedSignal(() => {
      this.value();
      this.path();

      return false;
    });
  }

  private createParsed(): Signal<InspectorParseResult> {
    return computed(() => {
      try {
        return { value: JSON.parse(this.draft().json) as unknown, error: '' };
      } catch {
        return {
          value: undefined,
          error: 'Enter valid JSON. Put strings in double quotes.',
        };
      }
    });
  }

  private createValidationError(): Signal<string> {
    return computed(
      () => (this.validationRequested() ? this.parsed().error : '') || this.error()
    );
  }

  private initialDraft(): InspectorDraft {
    return {
      key: this.path().at(-1) ?? 'root',
      json: JSON.stringify(this.value(), null, 2) ?? '',
    };
  }
}
