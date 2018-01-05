import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {options7} from "../policy.model";
import {UtilService} from "../../shared/util/util.service";
import {PolicyService} from "../policy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-data-report',
  templateUrl: './policy-item-data-report.component.html',
})
export class PolicyItemDataReportComponent implements OnInit, OnDestroy {
  @Input() system = 'Android'; // 该项没有系统平台的区别
  @Input() type = 'view';
  @Input() config;
  data: any[] = [
  {
    label: '设备信息',
    field: 'deviceInfo'
  },
  {
    label: '运营商信息',
    field: 'operatorInfo'
  },
  {
    label: '系统信息',
    field: 'systemInfo'
  },
  {
    label: '硬件信息',
    field: 'firmwareInfo'
  },
  {
    label: '网络信息',
    field: 'networkInfo'
  },
  {
    label: '应用信息',
    field: 'appInfo'
  }
];
  value = 120; // 数据上报频率默认值2小时
  // 上报频率
  options = options7;
  subscript;
  constructor(
    public util: UtilService,
    public policyService: PolicyService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {dataReport: this.getConfig()}
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
      this.value = this.config.config.frequency;
    } else {
      // 设置默认值
      for ( let item of this.data) {
        item.value = true;
      }
    }
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: this.system === 'Android' ? 'andp001' : 'iosdp001',
      config: {}
    };
    for (let item of this.data) {
      paramConfig.config[item.field] = item.value;
    }
    paramConfig.config.frequency = this.value;
    return paramConfig;
  }
}
