import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-sso-configuration',
  templateUrl: './policy-item-sso-configuration.component.html',
})
export class PolicyItemSsoConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  form: FormGroup;
  subscript;

  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {SSOConfiguration: this.getFormValue()}
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
      Name: [],
      PrincipalName: [],
      PayloadCertificateUUID: [],
      Realm: [],
      URLPrefixMatches: [],
      AppIdentifierMatches: [],
    });
  }
  setForm() {
    this.form = this.getForm();
    if (this.config) {
      let config = this.config.config;
      this.getFormControl('Name').setValue(config.Name || null);
      this.getFormControl('PrincipalName').setValue(config.PrincipalName || null);
      this.getFormControl('PayloadCertificateUUID').setValue(config.PayloadCertificateUUID || null);
      this.getFormControl('Realm').setValue(config.Realm || null);
      this.getFormControl('URLPrefixMatches').setValue(config.URLPrefixMatches || null);
      this.getFormControl('AppIdentifierMatches').setValue(config.AppIdentifierMatches || null);
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc018',
      config: {}
    };
    paramConfig.config = this.form.value;
    return paramConfig;
  }
}
