import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContentFileService} from "../../content.service";
import {ContentFilesHttpService} from "../../service/content-http.service";
import {ContentBreadcrumbService} from "../../content.service";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../../shared/service/modal.service";
import {CustomFormComponent} from "../../../shared/custom-form/custom-form.component";
import {CustomForm} from "../../../shared/custom-form/custom-form";
import {FormControl, Validators} from "@angular/forms";
import {MessageService} from "../../../shared/service/message.service";
import {ContentTagDocFormService} from "../../service/content-tag-doc-form.service";
import {ValidatorService} from "../../../shared/service/validator.service";

@Component({
  selector: 'app-content-all-files-table',
  templateUrl: './content-all-files-table.component.html',
})
export class ContentAllFilesTableComponent implements OnInit {
  modal;
  @Output()
  distribute = new EventEmitter(true);
  // table的配置参数
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.files.nextPage();
      }
    }
  };
  // 全选
  allIsChecked = false;

  constructor(public files: ContentFileService,
              private filesHttp: ContentFilesHttpService,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private modalService: ModalService,
              public breadcrumb: ContentBreadcrumbService,
              private http: ContentFilesHttpService) {
  }

  ngOnInit() {
    this.breadcrumb.toTargetEvent.subscribe((item) => {
      if (item.param) {
        this.files.param = item.param;
      } else if (item.id) {
        this.files.param.parentId = item.id;
      } else {
        this.files.param.parentId = 1;
      }
      this.files.initList({isActiveFist: false});
    });
  }

  distributeClick(item) {
    this.distribute.emit(item);
    this.files.contentDistribute = item;
  }

  delete(item) {
    this.modalService.confirmDelete(() => {
      this.filesHttp.deleteContent({contentIds: item.id}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('已将：' + item.name + '丢弃到了回收站！');
          let index = this.files.list.indexOf(item);
          if (index > -1) {
            this.files.list.splice(index, 1);
            this.files.param.total--;
          }
          // index = this.files.checkedList.indexOf(item);
          // if (index > -1) {
          //   this.files.checkedList.splice(index, 1);
          // }
        } else {
          this.messageService.error("操作失败(未知原因)");
        }
      });
    }, '确定要将：<span class="text-primary">' + item.name + '</span>丢弃到回收站吗?' + '<p>删除的文件可在30天内通过回收站还原。</p>');
  }

  /**
   * 全选
   */
  refreshStatus() {
  }

  /**
   * 收藏
   */
  starPermission(item) {
    if (item.collect) {
      // 取消收藏
      this.http.removeCollect({contentId: item.id}).subscribe((res: any) => {
        if (res.code === "200") {
          item.collect = false;
        }
      });
    } else {
      // 添加收藏
      this.http.addCollect({contentId: item.id}).subscribe((res: any) => {
        if (res.code === "200") {
          item.collect = true;
        }
      });
    }
  }

  /**
   * tr => td => name => click
   */
  itemNameClick(item) {
    if (item.flag === 'folder') {
      this.files.param.parentId = item.id;
      this.breadcrumb.add({label: item.name, param: {...this.files.param}, id: item.id});
      this.files.initList({isActiveFist: false});
    }
  }

  /**
   * 重命名
   */
  renameItem(item) {
    this.modal = this.nzModalService.open({
      title: '重命名: ' + item.name,
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new CustomForm(null,
          [
            {
              key: 'name',
              label: '名称',
              required: true,
              value: item.name,
              validator: [
                ValidatorService.required,
                Validators.maxLength(30),
              ],
              otherValidator: [
                // (control: FormControl): any => {
                //   let _this_ = this;
                //   return Observable.create((observer) => {
                //     observer.next({warning: true, nameAsyncValidator: true});
                //     observer.complete();
                //     _this_.http.post(
                //       _this_.dataService.url.user.checkGroupName,
                //       {group_name: control.value, group_id: _this_.itemIsActive.id}
                //     ).subscribe((res: any) => {
                //       if (res.data.isExist) {
                //         observer.next({error: true, nameAsyncValidator: true});
                //       } else {
                //         observer.next(null);
                //       }
                //       observer.complete();
                //     });
                //   });
                // }
              ],
              explains: [
                {
                  validate: function (v) {
                    return v.dirty && v.hasError('required');
                  },
                  desc: '名称不能为空',
                }, {
                  validate: function (v) {
                    return v.dirty && v.hasError('maxlength');
                  },
                  desc: '名称不能超过30个字',
                }, {
                  validate: function (v) {
                    return v.dirty && v.hasError('nameAsyncValidator');
                  },
                  desc: '名称已存在，请重新输入（否则点击保存之后系统将为您重命名）',
                }
              ],
            }
          ],
          {
            labelSm: 4,
            popUp: true
          }
        )
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.editContent({
          contentId: item.id, // 文档id,
          fileName: result.data.name, // 新文件名
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.files.initList({isActiveFist: false});
            this.modal.destroy();
            // item.name = result.data.name;
          } else {
            this.messageService.error("重命名失败！");
          }
        });
      }
    });
  }

  /**
   * 编辑书签
   */
  editItemTags(item) {
    let values = [];
    let options_ = [];
    item.tags.forEach((i: any) => {
      values.push(i.id);
      options_.push({
        label: i.tagName, value: i.id
      });
    });
    let ser = new ContentTagDocFormService(this.http);
    ser.items[0].options = options_;
    ser.items[0].value = values;
    this.modal = this.nzModalService.open({
      title: '书签： ' + item.name,
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: ser
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.attachTag({
          contentId: item.id, // 文档id,
          tagIds: result.data.tagIds.join(','), // 新文件名
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.http.getContentTags({contentId: item.id}).subscribe((ta: any) => {
              if (ta.code === '200') {
                item.tags = ta.data.result;
              }
            });
          } else {
            this.messageService.error("书签编辑失败！");
          }
        });
      }
    });
  }
}
