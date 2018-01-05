import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {ApplicationHttpService} from "./application-http.service";

@Injectable()
export class ApplicationVersionService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    total: 0,

    platform: 1, // [1|2]//平台
    appId: null,
  };

  constructor(private http: ApplicationHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getAppOldVersionList(Object.assign({}, this.param, _parame));
  }
}
