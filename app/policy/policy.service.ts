import {EventEmitter, Injectable} from "@angular/core";
import {PolicyItem} from "./policy.model";
import {UtilService} from "../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";
@Injectable()
export class PolicyService {
  initSystem = true;
  currentPolicyId = '';
  currentSystem = 'Android';
  currentPolicyType = '';
  policyConfigEvent = new EventEmitter();
  policyEnclosureAppEvent = new EventEmitter();
  policyObjectEvent = new EventEmitter();
  policyViolationEvent = new EventEmitter();
  policyViolationContentEvent = new EventEmitter();
  policySearchListEvent = new EventEmitter();
  constructor(
    private translateService: TranslateService,
    private util: UtilService
  ) {
  }
  /**
   * 通过policyType得到可以配置的policyItem项
   * @param policyType 是后台定义的策略模块的key值
   * @param system
   * @returns {Array}
   */
  getPolicyItemByPolicyType(policyType, system) {
    let policyItems = [];
    // ===========测试所有的项 start
    // policyItems = [
    //   new PolicyItem('数据上报', 'dataReport'),
    //   new PolicyItem('定位策略', 'position'),
    //   new PolicyItem('操作系统版本', 'version'),
    //   new PolicyItem('功能限制', 'function'),
    //   new PolicyItem('应用黑/白名单', 'appBlackWhiteList'),
    //   new PolicyItem('必装应用', 'requiredApp'),
    //   new PolicyItem('蜂窝移动网络', 'network'),
    //   new PolicyItem('安全桌面', 'securityDesk'),
    //   new PolicyItem('单一应用', 'simpleDesk'),
    //   new PolicyItem('围栏', 'fencing'),
    //   new PolicyItem('密码', 'passwordConfig'),
    //   new PolicyItem('WIFI', 'wifi'),
    //   new PolicyItem('VPN', 'vpn'),
    //   new PolicyItem('AirPrint', 'AirPrint'),
    //   new PolicyItem('AirPlay', 'AirPlay'),
    //   new PolicyItem('日历同步', 'CalendarConfiguration'),
    //   new PolicyItem('日历订阅', 'CalendarSubscription'),
    //   new PolicyItem('通讯录同步', 'AddressBookSynchronization'),
    //   new PolicyItem('字体配置', 'FontConfiguration'),
    //   new PolicyItem('Web Clip', 'WebClip'),
    //   new PolicyItem('全局HTTP代理', 'HTTPGlobalAgent'),
    //   new PolicyItem('应用网络限制', 'ApplicationAccessRestriction'),
    //   new PolicyItem('锁屏消息配置', 'LockScreenConfiguration'),
    //   new PolicyItem('Google帐户配置', 'GoogleAccountConfiguration'),
    //   new PolicyItem('邮件配置', 'EmailConfiguration'),
    //   new PolicyItem('Exchange电子邮件配置', 'ExchangeEmail'),
    //   new PolicyItem('通知设置', 'NotificationConfiguration'),
    //   new PolicyItem('单点登录设置', 'SSOConfiguration'),
    //   new PolicyItem('纳管域配置', 'FieldConfiguration'),
    //   new PolicyItem('macOS服务器', 'MacOsServerConfiguration'),
    //   new PolicyItem('LDAP配置', 'LDAPConfiguration'),
    //   new PolicyItem('Web内容过滤', 'WebContentFiltering'),
    //   new PolicyItem('主屏配置', 'MainScreen'),
    // ];
    // ===========测试所有的项 end
    switch (policyType) {
      case 'devPolicy':
        policyItems = [
          new PolicyItem('数据上报', 'dataReport'),
          new PolicyItem('定位策略', 'position'),
          new PolicyItem('操作系统版本', 'version', true),
          new PolicyItem('功能限制', 'function'),
          new PolicyItem('应用黑/白名单', 'appBlackWhiteList'),
          new PolicyItem('必装应用', 'requiredApp'),
          new PolicyItem('蜂窝移动网络', 'network'),
          new PolicyItem(system === 'Android' ? '安全桌面' : '单一应用', system === 'Android' ? 'securityDesk' : 'simpleDesk')
        ];
        break;
      case 'devConfig':
        if (system === 'Android') {
          policyItems = [
            new PolicyItem('密码', 'passwordConfig'),
            new PolicyItem('WIFI', 'wifi'),
          ];
        } else if (system === 'iOS') {
          policyItems = [
            new PolicyItem('密码', 'passwordConfig'),
            new PolicyItem('WIFI', 'wifi'),
            new PolicyItem('VPN', 'vpn'),
            new PolicyItem('AirPrint', 'AirPrint'),
            new PolicyItem('AirPlay', 'AirPlay'),
            new PolicyItem('日历同步', 'CalendarConfiguration'),
            new PolicyItem('日历订阅', 'CalendarSubscription'),
            new PolicyItem('通讯录同步', 'AddressBookSynchronization'),
            new PolicyItem('字体配置', 'FontConfiguration'),
            new PolicyItem('Web Clip', 'WebClip'),
            new PolicyItem('全局HTTP代理', 'HTTPGlobalAgent'),
            new PolicyItem('应用网络限制', 'ApplicationAccessRestriction'),
            new PolicyItem('锁屏消息配置', 'LockScreenConfiguration'),
            new PolicyItem('Google帐户配置', 'GoogleAccountConfiguration'),
            new PolicyItem('邮件配置', 'EmailConfiguration'),
            new PolicyItem('Exchange电子邮件配置', 'ExchangeEmail'),
            new PolicyItem('通知设置', 'NotificationConfiguration'),
            new PolicyItem('单点登录设置', 'SSOConfiguration'),
            new PolicyItem('纳管域配置', 'FieldConfiguration'),
            new PolicyItem('macOS服务器', 'MacOsServerConfiguration'),
            new PolicyItem('LDAP配置', 'LDAPConfiguration'),
            new PolicyItem('Web内容过滤', 'WebContentFiltering'),
            // new PolicyItem('主屏配置', 'MainScreen'),
          ];
        }
        break;
      case 'fencing':
        policyItems = [
          new PolicyItem('围栏', 'fencing'),
          new PolicyItem(system === 'Android' ? '安全桌面' : '单一应用', system === 'Android' ? 'securityDesk' : 'simpleDesk'),
        ];
        break;
      case 'securityDesk':
        policyItems = [
          new PolicyItem('安全桌面', 'securityDesk')
        ];
        break;
      case 'simpleDesk':
        policyItems = [
          new PolicyItem('单一应用', 'simpleDesk')
        ];
        break;
    }
    return policyItems;
  }
  getPolicyNameByPolicyType(policyType, system = 'Android') {
    let contentName;
    if (policyType === 'devPolicy') {
      contentName = '设备策略';
    } else if (policyType === 'devConfig') {
      contentName = '设备配置';
    } else if (policyType === 'fencing') {
      contentName = '围栏策略';
    } else if (policyType === 'securityDesk') {
      contentName = '安全桌面';
    } else if (policyType === 'simpleDesk') {
      contentName = '单一应用';
    } else if (policyType === 'IllegalURL') {
      contentName = '违规网址';
    } else if (policyType === 'sensitiveWord') {
      contentName = '敏感词';
    } else if (policyType === 'security') {
      contentName = '安全策略';
    } else if (policyType === 'Illegal') {
      contentName = '违规策略';
    }
    return contentName;
  }
  getRouteByPolicyType(policyType) {
    let route = '/app/policy/';
    if (policyType === 'devPolicy') {
      route += 'device';
    } else if (policyType === 'devConfig') {
      route += 'deviceConfig';
    } else if (policyType === 'fencing') {
      route += 'fencing';
    } else if (policyType === 'securityDesk') {
      route += 'securityDesk';
    } else if (policyType === 'simpleDesk') {
      route += 'simpleDesk';
    } else if (policyType === 'IllegalURL') {
      route += 'url';
    } else if (policyType === 'sensitiveWord') {
      route += 'sensitiveWord';
    } else if (policyType === 'security') {
      route += 'security';
    } else if (policyType === 'Illegal') {
      route += 'violation';
    }
    return route;
  }
  getIsShowAll(policyType, isDefaultPolicy) {
    let isShowAll = true;
    if (policyType === 'devPolicy') {
      isShowAll = true;
      if (isDefaultPolicy) {
        isShowAll = false;
      }
    } else if (policyType === 'devConfig' || policyType === 'fencing') {
      isShowAll = true;
    } else {
      isShowAll = false;
    }
    return isShowAll;
  }
  isMatched(policyConfig, policyItems) {
    let matchedCount = 0;
    for (let item of policyItems) {
      if (policyConfig[item.name]) {
        matchedCount ++;
      }
    }
    return matchedCount === 0 ? false : matchedCount === policyItems.length;
  }
  getPolicyObjectByRes(res) {
    let policyObject = {
      userGroupObject: [],
      departmentObject: [],
      devGroupObject: [],
    };
    for (let item of res.name.data) {
      if (item.type === 'group') {
        policyObject.userGroupObject.push(item);
      } else if (item.type === 'dept') {
        policyObject.departmentObject.push(item);
      } else if (item.type === 'deviceGroup') {
        policyObject.devGroupObject.push(item);
      }
    }
    return policyObject;
  }
  getResByPolicyObject(policyObject) {
    if (this.util.isEmptyObject(policyObject)) {
      return {};
    }
    let res = {
      groups: [],
      depts: [],
      deviceGroup: [],
      data: []
    };
    if (policyObject.userGroupObject) {
      for (let item of policyObject.userGroupObject) {
        res.groups.push(item);
        // res.data.push(item);
      }
    }
    if (policyObject.departmentObject) {
      for (let item of policyObject.departmentObject) {
        res.depts.push(item);
        // res.data.push(item);
      }
    }
    if (policyObject.devGroupObject) {
      for (let item of policyObject.devGroupObject) {
        res.deviceGroup.push(item);
        // res.data.push(item);
      }
    }
    return res;
  }
  isContainSameElement(policyObject, policyExceptionObject) {
    if (this.util.isEmptyObject(policyObject) || this.util.isEmptyObject(policyExceptionObject)) {
      return false;
    }
    if (this.util.isContainSameElement(
      this.util.getSimpleStringList(policyObject.userGroupObject),
        this.util.getSimpleStringList(policyExceptionObject.userGroupObject)) ||
      this.util.isContainSameElement(this.util.getSimpleStringList(policyObject.departmentObject),
        this.util.getSimpleStringList(policyExceptionObject.departmentObject)) ||
        this.util.isContainSameElement(this.util.getSimpleStringList(policyObject.devGroupObject),
          this.util.getSimpleStringList(policyExceptionObject.devGroupObject))) {
      return true;
    }
    return false;
  }
  isEmptyPolicyObject(policyObject) {
    if (this.util.isEmptyObject(policyObject)) {
      return true;
    } else {
      for (let p in policyObject) {
        if (policyObject[p].length) {
          return false;
        }
      }
      return true;
    }
  }

}
