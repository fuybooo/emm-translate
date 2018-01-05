import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {UtilService} from "../../shared/util/util.service";
import {FormBuilder} from "@angular/forms";
import {NzModalService} from "ng-zorro-antd";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-application-access-restriction',
  templateUrl: './policy-item-application-access-restriction.component.html',
})
export class PolicyItemApplicationAccessRestrictionComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  allowRoaming = '--';
  allowUseCellularData = '--';
  appList = [];
  activatedList = [];
  addModal;
  options = commonSelect;
  subscript;
  constructor(private policyService: PolicyService,
              private util: UtilService,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {ApplicationAccessRestriction: this.getConfig()}
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
    if (this.config && this.config.config && this.config.config.ApplicationRules) {
      this.appList = this.util.getReplenishArray(this.config.config.ApplicationRules.AppIdentifierMatches);
      this.allowRoaming = this.config.config.ApplicationRules.AllowRoamingCellularData;
      this.allowUseCellularData = this.config.config.ApplicationRules.AllowCellularData;
    } else {
      this.appList = this.util.getReplenishArray([]);
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc012',
      config: {}
    };
    let fields = ['bundleId', 'artworkUrl60', 'trackName', 'trackViewUrl'];
    let _data = this.util.getSimpleList(this.appList, ...fields);
    if (_data.length > 0) {
      paramConfig.config.ApplicationRules = {};
      paramConfig.config.ApplicationRules.AppIdentifierMatches =
        this.util.getSimpleList(this.appList, ...fields);
      if (this.allowUseCellularData !== '--') {
        paramConfig.config.ApplicationRules.AllowRoamingCellularData = this.allowUseCellularData;
      }
      if (this.allowRoaming !== '--') {
        paramConfig.config.ApplicationRules.AllowCellularData = this.allowRoaming;
      }
    }
    return paramConfig;
  }

  add() {
    this.addModal = this.nzModalService.open({
      title: '选取应用',
      content: AppStoreListComponent,
      footer: false,
      width: 800,
      componentParams: {
        multiple: true
      }
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.util.clearActive(res.data);
        this.appList = this.util.replenishConcat(this.appList, res.data, 'bundleId');
        this.addModal.destroy();
      }
    });
  }

  del() {
    let isDeleted = false;
    for (let item of this.activatedList) {
      for (let i = 0; i < this.appList.length; i++) {
        let data = this.appList[i];
        if (item.bundleId === data.bundleId) {
          this.appList.splice(i, 1);
          i--;
        }
      }
    }
    if (!isDeleted) {
      // 提示没有选中任何条目
    }
    this.appList = this.util.getReplenishArray(this.appList);
  }

  changeActive(item) {
    if (this.type !== 'view') {
      if (item.bundleId !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
  outDataChange($event) {
    this.activatedList = this.util.findActive($event);
  }
}
