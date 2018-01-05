import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

/**
 * 权限服务
 */
@Injectable()
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;
  constructor() { }

  /**
   * 判断用户是否已经登录
   * @returns {Observable<boolean>}
   */
  login(): Observable<boolean> {
    // 模仿访问真实的登录请求 --> 此处返回的是固定的true
    return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  }
  logout(): void {
    this.isLoggedIn = false;
  }
}
