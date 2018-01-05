import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {SettingHttpService} from "./setting-http.service";

@Injectable()
export class AdminService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    total: 0,

    sortName: '', // 排序名称
    sortOrder: '', // 排序方式
    role: null, // role:管理员角色//0：超级管理员 1：全局查看管理员 2：部门管理员 3：部门查看管理员
    search: '', // 搜索内容
  };

  constructor(private http: SettingHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getAdminList(Object.assign({}, this.param, _parame));
  }
}
