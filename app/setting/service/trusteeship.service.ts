import {EventEmitter, Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {SettingHttpService} from "./setting-http.service";
import {MessageService} from "../../shared/service/message.service";

@Injectable()
export class TrusteeshipService extends CustomList {
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    total: 0,

    status: null,
    search: '', // 搜索内容
  };

  constructor(private http: SettingHttpService, private messageService: MessageService) {
    super();
  }

  getList(_parame = {}) {
    return this.http.getConnectorList(Object.assign({}, this.param, _parame));
  }

  initList(...other) {
    let isActiveFist = true;
    other.forEach((item: any) => {
      if (item) {
        if (item.hasOwnProperty('isActiveFist')) {
          isActiveFist = item['isActiveFist'];
        } else if (item['paramCover'] && item.hasOwnProperty('param')) {
          this.param = {...this._param, ...item.param};
        } else if (item.hasOwnProperty('param')) {
          this.param = {...this.param, ...item.param};
        }
      }
    });
    this.param.page = 1;
    this.isLoading = true;
    // 清空选中项
    this.checkedList = [];
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        if (res.code === '200') {
          if (res.data && res.data.result) {
            this.list = res.data.result;
            this.param.total = res.data.total;
            this.isLoading = false;
            if (isActiveFist && this.list.length > 0) {
              this.active(this.list[0]);
            }
          } else {
            this.list = [];
            this.param.total = 0;
            this.isLoading = false;
            this.active({id: -1});
          }
          this.paramChangeEvent.emit(this.param);
        } else if (res.code === 'CONNTCTORFAIL500001') {
          this.messageService.error('同步系统断线！');
        }
      });
    return e;
  }
}
