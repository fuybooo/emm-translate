import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorService} from "../../shared/service/validator.service";
import {DataService} from "../../shared/service/data.service";
import {UtilService} from "../../shared/util/util.service";
import {PolicyItem} from "../policy.model";
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyService} from "../policy.service";
import {HttpClient} from "@angular/common/http";
import {NzModalService} from "ng-zorro-antd";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-policy-content-operate',
  templateUrl: './policy-content-operate.component.html',
})
export class PolicyContentOperateComponent implements OnInit, OnDestroy {
  system = 'Android'; // iOS/Android
  operate = 'add'; // add/edit
  levelOptions = [
    {
      label: '--',
      value: ''
    },
    {
      label: '1',
      value: 1
    },
    {
      label: '2',
      value: 2
    },
    {
      label: '3',
      value: 3
    },
    {
      label: '4',
      value: 4
    },
  ];
  step = 0;
  policyObject = {};
  policyExceptionObject = {};
  policyForm: FormGroup;
  policyItem: PolicyItem[] = [];
  currentPolicyItem: PolicyItem;
  policyId;
  policyType;
  configData;
  policyConfig = {};
  transferModal;
  policyPriority = '';
  contentName = '策略';
  policyData;
  isDefaultPolicy = false; // 是否为默认策略
  clickSave = false;
  isShowAll = false;
  subscript;

  constructor(private fb: FormBuilder,
              private validatorService: ValidatorService,
              private translateService: TranslateService,
              private dataService: DataService,
              private util: UtilService,
              private route: ActivatedRoute,
              private router: Router,
              private policyService: PolicyService,
              private http: HttpClient,
              private messageService: MessageService,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.policyConfig = {};
    this.subscribePolicy();
    // this.initPolicyForm();
    this.initPolicyContent();
  }
  initPolicyForm() {
    let extendParam = {};
    if (this.operate === 'edit') {
      extendParam = {id: this.policyId};
    }
    this.policyForm = this.fb.group({
      policyName: ['', [Validators.required, Validators.maxLength(20)],
        [this.validatorService.getSyncValidator(this.dataService.url.policy.check_policy_name, extendParam)]],
      policyDesc: ['', [Validators.required, Validators.maxLength(200)]],
      policyPriority: [''],
    });
  }

  initPolicyContent() {
    // 根据参数显示内容
    let routerParams: any = this.route.snapshot.params;
    this.system = routerParams.system;
    this.operate = routerParams.operate;
    this.policyId = routerParams.id;
    this.policyType = routerParams.policyType;
    this.isShowAll = this.policyService.getIsShowAll(this.policyType, false);
    this.contentName = this.policyService.getPolicyNameByPolicyType(this.policyType);
    // 根据策略类型获取需要配置的项
    this.policyItem = this.policyService.getPolicyItemByPolicyType(this.policyType, this.system);
    this.policyItem[0].isActive = true;
    this.currentPolicyItem = this.policyItem[0];
    if (this.operate === 'edit') {
      // 根据policyId获取策略详情
      this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
        id: this.policyId
      })).subscribe((res: any) => {
        this.policyData = res.data;
        if (this.policyData.policyName === '默认策略') {
          this.isDefaultPolicy = true;
          this.step = 2;
          // 搜集数据判断哪些已配置，哪些未配置
          setTimeout(() => this.changeActive(this.policyItem[0], true), 100);
        } else {
          this.step = 1;
        }
        // 获取所有的配置项
        this.configData = JSON.parse(res.data.config);
        this.initPolicyForm();
        this.setPolicyForm();
      });
    } else if (this.operate === 'add') {
      this.step = 1;
      this.initPolicyForm();
    }
  }
  setPolicyForm() {
    if (!this.isDefaultPolicy) {
      this.getFormControl('policyName').setValue(this.policyData.policyName);
      this.getFormControl('policyDesc').setValue(this.policyData.policyDescribe);
      this.getFormControl('policyPriority').setValue(this.policyData.policyLevel === 5 ? '' : this.policyData.policyLevel);
      this.policyObject = this.policyData.policyObject;
      this.policyExceptionObject = this.policyData.policyExceptionObject;
    }
  }
  subscribePolicy() {
    this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
      if (event.type === 2) {
        Object.assign(this.policyConfig, event.data);
        let length = 0;
        for (let p in this.policyConfig) {
          if (this.policyConfig.hasOwnProperty(p)) {
            length++;
          }
        }
        if (this.policyService.isMatched(this.policyConfig, this.policyItem)) {
          this.changePolicyItem();
          if (this.clickSave) {
            this.clickSave = false;
            // 判断合法的数据是否与应该配置的数据保持一致
            if (this.policyService.isMatched(this.policyConfig, this.util.getCheckedData(this.policyItem))) {
              this.savePolicy();
            } else {
              this.messageService.error('请配置好相关策略再点击保存！');
            }
          }
        }
      }
    });
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  /**
   * 根据配置好的数据将策略项数组更新，如果数据中有配置过的内容，则将其显示为已配置
   */
  changePolicyItem() {
    for (let item of this.policyItem) {
      // 对参数的每一项进行检查，判断该策略项是否已经完成配置
      let itemConfig = this.policyConfig[item.name].config;
      let isChecked = false;
      if (item.name === 'wifi' ||
        item.name === 'vpn' ||
        item.name === 'AddressBookSynchronization' ||
        item.name === 'CalendarConfiguration' ||
        item.name === 'CalendarSubscription' ||
        item.name === 'EmailConfiguration' ||
        item.name === 'ExchangeEmail' ||
        item.name === 'GoogleAccountConfiguration' ||
        item.name === 'LDAPConfiguration' ||
        item.name === 'WebClip' ||
        item.name === 'FontConfiguration' ||
        item.name === 'MacOsServerConfiguration') {
        if (itemConfig.length) {
          isChecked = true;
        }
      } else {
        for (let p in itemConfig) {
          let v = itemConfig[p];
          switch (item.name) {
            // 数据上报 需要判断是否有checkbox是否为选中状态
            case 'dataReport':
              if (p !== 'frequency') {
                if (v) {
                  isChecked = true;
                  break;
                }
              }
              break;
            // 定位策略 需要判断是否开启定位策略
            case 'position':
              if (p === 'enablePosition') {
                if (v) {
                  isChecked = true;
                  break;
                }
              }
              break;
            // 操作系统版
            case 'version':
              isChecked = true;
              break;
            // 应用黑白名单，判断list的长度
            case 'appBlackWhiteList':
              if (this.system === 'Android') {
                if (p === 'appList') {
                  if (v.length) {
                    isChecked = true;
                  }
                  break;
                }
              } else if (this.system === 'iOS') {
                if (p === 'options') {
                  for (let _p in v) {
                    if (v[_p] !== '--') {
                      isChecked = true;
                      break;
                    }
                  }
                }
                if (!isChecked) {
                  if (p === 'appList') {
                    if (v.length) {
                      isChecked = true;
                      break;
                    }
                  }
                }
              }
              break;
            // 只需要判断其中的数组长度是否不为0的项
            // 必装应用
            case 'requiredApp':
            case 'AirPlay':
            case 'AirPrint':
            case 'FieldConfiguration':
            case 'network':
            case 'LockScreenConfiguration':
            case 'fencing':
            case 'HTTPGlobalAgent':
            case 'NotificationConfiguration':
            case 'SSOConfiguration':
              if (v instanceof Array) {
                if (v.length) {
                  isChecked = true;
                  break;
                } else {
                  isChecked = false;
                  break;
                }
              } else if (item.name !== 'requiredApp' && v) {
                isChecked = true;
                break;
              }
              break;
            case 'WebContentFiltering':
              if (p) {
                isChecked = true;
                break;
              }
              break;
            // 安全桌面
            case 'securityDesk':
              if (this.policyType !== 'securityDesk') {
                if (v) {
                  isChecked = true;
                  break;
                }
              } else {
                // 在安全桌面模块，如果存在配置的项，则判断其为已配置
                if (v instanceof Array) {
                  if (v.length) {
                    isChecked = true;
                    break;
                  }
                }
                if (p !== 'useType') {
                  if (typeof v === 'object') {
                    if (!this.util.isEmptyObject(v)) {
                      isChecked = true;
                      break;
                    }
                  } else {
                    if (v) {
                      isChecked = true;
                      break;
                    }
                  }
                }
              }
              break;
            // 单一应用
            case 'simpleDesk':
              if (this.policyType !== 'simpleDesk') {
                if (v) {
                  isChecked = true;
                  break;
                }
              } else {
                // 在单一应用模块，如果存在配置的项，则判断其为已配置
                if (p === 'App') {
                  if (!this.util.isEmptyObject(v)) {
                    isChecked = true;
                    break;
                  }
                }
              }
              break;
            // 功能限制
            case 'function':
              if (v === true || v === false) {
                isChecked = true;
                break;
              }
              break;
            case 'passwordConfig':
              if (v || v === false) {
                isChecked = true;
                break;
              }
              break;
            case 'ApplicationAccessRestriction':
              if (v.AppIdentifierMatches.length || v.AllowRoamingCellularData || v.AllowCellularData) {
                isChecked = true;
                break;
              }
          }
        }
      }
      item.isChecked = isChecked;
    }
  }

  handleCancel() {
    this.back();
  }
  back() {
    // 执行back之后需要保持之前的系统
    this.policyService.initSystem = false;
    if (this.policyType === 'devPolicy') {
      this.router.navigate(['app/policy/device']);
    } else if (this.policyType === 'fencing') {
      this.router.navigate(['app/policy/fencing']);
    } else if (this.policyType === 'devConfig') {
      this.router.navigate(['app/policy/deviceConfig']);
    } else if (this.policyType === 'securityDesk') {
      this.router.navigate(['app/policy/securityDesk']);
    } else if (this.policyType === 'simpleDesk') {
      this.router.navigate(['app/policy/simpleDesk']);
    }
  }

  changeActive(item, isFirst = false) {
    // 滚动条滚动到顶部
    let scrollTop = 0;
    if (this.policyType === 'devConfig' && this.system === 'iOS' && !isFirst) {
      scrollTop = 220;
    }
    $(document).scrollTop(scrollTop);
    this.startCollectData();
    this.util.changeActive(this.policyItem, item);
    this.getCurrentPolicyItem();
  }

  getCurrentPolicyItem() {
    for (let item of this.policyItem) {
      if (item.isActive) {
        this.currentPolicyItem = item;
        break;
      }
    }
  }

  popupSelectObject(type) {
    class Form extends CustomForm {
      labelSm = 0;
      popUp = true;
      items = [
        {
          key: 'name',
          label: '',
          labels: ['group', 'dept', 'deviceGroup'],
          type: 'select-group'
        }
      ];
    }
    let form = new Form();
    let result = {};
    if (type === 1) {
      result = this.policyService.getResByPolicyObject(this.policyObject);
    } else if (type === 2) {
      result = this.policyService.getResByPolicyObject(this.policyExceptionObject);
    }
    form.setData({name: result});
    this.transferModal = this.nzModalService.open({
      title: '选择策略对象',
      content: CustomFormComponent,
      footer: false,
      // width: 756,
      componentParams: {
        options: form
      }
    });
    this.transferModal.subscribe((res: any) => {
      if (res.type === 'save') {
        // 获取到选中的策略对象
        let _tempObject;
        if (type === 1) {
          _tempObject = this.policyService.getPolicyObjectByRes(res.data);
          // this.policyObject = this.policyService.getPolicyObjectByRes(res.data);
          if (this.policyService.isContainSameElement(_tempObject, this.policyExceptionObject)) {
            this.messageService.error('策略对象和策略例外对象不能有相同项！');
          } else {
            this.policyObject = _tempObject;
            this.policyService.policyObjectEvent.emit({
              type: type,
              data: res.data
            });
            this.transferModal.destroy();
          }
        } else if (type === 2) {
          _tempObject = this.policyService.getPolicyObjectByRes(res.data);
          // this.policyExceptionObject = this.policyService.getPolicyObjectByRes(res.data);
          if (this.policyService.isContainSameElement(this.policyObject, _tempObject)) {
            this.messageService.error('策略对象和策略例外对象不能有相同项！');
          } else {
            this.policyExceptionObject = _tempObject;
            this.policyService.policyObjectEvent.emit({
              type: type,
              data: res.data
            });
            this.transferModal.destroy();
          }
        }
      }
    });
  }

  /**
   * 下一步
   */
  submit() {
    if (this.step === 1) {
      // todo 本地调试时不需要验证对象和优先级
      if (this.policyType === 'devPolicy' || this.policyType === 'devConfig' || this.policyType === 'fencing') {
        if (!this.getFormControl('policyPriority').value) {
          this.messageService.error('请选择策略优先级！');
          return;
        }
        if (this.policyService.isEmptyPolicyObject(this.policyObject)) {
          this.messageService.error('请选择策略对象！');
          return;
        }
      }
      if (this.policyForm.valid) {
        this.step = 2;
        // 第一次进入policy item页面时不需要跳转到250px的高度
        setTimeout(() => this.changeActive(this.policyItem[0], true), 10);
        // this.resetHeight();
      } else {
        this.messageService.error('请完善表单！');
        return;
      }
    } else {
      // 执行保存, 搜集数据
      this.clickSave = true;
      this.startCollectData(true);
    }
  }

  startCollectData(isSave = false) {
    this.policyConfig = {};
    this.policyService.policyConfigEvent.emit({type: 1, isSave: isSave});
  }

  /**
   * 保存策略
   */
  savePolicy() {
    // 拼接json数据：
    let params: any = {};
    let url;
    params.policyType = this.policyType;
    params.platformType = this.system;
    if (this.isDefaultPolicy) {
      params.policyName = '默认策略';
      params.policyDescribe = '默认策略';
      params.policyLevel = 5;
      params.policyObject = JSON.stringify({});
      params.policyExceptionObject = JSON.stringify({});
    } else {
      params.policyName = this.getFormControl('policyName').value;
      params.policyDescribe = this.getFormControl('policyDesc').value;
      params.policyLevel = this.getFormControl('policyPriority').value || 5;
      params.policyObject = JSON.stringify(this.policyObject);
      params.policyExceptionObject = JSON.stringify(this.policyExceptionObject);
    }
    params.config = JSON.stringify(this.policyConfig);
    // 需要对设备配置-iOS进行特殊处理：将应用黑白名单中的数据转移到功能限制中去
    if (this.policyType === 'devPolicy' && this.system === 'iOS') {
      let _policyConfig: any = this.policyConfig;
      if (_policyConfig.appBlackWhiteList && _policyConfig.appBlackWhiteList.config) {
        if (_policyConfig.function &&  _policyConfig.function.config) {
          // for (let p in _policyConfig.appBlackWhiteList.config.options) {
          //   if (_policyConfig.appBlackWhiteList.config.options.hasOwnProperty(p)) {
          //     _policyConfig.function.config[p] = _policyConfig.appBlackWhiteList.config.options[p];
          //   }
          // }
          if (_policyConfig.appBlackWhiteList.config.limitApp === 2) {
            _policyConfig.function.config['blacklistedAppBundleIDs'] = _policyConfig.appBlackWhiteList.config.appList;
          } else if (_policyConfig.appBlackWhiteList.config.limitApp === 3) {
            _policyConfig.function.config['whitelistedAppBundleIDs'] = _policyConfig.appBlackWhiteList.config.appList;
          }
        }
        params.config = JSON.stringify(_policyConfig);
      }
    }
    if (this.operate === 'edit') {
      params.id = this.policyData.id;
      url = this.dataService.url.policy.edit_policy_id;
    } else if (this.operate === 'add') {
      params.id = '';
      url = this.dataService.url.policy.add_policy_platform_type;
    }
    this.http.post(url, params).subscribe((res: any) => {
      if (res.code === '200') {
        // 回到内容页面之后，1.显示android或者ios，2显示哪条策略
        if (this.operate === 'edit') {
          this.policyService.currentPolicyId = res.data.id;
        } else if (this.operate === 'add') {
          this.policyService.currentPolicyId = res.data.policyId;
        }
        this.policyService.currentSystem = this.system;
        this.messageService.success('保存成功！');
        this.back();
      } else {
        this.messageService.error('保存失败！');
      }
    });
  }

  getFormControl(name) {
    return this.policyForm.controls[name];
  }
  // resetHeight() {
  //   setTimeout(() => {
  //     let leftHeight = $('.operate-box-content-side').height();
  //     let mainHeight = $('.operate-box-content-main').height();
  //     if (leftHeight < mainHeight) {
  //       $('.operate-box-content-side').height(mainHeight);
  //     }
  //   }, 1000);
  // }
}
