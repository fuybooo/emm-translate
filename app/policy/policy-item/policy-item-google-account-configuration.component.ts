import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {NzModalService} from "ng-zorro-antd";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-google-account-configuration',
  templateUrl: './policy-item-google-account-configuration.component.html',
})
export class PolicyItemGoogleAccountConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  selectedApps: any[] = [null];
  addModal;
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private nzModalService: NzModalService,
    private translateService: TranslateService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {GoogleAccountConfiguration: this.getFormValue()}
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
      AccountName: [],
      EmailAddress: [null, [Validators.required, Validators.email]],
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
        this.getFormControl(i, 'AccountName').setValue(config.AccountName || null);
        this.getFormControl(i, 'EmailAddress').setValue(config.EmailAddress || null);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc014',
      config: []
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i];
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        value.AudioCall = this.selectedApps[i] ? this.selectedApps[i].bundleId : '';
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
    this.selectedApps.push(null);
  }
  del(i) {
    this.forms.splice(i, 1);
    this.selectedApps.splice(i, 1);
  }
  selectApp(i) {
    this.addModal = this.nzModalService.open({
      title: '选取应用',
      content: AppStoreListComponent,
      footer: false,
      width: 800
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.selectedApps[i] = res.data[0];
        this.addModal.destroy();
      }
    });
  }
}
