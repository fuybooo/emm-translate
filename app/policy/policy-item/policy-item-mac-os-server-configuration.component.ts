import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-mac-os-server-configuration',
  templateUrl: './policy-item-mac-os-server-configuration.component.html',
})
export class PolicyItemMacOsServerConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {MacOsServerConfiguration: this.getFormValue()}
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
      AccountDescription: [],
      HostName: [null, [Validators.required]],
      Password: [],
      UserName: [null, [Validators.required]],
      Port: [],
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
        this.getFormControl(i, 'AccountDescription').setValue(config.AccountDescription || null);
        this.getFormControl(i, 'HostName').setValue(config.HostName || null);
        this.getFormControl(i, 'Password').setValue(config.Password || null);
        this.getFormControl(i, 'UserName').setValue(config.UserName || null);
        this.getFormControl(i, 'Port').setValue(config.Port || null);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc020',
      config: {}
    };
    let values = [];
    for (let form of this.forms) {
      if (form.valid) {
        let value = this.util.getAvailableObj(form.value);
        if (value) {
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
