import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {MessageService} from "../../shared/service/message.service";
import {ContentFilesHttpService} from "./content-http.service";
@Injectable()
export class ContentDistributeService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    contentId: null, // 文档id,
    total: 0
  };

  constructor(private filesHttp: ContentFilesHttpService) {
    super();
  }

  getList(_parame = {}) {
    return this.filesHttp.getContentDistList(Object.assign({}, this.param, _parame));
  }

  delete() {
  }
}
