import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  commonSelect, options26, options36, options40, options41,
  options42, options43, options44, options45, options46,
  options47, options48, options49, options50, options51, options52, options54, options55, options56, options57
} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-vpn',
  templateUrl: './policy-item-vpn.component.html',
})
export class PolicyItemVpnComponent implements OnInit, OnDestroy {
  @Input() system = 'Android';
  @Input() type = 'view';
  @Input() config;
  _options26 = options26;
  _options36 = options36;
  _options40 = options40;
  _options41 = options41;
  _options42 = options42;
  _options43 = options43;
  _options44 = options44;
  _options45 = options45;
  _options46 = options46;
  _options47 = options47;
  _options48 = options48;
  _options49 = options49;
  _options50 = options50;
  _options51 = options51;
  _options52 = options52;
  _options54 = options54;
  _options55 = options55;
  _options56 = options56;
  _options57 = options57;
  _options32 = [
    {
      label: '用于鉴定连接的凭证',
      value: 1
    }
  ];
  forms: FormGroup[];
  data = [];
  subscript;

  constructor(private policyService: PolicyService,
              private fb: FormBuilder,
              private translateService: TranslateService,
              public util: UtilService) {
  }

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
            data: {vpn: this.getFormValue()}
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
    return this.fb.group({
      CalDAVUsername: [],
      CalDAVPassword: [],
      CalDAVUseSSL: [true],
      // 大的下拉框 类型选择
      VPNType: ['L2TP'], // 连接类型 ——
      // 服务器 自动服务器
      ProxyServer: [],
      // 服务器 自动端口
      ProxyServerPort: [],
      ProxyUsername: [],
      IsRemovable: [],
      ProxyPassword: [],
      UserDefinedName: ['', [Validators.required]], // 连接名称 ——
      // 设备鉴定
      AuthenticationMethod: [], // -
      _id_: [1],
      IKEv2: [true],
      // 闲暇时断开连接
      DisconnectOnIdle: [1],
      // 通过VPN发送所有流量
      IPv4: [], // ——
      // 始终打开VPN
      PayloadDescription: [],
      // 局部标识与远程标示  这个与群组名称一个字段
      // LocalIdentifier: [],
      // 服务地址
      RemoteAddress: [''], // _
      // 共享密钥
      SharedSecret: [],
      // 服务器证书签发者通用名称
      ServerCertificateIssuerCommonName: [],
      // 服务器证书通用名称
      ServerCertificateCommonName: [],
      // 失效同层检测速率
      DeadPeerDetectionRate: [],
      // 停用重定向
      DisableRedirect: [],
      // 启用证书撤销检查
      EnableCertificateRevocationCheck: [],
      // 启用完全正向保密
      EnablePFS: [],
      // 停用移动性和多重主目录
      DisableMOBIKE: [],
      // 使用IPv4/IPv6内部子网属性
      UseConfigurationAttributeInternalIPSubnet: [],
      // 密码
      XAuthPassword: [],
      //
      AuthPassword: [],
      // 账户
      XAuthName: [],
      // 通过VPN发送所有流量
      OverridePrimary: [true],
      // L2TP账户
      AuthName: [],
      // L2TP 服务器
      CommRemoteAddress: ['', [Validators.required]],
      // 群组
      VendorConfig: [],
      // 代理设置
      Proxies: [3],
      // 始终打开VPN
      AlwaysOn: [], // ——
      // 为蜂窝移动网络和Wi-Fi使用相同的隧道配置
      Action: [],
      // 允许用户停用自动连接
      UIToggleEnabled: [],
      // 加密算法
      EncryptionAlgorithm: [4],
      // 完整性算法
      IntegrityAlgorithm: [3],
      // Diffie-Hellman 群组
      DiffieHellmanGroup: [5],
      // 累计时间
      LifeTimeInMinutes: [],
      // 启用EAP
      ExtendedAuthEnabled: [],
      // IKE SA参数
      IKESecurityAssociationParameters: [],
      // 子SA参数
      ChildSecurityAssociationParameters: [],
      // 领域
      Realm: [],
      // 角色
      Role: [],
      // 登录群组或域
      LoginGroupOrDomain: [],
      // 群组名称
      LocalIdentifier: [], // _
      _userAppraisalType: [1], // _
      ProxyPACURL: [], // _
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
        this.getFormControl(i, 'CalDAVUsername').setValue(config.CalDAVUsername || null);
        this.getFormControl(i, 'CalDAVPassword').setValue(config.CalDAVPassword || null);
        this.getFormControl(i, 'CalDAVUseSSL').setValue(config.CalDAVUseSSL || true);
        this.getFormControl(i, 'CalDAVPassword').setValue(config.CalDAVPassword || true);
        this.getFormControl(i, 'VPNType').setValue(config.VPNType || 'L2TP');
        // 群组名称
        this.getFormControl(i, 'LocalIdentifier').setValue(config.LocalIdentifier || true);
        // 登录群组或域
        this.getFormControl(i, 'LoginGroupOrDomain').setValue(config.LoginGroupOrDomain || true);
        // 角色
        this.getFormControl(i, 'Role').setValue(config.Role || true);
        // 领域
        this.getFormControl(i, 'Realm').setValue(config.Realm || true);
        // 子SA参数
        this.getFormControl(i, 'ChildSecurityAssociationParameters').setValue(config.ChildSecurityAssociationParameters || true);
        // IKE SA参数
        this.getFormControl(i, 'IKESecurityAssociationParameters').setValue(config.IKESecurityAssociationParameters || true);
        // 启用EAP
        this.getFormControl(i, 'ExtendedAuthEnabled').setValue(config.ExtendedAuthEnabled || true);
        // 累计时间
        this.getFormControl(i, 'LifeTimeInMinutes').setValue(config.LifeTimeInMinutes || true);
        // 服务器 自动服务器
        this.getFormControl(i, 'ProxyServer').setValue(config.ProxyServer || true);
        // 服务器 自动端口
        this.getFormControl(i, 'ProxyServerPort').setValue(config.ProxyServerPort || true);

        this.getFormControl(i, 'ProxyUsername').setValue(config.ProxyUsername || true);
        this.getFormControl(i, 'IsRemovable').setValue(config.IsRemovable || true);
        this.getFormControl(i, 'ProxyPassword').setValue(config.ProxyPassword || true);
        this.getFormControl(i, 'UserDefinedName').setValue(config.UserDefinedName || true);
        // 设备鉴定
        this.getFormControl(i, 'AuthenticationMethod').setValue(config.AuthenticationMethod || true);
        // 固定唯一值
        this.getFormControl(i, '_id_').setValue(config._id_ || true);
        // Diffie-Hellman 群组
        this.getFormControl(i, 'DiffieHellmanGroup').setValue(config.DiffieHellmanGroup || true);
        // 闲暇时断开连接
        this.getFormControl(i, 'DisconnectOnIdle').setValue(config.DisconnectOnIdle || true);
        // 通过VPN发送所有流量
        this.getFormControl(i, 'IPv4').setValue(config.IPv4 || true);
        // 始终打开VPN
        this.getFormControl(i, 'PayloadDescription').setValue(config.PayloadDescription || true);
        // 局部标识与远程标示
        this.getFormControl(i, 'LocalIdentifier').setValue(config.LocalIdentifier || true);
        // 服务地址
        this.getFormControl(i, 'RemoteAddress').setValue(config.RemoteAddress || true);
        // 共享密钥
        this.getFormControl(i, 'SharedSecret').setValue(config.SharedSecret || true);
        // 服务器证书签发者通用名称
        this.getFormControl(i, 'ServerCertificateIssuerCommonName').setValue(config.ServerCertificateIssuerCommonName || true);
        // 服务器证书通用名称
        this.getFormControl(i, 'ServerCertificateCommonName').setValue(config.ServerCertificateCommonName || true);
        // 失效同层检测速率
        this.getFormControl(i, 'DeadPeerDetectionRate').setValue(config.DeadPeerDetectionRate || true);
        // 停用重定向
        this.getFormControl(i, 'DisableRedirect').setValue(config.DisableRedirect || true);
        // 启用证书撤销检查
        this.getFormControl(i, 'EnableCertificateRevocationCheck').setValue(config.EnableCertificateRevocationCheck || true);
        // 启用完全正向保密
        this.getFormControl(i, 'EnablePFS').setValue(config.EnablePFS || true);
        // 停用移动性和多重主目录
        this.getFormControl(i, 'DisableMOBIKE').setValue(config.DisableMOBIKE || true);
        // 使用IPv4/IPv6内部子网属性
        this.getFormControl(i, 'UseConfigurationAttributeInternalIPSubnet').setValue(
          config.UseConfigurationAttributeInternalIPSubnet || true);
        // 密码
        this.getFormControl(i, 'XAuthPassword').setValue(config.XAuthPassword || true);
        // 账户
        this.getFormControl(i, 'XAuthName').setValue(config.XAuthName || true);
        // 通过VPN发送所有流量
        this.getFormControl(i, 'OverridePrimary').setValue(config.OverridePrimary || true);
        // L2TP 服务器
        this.getFormControl(i, 'CommRemoteAddress').setValue(config.CommRemoteAddress || true);
        // L2TP账户
        this.getFormControl(i, 'AuthName').setValue(config.AuthName || true);
        // 群组
        this.getFormControl(i, 'VendorConfig').setValue(config.VendorConfig || true);
        // 代理
        this.getFormControl(i, 'Proxies').setValue(config.Proxies || 3);
        // 始终打开VPN
        this.getFormControl(i, 'AlwaysOn').setValue(config.AlwaysOn || true);
        // 为蜂窝移动网络和Wi-Fi使用相同的隧道配置
        this.getFormControl(i, 'Action').setValue(config.Action || true);
        // 允许用户自动连接
        this.getFormControl(i, 'UIToggleEnabled').setValue(config.UIToggleEnabled || true);
        // 允许用户自动连接
        this.getFormControl(i, 'AuthPassword').setValue(config.AuthPassword || true);
        // 完整性算法
        this.getFormControl(i, 'IntegrityAlgorithm').setValue(config.IntegrityAlgorithm || true);
        // 加密算法
        this.getFormControl(i, 'EncryptionAlgorithm').setValue(config.EncryptionAlgorithm || true);
        // ProxyPACURL
        this.getFormControl(i, 'ProxyPACURL').setValue(config.ProxyPACURL || '');
      }
    }
  }

  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }

  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc003',
      config: []
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i];
      // todo 判断必填项是否已填
      if (form.valid) {
          values.push({
            UserDefinedName: form.value.UserDefinedName,
            CommRemoteAddress: form.value.CommRemoteAddress,
            AuthName: form.value.AuthName,
            ProxyPassword: form.value.ProxyPassword,
            OverridePrimary: form.value.OverridePrimary,
            // AuthenticationMethod: form.value.AuthenticationMethod,
            Proxies: form.value.Proxies,
            // 代理服务器URL
            ProxyPACURL: form.value.ProxyPACURL,
            VPNType: form.value.VPNType,
            DisconnectOnIdle: form.value.DisconnectOnIdle,
          });
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
