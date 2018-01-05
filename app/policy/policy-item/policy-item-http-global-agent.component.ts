import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options30} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-http-global-agent',
  templateUrl: './policy-item-http-global-agent.component.html',
})
export class PolicyItemHttpGlobalAgentComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  form: FormGroup;
  options30 = options30;
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
            data: {HTTPGlobalAgent: this.getFormValue()}
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
  changeProxyType(value) {
    if (value === 1) {
      this.getFormControl('ProxyServer').reset();
      this.getFormControl('ProxyServerPort').reset();
      this.getFormControl('ProxyUsername').reset();
      this.getFormControl('ProxyPassword').reset();
      this.getFormControl('ProxyServer').setValidators(null);
      this.getFormControl('ProxyServerPort').setValidators(null);
      this.getFormControl('ProxyPACURL').setValidators(Validators.required);
    } else {
      this.getFormControl('ProxyServer').setValidators(Validators.required);
      this.getFormControl('ProxyServerPort').setValidators(Validators.required);
      this.getFormControl('ProxyPACURL').setValidators(null);
    }
  }
  getForm() {
    return this.fb.group({
      ProxyCaptiveLoginAllowed: [false],
      ProxyType: [2],
      ProxyServerPort: [null, [Validators.required]],
      ProxyUsername: [],
      ProxyPassword: [],
      ProxyServer: [null, [Validators.required]],
      ProxyPACURL: [],
      ProxyPACFallbackAllowed: [],
    });
  }
  setForm() {
    this.form = this.getForm();
    if (this.config) {
      let config = this.config.config;
        this.getFormControl('ProxyCaptiveLoginAllowed').setValue(config.ProxyCaptiveLoginAllowed || null);
        this.getFormControl('ProxyType').setValue(config.ProxyType || 2);
        this.getFormControl('ProxyServer').setValue(config.ProxyServer || null);
        this.getFormControl('ProxyServerPort').setValue(config.ProxyServerPort || null);
        this.getFormControl('ProxyUsername').setValue(config.ProxyUsername || null);
        this.getFormControl('ProxyPassword').setValue(config.ProxyPassword || null);
        this.getFormControl('ProxyPACURL').setValue(config.ProxyPACURL || null);
        this.getFormControl('ProxyPACFallbackAllowed').setValue(config.ProxyPACFallbackAllowed || null);
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc011',
      config: {}
    };
    if (this.form.valid) {
      paramConfig.config = this.util.getAvailableObj(this.form.value);
    }
    return paramConfig;
  }
}
