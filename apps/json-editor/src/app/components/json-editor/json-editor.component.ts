import { ChangeDetectionStrategy, Component, } from '@angular/core';

@Component({
  selector: 'je-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorComponent {
}
