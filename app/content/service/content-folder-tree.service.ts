import {EventEmitter, Injectable} from '@angular/core';
import {CustomList, CustomListTree} from "../../shared/custom-list/custom-list";
import {MessageService} from "../../shared/service/message.service";
import {ContentFilesHttpService} from "./content-http.service";
import {ModalService} from "../../shared/service/modal.service";
import {UtilService} from "../../shared/util/util.service";
@Injectable()
export class ContentFolderTreeService extends CustomListTree {
  // 添加一行
  add = false;
  addEvent = new EventEmitter(true);
  // 参数
  param = {
    page: 1,
    pageSize: 5000,
    search: '',
    tagId: '',
    category: 'folder', // [all|picture|music|video|other|folder]，类型，默认为all
    excludeIds: null,
    isDelete: false,
    parentId: null,
    total: 0
  };
  // 文件路径
  breadcrumb;

  constructor(private filesHttp: ContentFilesHttpService,
              private modalService: ModalService,
              private util: UtilService,
              private messageService: MessageService) {
    super();
  }

  getList(_parame = {}) {
    return this.filesHttp.getContentList(Object.assign({}, this.param, _parame));
  }
  delete() {}
  initList(...other) {
    this.isLoading = true;
    this.param.page = 1;
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        this.list = [];
        this.list = this.list.concat(res.data.result);
        this.list = this.util.convertListToTree(this.list);
        this.list.forEach(item => {
          if (item.id === 1) {
            this.expandDataCache[item.id] = this.util.convertTreeToList(item);
          }
        });
        this.param.total = res.data.total || this.param.total;
        this.param.page = res.data.page || this.param.page;
        this.param.total = res.total || this.param.total;
        this.isLoading = false;
      });
    return e;
  }
  // 展开 array:expandDataCache[data.id]
  collapse(array: any[], data, $event) {
    this.util.collapse(array, data, $event);
  }
}
