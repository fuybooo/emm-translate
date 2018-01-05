import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({name: 'policyPipe'})
export class PolicyPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, exponent: string): string {
    let _value = '';
    switch (value) {
      case 'se001':
        _value = 'Email';  // 邮件设置
        break;
      case 'se002':
        _value = 'LoginPassWord';
        break;
      case 'se003':
        _value = 'Mobile';
        break;
      case 'se004':
        _value = 'AllowOffline';
        break;
      case 'nw001':
        _value = 'NetWorkWhiteList';
        break;
      case 'nw002':
        _value = 'NetWorkBlackList';
        break;
      case 'andp001':
        _value = 'DataReport';
        break;
      case 'andp002':
        _value = 'Position';
        break;
      case 'andp003':
        _value = 'Version';
        break;
      case 'andp004':
        _value = 'Function';
        break;
      case 'andp005':
        _value = 'ApkBlackWhiteList';
        break;
      case 'andp006':
        _value = 'RequiredApk';
        break;
      case 'andp007':
        _value = 'CellularNetWork';
        break;
      case 'andp008':
        _value = 'SecurityDesktop';
        break;
      case 'iosdp001':
        _value = 'DataReport';
        break;
      case 'iosdp002':
        _value = 'Position';
        break;
      case 'iosdp003':
        _value = 'Version';
        break;
      case 'iosdp004':
        _value = 'Function';
        break;
      case 'iosdp005':
        _value = 'ApkBlackWhiteList';
        break;
      case 'iosdp006':
        _value = 'RequiredApk';
        break;
      case 'iosdp007':
        _value = 'CellularNetWork';
        break;
      case 'iosdp008':
        _value = 'SimpleDesktop';
        break;
      case 'andc001':
        _value = 'DevicePassWord';
        break;
      case 'andc002':
        _value = 'WIFI';
        break;
      case 'iosdc001':
        _value = 'DevicePassWord';
        break;
      case 'iosdc002':
        _value = 'WIFI';
        break;
      case 'iosdc003':
        _value = 'VPN';
        break;
      case 'iosdc004':
        _value = 'AirPrint';
        break;
      case 'iosdc005':
        _value = 'AirPlay';
        break;
      case 'iosdc006':
        _value = 'CalendarSync';
        break;
      case 'iosdc007':
        _value = 'CalendarSubscribe';
        break;
      case 'iosdc008':
        _value = 'AddressSync';
        break;
      case 'iosdc010':
        _value = 'WebClip';
        break;
      case 'iosdc011':
        _value = 'HttpProxy';
        break;
      case 'iosdc012':
        _value = 'AppNetWorkLimit';
        break;
      case 'iosdc013':
        _value = 'LockConfig';
        break;
      case 'iosdc014':
        _value = 'GoogleAccount';
        break;
      case 'iosdc015':
        _value = 'EmailConfig';
        break;
      case 'iosdc016':
        _value = 'ExchangeEmail';
        break;
      case 'iosdc017':
        _value = 'Notify';
        break;
      case 'iosdc018':
        _value = 'SingleAccount';
        break;
      case 'iosdc019':
        _value = 'Domains';
        break;
      case 'iosdc020':
        _value = 'MacOS';
        break;
      case 'iosdc021':
        _value = 'LDAP';
        break;
      case 'iosdc022':
        _value = 'WebFilter';
        break;
      case 'iosdc023':
        _value = 'HomeScreen';
        break;
      case 'anfc001':
        _value = 'AndroidTimeFence';
        break;
      case 'anfc002':
        _value = 'AndroidGeographyFence';
        break;
      case 'anfc003':
        _value = 'AndroidSecurityDesktop';
        break;
      case 'iosfc001':
        _value = 'iOSTimeFence';
        break;
      case 'iosfc002':
        _value = 'iOSGeographyFence';
        break;
      case 'iosfc003':
        _value = 'iOSSecurityDesktop';
        break;
      case 'desk001':
        _value = 'AndroidSecurityDesktop';
        break;
      case 'desk002':
        _value = 'iOSSimpleDesktop';
        break;
      case 'wordurl001':
        _value = 'SensitiveWord';
        break;
      case 'wordurl002':
        _value = 'URL';
        break;
      case 'ClearRestrictionsPassword':
        _value = 'ClearRestrictionsPassword';
        break;
      case 'desktopApk':
        _value = 'desktopApk';
        break;
      case 'DeviceInformation':
        _value = 'DeviceInformation';
        break;
      case 'DeviceLock':
        _value = 'DeviceLock';
        break;
      case 'enableDevice':
        _value = 'enableDevice';
        break;
      case 'eraseData':
        _value = 'eraseData';
        break;
      case 'freezeEMM':
        _value = 'freezeEMM';
        break;
      case 'lockDevice':
        _value = 'lockDevice';
        break;
      case 'payload':
        _value = 'payload';
        break;
      case 'recoveryDevice':
        _value = 'recoveryDevice';
        break;
      case 'revokeDevice':
        _value = 'revokeDevice';
        break;
      case 'UnFreezeEMM':
        _value = 'UnFreezeEMM';
        break;
      case 'unLockDevice':
        _value = 'unLockDevice';
        break;
      case 'ill001':
        _value = 'PassWordErrorIllegal';
        break;
      case 'ill002':
        _value = 'InstallApkIllegal';
        break;
      case 'ill003':
        _value = 'RootIllegal';
        break;
      case 'ill004':
        _value = 'SystemVersionLower';
        break;
      case 'ill005':
        _value = 'CellularDataOut';
        break;
      case 'ill006':
        _value = 'SIMChange';
        break;
      case 'ill007':
        _value = 'UnEnableSecurityDesktop';
        break;
      default:
        return value;
    }
    return this.translateService.instant(_value);
  }
}

@Pipe({name: 'illegalPipe'})
export class IllegalPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, exponent: string): string {
    let _value = '';
    switch (value) {
      case 'ill001':
        _value = 'PassWordErrorIllegal';
        break;
      case 'ill002':
        _value = 'InstallApkIllegal';
        break;
      case 'ill003':
        _value = 'RootIllegal';
        break;
      case 'ill004':
        _value = 'SystemVersionLower';
        break;
      case 'ill005':
        _value = 'CellularDataOut';
        break;
      case 'ill006':
        _value = 'SIMChange';
        break;
      case 'ill007':
        _value = 'UnEnableSecurityDesktop';
        break;
      default:
        return value;
    }
    return this.translateService.instant(_value);
  }
}

@Pipe({name: 'commandStatePipe'})
export class CommandStatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, exponent: string): string {
    let _value = '';
    switch (value) {
      case 'Callback':
        _value = 'Callback';  // 执行成功
        break;
      case 'Send':
        _value = 'Send';  // 已发送
        break;
      case 'Sending':
        _value = 'Sending';  // 已发送
        break;
      default:
        return value;
    }
    return this.translateService.instant(_value);
  }
}

@Pipe({name: 'illegalPolicy'})
export class IllegalPolicy implements PipeTransform {
  constructor(private translateService: TranslateService) {
  }

  transform(value: any, exponent: string): string {
    let values = [];
    // --test
    // value = `{
    //   "alarm":true,"lockAccount":true,"lockDevice":true,"devicePassword":"123","disableContainer":true,
    //   "disableDownloadNewApp":true,"clearEnterpriseData":true,"clearAllData":true,
    //   "function":{
    //     "disableBluetooth":true,"disableWifi":true,"disableCamera":true,"disableClipboard":true,"disableGPS":true,
    //     "disableScreenCapture":true,"disableUSBDebugging":true,"disableRestore":true,"disableModifyNetwork":true}
    // }`;
    // --test
    if (value) {
      let jsonValue = JSON.parse(value);
      for (let pro in jsonValue) {
        if (jsonValue.hasOwnProperty(pro)) {
          let v = jsonValue[pro];
          if (typeof v === 'object') {
            for (let p in v) {
              if (v.hasOwnProperty(p)) {
                let _v = v[p];
                if (_v) {
                  values.push(this.translateService.instant(p));
                }
              }
            }
          } else if (v) {
            if (pro !== 'alarm') {
              values.push(this.translateService.instant(pro));
            }
          }
        }
      }
      values.push(this.translateService.instant('alarm'));
      return values.join(this.translateService.instant('comma'));
    } else {
      return value;
    }
  }
}


