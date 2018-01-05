import {Component, OnDestroy, OnInit} from "@angular/core";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {PolicySecurityAddIpComponent} from "./policy-security-add-ip.component";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {options1, options2, options3, options4, options5, options6} from "../policy.model";
import {MessageService} from "../../shared/service/message.service";
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-policy-security',
  templateUrl: './policy-security.component.html'
})
export class PolicySecurityComponent implements OnInit, OnDestroy {
  private_version = environment.private_version;
  isViewCommon = true;
  isViewUrl = true;
  selectedEmailTime;
  selectedPwdLength;
  selectedPwdDate;
  selectedPwdMistakeTimes;
  selectedPwdAutoUnlock = 5;
  checkedP1;
  checkedP2;
  checkedP3;
  checkedP4;
  enableAutoUnLock;
  pin;
  password;
  sign;
  fingerprint;
  mobileDateTime;
  quickLoginErrorCount;
  offline;
  // 激活邮件时效
  options1 = options1;
  // 最小密码长度
  options2 = options2;
  // 密码有效期
  options3 = options3;
  // 输入密码错误次数
  options4 = options4;
  // 自动解除锁定时间
  options5 = options5;
  // 输入PIN/手势/指纹时间
  options6 = options6;
  data: any[] = [];
  radioValue = 1;
  black = [];
  white = [];
  sourceData;
  securityPolicyId;

  allChecked = false;
  indeterminate = false;
  popupAddIPModal;
  options = {};

  constructor(private nzModalService: NzModalService,
              private modalService: ModalService,
              private http: HttpClient,
              private dataService: DataService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.initData();
  }

  ngOnDestroy() {
    if (this.popupAddIPModal) {
      this.popupAddIPModal.destroy();
    }
  }

  initData() {
    this.http.get(this.dataService.url.policy.get_policy_type_platform, this.dataService.getWholeParams({
      policyType: 'security',
      platform: 'all',
    })).subscribe((res: any) => {
      this.securityPolicyId = res.data.result[0].id;
      this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
        id: this.securityPolicyId,
      })).subscribe((response: any) => {
        this.sourceData = response;
        let config = JSON.parse(response.data.config);
        this.selectedEmailTime = config.commonPolicy.config.dateTime;
        this.selectedPwdLength = config.passwordPolicy.config.minLength;
        this.checkedP1 = config.passwordPolicy.config.upperCase;
        this.checkedP2 = config.passwordPolicy.config.lowerCase;
        this.checkedP3 = config.passwordPolicy.config.number;
        this.checkedP4 = config.passwordPolicy.config.specialCharacter;
        this.selectedPwdDate = config.passwordPolicy.config.dateTime;
        this.selectedPwdMistakeTimes = config.passwordPolicy.config.errorCount;
        this.enableAutoUnLock = config.passwordPolicy.config.enableAutoUnLock;
        if (this.enableAutoUnLock) {
          this.selectedPwdAutoUnlock = config.passwordPolicy.config.autoUnLock;
        }
        this.pin = config.mobilePolicy.config.pin;
        this.password = config.mobilePolicy.config.password;
        this.sign = config.mobilePolicy.config.sign;
        this.fingerprint = config.mobilePolicy.config.fingerprint;
        this.mobileDateTime = config.mobilePolicy.config.dateTime;
        this.quickLoginErrorCount = config.mobilePolicy.config.quickLoginErrorCount;
        this.offline = config.offlinePolicy.config.offline;
        if (config.blackList && config.blackList.config.length) {
          this.radioValue = 1;
          this.black = config.blackList.config;
          this.data = this.black;
        } else if (config.whiteList && config.whiteList.config.length) {
          this.radioValue = 2;
          this.white = config.whiteList.config;
          this.data = this.white;
        } else {
          this.radioValue = 1;
          this.black = [];
          this.data = this.black;
        }
      });
    });
  }

  switchBlackWhiteList(value) {
    this.data = (value === 1 ? this.black : this.white);
  }

  checkAll(value) {
    this.data.forEach((data: any) => data.isChecked = value);
  }

  refreshStatus() {
    let allChecked = this.data.every((data: any) => data.isChecked);
    let allUnChecked = this.data.every((data: any) => !data.isChecked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  addIp() {
    this.popupAddIPModal = this.nzModalService.open({
      title: '添加IP地址',
      content: PolicySecurityAddIpComponent,
      footer: false, // footer默认为true
      width: 600,
      zIndex: ++this.modalService.modalCount
    });
    this.popupAddIPModal.subscribe(res => {
      if (res.type === 'save') {
        let isRepeat = false;
        for (let i = 0; i < this.data.length; i++) {
          let data_item = this.data[i];
          if (data_item.config === res.item.config) {
            // 提示重复不允许添加
            isRepeat = true;
            this.messageService.error('有重复项！');
            break;
          }
        }
        if (!isRepeat) {
          this.data.push(res.item);
          this.messageService.success('添加成功，请点击保存！');
          this.refreshStatus();
          this.popupAddIPModal.destroy();
        }
      }
    });
  }

  deleteIp(data?) {
    let toBeDeleted = [];
    if (data) {
      toBeDeleted = [data];
    } else {
      toBeDeleted = this.data.filter((item: any) => item.isChecked);
    }
    if (toBeDeleted.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        let data_item = this.data[i];
        for (let j = 0; j < toBeDeleted.length; j++) {
          let del_item = toBeDeleted[j];
          if (del_item.config === data_item.config) {
            this.data.splice(i, 1);
            i--;
          }
        }
      }
      this.refreshStatus();
      this.messageService.success('删除成功，请点击保存！');
    }
  }
  saveCommon() {
    let config = JSON.parse(this.sourceData.data.config);
    let mobilePolicy: any = {
      pin: this.pin,
      password: this.password,
      sign: this.sign,
      fingerprint: this.fingerprint,
      quickLoginErrorCount: this.quickLoginErrorCount,
    };
    if (this.pin || this.password || this.sign) {
      mobilePolicy.dateTime = this.mobileDateTime;
    }
    this.http.post(this.dataService.url.policy.edit_policy_id, {
      id: this.securityPolicyId,
      policyType: 'security',
      config: JSON.stringify({
        commonPolicy: {
          id: config.commonPolicy.id,
          feature: 'se001', // 对应后端邮箱策略
          config: {
            dateTime: this.selectedEmailTime
          }
        },
        passwordPolicy: {
          id: config.passwordPolicy.id,
          feature: 'se002', // 对应后端登录密码策略
          config: {
            minLength: this.selectedPwdLength,
            upperCase: this.checkedP1,
            lowerCase: this.checkedP2,
            number: this.checkedP3,
            specialCharacter: this.checkedP4,
            dateTime: this.selectedPwdDate,
            errorCount: this.selectedPwdMistakeTimes,
            enableAutoUnLock: this.enableAutoUnLock,
            autoUnLock: this.selectedPwdAutoUnlock, // 后台处理时应该先判断enableAutoUnLock是否为true
          }
        },
        mobilePolicy: {
          id: config.mobilePolicy.id,
          feature: 'se003',
          config: mobilePolicy
        },
        offlinePolicy: {
          id: config.offlinePolicy.id,
          feature: 'se004',
          config: {
            offline: this.offline,
          }
        },
      }),
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.success('保存成功！');
      } else {
        this.messageService.error('保存失败！');
      }
    });
  }

  saveNetwork() {
    let config = JSON.parse(this.sourceData.data.config);
    let jsonConfig;
    if (this.radioValue === 1) {
      jsonConfig = {
        blackList: {
          id: config.blackList ? config.blackList.id : '',
          feature: 'nw002',
          config: this.data // data中会有多余的isChecked属性，后台不需要用到此属性
        },
        whiteList: {
          id: config.whiteList ? config.whiteList.id : '',
          feature: 'nw001',
          config: []
        }
      };
    } else if (this.radioValue === 2) {
      jsonConfig = {
        whiteList: {
          id: config.whiteList ? config.whiteList.id : '',
          feature: 'nw001',
          config: this.data
        },
        blackList: {
          id: config.blackList ? config.blackList.id : '',
          feature: 'nw002',
          config: []
        },
      };
    }
    this.http.post(this.dataService.url.policy.edit_policy_id, {
      id: this.securityPolicyId,
      policyType: 'security',
      config: JSON.stringify(jsonConfig),
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.success('保存成功！');
      } else {
        this.messageService.error('保存失败！');
      }
    });
  }

}
