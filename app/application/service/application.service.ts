import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {ApplicationHttpService} from "./application-http.service";

@Injectable()
export class ApplicationService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 15,
    total: 0,

    platform: 1,  // [1|2]//平台
    search: '',
    classId: '',
    publishMode: 1, // [1|2]//正常发布|灰度发布
    isOnline: null, // [true|false]是否上线，不传默认全部状态
    sortName: '', // 排序列
    sortOrder: '', // 升降序
  };

  constructor(private http: ApplicationHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getAppList(Object.assign({}, this.param, _parame));
  }
}
