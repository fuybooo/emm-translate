import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PolicyService} from "./policy.service";
import {environment} from "../../environments/environment";
import {AppSpinService} from "../shared/service/app-spin.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-device',
  templateUrl: './policy-common-content.component.html',
})
export class PolicyDeviceComponent implements OnInit {
  policyModuleName = '设备策略';
  policyType = 'devPolicy';
  tabIndex = 0;
  private_version = environment.private_version;
  disableTab = false;
  constructor(
    public policyService: PolicyService,
    public appSpinService: AppSpinService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
  }
  changeIndex(value) {
    this.policyService.currentSystem = value === 0 ? 'Android' : 'iOS';
    this.policyService.policySearchListEvent.emit();
  }
  onClickTab(system) {
    if (this.policyService.currentSystem !== system) {
      this.disableTab = true;
      this.appSpinService.spin();
      setTimeout(() => this.disableTab = false, 2000);
    }
  }
}
