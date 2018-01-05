import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd";
import {UtilService} from "../../shared/util/util.service";
import {MessageService} from "../../shared/service/message.service";
import {ValidatorService} from "../../shared/service/validator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-field-configuration',
  templateUrl: './policy-item-field-configuration.component.html',
})
export class PolicyItemFieldConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  EmailDomains: any[] = [];
  WebDomains: any[] = [];
  SafariPasswordAutoFillDomains: any[] = [];
  form: FormGroup;
  urlType = '';
  addModal;
  subscript;

  constructor(
    private policyService: PolicyService,
    private util: UtilService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private nzModalService: NzModalService,
    private translateService: TranslateService,
    private validatorService: ValidatorService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      // todo 添加URL的验证规则
      url: ['', [Validators.required]],
    });
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {FieldConfiguration: this.getConfig()}
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
  setData() {
    if (this.config) {
      this.EmailDomains = this.util.getReplenishArray(this.util.getObjectList(this.config.config.EmailDomains, 'url'));
      this.WebDomains = this.util.getReplenishArray(this.util.getObjectList(this.config.config.WebDomains, 'url'));
      this.SafariPasswordAutoFillDomains = this.util.getReplenishArray(
        this.util.getObjectList(this.config.config.SafariPasswordAutoFillDomains, 'url'));
    } else {
      this.EmailDomains = this.util.getReplenishArray([]);
      this.WebDomains = this.util.getReplenishArray([]);
      this.SafariPasswordAutoFillDomains = this.util.getReplenishArray([]);
    }
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc019',
      config: {}
    };
    let EmailDomains = this.util.getIdsByList(
      this.util.getUnReplenishArray(this.EmailDomains), true, 'url');
    if (EmailDomains !== '') {
      paramConfig.config.EmailDomains = EmailDomains.split(',');
    }
    let WebDomains = this.util.getIdsByList(
      this.util.getUnReplenishArray(this.WebDomains), true, 'url');
    if (WebDomains !== '') {
      paramConfig.config.WebDomains = WebDomains.split(',');
    }
    let SafariPasswordAutoFillDomains = this.util.getIdsByList(
      this.util.getUnReplenishArray(this.SafariPasswordAutoFillDomains), true, 'url');
    if (SafariPasswordAutoFillDomains !== '') {
      paramConfig.config.SafariPasswordAutoFillDomains = SafariPasswordAutoFillDomains.split(',');
    }
    return paramConfig;
  }
  add(titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
    });
    if (this.urlType === 'EmailDomains') {
      this.getFormControl('url').setValidators([Validators.required,
        this.validatorService.getIsDupValidator(this.EmailDomains, 'url')]);
    } else if (this.urlType === 'WebDomains') {
      this.getFormControl('url').setValidators([Validators.required,
        this.validatorService.getIsDupValidator(this.WebDomains, 'url')]);
    } else if (this.urlType === 'SafariPasswordAutoFillDomains') {
      this.getFormControl('url').setValidators([Validators.required,
        this.validatorService.getIsDupValidator(this.SafariPasswordAutoFillDomains, 'url')]);
    }
  }

  del(mode) {
    let list;
    if (mode === 'EmailDomains') {
      list = this.EmailDomains;
    } else if (mode === 'WebDomains') {
      list = this.WebDomains;
    } else if (mode === 'SafariPasswordAutoFillDomains') {
      list = this.SafariPasswordAutoFillDomains;
    }
    let isDeleted = false;
    for (let i = 0; i < list.length; i++) {
      let data = list[i];
      if (data.isActive) {
        isDeleted = true;
        list.splice(i, 1);
        i--;
      }
    }
    if (!isDeleted) {
      // 提示没有选中任何条目
      this.messageService.error('请选择要删除的项');
    } else {
      if (mode === 'EmailDomains') {
        this.EmailDomains = this.util.getReplenishArray(list);
      } else if (mode === 'WebDomains') {
        this.WebDomains = this.util.getReplenishArray(list);
      } else if (mode === 'SafariPasswordAutoFillDomains') {
        this.SafariPasswordAutoFillDomains = this.util.getReplenishArray(list);
      }
    }
  }

  handleOk() {
    if (this.urlType === 'EmailDomains') {
      this.util.replenishPush(this.EmailDomains, {
        url: this.getFormControl('url').value,
      }, 'url');
    } else if (this.urlType === 'WebDomains') {
      this.util.replenishPush(this.WebDomains, {
        url: this.getFormControl('url').value,
      }, 'url');
    } else if (this.urlType === 'SafariPasswordAutoFillDomains') {
      this.util.replenishPush(this.SafariPasswordAutoFillDomains, {
        url: this.getFormControl('url').value,
      }, 'url');
    }
    this.EmailDomains = this.util.getReplenishArray(this.EmailDomains);
    this.WebDomains = this.util.getReplenishArray(this.WebDomains);
    this.SafariPasswordAutoFillDomains = this.util.getReplenishArray(this.SafariPasswordAutoFillDomains);
    this.form.reset();
    this.addModal.destroy();
  }
  changeActive(item) {
    if (this.type !== 'view') {
      if (item.url !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
}
