import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {UtilService} from "../shared/util/util.service";
import {PolicyService} from "./policy.service";
import {MessageService} from "../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-violation',
  templateUrl: './policy-violation.component.html',
})
export class PolicyViolationComponent implements OnInit, OnDestroy {
  isView = true;
  data: any[] = [
    {
      label: '密码错误次数违规',
      field: 'passwordErrorCount',
      isActive: true
    },
    {
      label: '安装违规应用',
      field: 'installViolationApp'
    },
    {
      label: 'Root/越狱',
      field: 'rootBreak'
    },
    {
      label: '系统版本低于指定版本',
      field: 'lowerSystemVersion'
    },
    {
      label: '蜂窝移动网路超出',
      field: 'mobileDataExcess'
    },
    {
      label: 'SIM卡更换',
      field: 'changeSIM'
    },
    {
      label: '未启用安全桌面',
      field: 'unableLauncher'
    },
  ];
  currentViolation;
  itemData: any[] = [];
  itemFunctionData: any[] = [];
  violationPolicyId;
  sourceData;
  violationConfig = {};
  subscript;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private policyService: PolicyService,
              private util: UtilService,
              private translateService: TranslateService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.searchList();
    this.subscript = this.policyService.policyViolationEvent.subscribe((res: any) => {
      if (res.type === 2) {
        Object.assign(this.violationConfig, res.data);
        let length = 0;
        for (let p in this.violationConfig) {
          if (this.violationConfig.hasOwnProperty(p)) {
            length++;
          }
        }
        if (this.data.length === length) {
          this.save();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  searchList(sendEvent = false) {
    this.http.get(this.dataService.url.policy.get_policy_type_platform, this.dataService.getWholeParams({
      policyType: 'Illegal',
      platform: 'all',
    })).subscribe((res: any) => {
      if (res.code === '200') {
        this.violationPolicyId = res.data.result[0].id;
        this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
          id: this.violationPolicyId,
        })).subscribe((response: any) => {
          this.sourceData = JSON.parse(response.data.config);
          if (sendEvent) {
            this.policyService.policyViolationContentEvent.emit({
              data: this.sourceData[this.currentViolation.field], field: this.currentViolation.field
            });
          } else {
            this.currentViolation = this.data[0];
          }
        });
      }
    });
  }

  onClickViolationType(data) {
    this.currentViolation = data;
    this.util.changeActive(this.data, data, true);
  }

  onClickSave() {
    // 搜集数据
    this.violationConfig = {};
    this.policyService.policyViolationEvent.emit({type: 1});
  }
  // 取消按钮
  onCancel() {
    this.searchList(true);
    this.isView = true;
  }
  save() {
    let resultConfig = {
      id: this.violationPolicyId,
      policyType: 'Illegal',
      config: ''
    };
    let config = {};
    for (let item of this.data) {
      let configItem = this.violationConfig[item.field];
      if (configItem === false) {
        this.messageService.error('锁定设备后请设置设备密码！');
        this.isView = false;
        return false;
      }
      config[item.field] = this.violationConfig[item.field];
    }
    resultConfig.config = JSON.stringify(config);
    this.http.post(this.dataService.url.policy.edit_policy_id, resultConfig).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.success('保存成功！');
      } else {
        this.messageService.error('保存失败！');
      }
      this.searchList(true);
    });
  }
}
