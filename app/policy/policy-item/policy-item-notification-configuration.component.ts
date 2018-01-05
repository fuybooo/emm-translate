import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PolicyService} from "../policy.service";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-notification-configuration',
  templateUrl: './policy-item-notification-configuration.component.html',
})
export class PolicyItemNotificationConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  appList: any[] = [];
  selectedApp = null;
  addModal;
  configModal;
  AlertType;
  BadgesEnabled;
  NotificationsEnabled;
  ShowInLockScreen;
  ShowInNotificationCenter;
  SoundsEnabled;
  options = [
    {
      label: '无',
      value: ''
    },
    {
      label: '横幅',
      value: '1'
    },
    {
      label: '提醒',
      value: '2'
    },
  ];
  activatedList = [];
  subscript;

  constructor(private policyService: PolicyService,
              private util: UtilService,
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
            data: {NotificationConfiguration: this.getConfig()}
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
      this.appList = this.util.getReplenishArray(this.config.config);
    } else {
      this.appList = this.util.getReplenishArray([]);
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc017',
      config: []
    };
    paramConfig.config = this.util.getUnReplenishArray(this.appList);
    return paramConfig;
  }

  add(contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: '选取应用',
      content: AppStoreListComponent,
      footer: false,
      width: 800,
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.AlertType = 1;
        this.BadgesEnabled = false;
        this.NotificationsEnabled = false;
        this.ShowInLockScreen = false;
        this.ShowInNotificationCenter = false;
        this.SoundsEnabled = false;
        this.selectedApp = res.data[0];
        this.addModal.destroy();
        this.configModal = this.nzModalService.open({
          title: '通知设置',
          content: contentTpl,
          footer: footerTpl
        });
      }
    });
  }

  del() {
    if (this.activatedList.length) {
      for (let item of this.activatedList) {
        for (let i = 0; i < this.appList.length; i++) {
          let data = this.appList[i];
          if (item.name === data.name) {
            this.appList.splice(i, 1);
            i --;
          }
        }
      }
      this.appList = this.util.getReplenishArray(this.appList);
    } else {
      // 请选择要删除的应用
    }
  }

  outDataChange($event) {
    this.activatedList = $event;
  }

  handleOk() {
    this.selectedApp.isActive = false;
    this.util.replenishPush(this.appList, {
      BundleIdentifier: this.selectedApp.bundleId,
      trackName: this.selectedApp.trackName,
      artworkUrl60: this.selectedApp.artworkUrl60,
      AlertType: this.AlertType,
      BadgesEnabled: this.BadgesEnabled,
      NotificationsEnabled: this.NotificationsEnabled,
      ShowInLockScreen: this.ShowInLockScreen,
      ShowInNotificationCenter: this.ShowInNotificationCenter,
      SoundsEnabled: this.SoundsEnabled,
    }, 'BundleIdentifier');
    this.configModal.destroy();
  }
  changeActive(item) {
    if (this.type !== 'view') {
      if (item.BundleIdentifier !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
}
