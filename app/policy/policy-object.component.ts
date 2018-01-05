import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PolicyService} from "./policy.service";
import {UtilService} from "../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-object',
  templateUrl: './policy-object.component.html',
})
export class PolicyObjectComponent implements OnInit, OnDestroy {
  @Input() policyObjectJson;
  @Input() type;
  policyObject;
  isEmpty = true;
  subscript;
  constructor(
    private policyService: PolicyService,
    private translateService: TranslateService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.changeData();
    this.subscript = this.policyService.policyObjectEvent.subscribe((res: any) => {
      if (res.type === this.type) {
        this.changeData(res.data || false);
      }
    });
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
  changeData(res?) {
    if (res) {
      this.isEmpty = false;
      this.policyObject = this.policyService.getPolicyObjectByRes(res);
    } else if (!this.policyService.isEmptyPolicyObject(this.policyObjectJson)) {
      this.isEmpty = false;
      this.policyObject = this.policyObjectJson;
    } else {
      this.isEmpty = true;
      this.policyObject = {};
    }
  }
}
