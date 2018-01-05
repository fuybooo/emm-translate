import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {ApplicationHttpService} from "./application-http.service";

@Injectable()
export class ApplicationClassService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    total: 0,

    search: '', // 搜索关键字
  };

  constructor(private http: ApplicationHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getAppClassList(Object.assign({}, this.param, _parame));
  }
}
