import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COLORS } from "../const";
import { CommonModule } from "@angular/common";
import { UiCopyClickDirective } from "@ui-kit/copy-click";

@Component({
  selector: 'filecab-theme-colors',
  templateUrl: './theme-colors.component.html',
  styleUrls: ['./theme-colors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, UiCopyClickDirective],
})
export class ThemeColorsComponent {
  colors = COLORS;
}
