import { Component, OnInit } from '@angular/core';
import {PolicyService} from "./policy.service";
import {AppSpinService} from "../shared/service/app-spin.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-launcher',
  templateUrl: './policy-launcher.component.html',
})
export class PolicyLauncherComponent implements OnInit {
  policyType = 'securityDesk';
  constructor(private policyService: PolicyService,
              private translateService: TranslateService,
              public appSpinService: AppSpinService) { }

  ngOnInit() {
    this.appSpinService.spin();
    this.policyService.policySearchListEvent.emit();
  }

}
