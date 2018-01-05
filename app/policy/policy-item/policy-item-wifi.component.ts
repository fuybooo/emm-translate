import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  commonSelect, options36, options37, options38, options39, options44, options45,
  options58
} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-wifi',
  templateUrl: './policy-item-wifi.component.html',
})
export class PolicyItemWifiComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  _options36 = options36;
  _options37 = options37;
  _options38 = options38;
  _options39 = options39;
  _options44 = options44;
  _options45 = options45;
  _options = options58;
  data = [];
  showPassword = false;
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    public util: UtilService,
  ) { }

  ngOnInit() {
    if (this.type === 'view') {
      this.showList();
    }
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {wifi: this.getFormValue()}
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
  showList() {
    if (this.config) {
      this.data = this.config.config;
    }
  }
  getForm() {
    let protocols = [
      {
        label: 'TLS',
        value: 1,
      },
      {
        label: 'LEAP',
        value: 2,
      },
      {
        label: 'EAP-FAST',
        value: 3,
      },
      {
        label: 'EAP-AKA',
        value: 4,
      },
      {
        label: 'TTLS',
        value: 5,
      },
      {
        label: 'PEAP',
        value: 6,
      },
      {
        label: 'EAP-SIM',
        value: 7,
      },
    ];
    return this.fb.group({
      // 服务集标识符（SSID）
      SSID_STR: ['', [Validators.required]],
      // 隐藏的网络
      HIDDEN_NETWORK: [false],
      // 自动加入
      AutoJoin: [true],  // 可信的服务器证书的名称  身份证书  允许两个RADN值  ======
      // 停用强制网络检测
      CaptiveBypass: [],
      // 代理设置
      ProxyType: [1],
      // 代理设置 自动 服务器
      ProxyServer: [],
      // 代理设置 自动 端口
      ProxyServerPort: [],
      // 用户名
      ProxyUsername: [],
      // 用户密码  =============
      ProxyPassword: [],
      // 代理服务器URL
      ProxyPACURL: [],
      // 如果PAC无法连通，则允许直接连接
      ProxyPACFallbackAllowed: [],
      // 安全性类型
      EncryptionType: [1],
      // WEB页面 密码 这个密码与用户的那个密码  傻傻分不清楚  ===========
      Password: [],
      // 协议与信任默认选1
      protocolTrust: [1],
      //
      TLS: [true],  // 后台传的数据是：13
      LEAP: [],  // 后台传的数据是：17
      EAP_FAST: [],  // 后台传的数据是：43
      EAP_AKA: [],  // 后台传的数据是：23
      TTLS: [],  // 后台传的数据是：21
      PEAP: [],  // 后台传的数据是：25
      EAP_SIM: [],  // 后台传的数据是：18
      // 网络类型 内部鉴定 ========================
      IsHotspot: [true],
      // Fast Lane QoS标记
      isQoS: [1],
      // 身份证书key没有找到 暂时使用id进行默认值选择且是不可编辑的
      _id_: [1],
      // 用户密码  =============
      UserPassword: [],
      // 使用单次连接密码
      OneTimeUserPassword: [],
      // 外部身份
      OuterIdentity: [],
      // NAI 领域名称   表格的key
      NAIRealmNames: [],
      // 漫游联盟 OI   表格的key
      RoamingConsortiumOIs: [],
      // 连接到漫游方网络
      ServiceProviderRoamingEnabled: [],
      // 域名
      DomainName: [],
      // 服务商显示名称
      DisplayedOperatorName: [],
    });
  }
  setForm() {
    this.forms = [this.getForm()];
    if (this.config) {
      let configs = this.config.config;
      if (configs.length !== 0) {
        this.forms = [];
      }
      for (let i = 0; i < configs.length; i++) {
        this.forms.push(this.getForm());
        let config = configs[i];
        // 服务商显示名称
        this.getFormControl(i, 'DisplayedOperatorName').setValue(config.DisplayedOperatorName || null);
        // 域名
        this.getFormControl(i, 'DomainName').setValue(config.DomainName || null);
        // 连接到漫游方网络
        this.getFormControl(i, 'ServiceProviderRoamingEnabled').setValue(config.ServiceProviderRoamingEnabled || null);
        // 漫游联盟 OI
        this.getFormControl(i, 'RoamingConsortiumOIs').setValue(config.RoamingConsortiumOIs || null);
        // NAI 领域名称
        this.getFormControl(i, 'NAIRealmNames').setValue(config.NAIRealmNames || null);
        // 外部身份
        this.getFormControl(i, 'OuterIdentity').setValue(config.OuterIdentity || null);
        // 使用单次连接密码
        this.getFormControl(i, 'OneTimeUserPassword').setValue(config.OneTimeUserPassword || null);
        // 服务集标识符（SSID）
        this.getFormControl(i, 'SSID_STR').setValue(config.SSID_STR || null);
        // 隐藏的网络
        this.getFormControl(i, 'HIDDEN_NETWORK').setValue(config.HIDDEN_NETWORK || null);
        // 自动加入
        this.getFormControl(i, 'AutoJoin').setValue(config.AutoJoin || null);
        // 停用强制网络检测
        this.getFormControl(i, 'CaptiveBypass').setValue(config.CaptiveBypass || null);
        // 代理设置
        this.getFormControl(i, 'ProxyType').setValue(config.ProxyType || null);
        // 代理设置 自动 服务器
        this.getFormControl(i, 'ProxyServer').setValue(config.ProxyServer || null);
        // 代理设置 自动 端口
        this.getFormControl(i, 'ProxyServerPort').setValue(config.ProxyServerPort || null);
        // 代理设置 自动 用户名
        this.getFormControl(i, 'ProxyUsername').setValue(config.ProxyUsername || null);
        // 代理设置 自动 密码
        this.getFormControl(i, 'ProxyPassword').setValue(config.ProxyPassword || null);
        // 代理服务器URL
        this.getFormControl(i, 'ProxyPACURL').setValue(config.ProxyPACURL || null);
        // 如果PAC无法连通，则允许直接连接
        this.getFormControl(i, 'ProxyPACFallbackAllowed').setValue(config.ProxyPACFallbackAllowed || null);
        // 安全性类型
        this.getFormControl(i, 'EncryptionType').setValue(config.EncryptionType || 1);
        // 密码
        this.getFormControl(i, 'Password').setValue(config.Password || true);
        // 多选框的那7项
        this.getFormControl(i, 'TLS').setValue(config.TLS || null);
        this.getFormControl(i, 'LEAP').setValue(config.LEAP || null);
        this.getFormControl(i, 'EAP_FAST').setValue(config.EAP_FAST || null);
        this.getFormControl(i, 'EAP_AKA').setValue(config.EAP_AKA || null);
        this.getFormControl(i, 'TTLS').setValue(config.TTLS || null);
        this.getFormControl(i, 'PEAP').setValue(config.PEAP || true);
        this.getFormControl(i, 'EAP_SIM').setValue(config.EAP_SIM || true);
        //
        this.getFormControl(i, 'IsHotspot').setValue(config.IsHotspot || true);
        // Fast Lane QoS标记
        this.getFormControl(i, 'isQoS').setValue(config.isQoS || true);
        // 身份证书 暂时使用——id—— 没找到相应的字段
        this.getFormControl(i, '_id_').setValue(config._id_ || true);
        this.getFormControl(i, 'UserPassword').setValue(config.UserPassword || true);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: this.system === 'Android' ? 'andc002' : 'iosdc002',
      config: {}
    };
    let values = [];
    for (let form of this.forms) {
      if (form.valid) {
        if (form.value.SSID_STR) {
          values.push({
            SSID_STR: form.value.SSID_STR,
            HIDDEN_NETWORK: form.value.HIDDEN_NETWORK,
            AutoJoin: form.value.AutoJoin,
            EncryptionType: form.value.EncryptionType,
            ProxyUsername: form.value.ProxyUsername,
            ProxyPassword: form.value.ProxyPassword,
          });
        }
      }
    }
    paramConfig.config = values;
    return paramConfig;
  }
  add() {
    this.forms.push(this.getForm());
  }
  del(i) {
    this.forms.splice(i, 1);
  }
}
