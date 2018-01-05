import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options22, options23, options24, options25, options59, options6} from "../policy.model";
import {PolicyService} from "../policy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-password',
  templateUrl: './policy-item-password.component.html',
})
export class PolicyItemPasswordComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  data: any[] = [
    {
      // label: '强制启用密码',
      label: this.translateService.instant('logout'),
      field: 'forcePIN',
      tip: '',
      options: commonSelect,
      value: '--',
      system: 'iOS'
    },
    {
      label: '允许简单密码',
      field: 'allowSimple',
      tip: '允许使用重复字符序列、生序字符序列和降序字符序列',
      options: commonSelect,
      value: '--',
      system: 'iOS'
    },
    // a
    {
      label: '最小密码长度',
      field: 'minLength',
      tip: '允许密码字符的最小长度',
      options: options25,
      value: '--',
      system: 'iOS,Android'
    },
    // a
    {
      label: '最小复杂密码字符数',
      field: 'minComplexChars',
      tip: '',
      options: options22,
      value: '--',
      system: 'iOS,Android'
    },
    // a
    {
      label: '需要字母数字密码',
      field: 'requireAlphanumeric',
      tip: '',
      options: commonSelect,
      value: '--',
      system: 'iOS,Android'
    },
    // a
    {
      label: '密码有效期',
      field: 'maxPINAgeInDays',
      tip: '于所选的天数后必须修改密码',
      value: undefined,
      system: 'iOS,Android'
    },
    // a
    {
      label: '自动锁定时间',
      field: 'maxInactivity',
      options: options6,
      value: 5,
      system: 'iOS,Android'
    },
    {
      label: '锁定宽限时间',
      field: 'maxGracePeriod',
      tip: '',
      options: options23,
      value: '--',
      system: 'iOS'
    },
    // a
    {
      label: '密码历史长度',
      field: 'pinHistory',
      tip: '',
      options: options59,
      value: '--',
      system: 'iOS,Android'
    },
    // a
    {
      label: '最多允许失败次数',
      field: 'maxFailedAttempts',
      tip: '在抹掉设备上所有数据之前所允许的密码输入次数',
      options: options24,
      value: '--',
      system: 'iOS,Android'
    },
    {
      label: '允许修改TouchID',
      field: 'allowModifyTouchID',
      options: commonSelect,
      system: 'iOS'
    }
  ];
  subscript;

  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {passwordConfig: this.getConfig()}
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
      for ( let item of this.data) {
        item.value = this.config.config[item.field];
      }
    }
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: this.system === 'Android' ? 'andc001' : 'iosdc001',
      config: {}
    };
    for (let item of this.data) {
      if (item.value !== '--' && item.value !== '' && item.value !== 0 && item.value !== undefined) {
        paramConfig.config[item.field] = item.value;
      }
    }
    return paramConfig;
  }

}
