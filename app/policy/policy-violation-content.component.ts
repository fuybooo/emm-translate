import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PolicyService} from "./policy.service";
import {ValidatorService} from "../shared/service/validator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-violation-content',
  templateUrl: './policy-violation-content.component.html',
})
export class PolicyViolationContentComponent implements OnInit, OnDestroy {
  @Input() currentViolationContent;
  @Input() isView = true;
  @Input() currentViolation;
  itemData: any[] = [];
  itemFunctionData: any[] = [];
  devicePassword = '';
  showPassword = false;
  subscript;
  subscript2;
  errorMsg = '';
  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private validatorService: ValidatorService,
  ) { }

  ngOnInit() {
    this.setData();
    this.subscript = this.policyService.policyViolationEvent.subscribe((res: any) => {
      if (res.type === 1) {
        this.policyService.policyViolationEvent.emit({type: 2, data: {[this.currentViolation.field]: this.getConfig()}});
      }
    });
    this.subscript2 = this.policyService.policyViolationContentEvent.subscribe((res: any) => {
      if (res.field === this.currentViolation.field) {
        this.setData(res.data);
        this.errorMsg = '';
      }
    });
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }
  changePassword($event) {
    if (this.validatorService.regExp.simplePassword.test($event)) {
      this.errorMsg = '';
    } else {
      this.errorMsg = '密码只能输入6位数字！';
    }
  }
  setData(res?) {
    this.itemData = [
      {
        label: '告警',
        field: 'alarm',
        isDisabled: true,
        value: true,
      },
      {
        label: '锁定设备',
        field: 'lockDevice',
      },
      {
        label: '禁用容器',
        field: 'lockContainer'
      },
      {
        label: '不允许下载新的应用',
        field: 'disableDownloadNewApp'
      },
      {
        label: '擦除企业数据',
        field: 'clearEnterpriseData'
      },
      {
        label: '擦除全部数据',
        field: 'clearAllData'
      },
    ];
    this.itemFunctionData = [
      {
        label: '禁用WiFi',
        field: 'disableWifi'
      },
      {
        label: '禁用蓝牙',
        field: 'disableBluetooth'
      },
      {
        label: '禁用摄像头',
        field: 'disableCamera'
      },
      {
        label: '禁用剪切板',
        field: 'disableClipboard'
      },
      {
        label: '禁用定位',
        field: 'disableGPS'
      },
      {
        label: '禁用屏幕捕捉',
        field: 'disableScreenCapture'
      },
      {
        label: '禁用USB调试',
        field: 'disableUSBDebugging'
      },
      {
        label: '禁用修改网络',
        field: 'disableModifyNetwork'
      },
      {
        label: '禁用恢复出厂设置',
        field: 'disableRestore'
      },
    ];
    let config = res ? res.config : this.currentViolationContent.config;
    for (let item of this.itemData) {
      if (item.field !== 'alarm') {
        item.value = config[item.field];
      }
    }
    for (let item of this.itemFunctionData) {
      item.value = config.function ? config.function[item.field] : false;
    }
    this.devicePassword = config.devicePassword;
  }
  getConfig() {
    let paramConfig: any = {
      id: this.currentViolationContent.id,
      feature: this.currentViolationContent.feature,
      config: {}
    };
    paramConfig.config.function = {};
    let isValid = true;
    for (let item of this.itemData) {
      if (item.value !== undefined && item.value !== '--') {
        if (item.field === 'lockDevice') {
          if (item.value) {
            if (!this.devicePassword || this.errorMsg) {
              isValid = false;
              break;
            } else {
              paramConfig.config.devicePassword = this.devicePassword;
            }
          } else {
            paramConfig.config.devicePassword = '';
          }
        }
        paramConfig.config[item.field] = item.value;
      }
    }
    if (!isValid) {
      return false;
    } else {
      for (let item of this.itemFunctionData) {
        if (item.value !== undefined && item.value !== '--') {
          paramConfig.config.function[item.field] = item.value;
        }
      }
    }
    return paramConfig;
  }
}
