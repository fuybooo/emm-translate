import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options13, options14, options15, options16, options17, options53} from "../policy.model";
import {PolicyService} from "../policy.service";
import {NzModalService} from "ng-zorro-antd";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-function',
  templateUrl: './policy-item-function.component.html',
})
export class PolicyItemFunctionComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  options = commonSelect;
  _options13 = options13;
  _options14 = options14;
  _options15 = options15;
  _options16 = options16;
  _options17 = options17;
  _options53 = options53;
  // limitApp = 1;
  // appList = [];
  data: any = [];
  dataType = 1;
  supervisedDesc = '（仅限被监督的设备）';
  // addModal;
  // activatedList = [];
  subscript;

  constructor(
    private policyService: PolicyService,
    private nzModalService: NzModalService,
    private translateService: TranslateService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {'function': this.getConfig()}
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
    if (this.system === 'Android') {
      this.data = [
        {
          label: '禁用蓝牙',
          field: 'disableBluetooth'
        },
        {
          label: '禁用WiFi',
          field: 'disableWifi'
        },
        {
          label: '禁用摄像头',
          field: 'disableCamera'
        },
        {
          label: '禁用剪切板',
          field: 'disableClipboard'
        },
        {
          label: '禁用GPS',
          field: 'disableGPS'
        },
        {
          label: '禁用屏幕捕捉',
          field: 'disableScreenCapture'
        },
        {
          label: '禁用USB调试',
          field: 'disableUSBDebugging'
        },
        {
          label: '禁用恢复出厂设置',
          field: 'disableRestore'
        },
        {
          label: '禁用修改网络',
          field: 'disableModifyNetwork'
        },
        {
          label: '禁止挂载SD卡',
          field: 'disableSD'
        },
      ];
      if (this.config) {
        for ( let item of this.data) {
          let v = this.config.config[item.field];
          if (v === undefined) {
            item.value = '--';
          } else {
            item.value = v;
          }
        }
      } else {
        for ( let item of this.data) {
          item.value = '--';
        }
      }
    } else if (this.system === 'iOS') {
      this.data = {
        'function': [
          {
            label: '允许使用相机',
            field: 'allowCamera',
            children: [1],
          },
          {
            label: '允许 FaceTime',
            field: 'allowVideoConferencing',
            level: 2,
            id: 1
          },
          {
            label: '允许屏幕快照和屏幕录制',
            field: 'allowScreenShot'
          },
          {
            label: '允许 AriDrop',
            field: 'allowAirDrop',
            isSupervised: true
          },
          {
            label: '允许 iMessage',
            field: 'allowChat',
            isSupervised: true
          },
          {
            label: '允许 Apple Music',
            field: 'allowMusicService',
            isSupervised: true
          },
          {
            label: '允许广播',
            field: 'allowRadioService',
            isSupervised: true
          },
          {
            label: '设备锁定时允许语音拨号',
            field: 'allowVoiceDialing'
          },
          {
            label: '允许 Siri',
            field: 'allowAssistant',
            children: [2, 3, 4],
          },
          {
            label: '设备锁定时允许 Siri',
            field: 'allowAssistantWhileLocked',
            level: 2,
            id: 2
          },
          {
            label: '启用Siri脏话过滤器',
            field: 'forceAssistantProfanityFilter',
            level: 2,
            id: 3,
            isSupervised: true
          },
          {
            label: '在Siri中显示用户生成的内容',
            field: 'allowAssistantUserGeneratedContent',
            level: 2,
            id: 4,
            isSupervised: true
          },
          {
            label: '允许Siri建议',
            field: 'allowSpotlightInternetResults'
          },
          {
            label: '允许使用 iBooks Store',
            field: 'allowBookstore',
            isSupervised: true
          },
          {
            label: '允许安装应用',
            field: 'allowAppInstallation',
            children: [5, 6]
          },
          {
            label: '允许使用 App Store',
            field: 'allowUIAppInstallation',
            level: 2,
            id: 5,
            isSupervised: true
          },
          {
            label: '允许自动下载应用',
            field: 'allowAutomaticAppDownloads',
            level: 2,
            id: 6,
            isSupervised: true
          },
          {
            label: '允许移出应用',
            field: 'allowAppRemoval',
            isSupervised: true
          },
          {
            label: '允许 App 内购买',
            field: 'allowInAppPurchases'
          },
          {
            label: '所有购买都必须输入 iTunes Store密码',
            field: 'forceITunesStorePasswordEntry'
          },
          {
            label: '允许 iCloud 云备份',
            field: 'allowCloudBackup'
          },
          {
            label: '允许 iCloud 文稿与数据',
            field: 'allowCloudDocumentSync'
          },
          {
            label: '允许 iCloud 钥匙串',
            field: 'allowCloudKeychainSync'
          },
          {
            label: '允许被管理的应用将数据存储到 iCloud',
            field: 'allowManagedAppsCloudSync'
          },
          {
            label: '允许备份企业级图书',
            field: 'allowEnterpriseBookBackup'
          },
          {
            label: '允许同步企业级图书的笔记和和重点',
            field: 'allowEnterpriseBookMetadataSync'
          },
          {
            label: '允许 iCloud 照片共享',
            field: 'allowSharedStream'
          },
          {
            label: '允许 iCloud 照片图库',
            field: 'allowCloudPhotoLibrary'
          },
          {
            label: '允许“我的照片流”（若不允许可能会导致数据流失）',
            field: 'allowPhotoStream'
          },
          {
            label: '允许在漫游时自动同步',
            field: 'allowGlobalBackgroundFetchWhenRoaming'
          },
          {
            label: '强制加密备份',
            field: 'forceEncryptedBackup'
          },
          {
            label: '强制限制广告跟踪',
            field: 'forceLimitAdTracking'
          },
          {
            label: '允许抹掉所有内容和设置',
            field: 'allowEraseContentAndSettings',
            isSupervised: true
          },
          {
            label: '允许用户接受不信任的 TLS 证书',
            field: 'allowUntrustedTLSPrompt',
            isSupervised: true
          },
          {
            label: '允许自动更新证书信任设置',
            field: 'allowOTAPKIUpdates'
          },
          {
            label: '允许信任新企业级应用作者',
            field: 'allowEnterpriseAppTrust'
          },
          {
            label: '允许安装配置描述文件',
            field: 'allowUIConfigurationProfileInstallation',
            isSupervised: true
          },
          {
            label: '允许修改帐户设置',
            field: 'allowAccountModification',
            isSupervised: true
          },
          {
            label: '允许修改蓝牙设置',
            field: 'allowBluetoothModification',
            isSupervised: true
          },
          {
            label: '允许修改蜂窝移动数据应用设置',
            field: 'allowAppCellularDataModification',
            isSupervised: true
          },
          {
            label: '允许修改设备名称',
            field: 'allowDeviceNameModification',
            isSupervised: true
          },
          {
            label: '允许修改“查找我的朋友”设置',
            field: 'allowFindMyFriendsModification',
            isSupervised: true
          },
          {
            label: '允许修改通知设置',
            field: 'allowNotificationsModification',
            isSupervised: true
          },
          {
            label: '允许修改密码',
            field: 'allowPasscodeModification',
            isSupervised: true,
            children: [7]
          },
          {
            label: '允许修改 Touch ID 指纹',
            field: 'allowFingerprintModification',
            level: 2,
            id: 7,
            isSupervised: true
          },
          {
            label: '允许修改访问限制',
            field: 'allowEnablingRestrictions',
            isSupervised: true
          },
          {
            label: '允许修改墙纸',
            field: 'allowWallpaperModification',
            isSupervised: true
          },
          {
            label: '仅加入由描述文件安装的 Wi-Fi 网络',
            field: 'forceWiFiWhitelisting',
            isSupervised: true
          },
          {
            label: '允许与未安装 Configurator 的主机配对',
            field: 'allowHostPairing',
            isSupervised: true
          },
          {
            label: '允许未被管理的目的位置中包含来自被管理的来源中的文稿',
            field: 'allowOpenFromManagedToUnmanaged'
          },
          {
            label: '允许被管理的目的位置中包含来自未被管理的来源中的文稿',
            field: 'allowOpenFromUnmanagedToManaged'
          },
          {
            label: '将 AirDrop 视为未被管理的目的位置',
            field: 'forceAirDropUnmanaged'
          },
          {
            label: '允许使用Handoff',
            field: 'allowActivityContinuation'
          },
          {
            label: '允许向 Apple 发送诊断和使用数据',
            field: 'allowDiagnosticSubmission',
            children: [8]
          },
          {
            label: '允许修改诊断设置',
            field: 'allowDiagnosticSubmissionModification',
            level: 2,
            id: 8,
            isSupervised: true
          },
          {
            label: '允许使用 Touch ID 解锁设备',
            field: 'allowFingerprintForUnlock'
          },
          {
            label: '强制 Apple Watch 进行手腕检测',
            field: 'forceWatchWristDetection'
          },
          {
            label: '允许与 Apple Watch 配对',
            field: 'allowPairedWatch',
            isSupervised: true
          },
          {
            label: '首次 AirPlay 配对时要求密码',
            field: 'forceAirPlayIncomingRequestsPairingPassword'
          },
          {
            label: '允许使用输入预测键盘',
            field: 'allowPredictiveKeyboard',
            isSupervised: true
          },
          {
            label: '允许键盘快捷键',
            field: 'allowKeyboardShortcuts',
            isSupervised: true
          },
          {
            label: '允许自动改正',
            field: 'allowAutoCorrection',
            isSupervised: true
          },
          {
            label: '允许听写',
            field: 'allowDictation',
            isSupervised: true
          },
          {
            label: '允许在锁定屏幕中显示 Wallet 通知',
            field: 'allowPassbookWhileLocked'
          },
          {
            label: '在锁定屏幕中显示控制中心',
            field: 'allowLockScreenControlCenter'
          },
          {
            label: '在锁定屏幕中显示通知中心',
            field: 'allowLockScreenNotificationsView'
          },
          {
            label: '在锁定屏幕中显示今天视图',
            field: 'allowLockScreenTodayView'
          },
          {
            label: '允许与“遥控器”应用配对（仅限tvOS）',
            field: 'allowRemoteAppPairing'
          },
          {
            label: '允许传入 AirPlay 请求（仅限tvOS）',
            field: 'allowAirPlayIncomingRequests'
          },
        ],
        application: [
          {
            label: '允许使用 iTunes Store',
            field: 'allowiTunes'
          },
          {
            label: '允许使用 News',
            field: 'allowNews',
            isSupervised: true
          },
          {
            label: '允许使用“播客”',
            field: 'allowPodcasts',
            isSupervised: true
          },
          {
            label: '允许使用 Game Center',
            field: 'allowGameCenter',
            isSupervised: true,
            children: [1, 2],
          },
          {
            label: '允许多人游戏',
            field: 'allowMultiplayerGaming',
            isSupervised: true,
            level: 2,
            id: 1
          },
          {
            label: '允许添加 Game Center 朋友',
            field: 'allowAddingGameCenterFriends',
            level: 2,
            id: 2
          },
          {
            label: '允许使用Safari',
            field: 'allowSafari',
            children: [3, 4, 5, 6, 7],
          },
          {
            label: '启用自动填充',
            field: 'safariAllowAutoFill',
            level: 2,
            id: 3
          },
          {
            label: '强制发出欺诈警告',
            field: 'safariForceFraudWarning',
            level: 2,
            id: 4
          },
          {
            label: '启用JavaScript',
            field: 'safariAllowJavaScript',
            level: 2,
            id: 5
          },
          {
            label: '阻止弹出式窗口',
            field: 'safariAllowPopups',
            level: 2,
            id: 6
          },
          {
            label: '接受Cookie',
            field: 'safariAcceptCookies',
            level: 2,
            id: 7
          },
        ],
        media: [
          {
            label: '评选地区（设定评选级的地区）',
            field: 'ratingRegion'
          },
          {
            label: '影片',
            field: 'ratingMovies'
          },
          {
            label: '电视节目',
            field: 'ratingTVShows'
          },
          {
            label: '应用',
            field: 'ratingApps'
          },
          {
            label: '允许回放儿童不宜的音乐、播客与 iTunes U 媒体',
            field: 'allowBookstoreErotica'
          },
          {
            label: '允许iBooks Store中包含儿童不宜的成人内容',
            field: 'allowExplicitContent'
          },
        ]
      };
      if (this.config) {
        for ( let item of this.data.function) {
          let v = this.config.config[item.field];
          if (v === undefined) {
            item.value = '--';
          } else {
            item.value = v;
          }
        }
        for ( let item of this.data.application) {
          let v = this.config.config[item.field];
          if (v === undefined) {
            item.value = '--';
          } else {
            item.value = v;
          }
        }
        for ( let item of this.data.media) {
          let v = this.config.config[item.field];
          if (v === undefined) {
            item.value = '--';
          } else {
            item.value = v;
          }
        }
      } else {
        for ( let item of this.data.function) {
          item.value = '--';
        }
        for ( let item of this.data.application) {
          item.value = '--';
        }
        for ( let item of this.data.media) {
          item.value = '--';
        }
      }
      this.setChildren(this.data.function);
      this.setChildren(this.data.application);
    }
  }
  getConfig() {
    let paramConfig = {
      id: this.config ? this.config.id : '',
      feature: this.system === 'Android' ? 'andp004' : 'iosdp004',
      config: {}
    };
    if (this.system === 'iOS') {
      for (let item of this.data.function) {
        if (item.value !== '--') {
          paramConfig.config[item.field] = item.value;
        }
      }
      for (let item of this.data.application) {
        if (item.value !== '--') {
          paramConfig.config[item.field] = item.value;
        }
      }
      // let fields = ['bundleId', 'artworkUrl60', 'trackName'];
      // if (this.limitApp === 2) {
      //   paramConfig.config['blacklistedAppBundleIDs'] = this.util.getSimpleList(this.appList, ...fields);
      // } else if (this.limitApp === 3) {
      //   paramConfig.config['whitelistedAppBundleIDs'] = this.util.getSimpleList(this.appList, ...fields);
      // }
      for (let item of this.data.media) {
        if (item.value !== '--') {
          paramConfig.config[item.field] = item.value;
        }
      }
    } else if (this.system === 'Android') {
      for (let item of this.data) {
        if (item.value !== '--') {
          paramConfig.config[item.field] = item.value;
        }
      }
    }
    return paramConfig;
  }
  changeSelect(item, $event) {
    if (item.children) {
      let list;
      if (this.dataType === 1) {
        list = this.data.function;
      } else if (this.dataType === 2) {
        list = this.data.application;
      }
      // let list = this.data.function;
      this.setChildren(list, item, $event);
    }
  }
  setChildren(list, item?, value?) {
    for (let data of list) {
      if (item) {
        for (let i of item.children) {
          if (data.id === i) {
            if (value === true) {
              data.isDisabled = false;
            } else {
              data.isDisabled = true;
              data.value = '--';
            }
          }
        }
      } else {
        if (data.children) {
          this.setChildren(list, data, data.value);
        }
      }
    }
  }
  // add() {
  //   this.addModal = this.nzModalService.open({
  //     title: '选取应用',
  //     content: AppStoreListComponent,
  //     footer: false,
  //     width: 800,
  //     componentParams: {
  //       multiple: true
  //     }
  //   });
  //   this.addModal.subscribe((res: any) => {
  //     if (res.type === 'save') {
  //       this.util.clearActive(res.data);
  //       this.appList = this.util.replenishConcat(this.appList, res.data, 'bundleId');
  //       this.addModal.destroy();
  //     }
  //   });
  // }
  // del() {
  //   if (this.activatedList.length) {
  //     let list = this.appList;
  //     for (let item of this.activatedList) {
  //       for (let i = 0; i < list.length; i++) {
  //         let data = list[i];
  //         if (item.name === data.name) {
  //           list.splice(i, 1);
  //           i --;
  //         }
  //       }
  //     }
  //     this.appList = this.util.getReplenishArray(list);
  //   } else {
  //     // 请选择要删除的应用
  //   }
  // }
  // outDataChange($event) {
  //   this.activatedList = this.util.findActive($event);
  // }

}
