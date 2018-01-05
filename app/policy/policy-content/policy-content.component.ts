import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UtilService} from "../../shared/util/util.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {PolicyItem} from "../policy.model";
import {PolicyService} from "../policy.service";
import {ModalService} from "../../shared/service/modal.service";
import {MessageService} from "../../shared/service/message.service";
import {AppSpinService} from "../../shared/service/app-spin.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-content',
  templateUrl: './policy-content.component.html',
})
export class PolicyContentComponent implements OnInit, OnDestroy {
  @Input() system; // 系统平台： Android iOS
  @Input() policyType; // 策略类型： 设备策略：devPolicy；设备配置：devConfig；围栏策略：fencing；安全桌面：securityDesk
  searchWord = '';
  data = [];
  policyItem: PolicyItem[] = [];
  currentPolicy;
  configData;
  contentName;
  popupDeleteModal;
  params = {
    policyType: '',
    platform: '',
    search: '',
    pageNumber: 100,
    pageSize: 1,
  };
  isShowAll = true;
  subscript;

  constructor(private router: Router,
              private util: UtilService,
              private http: HttpClient,
              private dataService: DataService,
              private modalService: ModalService,
              private messageService: MessageService,
              private appSpinService: AppSpinService,
              private translateService: TranslateService,
              private policyService: PolicyService) {
  }

  ngOnInit() {
    this.getPolicyList();
    this.subscript = this.policyService.policySearchListEvent.subscribe(() => {
      // if (this.policyService.currentSystem === this.system) {
      //   this.contentName = this.policyService.getPolicyNameByPolicyType(this.policyType);
      //   // 获取策略列表
      //   this.getPolicyList();
      // }
      this.getPolicyList();
    });
  }

  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  getPolicyList() {
    if (this.policyService.currentSystem === this.system) {
      this.contentName = this.policyService.getPolicyNameByPolicyType(this.policyType);
      this.params.policyType = this.policyType;
      this.params.platform = this.system;
      // 获取列表数据
      this.http.get(this.dataService.url.policy.get_policy_type_platform, this.dataService.getWholeParams(this.params))
        .subscribe((res: any) => {
          // 将默认策略放在第一位
          this.data = this.changeSort(res.data.result);
          // 获取list之后立刻加载策略详情：policyService中的currentPolicyId
          if (this.data.length !== 0) {
            // 如果是从保存策略的地方跳转到此处的则进行查询
            if (this.policyService.currentPolicyId) {
              this.getPolicyInfo(this.policyService.currentPolicyId);
              this.util.findMatchNode(this.data, this.policyService.currentPolicyId).isActive = true;
              // 使用完之后清空该值
              this.policyService.currentPolicyId = '';
            } else {
              this.getPolicyInfo(this.data[0].id);
              this.util.findMatchNode(this.data, this.data[0].id).isActive = true;
            }
          } else {
            this.currentPolicy = null;
            this.appSpinService.spin(false);
          }
        });
    }
  }

  getPolicyInfo(id) {
    this.http.get(this.dataService.url.policy.get_policy_info_id, this.dataService.getWholeParams({
      id: id
    })).subscribe((response: any) => {
      this.currentPolicy = response.data;
      this.isShowAll = this.policyService.getIsShowAll(this.policyType, this.currentPolicy.policyName === '默认策略');
      setTimeout(() => {
        this.policyService.policyObjectEvent.emit({type: 1});
        this.policyService.policyObjectEvent.emit({type: 2});
      }, 0);
      this.configData = JSON.parse(response.data.config);
      // 根据配置项显示策略项的项目头部
      this.policyItem = this.policyService.getPolicyItemByPolicyType(this.policyType, this.system);
      this.appSpinService.spin(false);
    });
  }

  changeSort(list) {
    let _list = [];
    let defaultPolicy = null;
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (item.policyName === '默认策略') {
        defaultPolicy = item;
      } else {
        _list.push(item);
      }
    }
    if (defaultPolicy) {
      _list.unshift(defaultPolicy);
    }
    return _list;
  }

  changeSearchWord() {
    if (this.searchWord === '') {
      this.params.search = '';
      this.getPolicyList();
    }
  }

  switchPolicyStatus() {
    this.http.post(this.dataService.url.policy.enable_disable_policy, {
      id: this.currentPolicy.id,
      action: this.currentPolicy.policyEnable ? 'disable' : 'enable'
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.success('策略' + (this.currentPolicy.policyEnable ? '禁用' : '启用') + '成功！');
        this.getPolicyInfo(this.currentPolicy.id);
      } else {
        this.messageService.error('策略' + (this.currentPolicy.policyEnable ? '禁用' : '启用') + '失败！');
      }
    });
  }

  doSearch() {
    this.params.search = this.searchWord;
    this.getPolicyList();
  }

  refreshStatus() {
  }

  delPolicy() {
    this.popupDeleteModal = this.modalService.popupConfirm('confirm_delete', () => {
      this.http.post(this.dataService.url.policy.delete_policy_platform_type, {id: this.currentPolicy.id})
        .subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('策略删除成功！');
            this.getPolicyList();
          } else if (res.code === 'POLICY700010') {
            this.messageService.error('该策略正在被其他策略使用，不能删除！');
          } else if (res.code === 'POLICY700007') {
            this.messageService.error('该策略正在被使用，不能删除！');
          } else {
            this.messageService.error('策略删除失败！');
          }
        });
    }, '');
  }

  operatePolicy(operate) {
    this.router.navigate(['/app/policy/operate',
      this.system,
      operate,
      this.policyType,
      operate === 'add' ? '-1' : this.currentPolicy.id]); // 添加时id为-1
  }

  onClickPolicyName(data) {
    // 改变列表的激活状态
    this.util.changeActive(this.data, data);
    // 查询当前策略详情
    this.getPolicyInfo(data.id);
  }
}
