import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-main-screen',
  templateUrl: './policy-item-main-screen.component.html',
})
export class PolicyItemMainScreenComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  data: any[] = [
    {
      label: '强制启用密码',
      field: 'forceOpen',
      tip: '',
      options: commonSelect
    }
  ];
  subscript;

  constructor(
    private translateService: TranslateService,
    private policyService: PolicyService
  ) { }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {MainScreen: this.getConfig()}
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
      feature: 'iosdc023',
      config: {}
    };
    for (let item of this.data) {
      paramConfig.config[item.field] = item.value;
    }
    return paramConfig;
  }

}
