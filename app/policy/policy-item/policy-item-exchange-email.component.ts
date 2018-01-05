import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options27, options28} from "../policy.model";
import {options7} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {NzModalService} from "ng-zorro-antd";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-exchange-email',
  templateUrl: './policy-item-exchange-email.component.html',
})
export class PolicyItemExchangeEmailComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  _options27 = options27;
  _options28 = options28;
  selectedApps: any[] = [null];
  addModal;
  subscript;

  constructor(private policyService: PolicyService,
              private fb: FormBuilder,
              private nzModalService: NzModalService,
              private translateService: TranslateService,
              private util: UtilService ) {
  }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {ExchangeEmail: this.getFormValue()}
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
      Account: [],
      Host: ['', [Validators.required]],
      PayloadDisplayName: [],
      UserName: [],
      SSL: [true],
      Password: [],
      MailNumberOfPastDaysToSync: [7],
      CertificateName: [],
      voucherId: ['none'],
      allowMailDrop: [true],
      PreventAppSheet: [true],
      SMIMESigningEnabled: [true],
      SMIMEEncryptionEnabled: [true],
      CommunicationServiceRules: [],
      EmailAddress: [],
      PreventMove: [true],
      disableMailRecentsSyncing: [true],
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
        this.getFormControl(i, 'PayloadDisplayName').setValue(config.PayloadDisplayName || null);
        this.getFormControl(i, 'Account').setValue(config.Account || null);
        this.getFormControl(i, 'Host').setValue(config.Host || null);
        this.getFormControl(i, 'UserName').setValue(config.UserName || null);
        this.getFormControl(i, 'SSL').setValue(config.SSL || null);
        this.getFormControl(i, 'Password').setValue(config.Password || null);
        this.getFormControl(i, 'MailNumberOfPastDaysToSync').setValue(config.MailNumberOfPastDaysToSync || null);
        this.getFormControl(i, 'CertificateName').setValue(config.CertificateName || true);
        this.getFormControl(i, 'voucherId').setValue(config.voucherId || true);
        this.getFormControl(i, 'allowMailDrop').setValue(config.allowMailDrop || null);
        this.getFormControl(i, 'PreventAppSheet').setValue(config.PreventAppSheet || null);
        this.getFormControl(i, 'SMIMESigningEnabled').setValue(config.SMIMESigningEnabled || null);
        this.getFormControl(i, 'SMIMEEncryptionEnabled').setValue(config.SMIMEEncryptionEnabled || null);
        this.getFormControl(i, 'CommunicationServiceRules').setValue(config.CommunicationServiceRules || true);
        this.getFormControl(i, 'EmailAddress').setValue(config.EmailAddress || true);
        this.getFormControl(i, 'PreventMove').setValue(config.PreventMove || null);
        this.getFormControl(i, 'disableMailRecentsSyncing').setValue(config.disableMailRecentsSyncing || true);
      }
    }
  }

  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }

  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc016',
      config: {}
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i];
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        value.CommunicationServiceRules = this.selectedApps[i] ? this.selectedApps[i].bundleId : '';
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
