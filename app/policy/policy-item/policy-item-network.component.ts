import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {options10} from "../policy.model";
import {PolicyService} from "../policy.service";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-network',
  templateUrl: './policy-item-network.component.html',
})
export class PolicyItemNetworkComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  options10 = options10;
  disableChangeSIM;
  openLimitMonthlyCallTime;
  limitMonthlyCallTime;
  openCallTimeBillingCycle;
  callTimeBillingMode;
  callTimeFrom;
  callTimeTo;
  openLimitMonthlyData;
  limitMonthlyData;
  openDataBillingCycle;
  dataBillingMode;
  dataFrom;
  dataTo;
  subscript;
  placeholderCallTime = '1~44640';
  placeholderData = '大于等于1';
  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    if (this.config) {
      let config = this.config.config;
      this.disableChangeSIM = config.disableChangeSIM;
      this.openLimitMonthlyCallTime = config.openLimitMonthlyCallTime;
      this.limitMonthlyCallTime = config.limitMonthlyCallTime;
      this.openCallTimeBillingCycle = config.openCallTimeBillingCycle;
      this.callTimeBillingMode = config.callTimeBillingMode;
      this.callTimeFrom = config.callTimeFrom;
      this.callTimeTo = config.callTimeTo;
      this.openLimitMonthlyData = config.openLimitMonthlyData;
      this.limitMonthlyData = config.limitMonthlyData;
      this.openDataBillingCycle = config.openDataBillingCycle;
      this.dataBillingMode = config.dataBillingMode;
      this.dataFrom = config.dataFrom;
      this.dataTo = config.dataTo;
    }
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          let config = this.getConfig();
          if (event.isSave) {
            if (!config) {
              this.messageService.error('请填写完整蜂窝移动网络的必填项！');
              return;
            }
          }
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {network: config}
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
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: this.system === 'Android' ? 'andp007' : 'iosdp007',
      config: {}
    };
    paramConfig.config.disableChangeSIM = this.disableChangeSIM;
    paramConfig.config.openLimitMonthlyCallTime = this.openLimitMonthlyCallTime;
    let isValid = true;
    if (this.openLimitMonthlyCallTime) {
      if (this.limitMonthlyCallTime) {
        paramConfig.config.limitMonthlyCallTime = this.limitMonthlyCallTime;
      } else {
        isValid = false;
      }
      if (this.limitMonthlyCallTime) {
        paramConfig.config.openCallTimeBillingCycle = this.openCallTimeBillingCycle;
        if (this.openCallTimeBillingCycle) {
          paramConfig.config.callTimeBillingMode = this.callTimeBillingMode;
          if (this.callTimeBillingMode === 2) {
            paramConfig.config.callTimeFrom = this.callTimeFrom;
            paramConfig.config.callTimeTo = this.callTimeTo;
          }
        }
      }
    }
    paramConfig.config.openLimitMonthlyData = this.openLimitMonthlyData;
    if (this.openLimitMonthlyData) {
      if (this.limitMonthlyData) {
        paramConfig.config.limitMonthlyData = this.limitMonthlyData;
      } else {
        isValid = false;
      }
      if (this.limitMonthlyData) {
        paramConfig.config.openDataBillingCycle = this.openDataBillingCycle;
        if (this.openDataBillingCycle) {
          paramConfig.config.dataBillingMode = this.dataBillingMode;
          if (this.dataBillingMode === 2) {
            paramConfig.config.dataFrom = this.dataFrom;
            paramConfig.config.dataTo = this.dataTo;
          }
        }
      }
    }
    if (!isValid) {
      return false;
    }
    return paramConfig;
  }
  changeMonthlyData(value) {
    if (value) {
      this.placeholderData = '【必填】大于等于1';
    } else {
      this.placeholderData = '大于等于1';
    }
  }
  changeMonthlyCallTime(value) {
    if (value) {
      this.placeholderCallTime = '【必填】1~44640';
    } else {
      this.placeholderCallTime = '1~44640';
    }
  }
}
