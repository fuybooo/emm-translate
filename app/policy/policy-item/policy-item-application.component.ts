import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect, options17, options53, options8} from "../policy.model";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorService} from "../../shared/service/validator.service";
import {PolicyService} from "../policy.service";
import {ApplicationListComponent} from "../../shared/component/application-list.component";
import {MessageService} from "../../shared/service/message.service";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-policy-item-application',
  templateUrl: './policy-item-application.component.html',
})
export class PolicyItemApplicationComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  @Input() applicationConfig; // iOS情况下需要的参数
  @Input() mode; // 模式： 1： 单个表格 2：两个表格
  @Input() policyType;
  blackWhiteRadio = 'white'; // white black
  appList = [];
  appBlackList = [];
  appWhiteList = [];
  value = 120;
  // 弹出提示的间隔时间
  options = options8;
  _commonSelect = commonSelect;
  _options17 = options17;
  _options53 = options53;
  supervisedDesc = '（仅限被监督的设备）';
  limitApp = 1;
  addModal;
  appNameForm: FormGroup;
  activatedList = [];
  // data: any[] = [
  //   {
  //     label: '允许使用 iTunes Store',
  //     field: 'allowiTunes'
  //   },
  //   {
  //     label: '允许使用 News',
  //     field: 'allowNews',
  //     isSupervised: true
  //   },
  //   {
  //     label: '允许使用“播客”',
  //     field: 'allowPodcasts',
  //     isSupervised: true
  //   },
  //   {
  //     label: '允许使用 Game Center',
  //     field: 'allowGameCenter',
  //     isSupervised: true,
  //     children: [1, 2],
  //   },
  //   {
  //     label: '允许多人游戏',
  //     field: 'allowMultiplayerGaming',
  //     isSupervised: true,
  //     level: 2,
  //     id: 1
  //   },
  //   {
  //     label: '允许添加 Game Center 朋友',
  //     field: 'allowAddingGameCenterFriends',
  //     level: 2,
  //     id: 2
  //   },
  //   {
  //     label: '允许使用Safari',
  //     field: 'allowSafari',
  //     children: [3, 4, 5, 6, 7],
  //   },
  //   {
  //     label: '启用自动填充',
  //     field: 'safariAllowAutoFill',
  //     level: 2,
  //     id: 3
  //   },
  //   {
  //     label: '强制发出欺诈警告',
  //     field: 'safariForceFraudWarning',
  //     level: 2,
  //     id: 4
  //   },
  //   {
  //     label: '启用JavaScript',
  //     field: 'safariAllowJavaScript',
  //     level: 2,
  //     id: 5
  //   },
  //   {
  //     label: '阻止弹出式窗口',
  //     field: 'safariAllowPopups',
  //     level: 2,
  //     id: 6
  //   },
  //   {
  //     label: '接受Cookie',
  //     field: 'safariAcceptCookies',
  //     level: 2,
  //     id: 7
  //   },
  // ];
  subscript;
  subscript2;

  constructor(public util: UtilService,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private translateService: TranslateService,
              private fb: FormBuilder,
              private validatorService: ValidatorService,
              private policyService: PolicyService) {
  }

  ngOnInit() {
    this.setData();
    if (this.config) {
      if (this.mode === 2 && this.system === 'Android') {
        this.blackWhiteRadio = this.config.config.type;
        if (this.blackWhiteRadio === 'white') {
          this.appWhiteList = $.extend(true, [], this.config.config.appList); // 深拷贝
          this.appBlackList = [];
        } else if (this.blackWhiteRadio === 'black') {
          this.appBlackList = $.extend(true, [], this.config.config.appList);
          this.appWhiteList = [];
        }
      }
      if (this.config.config) {
        this.limitApp = this.config.config.limitApp;
        this.appList = $.extend(true, [], this.config.config.appList);
        this.value = this.config.config.frequency;
      }
    }
    this.appNameForm = this.fb.group({
      newAppName: ['', [Validators.required, Validators.maxLength(100)]]
    });
    this.updateValidator();
    if (this.policyType === 'devPolicy') {
      if (this.type !== 'view') {
        this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
          if (event.type === 1) {
            let data;
            if (this.mode === 1) {
              data = {requiredApp: this.getConfig()};
            } else if (this.mode === 2) {
              data = {appBlackWhiteList: this.getConfig()};
            }
            this.policyService.policyConfigEvent.emit({
              type: 2,
              data: data
            });
          }
        });
      }
    } else if (this.policyType === 'fencing') {
      if (this.type !== 'view') {
        this.subscript2 = this.policyService.policyEnclosureAppEvent.subscribe((res: any) => {
          if (res.type === 1) {
            this.policyService.policyEnclosureAppEvent.emit({
              type: 2,
              data: this.getConfig(),
              isSave: res.isSave
            });
          }
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.addModal) {
      this.addModal.destroy();
    }
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }

  setData() {
    // if (this.mode === 2 && this.system === 'iOS') {
    //   if (this.applicationConfig) {
    //     debugger
    //     for (let item of this.data) {
    //       let v = this.applicationConfig.config[item.field];
    //       if (v === undefined) {
    //         item.value = '--';
    //       } else {
    //         item.value = v;
    //       }
    //     }
    //   } else {
    //     for (let item of this.data) {
    //       item.value = '--';
    //     }
    //   }
    //   this.setChildren(this.data);
    // }
  }

  changeList(value) {
    if (value === 'white') {
      this.appList = this.util.getReplenishArray(this.appWhiteList);
    } else if (value === 'black') {
      this.appList = this.util.getReplenishArray(this.appBlackList);
    }
  }

  updateValidator() {
    let list = this.getAppList();
    this.getFormControl('newAppName').setValidators([Validators.required, Validators.maxLength(100),
      this.validatorService.getIsDupValidator(list, 'name')]);
    this.activatedList = [];
  }

  getAppList() {
    let list = [];
    if (this.mode === 1 || (this.mode === 2 && this.system === 'iOS')) {
      list = this.appList;
    } else {
      if (this.blackWhiteRadio === 'white') {
        list = this.appWhiteList;
      } else if (this.blackWhiteRadio === 'black') {
        list = this.appBlackList;
      }
    }
    return list;
  }

  setAppList(list) {
    if (this.mode === 1 || (this.mode === 2 && this.system === 'iOS')) {
      this.appList = list;
    } else {
      if (this.blackWhiteRadio === 'white') {
        this.appWhiteList = list;
      } else if (this.blackWhiteRadio === 'black') {
        this.appBlackList = list;
      }
    }
  }

  getFormControl(name) {
    return this.appNameForm.controls[name];
  }

  add(titleTpl, contentTpl, footerTpl) {
    let completeAdd = (res, fields) => {
      if (res.type === 'save') {
        let list = this.getAppList();
        this.util.clearActive(res.data);
        list = this.util.replenishConcat(list, res.data, fields);
        this.setAppList(list);
        this.appList = list;
        this.updateValidator();
        this.addModal.destroy();
      }
    };
    if (this.mode === 1) {
      this.addModal = this.nzModalService.open({
        title: '添加必装应用',
        content: ApplicationListComponent,
        footer: false,
        componentParams: {
          system: this.system
        }
      });
      this.addModal.subscribe((res: any) => {
        completeAdd(res, ['id']);
        // if (res.type === 'save') {
        //   let list = this.getAppList();
        //   this.util.clearActive(res.data);
        //   list = this.util.replenishConcat(list, res.data, 'name');
        //   this.setAppList(list);
        //   this.appList = list;
        //   this.updateValidator();
        //   this.addModal.destroy();
        // }
      });
    } else if (this.mode === 2) {
      if (this.system === 'Android') {
        this.addModal = this.nzModalService.open({
          title: titleTpl,
          content: contentTpl,
          footer: footerTpl,
        });
      } else if (this.system === 'iOS') {
        // this.addModal = this.nzModalService.open({
        //   title: '选取应用',
        //   content: AppStoreListComponent,
        //   footer: false,
        //   width: 800,
        //   componentParams: {
        //     multiple: true
        //   }
        // });
        // this.addModal.subscribe((res: any) => {
        //   completeAdd(res, 'bundleId');
        //   // if (res.type === 'save') {
        //   //   let list = this.getAppList();
        //   //   this.util.clearActive(res.data);
        //   //   list = this.util.replenishConcat(list, res.data, 'bundleId');
        //   //   this.setAppList(list);
        //   //   this.appList = list;
        //   //   this.updateValidator();
        //   //   this.addModal.destroy();
        //   // }
        // });
        // 2017-12-27 改为从本地应用商店取
        this.addModal = this.nzModalService.open({
          title: '选取应用',
          content: AppStoreListComponent,
          footer: false,
          componentParams: {
            widthLocalApp: true,
            multiple: true
          }
        });
        this.addModal.subscribe((res: any) => {
          completeAdd(res, ['bundleId']);
          // if (res.type === 'save') {
          //   let list = this.getAppList();
          //   this.util.clearActive(res.data);
          //   list = this.util.replenishConcat(list, res.data, 'name');
          //   this.setAppList(list);
          //   this.appList = list;
          //   this.updateValidator();
          //   this.addModal.destroy();
          // }
        });
      }
    }
  }

  del() {
    if (this.activatedList.length) {
      let list = this.getAppList();
      for (let item of this.activatedList) {
        for (let i = 0; i < list.length; i++) {
          let data = list[i];
          if (item.name === data.name) {
            list.splice(i, 1);
            i--;
          }
        }
      }
      this.appList = this.util.getReplenishArray(list);
      this.updateValidator();
    } else {
      // 请选择要删除的应用
    }
  }

  handleOk() {
    let list = this.getAppList();
    let result = this.util.replenishPush(list, {name: this.getFormControl('newAppName').value}, 'name');
    if (result) {
      list = result;
    }
    this.setAppList(list);
    this.appList = list;
    this.getFormControl('newAppName').reset();
    this.updateValidator();
    this.addModal.destroy();
  }

  outDataChange($event) {
    this.activatedList = this.util.findActive($event);
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: '',
      config: {}
    };
    if (this.mode === 1) {
      paramConfig.feature = this.system === 'Android' ? 'andp006' : 'iosdp006';
    } else if (this.mode === 2) {
      paramConfig.feature = this.system === 'Android' ? 'andp005' : 'iosdp005';
    }
    let fields;
    if (this.system === 'Android') {
      fields = ['id', 'name', 'iconUrl', 'appUrl', 'packageName'];
      // paramConfig.config.frequency = this.value;
      if (this.mode === 2) {
        fields = ['name']; // 此处的应用是用户手填的bundleId
        paramConfig.config.type = this.blackWhiteRadio;
      }
    } else if (this.system === 'iOS') {
      // 必装应用从本地商店取
      fields = ['id', 'name', 'iconUrl', 'appUrl', 'packageName'];
      if (this.mode === 2) {
        // 黑白名单从服务器取
        fields = ['bundleId', 'trackName', 'artworkUrl60', 'trackViewUrl'];
        // fields = ['id', 'name', 'iconUrl', 'appUrl', 'packageName'];
        // paramConfig.config.options = {};
        paramConfig.config.limitApp = this.limitApp;
        // for (let item of this.data) {
        //   if (item.value !== '--' && item.value !== undefined) {
        //     paramConfig.config.options[item.field] = item.value;
        //   }
        // }
      }
    }
    let appList = this.util.getSimpleList(this.getAppList(), ...fields);
    if (appList.length) {
      paramConfig.config.appList = appList;
      paramConfig.config.frequency = this.value;
    }
    return paramConfig;
  }

  changeSelect(item, $event) {
    if (item.children) {
      // this.setChildren(this.data, item, $event);
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
}
