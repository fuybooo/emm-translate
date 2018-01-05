import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options12} from "../policy.model";
import {PolicyService} from "../policy.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {NzModalService} from "ng-zorro-antd";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-simple-app',
  templateUrl: './policy-item-simple-app.component.html',
})
export class PolicyItemSimpleAppComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  @Input() policyType;
  app = null;
  options = commonSelect;
  data: any[] = [
    {
      label: '禁用触屏',
      field: 'DisableTouch'
    },
    {
      label: '禁用设备屏幕旋转功能',
      field: 'DisableDeviceRotation'
    },
    {
      label: '禁用音量键',
      field: 'DisableVolumeButtons'
    },
    {
      label: '禁用铃声开关',
      field: 'DisableRingerSwitch'
    },
    {
      label: '禁用睡眠/唤醒键',
      field: 'DisableSleepWakeButton'
    },
    {
      label: '禁用自动锁定',
      field: 'DisableAutoLock'
    },
    {
      label: '启用 VoiceOver',
      field: 'EnableVoiceOver'
    },
    {
      label: '启用缩放',
      field: 'EnableZoom'
    },
    {
      label: '启用颜色反转',
      field: 'EnableInvertColors'
    },
    {
      label: '启用AssistiveTouch',
      field: 'EnableAssistiveTouch'
    },
    {
      label: '启用朗读所选项',
      field: 'EnableSpeakSelection'
    },
    {
      label: '启用单声道音频',
      field: 'EnableMonoAudio'
    },
  ];
  value = '';
  simpleApps = [];
  simpleAppId = '';
  isView = true;
  addModal;
  subscript;

  constructor(private policyService: PolicyService,
              private http: HttpClient,
              private translateService: TranslateService,
              private dataService: DataService,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.isView = this.policyType !== 'simpleDesk' || this.type === 'view';
    if (this.policyType === 'simpleDesk') {
      this.setData(this.config);
    } else {
      this.initList({isActiveFist: false});
      if (this.config && this.config.config.simpleAppId) {
        this.simpleAppId = this.config.config.simpleAppId;
        this.searchSimpleApp(this.simpleAppId);
      }
    }
    if (this.type !== 'view' && this.system === 'iOS') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          if (this.system === 'iOS') {
            this.policyService.policyConfigEvent.emit({
              type: 2,
              data: {simpleDesk: this.getConfig()}
            });
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  selectApp() {
    this.addModal = this.nzModalService.open({
      title: '选取应用',
      content: AppStoreListComponent,
      footer: false,
      width: 800,
      componentParams: {
        widthLocalApp: true,
      }
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.app = res.data[0];
        this.addModal.destroy();
      }
    });
  }

  initList(...other) {
    this.http.get(this.dataService.url.policy.get_policy_type_platform, this.dataService.getWholeParams({
      policyType: 'simpleDesk',
      platform: 'iOS',
    })).subscribe((res: any) => {
      this.simpleApps = res.data.result;
      this.simpleApps.unshift({
        policyName: '--',
        id: ''
      });
    });
  }

  searchSimpleApp(value) {
    if (value !== '') {
      this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
        id: value,
      })).subscribe((response: any) => {
        let res = JSON.parse(response.data.config);
        this.setData(res.simpleDesk);
      });
    }
  }

  setData(config) {
    if (config && config.config.App) {
      for (let item of this.data) {
        let v = config.config.App.Options[item.field];
        if (v === undefined) {
          item.value = '--';
        } else {
          item.value = config.config.App.Options[item.field];
        }
      }
      this.app = {
        // bundleId: config.config.bundleId,
        artworkUrl60: config.config.App.artworkUrl60,
        trackName: config.config.App.trackName
      };
    } else {
      for (let item of this.data) {
        item.value = '--';
      }
      this.app = null; // todo 默认的app图标
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: '',
      config: {}
    };
    if (this.policyType === 'devPolicy') {
      paramConfig.feature = 'iosdp008';
      if (this.simpleAppId && this.simpleAppId !== '--') {
        paramConfig.config.simpleAppId = this.simpleAppId;
      }
    } else if (this.policyType === 'fencing') {
      paramConfig.feature = 'iosfc003';
      if (this.simpleAppId !== '--') {
        paramConfig.config.simpleAppId = this.simpleAppId;
      }
    } else if (this.policyType === 'simpleDesk') {
      paramConfig.feature = 'desk002';
      if (this.app) {
        paramConfig.config.App = {};
        paramConfig.config.App.Identifier = this.app.bundleId;
        paramConfig.config.App.artworkUrl60 = this.app.artworkUrl60;
        paramConfig.config.App.trackName = this.app.trackName;
        paramConfig.config.App.trackViewUrl = this.app.trackViewUrl;
        paramConfig.config.App.Options = {};
        paramConfig.config.App.UserEnabledOptions = {};
        for (let item of this.data) {
          paramConfig.config.App.Options[item.field] = item.value;
          if (item.field === 'EnableVoiceOver') {
            paramConfig.config.App.UserEnabledOptions.VoiceOver = item.value;
          }
          if (item.field === 'EnableZoom') {
            paramConfig.config.App.UserEnabledOptions.Zoom = item.value;
          }
          if (item.field === 'EnableInvertColors') {
            paramConfig.config.App.UserEnabledOptions.InvertColors = item.value;
          }
          if (item.field === 'EnableAssistiveTouch') {
            paramConfig.config.App.UserEnabledOptions.AssistiveTouch = item.value;
          }
        }
      }
    }
    return paramConfig;
  }
}
