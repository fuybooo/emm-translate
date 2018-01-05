import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {options9} from "../policy.model";
import {UtilService} from "../../shared/util/util.service";
import {PolicyService} from "../policy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-position',
  templateUrl: './policy-item-position.component.html',
})
export class PolicyItemPositionComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  enablePosition = true;
  value = 120; // 定位策略默认值2小时
  options = options9;
  subscript;
  constructor(
    public util: UtilService,
    private translateService: TranslateService,
    public policyService: PolicyService,
  ) {
  }

  ngOnInit() {
    if (this.config) {
      this.enablePosition = this.config.config.enablePosition;
      this.value = this.config.config.frequency;
    }
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {position: this.getConfig()}
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
      feature: this.system === 'Android' ? 'andp002' : 'iosdp002',
      config: {}
    };
    paramConfig.config.enablePosition = this.enablePosition;
    paramConfig.config.frequency = this.value;
    return paramConfig;
  }

}
