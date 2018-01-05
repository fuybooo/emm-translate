import {EventEmitter, Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {PushHttpService} from "./push-http.service";

@Injectable()
export class PushService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    pushStatue: '',  // 推送状态 all:全部 ，pushed：已经推送，nopush：未推送
    searchPush: '',  // 查询内容
    total: 0
  };
  // 文件路径
  breadcrumb;

  constructor(private http: PushHttpService) {
    super();
  }

  nextPage() {
    if (this.list.length < this.param.total) {
      this.param.page++;
      this.getList()
        .subscribe((res: any) => {
          if (res.data && res.data.list) {
            this.list = this.list.concat(res.data.list);
            this.param.total = res.data.total;
          }
        });
    }
  }

  initList(...other) {
    this.param.page = 1;
    this.isLoading = true;
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        if (res.data && res.data.list) {
          this.list = res.data.list;
          this.param.total = res.data.total;
          this.isLoading = false;
        } else {
          this.list = [];
          this.param.total = 0;
          this.isLoading = false;
        }
      });
    return e;
  }

  getList(_parame = {}) {
    return this.http.getPushList(Object.assign({}, this.param, _parame));
  }
}
