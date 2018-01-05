import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options35} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-web-content-filtering',
  templateUrl: './policy-item-web-content-filtering.component.html'
})
export class PolicyItemWebContentFilteringComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  filterType = 1;
  PermittedURLs = []; // 允许的URL
  listForm: FormGroup;
  BlacklistedURLs = [];
  WhitelistedBookmarks = [];
  VendorConfig = [];
  form: FormGroup;
  addModal;
  options35 = options35;
  mode;
  subscript;

  constructor(private policyService: PolicyService,
              private util: UtilService,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private messageService: MessageService,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.listForm = this.fb.group({
      BookmarkPath: [null],
      Title: [null],
      URL: [null],
      Key: [null],
      Value: [null]
    });
    this.form = this.fb.group({
      UserDefinedName: [null, [Validators.required]],
      PluginBundleID: [null, [Validators.required]],
      ServerAddress: [''],
      Organization: [''],
      UserName: [''],
      Password: [''],
      _voucher: [''],
      FilterBrowsers: [true],
      FilterSockets: [true],
    });
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {WebContentFiltering: this.getConfig()}
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
      let config = this.config.config;
      this.filterType = config._filterType;
      this.PermittedURLs = this.util.getReplenishArray(this.util.getObjectList(config.PermittedURLs));
      this.BlacklistedURLs = this.util.getReplenishArray(this.util.getObjectList(config.BlacklistedURLs));
      this.WhitelistedBookmarks = this.util.getReplenishArray(config.WhitelistedBookmarks);
      this.VendorConfig = this.util.getReplenishArray(config.VendorConfig);
      this.getFormControl('UserDefinedName').setValue(config.UserDefinedName || null);
      this.getFormControl('PluginBundleID').setValue(config.PluginBundleID || null);
      this.getFormControl('ServerAddress').setValue(config.ServerAddress || null);
      this.getFormControl('Organization').setValue(config.Organization || null);
      this.getFormControl('UserName').setValue(config.UserName || null);
      this.getFormControl('Password').setValue(config.Password || null);
      // this.getFormControl('_voucher').setValue(config._voucher || null);
      this.getFormControl('FilterBrowsers').setValue(config.FilterBrowsers || null);
      this.getFormControl('FilterSockets').setValue(config.FilterSockets || null);
    } else {
      this.PermittedURLs = this.util.getReplenishArray([]);
      this.BlacklistedURLs = this.util.getReplenishArray([]);
      this.WhitelistedBookmarks = this.util.getReplenishArray([]);
      this.VendorConfig = this.util.getReplenishArray([]);
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc022',
      config: {}
    };
    let isValid = false;
    // paramConfig.config.AirPrint = this.util.getUnReplenishArray(this.data);
    if (this.filterType === 1) {
      paramConfig.config.AutoFilterEnabled = true;
      let BlacklistedURLs = this.util.getIdsByList(
        this.util.getUnReplenishArray(this.BlacklistedURLs), true, 'URL');
      if (BlacklistedURLs !== '') {
        paramConfig.config.BlacklistedURLs = BlacklistedURLs.split(',');
        isValid = true;
      }
      let PermittedURLs = this.util.getIdsByList(
        this.util.getUnReplenishArray(this.PermittedURLs), true, 'URL');
      if (PermittedURLs !== '') {
        paramConfig.config.PermittedURLs = PermittedURLs.split(',');
        isValid = true;
      }
      paramConfig.config.FilterBrowsers = true;
      paramConfig.config.FilterSockets = true;
      paramConfig.config.FilterType = 'BuiltIn';
      paramConfig.config._filterType = this.filterType;
    } else if (this.filterType === 2) {
      paramConfig.config.AutoFilterEnabled = true;
      paramConfig.config.WhitelistedBookmarks = this.util.getUnReplenishArray(this.WhitelistedBookmarks);
      if (paramConfig.config.WhitelistedBookmarks.length) {
        isValid = true;
      }
      paramConfig.config.FilterBrowsers = true;
      paramConfig.config.FilterSockets = true;
      paramConfig.config.FilterType = 'BuiltIn';
      paramConfig.config._filterType = this.filterType;
    } else if (this.filterType === 3) {
      if (this.form.valid) {
        isValid = true;
        paramConfig.config = this.form.value;
        paramConfig.config.AutoFilterEnabled = true;
        paramConfig.config.VendorConfig = this.util.getUnReplenishArray(this.VendorConfig);
        paramConfig.config.FilterBrowsers = true;
        paramConfig.config.FilterSockets = true;
        paramConfig.config.FilterType = 'Plugin';
        paramConfig.config._filterType = this.filterType;
      } else {
        paramConfig.config._filterType = 1;
      }
    }
    if (!isValid) {
      paramConfig.config = {};
    }
    return paramConfig;
  }

  add(mode, titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
    });
    this.addModal.subscribe((res: any) => {
      if (res === 'onHide' || res === 'onHidden' || res === 'onCancel' || res === 'onDestroy') {
        this.listForm.reset();
      }
    });
    this.mode = mode;
    if (this.mode === 'PermittedURLs') {
      this.getListFormControl('URL').setValidators([Validators.required]);
      this.getListFormControl('Key').clearValidators();
      this.getListFormControl('Value').clearValidators();
      this.getListFormControl('BookmarkPath').clearValidators();
      this.getListFormControl('Title').clearValidators();
    } else if (this.mode === 'BlacklistedURLs') {
      this.getListFormControl('URL').setValidators([Validators.required]);
      this.getListFormControl('Key').clearValidators();
      this.getListFormControl('Value').clearValidators();
      this.getListFormControl('BookmarkPath').clearValidators();
      this.getListFormControl('Title').clearValidators();
    } else if (this.mode === 'WhitelistedBookmarks') {
      this.getListFormControl('BookmarkPath').setValidators([Validators.required]);
      this.getListFormControl('Title').setValidators([Validators.required]);
      this.getListFormControl('URL').setValidators([Validators.required]);
      this.getListFormControl('Key').clearValidators();
      this.getListFormControl('Value').clearValidators();
    } else if (this.mode === 'VendorConfig') {
      this.getListFormControl('Key').setValidators([Validators.required]);
      this.getListFormControl('Value').setValidators([Validators.required]);
      this.getListFormControl('BookmarkPath').clearValidators();
      this.getListFormControl('Title').clearValidators();
      this.getListFormControl('URL').clearValidators();
    }
  }

  del(mode) {
    let list;
    if (mode === 'PermittedURLs') {
      list = this.PermittedURLs;
    } else if (mode === 'BlacklistedURLs') {
      list = this.BlacklistedURLs;
    } else if (mode === 'WhitelistedBookmarks') {
      list = this.WhitelistedBookmarks;
    } else if (mode === 'VendorConfig') {
      list = this.VendorConfig;
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
    }
    if (mode === 'PermittedURLs') {
      this.PermittedURLs = this.util.getReplenishArray(this.PermittedURLs);
    } else if (mode === 'BlacklistedURLs') {
      this.BlacklistedURLs = this.util.getReplenishArray(this.BlacklistedURLs);
    } else if (mode === 'WhitelistedBookmarks') {
      this.WhitelistedBookmarks = this.util.getReplenishArray(this.WhitelistedBookmarks);
    } else if (mode === 'VendorConfig') {
      this.VendorConfig = this.util.getReplenishArray(this.VendorConfig);
    }
  }

  handleOk() {
    if (this.mode === 'PermittedURLs') {
      this.util.replenishPush(this.PermittedURLs, {
        URL: this.getListFormControl('URL').value
      }, 'URL');
    } else if (this.mode === 'BlacklistedURLs') {
      this.util.replenishPush(this.BlacklistedURLs, {
        URL: this.getListFormControl('URL').value
      }, 'URL');
    } else if (this.mode === 'WhitelistedBookmarks') {
      this.util.replenishPush(this.WhitelistedBookmarks, {
        BookmarkPath: this.getListFormControl('BookmarkPath').value,
        Title: this.getListFormControl('Title').value,
        URL: this.getListFormControl('URL').value,
      }, 'BookmarkPath');
    } else if (this.mode === 'VendorConfig') {
      this.util.replenishPush(this.VendorConfig, {
        Key: this.getListFormControl('Key').value,
        Value: this.getListFormControl('Value').value,
      }, 'Key');
    }
    this.listForm.reset();
    this.addModal.destroy();
  }
  changeActive(item, field) {
    if (this.type !== 'view') {
      if (item[field] !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
  getListFormControl(name) {
    return this.listForm.controls[name];
  }
}
