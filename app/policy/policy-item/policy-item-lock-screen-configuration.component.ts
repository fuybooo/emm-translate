import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-lock-screen-configuration',
  templateUrl: './policy-item-lock-screen-configuration.component.html',
})
export class PolicyItemLockScreenConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  form: FormGroup;
  subscript;

  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {LockScreenConfiguration: this.getFormValue()}
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
      IfLostReturnToMessage: [],
      resourceTag: [],
    });
  }
  setForm() {
    this.form = this.getForm();
    if (this.config) {
      let config = this.config.config;
        this.getFormControl('IfLostReturnToMessage').setValue(config.IfLostReturnToMessage || null);
        this.getFormControl('resourceTag').setValue(config.resourceTag || null);
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc013',
      config: {}
    };
    paramConfig.config = this.util.getAvailableObj(this.form.value) || {};
    return paramConfig;
  }
}
