import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FEEDBACK } from './const';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent {
  feedback = FEEDBACK;
}
