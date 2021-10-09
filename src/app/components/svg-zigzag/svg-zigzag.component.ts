import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-zigzag',
  templateUrl: './svg-zigzag.component.html',
  styleUrls: ['./svg-zigzag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgZigzagComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
