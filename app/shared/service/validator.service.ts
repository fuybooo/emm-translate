import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {DataService} from "./data.service";
import {UtilService} from "../util/util.service";
/**
 * 验证服务
 */
@Injectable()
export class ValidatorService {
  regExp = {
    simplePassword: /^\d{6}$/,
    email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  };

  /**
   * 非空判断 (空格)
   */
  static required = (control: FormControl): { [s: string]: boolean } => {
    if (typeof control.value === 'string') {
      return control.value.replace(/\s/g, '').length === 0 ? {required: true} : null;
    } else if (control.value instanceof Array) {
      return control.value.length === 0 ? {required: true} : null;
    } else {
      return null;
    }
  }

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private util: UtilService) {
  }

  /**
   * 远程验证表单中的值是否与数据库中的重复
   * @param url
   * @param extend
   * @param field
   * @returns {(control:FormControl)=>any}
   */
  getSyncValidator(url, extend = {}, field = 'value') {
    let _this = this;
    return function (control: FormControl) {
      return Observable.create((observer) => {
        _this.http.get(url, {params: _this.dataService.getParams(Object.assign({
          [field]: control.value.trim() || ''
        }, extend))}).subscribe((res: any) => {
          if (res.code === '200') {
            if (res.data.isExist) {
              // if (!res) {
              observer.next({error: true, duplicated: true});
            } else {
              observer.next(null);
            }
          } else {
            observer.next(null);
          }
          observer.complete();
        });
      });
    };
  }

  /**
   * 验证控件的值是否符合要求
   * @param specialCharacter 特殊字符正则表达式
   * @param mode 如何进行校验
   * true：正则匹配通过则字符串不符合要求 - 例如：验证控件不允许输入特殊字符
   * false：正则匹配不通过则字符串不符合要求 - 例如：验证控件只能输入某些字符
   * @returns {(control:FormControl)=>any}
   */
  getSpecialCharacterValidator(specialCharacter: RegExp, mode = true) {
    return function (control: FormControl) {
      if (control.value && control.value.trim() !== '') {
        if (mode) {
          if (specialCharacter.test(control.value.trim())) {
            return {error: true, specialCharacter: true};
          } else {
            return null;
          }
        } else {
          if (!specialCharacter.test(control.value.trim())) {
            return {error: true, specialCharacter: true};
          } else {
            return null;
          }
        }
      }
    };
  }

  /**
   * 判断控件与本地的list是否重复
   * @param list
   * @param key
   * @returns {(control:FormControl)=>{error: boolean, duplicated: boolean}}
   */
  getIsDupValidator(list, key) {
    return function (control: FormControl) {
      if (control.value && control.value.trim() !== '') {
        // 判断控件是否重复
        for (let item of list) {
          if (control.value === item[key]) {
            return {error: true, duplicated: true};
          }
        }
      }
    };
  }
}
