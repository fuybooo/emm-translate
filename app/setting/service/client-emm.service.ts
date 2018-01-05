
import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {SettingHttpService} from "./setting-http.service";

@Injectable()
export class ClientEMMService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    total: 0,

    platform: 1, // 平台
    search: '', // 搜索内容
  };

  constructor(private http: SettingHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getEMMList(Object.assign({}, this.param, _parame));
  }
}
