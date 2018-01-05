import {Injectable} from '@angular/core';
@Injectable()
export class PermissionService {
  /**
   * "isAdUser": false, // 是否是AD用户
     "permission": "add_edit100", // add_edit100:超级管理员;add_edit101:全局查看管理员;add_edit102:部门查看管理员;add_edit103:部门管理员;
     "isAdmin": true, // 是否是管理员
     "isPasswordExpired": false // 密码是否过期
   */
  userKey = '__user__';
  user = '__user_detail';
  saveSession(userInfo, user?) {
    if (userInfo.currentIsAdmin === undefined) {
      userInfo.currentIsAdmin = userInfo.isAdmin;
    }
    localStorage.setItem(this.userKey, JSON.stringify(userInfo));
    if (user) {
      localStorage.setItem(this.user, JSON.stringify(user));
    }
    // 忘记当时为何要清除 2017-12-26 ,不能清除,会报错!
    // else {
    //   localStorage.removeItem(this.user);
    // }
  }
  getSession() {
    return JSON.parse(localStorage.getItem(this.userKey));
  }
  getUser() {
    return JSON.parse(localStorage.getItem(this.user));
  }
  clearSession() {
    localStorage.clear();
  }
}

