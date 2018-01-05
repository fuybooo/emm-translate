import {Component, OnDestroy, OnInit} from "@angular/core";
import {ContentFileService, ContentFilesHttpService, ContentTagService} from "./content.service";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../shared/service/modal.service";
import {ContentTagsAllComponent} from "./component/common/content-tags-all.component";
import {CustomFormComponent} from "../shared/custom-form/custom-form.component";
import {ContentFileFormService} from "./service/content-file-form.service";
import {DataService} from "../shared/service/data.service";
import {CustomForm} from "../shared/custom-form/custom-form";
import {MessageService} from "../shared/service/message.service";
import {ContentDistributeService} from "./service/content-distribute.service";
import {ContentFolderTreeComponent} from "./component/common/content-folder-tree.component";
import {ContentBreadcrumbService} from "./content.service";
import {ContentTagFormService} from "./service/content-tag-form.service";
import {ContentFolderTreeService} from "./service/content-folder-tree.service";
import {FormControl, Validators} from "@angular/forms";
import {ValidatorService} from "../shared/service/validator.service";
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  providers: [
    ContentBreadcrumbService,
    ContentFileService,
    ContentFileFormService,
    ContentTagService,
    ContentDistributeService,
    ContentTagFormService,
    ContentFolderTreeService,
  ]
})
export class ContentComponent implements OnInit, OnDestroy {
  /* 文件类型 */
  type = 'AllFiles';
  /* popups */
  modal;

  constructor(public files: ContentFileService,
              public http: ContentFilesHttpService,
              public tags: ContentTagService,
              public breadcrumb: ContentBreadcrumbService,
              private modalService: ModalService,
              private distributes: ContentDistributeService,
              private messages: MessageService,
              private dataService: DataService,
              private nzModalService: NzModalService) {
    this.files.initList({isActiveFist: false});
    this.tags.initList({isActiveFist: false});
    this.breadcrumb.add({label: '全部文件', id: 1});
  }

  ngOnInit() {
    // tags 多选
    // this.tags.checkedEvent.subscribe((data) => {
    //   let tagIds = [];
    //   data.forEach((item) => {
    //     tagIds.push(item.id);
    //   });
    //   this.files.param.tagId = tagIds.join(',');
    // });
    this.tags.itemActiveEvent.subscribe((data) => {
        let tagId = null;
        if (data && data.id) {
          tagId = data.id;
        }
        this.files.param.tagId = tagId;
        this.files.initList({isActiveFist: false});
      });
  }

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
  }

  /**
   * 书签管理
   */
  addTag() {
    this.modal = this.nzModalService.open({
      title: '标签管理',
      content: ContentTagsAllComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        files: this.files,
        tags: this.tags
      },
      zIndex: ++this.modalService.modalCount
    });
  }

  /**
   * 全文搜索
   * @param search
   */
  doSearch(search) {
    this.files.param.search = search;
    this.files.initList({isActiveFist: false});
  }

  /**
   * 新建文件夹
   */
  newFolder() {
    this.modal = this.nzModalService.open({
      title: '新建文件夹',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new CustomForm(null,
          [
            {
              key: 'name',
              label: '文件夹名称',
              validator: [ValidatorService.required, Validators.maxLength(70)],
              explains: [
                {
                  validate: function (item) {
                    return item.dirty && item.hasError('required');
                  },
                  desc: '文件夹名称不能为空',
                }, {
                  validate: (o) => {
                    return o.dirty && o.hasError('maxlength');
                  },
                  desc: "文件夹名称最多不超过70个字",
                },
              ]
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
        this.http.addContent({
          contentType: 'folder',
          parentId: this.breadcrumb.curr.id || null,
          folderName: result.data.name
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.files.initList({isActiveFist: false});
          }
        });
      }
    });
  }
  /**
   * 上传文件
   */
  uploadFile() {
    // this.modal = this.nzModalService.open({
    //   title: '上传',
    //   content: ContentUploadFilesComponent,
    //   footer: false, // footer默认为true
    //   width: 600,
    //   componentParams: {
    //     xx: ''
    //   },
    //   zIndex: ++this.modalService.modalCount
    // });
    // this.modal.subscribe((result) => {
    //   if (result.type === 'save') {
    //     this.http.addContent({...result.data, contentType: 'file', parentId: null}).subscribe((res: any) => {
    //       if (res.code === '200') {
    //         this.modal.destroy();
    //       }
    //     });
    //   }
    // });
    /**************************************************/
    let service = new ContentFileFormService(this.dataService, this.messages, this.http);
    service.popUp = true;
    this.modal = this.nzModalService.open({
      title: '上传文件',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        let data = {
          contentType: 'file',
          parentId: this.breadcrumb.curr.id,
          contentNames: service.contentNames.join(','),
          localNames: service.localNames.join(','),
          userIds: result.data.distribution.userIds.join(','),
          userGroupIds: result.data.distribution.groupIds.join(','),
          depIds: result.data.distribution.deptIds.join(','),
          tagIds: result.data.tagIds.join(','),
          isEncrypt: result.data.isEncrypt,
          isPermission: result.data.isPermission,
        };
        this.http.addContent(data).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.files.initList({isActiveFist: false});
          }
        });
      }
    });
  }

  /**
   * 远程删除
   */
  deleteRemote() {
    let data = this.files.checkedList;
    if (data.length < 1) {
      this.messages.warning('请选择文件！');
      return;
    }
    let ids = [];
    let names = [];
    data.forEach(item => {
      ids.push(item.id);
      names.push(item.name);
    });
    class Service extends CustomForm {
      popUp = true;
      labelSm = 5;
      items = [
        {
          type: 'select-group',
          key: 'distribution',
          label: '选择删除对象',
          resultLabel: '删除对象'
        }
      ];
    }
    let service = new Service();
    this.modal = this.nzModalService.open({
      title: '远程删除',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.remoteDeleteContent({
          contentIds: ids.join(','),
          userIds: result.data.distribution.userIds.join(','),
          userGroupIds: result.data.distribution.groupIds.join(','),
          deptIds: result.data.distribution.deptIds.join(',')
        }).subscribe((res: any) => {
          this.messages.info('此操作已下发！');
          this.files.clearChecked();
          this.modal.destroy();
        });
      }
    });
  }

  /**
   * 文档可见范围
   */
  visibleRange() {
    let content = this.files.contentDistribute;
    this.http.getAccessConfOfContent({contentIds: content.id}).subscribe((res: any) => {
      if (res.code === '200') {
        let _data = [];
        res.data.result.forEach((item: any) => {
          switch (item.applyType) {
            case 4:
              if (item.applyName) {
                _data.push({type: 'user', id: item.applyValue, name: item.applyName});
              }
              break;
            case 5:
              if (item.applyName) {
                _data.push({type: 'group', id: item.applyValue, name: item.applyName});
              }
              break;
            case 1:
              if (item.applyName) {
                _data.push({type: 'dept', id: item.applyValue, name: item.applyName});
              }
              break;
          }
        });
        class Service extends CustomForm {
          popUp = true;
          labelSm = 4;
          items = [
            {
              type: 'select-group',
              key: 'distribution',
              value: {data: _data},
              label: '可见对象',
              resultLabel: '可见对象'
            }, {
              hide: true,
              type: 'checkbox',
              key: 'isPermission',
              label: '下载设置',
              value: false,
              placeHolder: '下载设置',
              describe: '不勾选此项，客户端只能预览文档，不能下载'
            }
          ];
        }
        let service = new Service();
        this.modal = this.nzModalService.open({
          title: '文档可见范围',
          content: CustomFormComponent,
          footer: false, // footer默认为true
          width: 600,
          componentParams: {
            options: service
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modal.subscribe((result: any) => {
          if (result.type === 'save') {
            this.http.saveAccessConfOfContent({
              contentIds: content.id,
              userIds: result.data.distribution.userIds.join(','), // 可见用户ids
              userGroupIds: result.data.distribution.groupIds.join(','), // 可见用户组ids
              deptIds: result.data.distribution.deptIds.join(','), // 可见部门ids
              permission: result.data.isPermission, // 下载权限 false
            }).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.messages.info('设置成功！');
                this.modal.destroy();
              } else {
                this.messages.error('设置失败！');
              }
            });
          }
        });
      } else {
        this.messages.error('获取文档可见范围失败！');
      }
    });
  }

  /**
   * 下载权限
   */
  downloadPermissions() {
    let content = this.files.contentDistribute;
    this.http.getDownloadConfOfContent({contentId: content.id}).subscribe((res: any) => {
      if (res.code === '200') {
        let sourceData = [];
        res.data.result.forEach((item: any) => {
          sourceData.push({direction: item.permission ? 'right' : 'left', title: item.applyName, ...item});
        });
        class Service extends CustomForm {
          popUp = true;
          labelSm = 1;
          items = [
            {
              type: 'transfer',
              key: 'objs',
              value: sourceData,
              nzTitles: ['', '']
            }
          ];
        }
        let service = new Service();
        this.modal = this.nzModalService.open({
          title: '下载权限',
          content: CustomFormComponent,
          footer: false, // footer默认为true
          width: 565,
          componentParams: {
            options: service
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modal.subscribe((result: any) => {
          if (result.type === 'save') {
            result.data.objs.forEach((item: any) => {
              if (item.direction === 'right') {
                item.permission = true;
              } else if (item.direction === 'left') {
                item.permission = false;
              }
            });
            this.http.saveDownloadConfOfContent({
              contentIds: content.id,
              data: JSON.stringify(result.data.objs)
            }).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.messages.info('设置成功！');
                this.modal.destroy();
              } else {
                this.messages.error('设置失败！');
              }
            });
          }
        });
      } else {
        this.messages.error('获取文档下载权限失败！');
      }
    });
  }

  /**
   * 文档权限
   */
  documentPermissions() {
    let data = this.files.checkedList;
    if (data.length < 1) {
      this.messages.warning('请选择文件！');
      return;
    }
    let ids = [];
    let names = [];
    data.forEach(item => {
      ids.push(item.id);
      names.push(item.name);
    });
    this.http.getAccessConfOfContent({contentIds: ids.join(',')}).subscribe((res: any) => {
      if (res.code === '200') {
        let _data = [];
        res.data.result.forEach((item: any) => {
          switch (item.applyType) {
            case 4:
              if (item.applyName) {
                _data.push({type: 'user', id: item.applyValue, name: item.applyName});
              }
              break;
            case 5:
              if (item.applyName) {
                _data.push({type: 'group', id: item.applyValue, name: item.applyName});
              }
              break;
            case 1:
              if (item.applyName) {
                _data.push({type: 'dept', id: item.applyValue, name: item.applyName});
              }
              break;
          }
        });
        class Service extends CustomForm {
          popUp = true;
          labelSm = 4;
          items = [
            {
              type: 'select-group',
              key: 'distribution',
              value: {data: _data},
              label: '可见对象',
              resultLabel: '可见对象'
            }, {
              type: 'checkbox',
              key: 'isPermission',
              label: '下载设置',
              value: false,
              placeHolder: '下载设置',
              describe: '不勾选此项，客户端只能预览文档，不能下载'
            }
          ];
        }
        let service = new Service();
        this.modal = this.nzModalService.open({
          title: '文档权限',
          content: CustomFormComponent,
          footer: false, // footer默认为true
          width: 600,
          componentParams: {
            options: service
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modal.subscribe((result: any) => {
          if (result.type === 'save') {
            this.http.saveAccessConfOfContent({
              contentIds: ids.join(','),
              userIds: result.data.distribution.userIds.join(','), // 可见用户ids
              userGroupIds: result.data.distribution.groupIds.join(','), // 可见用户组ids
              deptIds: result.data.distribution.deptIds.join(','), // 可见部门ids
              permission: result.data.isPermission, // 下载权限
            }).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.messages.info('设置成功！');
                this.modal.destroy();
              } else {
                this.messages.error('设置失败！');
              }
            });
          }
        });
      } else {
        this.messages.error('获取文档可见范围失败！');
      }
    });
  }

  /**
   * 移动
   */
  move() {
    let contentids = [];
    this.files.checkedList.forEach(item => contentids.push(item.id));
    if (contentids.length === 0) {
      this.messages.warning("请选择文档！");
      return;
    }
    this.modal = this.nzModalService.open({
      title: '移动',
      content: ContentFolderTreeComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: "",
        excludeIds: contentids
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        let targetIds = [];
        result.data.forEach(item => targetIds.push(item.id));
        if (targetIds.length === 0) {
          this.messages.warning("请选择目录！");
          return;
        }
        this.http.moveContent({
          contentIds: contentids.join(','), // 文档id,
          targetPath: targetIds.join(','), //
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.files.initList({isActiveFist: false});
          }
        });
      }
    });
  }
  /**
   * 复制
   */
  copy() {
    let contentids = [];
    this.files.checkedList.forEach(item => contentids.push(item.id));
    if (contentids.length === 0) {
      this.messages.warning("请选择文档！");
      return;
    }
    this.modal = this.nzModalService.open({
      title: '文档复制',
      content: ContentFolderTreeComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: "",
        excludeIds: contentids
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        let targetIds = [];
        result.data.forEach(item => targetIds.push(item.id));
        if (targetIds.length === 0) {
          this.messages.warning("请选择目录！");
          return;
        }
        this.http.copyContent({
          contentIds: contentids.join(','), // 文档id,
          targetPath: targetIds.join(','), //
        }).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.files.initList({isActiveFist: false});
          }
        });
      }
    });
  }

  /* 文件类型切换 [all|picture|music|video|other|folder] 回收站 isDelete */
  changeType(type) {
    this.files.contentDistribute = null;
    this.files.param.isDelete = false;
    switch (type) {
      case 'AllFiles':
        this.files.param.category = 'all';
        break;
      case 'PictureFiles':
        this.files.param.category = 'picture';
        break;
      case 'AudioFiles':
        this.files.param.category = 'music';
        break;
      case 'VideoFiles':
        this.files.param.category = 'video';
        break;
      case 'OtherFiles':
        this.files.param.category = 'other';
        break;
      case 'RecycleBin': {
        this.files.param.category = 'all';
        this.files.param.isDelete = true;
      }
        break;
    }
    this.type = type;
    this.files.initList({isActiveFist: false});
  }
}
