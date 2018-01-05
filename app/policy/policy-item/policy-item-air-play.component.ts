import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {UtilService} from "../../shared/util/util.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-air-play',
  templateUrl: './policy-item-air-play.component.html',
})
export class PolicyItemAirPlayComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  data: any[] = [];
  whiteList: any[] = [];
  passwordForm: FormGroup;
  whiteForm: FormGroup;
  addModal;
  subscript;

  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private util: UtilService,
    private fb: FormBuilder,
    private nzModalService: NzModalService,
  ) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      DeviceName: [''],
      Password: ['']
    });
    this.whiteForm = this.fb.group({
      DeviceID: [''],
    });
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {AirPlay: this.getConfig()}
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
      this.data = this.util.getReplenishArray(this.config.config.Passwords);
      this.whiteList = this.util.getReplenishArray(this.config.config.Whitelist);
    } else {
      this.data = this.util.getReplenishArray([]);
      this.whiteList = this.util.getReplenishArray([]);
    }
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc005',
      config: {}
    };
    let _data = this.util.getUnReplenishArray(this.data);
    let _whiteList = this.util.getUnReplenishArray(this.whiteList);
    if (_data.length > 0) {
      paramConfig.config.Passwords = _data;
    }
    if (_whiteList.length > 0) {
      paramConfig.config.Whitelist = _whiteList;
    }
    return paramConfig;
  }
  add(titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
    });
  }

  del(mode) {
    let list;
    if (mode === 'password') {
      list = this.data;
    } else if (mode === 'white') {
      list = this.whiteList;
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
    }
    if (mode === 'password') {
      this.data = this.util.getReplenishArray(list);
    } else if (mode === 'white') {
      this.whiteList = this.util.getReplenishArray(list);
    }
  }

  handleOk(mode) {
    if (mode === 'password') {
      this.util.replenishPush(this.data, {
        DeviceName: this.getFormControl(mode, 'DeviceName').value,
        Password: this.getFormControl(mode, 'Password').value,
      }, 'DeviceName');
    } else if (mode === 'white') {
      this.util.replenishPush(this.whiteList, {
        DeviceID: this.getFormControl(mode, 'DeviceID').value,
      }, 'DeviceID');
    }
    this.data = this.util.getReplenishArray(this.data);
    this.whiteList = this.util.getReplenishArray(this.whiteList);
    this.passwordForm.reset();
    this.whiteForm.reset();
    this.addModal.destroy();
  }
  changeActive(mode, item) {
    if (this.type !== 'view') {
      if (mode === 'password') {
        if (item.DeviceName !== undefined) {
          item.isActive = !item.isActive;
        }
      } else if (mode === 'white') {
        if (item.DeviceID !== undefined) {
          item.isActive = !item.isActive;
        }
      }
    }
  }
  getFormControl(mode, name) {
    if (mode === 'password') {
      return this.passwordForm.controls[name];
    } else if (mode === 'white') {
      return this.whiteForm.controls[name];
    }
  }
}
