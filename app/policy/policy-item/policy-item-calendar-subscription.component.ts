import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-calendar-subscription',
  templateUrl: './policy-item-calendar-subscription.component.html',
})
export class PolicyItemCalendarSubscriptionComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private util: UtilService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {CalendarSubscription: this.getFormValue()}
          });
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
  getForm() {
    return this.fb.group({
      SubCalAccountDescription: [],
      SubCalAccountHostName: [null, [Validators.required]],
      SubCalAccountUsername: [],
      SubCalAccountPassword: [],
      SubCalAccountUseSSL: [true],
    });
  }
  setForm() {
    this.forms = [this.getForm()];
    if (this.config) {
      let configs = this.config.config;
      if (configs.length !== 0) {
        this.forms = [];
      }
      for (let i = 0; i < configs.length; i++) {
        this.forms.push(this.getForm());
        let config = configs[i];
        this.getFormControl(i, 'SubCalAccountDescription').setValue(config.SubCalAccountDescription || null);
        this.getFormControl(i, 'SubCalAccountHostName').setValue(config.SubCalAccountHostName || null);
        this.getFormControl(i, 'SubCalAccountUsername').setValue(config.SubCalAccountUsername || null);
        this.getFormControl(i, 'SubCalAccountPassword').setValue(config.SubCalAccountPassword || null);
        this.getFormControl(i, 'SubCalAccountUseSSL').setValue(config.SubCalAccountUseSSL || true);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc007',
      config: {}
    };
    let values = [];
    for (let form of this.forms) {
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        if (value && value.SubCalAccountHostName) {
          values.push(value);
        }
      }
    }
    paramConfig.config = values;
    return paramConfig;
  }
  add() {
    this.forms.push(this.getForm());
  }
  del(i) {
    this.forms.splice(i, 1);
  }

}
