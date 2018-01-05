import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'settingAdminType'})
export class SettingAdminType implements PipeTransform {
  transform(value: string, exponent: string): string {
    let result = "管理员";
    switch (value) {
      case '0':
        result = "超级管理员"; break;
      case '2':
        result = "部门管理员"; break;
      case '1':
        result = "全局只读管理员"; break;
      case '3':
        result = "部门只读管理员"; break;
    }
    return result;
  }
}
@Pipe({name: 'settingConnectorState'})
export class SettingConnectorState implements PipeTransform {
  transform(value: string, exponent: string): string {
    let result = `未知`;
    switch (value) {
      case '0':
        result = `<span class="text-green">已连接</span>`; break;
      case '1':
        result = `<span class="text-aux">未连接</span>`; break;
      case '2':
        result = `<span class="text-primary-static">连接断开</span>`; break;
      case '3':
        result = `<span class="text-warning">连接失败</span>`; break;
    }
    return result;
  }
}
/**
 * EＭM　详情　设备型号
 */
@Pipe({name: 'settingEMMModel'})
export class SettingEMMModel implements PipeTransform {
  transform(value: any[], exponent: string): string {
    let result = ``;
    if (value) {
      value.forEach((item: any, index: number) => {
        result += item.model;
        if ((index + 1) === value.length) {
          result += '';
        } else {
          result += ', ';
        }
      });
    }
    return result;
  }
}
