import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {options11} from "../policy.model";
import {UtilService} from "../../shared/util/util.service";
import {PolicyService} from "../policy.service";
import {NzModalService} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {ApplicationListComponent} from "../../shared/component/application-list.component";
import {MessageService} from "../../shared/service/message.service";
import {ValidatorService} from "../../shared/service/validator.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-launcher',
  templateUrl: './policy-item-launcher.component.html',
})
export class PolicyItemLauncherComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  @Input() policyType;
  launcherId = '';
  options = options11;
  useType = 1;
  password = '';
  showPassword = false;
  selectedAppList = [];
  hiddenAppList = [];
  systemApp: any[] = [
    {
      label: '电话（通讯录）',
      field: 'sysPhone',
    },
    {
      label: '短信',
      field: 'sysMessage'
    }
  ];
  configableApp: any[] = [
    {
      label: '声音',
      field: 'conVoice'
    },
    {
      label: '显示（调节亮度）',
      field: 'conBright'
    },
    {
      label: 'Wifi',
      field: 'conWifi'
    },
    {
      label: '蓝牙',
      field: 'conBluetooth'
    },
    {
      label: 'GPS',
      field: 'conGPS'
    },
    {
      label: '密码设置',
      field: 'conPassword'
    },
    {
      label: '应用程序（管理应用程序进程）',
      field: 'conProgram'
    },
    {
      label: '应用管理器',
      field: 'conManager'
    },
    {
      label: '移动蜂窝数据',
      field: 'conCellular'
    },
    {
      label: '设置状态栏下拉',
      field: 'conStatusBar'
    },
  ];
  launcherList: any[] = [];
  activatedSelectedList = [];
  activatedHiddenList = [];
  isDisableAdd = false;
  addModal;
  isView = true;
  errorMsg = '';
  subscript;
  constructor(
    public util: UtilService,
    private policyService: PolicyService,
    private http: HttpClient,
    private dataService: DataService,
    private nzModalService: NzModalService,
    private validatorService: ValidatorService,
    private translateService: TranslateService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.isView = this.type === 'view' || this.policyType !== 'securityDesk';
    if (this.policyType !== 'securityDesk') {
      this.initList();
      if (this.config && this.config.config.launcherId) {
        this.launcherId = this.config.config.launcherId;
        this.searchLauncher(this.launcherId);
      }
    } else {
      if (this.config) {
        this.initData(this.config.config);
      }
      this.setData(this.config ? this.config.config : false);
    }
    if (this.type !== 'view' && this.system === 'Android') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          if (this.system === 'Android') {
            let config = this.getConfig();
            if (!config.config) {
              if (event.isSave) {
                this.messageService.error('请完善安全桌面信息！');
              }
            } else {
              this.policyService.policyConfigEvent.emit({
                type: 2,
                data: {securityDesk: this.getConfig()}
              });
            }
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
  initData(config) {
    this.useType = config.useType;
    this.password = config.password;
    if (this.useType === 1) {
      if (config.selectedAppList && config.selectedAppList.length === 1) {
        this.isDisableAdd = true;
      }
    }
    this.selectedAppList = this.util.getReplenishArray(config.selectedAppList || []);
    this.hiddenAppList = this.util.getReplenishArray(config.hiddenAppList || []);
  }
  initList() {
    this.http.get(this.dataService.url.policy.get_policy_type_platform, this.dataService.getWholeParams({
      policyType: 'securityDesk',
      platform: 'Android',
    })).subscribe((res: any) => {
      this.launcherList = res.data.result;
      this.launcherList.unshift({
        policyName: '--',
        id: ''
      });
    });
  }
  searchLauncher(value) {
    if (value !== '' && value !== '--') {
      this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
        id: value,
      })).subscribe((response: any) => {
        let res = JSON.parse(response.data.config);
        console.log(res);
        this.initData(res.securityDesk.config);
        this.setData(res.securityDesk.config);
      });
    }
  }
  changePassword($event) {
    if (this.validatorService.regExp.simplePassword.test($event)) {
      this.errorMsg = '';
    } else {
      this.errorMsg = '密码只能输入6位数字！';
    }
  }
  outDataChange(useType, $event) {
    if (useType === 'selected') {
      this.activatedSelectedList = this.util.findActive($event);
    } else if (useType === 'hidden') {
      this.activatedHiddenList = this.util.findActive($event);
    }
  }
  add(useType) {
    this.addModal = this.nzModalService.open({
      title: '添加应用',
      content: ApplicationListComponent,
      footer: false
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        let list = this.getAppList(useType);
        this.util.clearActive(res.data);
        if (this.useType === 1 && res.data.length > 1) {
          this.messageService.error('单一应用模式只能选择一个应用！');
          return;
        }
        // 去重复
        res.data = this.util.removeRepeat(res.data, this.getAppList(useType, false));
        list = this.util.replenishConcat(list, res.data, 'name');
        if (useType === 'selected') {
          if (this.useType === 1) {
            let length = this.util.getUnReplenishArray(list).length;
            if (length > 1) {
              // this.messageService.error('单一应用模式只能选择一个应用！');
              // list = [];
              return;
            } else if (length === 1) {
              this.isDisableAdd = true;
            }
          }
          this.selectedAppList = this.util.getReplenishArray(list);
        } else if (useType === 'hidden') {
          this.hiddenAppList = this.util.getReplenishArray(list);
        }
        this.addModal.destroy();
      }
    });
  }
  del(useType) {
    let activatedList;
    if (useType === 'selected') {
      activatedList = this.activatedSelectedList;
    } else if (useType === 'hidden') {
      activatedList = this.activatedHiddenList;
    }
    if (activatedList.length) {
      let list = this.getAppList(useType);
      for (let item of activatedList) {
        for (let i = 0; i < list.length; i++) {
          let data = list[i];
          if (item.name === data.name) {
            list.splice(i, 1);
            i --;
          }
        }
      }
      if (useType === 'selected') {
        this.selectedAppList = this.util.getReplenishArray(list);
        if (this.useType === 1) {
          if (this.util.getUnReplenishArray(this.selectedAppList).length === 0) {
            this.isDisableAdd = false;
          }
        }
        this.activatedSelectedList = [];
      } else if (useType === 'hidden') {
        this.hiddenAppList = this.util.getReplenishArray(list);
        this.activatedHiddenList = [];
      }
    } else {
      // 请选择要删除的应用
      this.messageService.error('请选择要删除的应用');
    }
  }
  changeUseType() {
    if (this.useType === 1) {
      this.selectedAppList = this.util.getReplenishArray([]);
      this.isDisableAdd = false;
      this.systemApp[0].value = false;
      this.systemApp[1].value = false;
    } else {
      this.isDisableAdd = false;
    }
  }
  getAppList(useType, normal = true) {
    let list;
    if (useType === 'selected') {
      if (normal) {
        list = this.selectedAppList;
      } else {
        list = this.hiddenAppList;
      }
    } else if (useType === 'hidden') {
      if (normal) {
        list = this.hiddenAppList;
      } else {
        list = this.selectedAppList;
      }
    }
    return list;
  }
  setData(config) {
    if (config) {
      for ( let item of this.systemApp) {
        if (config.sys) {
          item.value = config.sys[item.field];
        }
      }
      for ( let item of this.configableApp) {
        if (config.con) {
          item.value = config.con[item.field];
        }
      }
    } else {
      // 设置默认值
      for ( let item of this.systemApp) {
        item.value = false;
      }
      for ( let item of this.configableApp) {
        item.value = false;
      }
    }
  }
  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: '',
      config: {}
    };
    if (this.policyType === 'devPolicy') {
      paramConfig.feature = 'andp008';
      if (this.launcherId) {
        paramConfig.config.launcherId = this.launcherId;
      }
    } else if (this.policyType === 'fencing') {
      paramConfig.feature = 'anfc003';
      if (this.launcherId) {
        paramConfig.config.launcherId = this.launcherId;
      }
    } else if (this.policyType === 'securityDesk') {
      paramConfig.feature = 'desk001';
      paramConfig.config.sys = {};
      paramConfig.config.con = {};
      for (let item of this.systemApp) {
        if (item.value) {
          paramConfig.config.sys[item.field] = item.value;
        }
      }
      for (let item of this.configableApp) {
        if (item.value) {
          paramConfig.config.con[item.field] = item.value;
        }
      }
      paramConfig.config.useType = this.useType;
      paramConfig.config.password = this.password;
      let fields = ['id', 'iconUrl', 'name'];
      paramConfig.config.selectedAppList = this.util.getSimpleList(this.selectedAppList, ...fields);
      paramConfig.config.hiddenAppList = this.util.getSimpleList(this.hiddenAppList, ...fields);
      if (!this.password || this.errorMsg ||
        paramConfig.config.selectedAppList.length === 0) {
        paramConfig.config = false;
      }
    }
    return paramConfig;
  }
}
