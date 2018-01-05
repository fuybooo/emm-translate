import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options33, options34} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {ValidatorService} from "../../shared/service/validator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-email-configuration',
  templateUrl: './policy-item-email-configuration.component.html',
})
export class PolicyItemEmailConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  _options33 = options33;
  _options34 = options34;
  subscript;

  constructor(private policyService: PolicyService,
              private fb: FormBuilder,
              private validatorService: ValidatorService,
              private translateService: TranslateService,
              private util: UtilService, ) {
  }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {EmailConfiguration: this.getFormValue()}
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
      EmailAccountDescription: ['', [Validators.required]],
      EmailAccountType: ['EmailTypeIMAP'],
      IncomingMailServerIMAPPathPrefix: [],
      EmailAccountName: [],
      EmailAddress: [null, [
        this.validatorService.getSpecialCharacterValidator(this.validatorService.regExp.email, false)
      ]],
      PreventMove: [true],
      disableMailRecentsSyncing: [true],
      IncomingMailServerHostName: ['', [Validators.required]],
      allowMailDrop: [true],
      PreventAppSheet: [true],
      SMIMESigningEnabled: [true],
      SMIMEEncryptionEnabled: [true],
      IncomingMail: [],
      OutgoingMail: [],
      IncomingMailServerPortNumber: [443, [Validators.required]],
      IncomingMailServerUsername: [],
      IncomingMailServerAuthentication: ['password'],
      IncomingPassword: [],
      IncomingMailServerUseSSL: [true],
      OutgoingMailServerHostName: ['', [Validators.required]],
      OutgoingMailServerPortNumber: [578, [Validators.required]],
      OutgoingMailServerUsername: [],
      OutgoingMailServerAuthentication: ['password'],
      OutgoingPassword: [],
      OutgoingPasswordSameAsIncomingPassword: [],
      OutgoingMailServerUseSSL: [true],
      emailType: [1],
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
        this.getFormControl(i, 'EmailAccountDescription').setValue(config.EmailAccountDescription || null);
        this.getFormControl(i, 'EmailAccountType').setValue(config.EmailAccountType || null);
        this.getFormControl(i, 'IncomingMailServerIMAPPathPrefix').setValue(config.IncomingMailServerIMAPPathPrefix || null);
        this.getFormControl(i, 'EmailAccountName').setValue(config.EmailAccountName || null);
        this.getFormControl(i, 'EmailAddress').setValue(config.EmailAddress || null);
        this.getFormControl(i, 'PreventMove').setValue(config.PreventMove || null);
        this.getFormControl(i, 'IncomingMailServerHostName').setValue(config.IncomingMailServerHostName || null);
        this.getFormControl(i, 'disableMailRecentsSyncing').setValue(config.disableMailRecentsSyncing || null);
        this.getFormControl(i, 'allowMailDrop').setValue(config.allowMailDrop || null);
        this.getFormControl(i, 'PreventAppSheet').setValue(config.PreventAppSheet || null);
        this.getFormControl(i, 'SMIMESigningEnabled').setValue(config.SMIMESigningEnabled || null);
        this.getFormControl(i, 'SMIMEEncryptionEnabled').setValue(config.SMIMEEncryptionEnabled || null);
        this.getFormControl(i, 'IncomingMail').setValue(config.IncomingMail || null);
        this.getFormControl(i, 'OutgoingMail').setValue(config.OutgoingMail || null);
        this.getFormControl(i, 'IncomingMailServerPortNumber').setValue(config.IncomingMailServerPortNumber || null);
        this.getFormControl(i, 'IncomingMailServerUsername').setValue(config.IncomingMailServerUsername || null);
        this.getFormControl(i, 'IncomingMailServerAuthentication').setValue(config.IncomingMailServerAuthentication || null);
        this.getFormControl(i, 'IncomingPassword').setValue(config.IncomingPassword || null);
        this.getFormControl(i, 'IncomingMailServerUseSSL').setValue(config.IncomingMailServerUseSSL || null);
        this.getFormControl(i, 'OutgoingMailServerHostName').setValue(config.OutgoingMailServerHostName || null);
        this.getFormControl(i, 'OutgoingMailServerPortNumber').setValue(config.OutgoingMailServerPortNumber || null);
        this.getFormControl(i, 'OutgoingMailServerUsername').setValue(config.OutgoingMailServerUsername || null);
        this.getFormControl(i, 'OutgoingMailServerAuthentication').setValue(config.OutgoingMailServerAuthentication || null);
        this.getFormControl(i, 'OutgoingPassword').setValue(config.OutgoingPassword || null);
        this.getFormControl(i, 'OutgoingPasswordSameAsIncomingPassword').setValue(config.OutgoingPasswordSameAsIncomingPassword || true);
        this.getFormControl(i, 'OutgoingMailServerUseSSL').setValue(config.OutgoingMailServerUseSSL || true);
      }
    }
  }

  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }

  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc015',
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
  test(i, value) {
    console.log(value);
    console.log(this.getFormControl(i, 'EmailAddress'));
  }
}
