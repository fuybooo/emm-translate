import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'customFormItemValuePipe'})
export class CustomFormItemValuePipe implements PipeTransform {
  transform(value: any, exponent: any): string {
    let result = value;
    switch (exponent) {
      case 'user-detail-status':
        switch (value) {
          case 0:
            result = `<span class="text-aux">未激活</span>`;
            break;
          case 1:
            result = `<span class="text-green">已激活</span>`;
            break;
          case 5:
            result = `<span class="text-primary-static">管理员锁定</span>`;
            break;
          case 6:
            result = `<span class="text-primary-static">密码输入错误导致的锁定</span>`;
            break;
          case 7:
            result = `<span class="text-warning">停用</span>`;
            break;
        }
        break;
      case 'user-detail-devices':
        if (value) {
          value = JSON.parse(value);
          if (value && value instanceof Array) {
            let devices = value as Array<any>;
            result = '';
            devices.forEach((item: any, index) => {
              if (item.deviceName) {
                result += '<span class="text-primary-static">' + item.deviceName + '</span>';

                if (item.isDevUnactivated) {
                  result += '<i class="icon-allicon-07 ml20"></i>';
                }
                if (item.isDevRecovery) {
                  result += '<i class="icon-allicon-10 ml20"></i>';
                }
                if (item.isDevLogged || item.status === "登录") {
                  result += '<span class="icon-allicon-15 ml20">';
                  result += '<span class="path1"></span><span class="path2"></span>';
                  result += '</span>';
                }
                if (item.isDevLogout) {
                  result += '<span class="icon-allicon-14 ml20">';
                  result += '<span class="path1"></span><span class="path2"></span>';
                  result += '</span>';
                }
                if (item.isDevUnactivated && !item.isDevRecovery && item.isDevOnline === false) {
                  result += '<i class="icon-allicon-09 ml20"></i>';
                }
                if (item.isDevUnactivated && !item.isDevRecovery && item.isDevOnline === true) {
                  result += '<i class="icon-allicon-17 ml20"></i>';
                }
                if (item.isDevLock) {
                  result += '<i class="icon-allicon-13 ml20"></i>';
                }
                if ((index + 1) === devices.length) {
                  result += '';
                } else {
                  result += '<br>';
                }
              }
            });
          }
        }
        break;
      case 'user-detail-group':
        if (value && value instanceof Array) {
          let devices = value as Array<any>;
          result = '';
          devices.forEach((item: any, index) => {
            result += '<span class="text-primary-static">' + item + '</span>';
            if ((index + 1) === devices.length) {
              result += '';
            } else {
              result += '<br>';
            }
          });
        }
        break;
      case 'user-detail-dept':
        if (value && value instanceof Array) {
          let devices = value as Array<any>;
          result = '';
          devices.forEach((item: any) => {
            // result += '<span class="text-primary-static">' + item.replace(/\//g, ' > ') + '</span>';
            item.split('/').forEach((s: any, index) => {
              if (index === 0) {
                result += '';
              } else {
                result += ' > ';
              }
              result += '<span class="text-primary-static">' + s + '</span>';
            });
          });
        }
        break;
    }
    return result;
  }
}
