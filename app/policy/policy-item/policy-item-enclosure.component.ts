import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {options19, options20} from "../policy.model";
import * as moment from 'moment';
import {PolicyService} from "../policy.service";
import {NzModalService} from "ng-zorro-antd";
import {MapGeoEnclosureComponent} from "../../shared/custom-map/map-geo-enclosure.component";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
@Component({
  selector: 'app-policy-item-enclosure',
  templateUrl: './policy-item-enclosure.component.html',
})
export class PolicyItemEnclosureComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  @Input() policyType;
  enclosureType = 1;
  enclosureMode = 1;
  // enclosureCircleType = 1; // 围栏周期类型 1.重复周期 2.时间段
  enclosureTimeType = 1; // 围栏时间类型 1：每天，2：工作日，3：每周（为3时取weekly的值），4：每月（为4时取monthly），5：时间段（为5时取timeSection）
  _options19 = options19;
  _options20 = options20;
  weekly = '';
  weeklyOptions = [
    {
      label: '周一',
      value: 1,
      checked: false
    },
    {
      label: '周二',
      value: 2,
      checked: false
    },
    {
      label: '周三',
      value: 3,
      checked: false
    },
    {
      label: '周四',
      value: 4,
      checked: false
    },
    {
      label: '周五',
      value: 5,
      checked: false
    },
    {
      label: '周六',
      value: 6,
      checked: false
    },
    {
      label: '周日',
      value: 7,
      checked: false
    },
  ];
  selectedDay = '';
  defaultTimeSection = [
    {
      from: moment('2017-11-22 09:30').toDate(),
      to: moment('2017-11-22 19:30').toDate(),
    }
  ];
  displayTimeSection: any[] = [
    {
      from: moment('2017-11-22 09:30').toDate(),
      to: moment('2017-11-22 19:30').toDate(),
    }
  ];
  timeSection = [];
  limitList = [];
  lockContainer;
  disablePhone;
  disableMobileData;
  appInfo;
  geoDesc;
  longitude;
  latitude;
  radius;
  geoEnclosureModal;
  subscript1;
  subscript2;
  enclosureApplicationConfig = {};
  constructor(
    private policyService: PolicyService,
    private nzModalService: NzModalService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.getLimitList();
    this.setData();
    if (this.config) {
      let config: any = this.config.config;
      this.enclosureType = config.enclosureType || 1;
      this.enclosureTimeType = config.enclosureTimeType || 1;
      // if (this.enclosureTimeType !== 5) {
      //   this.enclosureCircleType = 1;
      // } else {
      //   this.enclosureCircleType = 2;
      // }
      this.enclosureMode = config.enclosureMode;
      if (this.enclosureTimeType === 3) {
        this.getOptionsByWeekly(config.weekly);
      } else if (this.enclosureTimeType === 4) {
        this.selectedDay = config.monthly;
      }
      // else if (this.enclosureTimeType === 5) {
      //   this.timeSection = config.timeSection;
      //   // this.displayTimeSection = this.getDisplayByTimeSection(this.timeSection);
      // }
      this.timeSection = config.timeSection;
      this.getDisplayByTimeSection(this.timeSection);
      this.lockContainer = config.function.lockContainer;
      this.disablePhone = config.function.disablePhone;
      this.disableMobileData = config.function.disableMobileData;
      // this.enclosureApplicationConfig = {
      //   appList: config.appList,
      //   frequency: config.frequency
      // };
      // 暂时只支持ios
      if (config.blacklistedAppBundleIDs && config.blacklistedAppBundleIDs.length) {
        this.enclosureApplicationConfig = {config: {
          limitApp: 2,
          appList: config.blacklistedAppBundleIDs
        }};
      } else if (config.whitelistedAppBundleIDs && config.blacklistedAppBundleIDs.length) {
        this.enclosureApplicationConfig = {config: {
          limitApp: 3,
          appList: config.whitelistedAppBundleIDs
        }};
      }
      this.geoDesc = config.geoDesc;
      this.longitude = config.longitude;
      this.latitude = config.latitude;
      this.radius = config.radius;
    }
    if (this.type !== 'view') {
      this.subscript1 = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          if (event.isSave) {
            // 检验时间是否正确
            this.getTimeSectionByDisplay();
            if (!this.validateTimeSection()) {
              this.messageService.error('请填写正确的时间段！');
              return;
            }
          }
          // 发送搜集应用信息的事件
          if (this.system === 'iOS') {
            this.policyService.policyEnclosureAppEvent.emit({type: 1, isSave: event.isSave});
          } else if (this.system === 'Android') {
            // 安卓暂时不做应用黑白名单
            // this.policyService.policyEnclosureAppEvent.emit({type: 1});
            let config = this.getConfig();
            if (config) {
              this.policyService.policyConfigEvent.emit({
                type: 2,
                data: {fencing: this.getConfig()},
                isSave: event.isSave
              });
            } else {
              if (event.isSave) {
                this.messageService.error('请填写完整信息！');
              }
            }
          }
        }
      });
      // if (this.system === 'iOS') {
        this.subscript2 = this.policyService.policyEnclosureAppEvent.subscribe((res: any) => {
          if (res.type === 2) {
            // 搜集到应用信息
            this.appInfo = res.data;
            let config: any = this.getConfig();
            if (config) {
              if (this.system === 'iOS') {
                for (let p in res.data.config.options) {
                  config.config[p] = res.data.config.options[p];
                }
                if (res.data.config.limitApp === 2) {
                  config.config['blacklistedAppBundleIDs'] = res.data.config.appList;
                } else if (res.data.config.limitApp === 3) {
                  config.config['whitelistedAppBundleIDs'] = res.data.config.appList;
                }
              } else if (this.system === 'Android') {
                config.config.appList = res.data.config.appList;
                config.config.frequency = res.data.config.frequency;
              }
              this.policyService.policyConfigEvent.emit({
                type: 2,
                data: {fencing: config}
              });
            } else if (res.isSave) {
              this.messageService.error('请完善围栏信息！');
            }
          }
        });
      // }
    }
  }
  ngOnDestroy() {
    if (this.subscript1) {
      this.subscript1.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }
  getLimitList() {
    if (this.system === 'Android') {
      this.limitList = [
        {
          label: '禁用蓝牙',
          field: 'disableBluetooth'
        },
        {
          label: '禁用Wifi',
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
        }
      ];
    } else if (this.system === 'iOS') {
      this.limitList = [
        {
          label: '禁止修改蓝牙',
          field: 'allowBluetoothModification'
        },
        {
          label: '禁用语音拨号',
          field: 'allowVoiceDialing'
        },
        {
          label: '禁止使用相机',
          field: 'allowCamera'
        },
        {
          label: '禁止屏幕捕捉',
          field: 'allowScreenShot'
        },
        {
          label: '禁止使用safari',
          field: 'allowSafari'
        },
        {
          label: '禁止使用iTunes store',
          field: 'allowiTunes'
        },
        {
          label: '禁止修改墙纸',
          field: 'allowWallpaperModification'
        },
        {
          label: '禁止AppleWatch配对',
          field: 'allowPairedWatch'
        },
        {
          label: '禁止Siri',
          field: 'allowAssistant'
        },
      ];
    }
  }
  setData() {
    if (this.config) {
      for ( let item of this.limitList) {
        if (this.config.config.function) {
          let v = this.config.config.function[item.field];
          // if (v === undefined) {
          //   item.value = false;
          // } else {
          //   item.value = this.system === 'Android' ? !!v : !v;
          // }
          item.value = this.system === 'Android' ? !!v : !v;
        }
      }
    } else {
      // 设置默认值
      for ( let item of this.limitList) {
        item.value = false;
      }
    }
  }
  changeWeeklyOptions() {

  }
  getOptionsByWeekly(weekly) {
    let weeklyArray = weekly.split(',');
    for (let i = 0; i < weeklyArray.length; i++) {
      let item = weeklyArray[i];
      for (let option of this.weeklyOptions) {
        if (option.value === +item) {
          option.checked = true;
          break;
        }
      }
    }
  }
  getWeeklyByOptions () {
    let weekly = '';
    for (let item of this.weeklyOptions) {
      if (item.checked) {
        weekly += item.value + ',';
      }
    }
    return weekly.slice(0, -1);
  }
  getDisplayByTimeSection(timeSection) {
    this.displayTimeSection = [{
      from: moment('2017-11-22 09:30').toDate(),
      to: moment('2017-11-22 19:30').toDate(),
    }];
    if (timeSection) {
      for (let i = 0; i < timeSection.length; i++) {
        let item = timeSection[i];
        this.displayTimeSection[i] = {
          from: moment('2017-11-22 ' + item.from).toDate(),
          to: moment('2017-11-22 ' + item.to).toDate(),
        };
      }
    }
  }
  getTimeSectionByDisplay() {
    this.timeSection = [];
    for (let i = 0; i < this.displayTimeSection.length; i++) {
      let item = this.displayTimeSection[i];
      this.timeSection[i] = {
        from: moment(item.from).format('HH:mm'),
        to: moment(item.to).format('HH:mm')
      };
    }
  }
  addTimeSection() {
    // todo 对时间段进行验证
    this.displayTimeSection.push({
      from: moment('2017-11-22 09:30').toDate(),
      to: moment('2017-11-22 19:30').toDate(),
    });
    this.getTimeSectionByDisplay();
  }
  delTimeSection(i) {
    this.displayTimeSection.splice(i, 1);
    this.getTimeSectionByDisplay();
  }
  validateTimeSection() {
    let timeArray = [];
    this.timeSection.forEach(item => {
      timeArray.push(item.from);
      timeArray.push(item.to);
    });
    let beforeTimeArrayString = timeArray.join('');
    let afterTimeArrayString = timeArray.sort().join(''); // 默认排序方式为正序
    return beforeTimeArrayString === afterTimeArrayString;
  }
  popupGeoEnclosure() {
    this.geoEnclosureModal = this.nzModalService.open({
      title: '选择地理围栏',
      content: MapGeoEnclosureComponent,
      footer: false, // footer默认为true
      width: 1200,
      componentParams: {
        longitude: this.longitude || 116.393578,
        latitude: this.latitude || 39.09437,
        radius: this.radius || 200,
      }
    });
    this.geoEnclosureModal.subscribe((res: any) => {
      if (res.type === 'ok') {
        this.longitude = res.data.longitude;
        this.latitude = res.data.latitude;
        this.radius = res.data.radius;
        this.geoEnclosureModal.destroy();
      }
    });
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: '',
      config: {}
    };
    paramConfig.config.enclosureType = this.enclosureType;
    paramConfig.config.enclosureMode = this.enclosureMode;
    let geoIsSelected = false;
    // 时间围栏
    if (this.enclosureType === 1) {
      paramConfig.feature = this.system === 'Android' ? 'anfc001' : 'iosfc001';
      // if (this.enclosureCircleType === 2) {
      //   this.enclosureTimeType = 5;
      // }
      paramConfig.config.enclosureTimeType = this.enclosureTimeType;
      if (this.enclosureTimeType === 3) {
        paramConfig.config.weekly = this.getWeeklyByOptions();
      } else if (this.enclosureTimeType === 4) {
        paramConfig.config.monthly = this.selectedDay;
      }
      // else if (this.enclosureTimeType === 5) {
      //   paramConfig.config.timeSection = this.getTimeSectionByDisplay();
      // }
      this.getTimeSectionByDisplay();
      paramConfig.config.timeSection = this.timeSection;
    } else if (this.enclosureType === 2) {
      // 地理围栏
      paramConfig.feature = this.system === 'Android' ? 'anfc002' : 'iosfc002';
      paramConfig.config.geoDesc = this.geoDesc;
      paramConfig.config.longitude = this.longitude;
      paramConfig.config.latitude = this.latitude;
      paramConfig.config.radius = this.radius;
      if (this.longitude && this.latitude && this.radius) {
        geoIsSelected = true;
      }
    }
    let hasTrue = false;
    paramConfig.config.function = {};
    for (let item of this.limitList) {
      paramConfig.config.function[item.field] = this.system === 'Android' ? item.value : !item.value;
      if (item.value) {
        hasTrue = true;
      }
    }
    paramConfig.config.function.lockContainer = this.lockContainer;
    paramConfig.config.function.disablePhone = this.disablePhone;
    paramConfig.config.function.disableMobileData = this.disableMobileData;
    if (!hasTrue) {
      if (this.lockContainer || this.disablePhone || this.disableMobileData) {
        hasTrue = true;
      }
    }
    let isValid = true;
    if (this.enclosureType === 1) {
      if (!hasTrue) {
        // 时间围栏必须选择至少一个限制项
        isValid = false;
      }
    } else if (this.enclosureType === 2) {
      if (!hasTrue || !geoIsSelected) {
        // 地理围栏有必填项未填
        isValid = false;
      }
    }
    if (!isValid) {
      return false;
    }
    // if (!isValid) {
    //   // 不合法的数据
    //   paramConfig.config = {};
    // }
    return paramConfig;
  }
  changeEnclosureType(isOpen) {
    // 选择完成时判断
    // if (!isOpen) {
    //   console.log(this.enclosureType);
    // }
  }
}
