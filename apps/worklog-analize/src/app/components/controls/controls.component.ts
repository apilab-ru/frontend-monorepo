import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserDataService } from "../../services/user-data.service";
import { LogsUserRawData } from "../../interfaces";
import { debounceTime, combineLatest } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {
  formGroup = new FormGroup({
    logs: new FormControl(),
    rules: new FormControl(),

    groupConfig: new FormGroup({
      groupByTask: new FormControl(true),
      groupByComment: new FormControl(true),
      groupByRules: new FormControl(false),
    })
  })

  constructor(
    private userDataService: UserDataService,
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.formGroup.controls.groupConfig.valueChanges,
      this.formGroup.controls.logs.valueChanges,
      this.formGroup.controls.rules.valueChanges.pipe(
        debounceTime(200),
      ),
    ]).pipe(
      untilDestroyed(this),
    ).subscribe(([groupConfig, logs, rules]) => {
      this.userDataService.saveData({
        groupConfig, logs, rules
      } as LogsUserRawData);
    });

    const formData = this.userDataService.loadData();
    this.formGroup.patchValue(formData, { emitEvent: true });
  }
}
