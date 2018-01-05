import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options12, options21} from "../policy.model";
import {PolicyService} from "../policy.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-version',
  templateUrl: './policy-item-version.component.html',
})
export class PolicyItemVersionComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  app;
  value = 'Android 4.4';
  options = options12;
  subscript;
  constructor(
    private translateService: TranslateService,
    private policyService: PolicyService
  ) { }

  ngOnInit() {
    if (this.system === 'iOS') {
      this.options = options21;
      this.value = 'iOS 7';
    }
    if (this.config) {
      this.value = this.config.config.version;
    }
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {version: this.getConfig()}
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
      feature: this.system === 'Android' ? 'andp003' : 'iosdp003',
      config: {}
    };
    paramConfig.config.version = this.value;
    return paramConfig;
  }
}
