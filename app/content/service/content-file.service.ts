import {EventEmitter, Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {MessageService} from "../../shared/service/message.service";
import {ContentFilesHttpService} from "./content-http.service";
import {ModalService} from "../../shared/service/modal.service";
@Injectable()
export class ContentFileService extends CustomList {
  // 添加一行
  add = false;
  addEvent = new EventEmitter(true);
  // 参数
  param = {
    page: 1,
    pageSize: 50,
    search: '',
    tagId: '',
    category: 'all', // [all|picture|music|video|other|folder]，类型，默认为all
    sortName: '', // 名称:name，大小:realsize，类型:flag，修改时间:update_time
    sortOrder: '', // asc|desc
    isDelete: false,
    parentId: 1,
    total: 0
  };

  /**
   * 当前显示分发的文档对象
   */
  contentDistribute;

  constructor(private filesHttp: ContentFilesHttpService,
              private modalService: ModalService,
              private messageService: MessageService) {
    super();
  }

  getList(_parame = {}) {
    return this.filesHttp.getContentList(Object.assign({}, this.param, _parame));
  }

  sort(type, order) {
    this.param.sortName = type;
    this.param.sortOrder = order;
    this.initList({isActiveFist: false});
  }

  delete(item?, isHard = false) {
    if (item) {
      this.filesHttp.deleteContent({contentIds: item.id, isHard: isHard}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('已删除:' + item.name);
          let index = this.list.indexOf(item);
          if (index > -1) {
            this.list.splice(index, 1);
            this.param.total--;
          }
          index = this.checkedList.indexOf(item);
          if (index > -1) {
            this.checkedList.splice(index, 1);
          }
        }
      });
    } else {
      if (this.checkedList.length < 1) {
        this.messageService.info('请选择要删除的内容');
      } else {
        let items = this.checkedList;
        let ids = [];
        let names = [];
        for (let i of items) {
          ids.push(i.id);
          names.push(i.name);
        }
        this.modalService.confirmDelete(() => {
          this.filesHttp.deleteContent({contentIds: ids.join(','), isHard: isHard}).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('已删除:' + names.join(','));
              for (let i of items) {
                let index = this.list.indexOf(i);
                this.list.splice(index, 1);
                this.param.total--;
              }
              this.checkedList = [];
            }
          });
        }, '确定要彻底删除所选文件吗？<span class="text-primary">文件彻底删除后将无法恢复。</span>');
      }
    }
  }

  // 还原文档
  restoreContent(item?) {
    if (item) {
      // this.filesHttp.deleteContent({contentId: item.id, isHard: isHard}).subscribe((res: any) => {
      //   if (res.code === '200') {
      //     this.messageService.info('已删除:' + item.name);
      //     let index = this.list.indexOf(item);
      //     if (index > -1) {
      //       this.list.splice(index, 1);
      //       this.param.total--;
      //     }
      //     index = this.checkedList.indexOf(item);
      //     if (index > -1) {
      //       this.checkedList.splice(index, 1);
      //     }
      //   }
      // });
    } else {
      if (this.checkedList.length < 1) {
        this.messageService.info('请选择要还原的文档');
      } else {
        let items = this.checkedList;
        let ids = [];
        let names = [];
        for (let i of items) {
          ids.push(i.id);
          names.push(i.name);
        }
        this.modalService.confirmDelete(() => {
          this.filesHttp.restoreContent({contentId: ids.join(',')}).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('已还原:' + names.join(','));
              for (let i of items) {
                let index = this.list.indexOf(i);
                this.list.splice(index, 1);
                this.param.total--;
              }
              this.checkedList = [];
            } else {
              this.messageService.error("操作失败(未知原因)");
            }
          });
        }, '确定要把所选文件还原吗？');
      }
    }
  }
}
