import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Feedback } from '../interfaces/feedback';

@Component({
  selector: 'app-item-feedback',
  templateUrl: './item-feedback.component.html',
  styleUrls: ['./item-feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ItemFeedbackComponent {
  @Input() feedback: Feedback;
}
