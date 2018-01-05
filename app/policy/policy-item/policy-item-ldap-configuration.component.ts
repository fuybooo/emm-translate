import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-ldap-configuration',
  templateUrl: './policy-item-ldap-configuration.component.html',
})
export class PolicyItemLdapConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  lists: any[][] = [[]];
  listForm: FormGroup;
  addModal;
  index;
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private nzModalService: NzModalService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.listForm = this.fb.group({
      LDAPSearchSettingDescription: ['', [Validators.required]],
      LDAPSearchSettingScope: ['', [Validators.required]],
      LDAPSearchSettingSearchBase: ['', [Validators.required]],
    });
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {LDAPConfiguration: this.getFormValue()}
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
      LDAPAccountDescription: [null, [Validators.required]],
      LDAPAccountUserName: [],
      LDAPAccountPassword: [],
      LDAPAccountHostName: [null, [Validators.required]],
      LDAPAccountUseSSL: [true],
      // LDAPSearchSettings: [],
    });
  }
  setForm() {
    this.forms = [this.getForm()];
    this.lists = [this.util.getReplenishArray([])];
    if (this.config) {
      let configs = this.config.config;
      if (configs.length !== 0) {
        this.forms = [];
      }
      for (let i = 0; i < configs.length; i++) {
        this.forms.push(this.getForm());
        let config = configs[i];
        this.getFormControl(i, 'LDAPAccountDescription').setValue(config.LDAPAccountDescription || null);
        this.getFormControl(i, 'LDAPAccountUserName').setValue(config.LDAPAccountUserName || null);
        this.getFormControl(i, 'LDAPAccountPassword').setValue(config.LDAPAccountPassword || null);
        this.getFormControl(i, 'LDAPAccountHostName').setValue(config.LDAPAccountHostName || null);
        this.getFormControl(i, 'LDAPAccountUseSSL').setValue(config.LDAPAccountUseSSL || null);
        // this.getFormControl(i, 'LDAPSearchSettings').setValue(config.LDAPSearchSettings || true);
        this.lists[i] = this.util.getReplenishArray(config.LDAPSearchSettings);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getListFormControl(name) {
    return this.listForm.controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc021',
      config: []
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i ++) {
      let form = this.forms[i];
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        value.LDAPSearchSettings = this.util.getUnReplenishArray(this.lists[i]);
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
    this.lists.push(this.util.getReplenishArray([]));
  }
  del(i) {
    this.forms.splice(i, 1);
    this.lists.splice(i, 1);
  }
  addSearch(i, titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
    });
    this.index = i;
  }

  delSearch(index) {
    let data = this.lists[index];
    let isDeleted = false;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.isActive) {
        isDeleted = true;
        data.splice(i, 1);
        i--;
      }
    }
    if (!isDeleted) {
      // 提示没有选中任何条目
      this.messageService.error('请选择要删除的项');
    }
    this.lists[index] = this.util.getReplenishArray(data);
  }
  handleOk() {
    this.util.replenishPush(this.lists[this.index], {
      LDAPSearchSettingDescription: this.getListFormControl('LDAPSearchSettingDescription').value,
      LDAPSearchSettingScope: this.getListFormControl('LDAPSearchSettingScope').value,
      LDAPSearchSettingSearchBase: this.getListFormControl('LDAPSearchSettingSearchBase').value,
    }, 'LDAPSearchSettingDescription');
    this.lists[this.index] = this.util.getReplenishArray(this.lists[this.index]);
    this.listForm.reset();
    this.addModal.destroy();
  }
  changeActive(data) {
    if (this.type !== 'view') {
      if (data.LDAPSearchSettingDescription) {
        data.isActive = !data.isActive;
      }
    }
  }
}
