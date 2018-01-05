import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {NzModalService, NzNotificationService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {MessageService} from "../../shared/service/message.service";
import {UserFormComponent} from "./user-form.component";
import {UserGroupService, UserSearchService, UserService} from "../user.service";
import {UserGroupFormComponent} from "./user-group-form.component";
import {MapTrailComponent} from "../../shared/custom-map/map-trail.component";
import {UserMoveComponent} from "./user-move.component";
import {ImportFileComponent} from "../../shared/component/import-file.component";
import {ExportFileComponent} from "../../shared/component/export-file.component";
import {AddUserFormService} from "../service/user-user-add-form.service";
import {UserHttpService} from "../service/user-http.service";
import {DataService} from "../../shared/service/data.service";
import {environment} from "../../../environments/environment";
import {DeptService} from "../service/user-dept.service";
import {UserGroupFormService} from "../service/user-group-form.service";
import {UserFormService} from "../service/user-user-form.service";
import {DeptFormService} from "../service/user-dept-form.service";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.component.html',
  providers: [
    UserService,
    UserFormComponent,
    AddUserFormService,
    UserGroupFormService,
    UserFormService,
    DeptFormService,
    DeptService,
    UserGroupService
  ]
})
export class UserContentComponent implements OnDestroy {
  // Disable:用户 激活，启用，停用，锁定，解锁
  changeUserStateDisable = {
    active: false,
    blockUp: false,
    locking: false,
    unlocked: false,
    reload: false,
  };
  // 所有的弹出层
  modalUserPlace;
  modalMoveTo;
  modalAddUserGroup;
  modalAddUser;
  modalImport;

  constructor(private nzModalService: NzModalService,
              private notification: NzNotificationService,
              private modalService: ModalService,
              private httpUser: UserHttpService,
              private httpClient: HttpClient,
              private dataService: DataService,
              private messageService: MessageService,
              private userSearchService: UserSearchService,
              private userService: UserService,
              public userGroup: UserGroupService) {
    // 初始化用户组数据
    this.userGroup.initList({isActiveFist: false});
    // 选择用户
    this.userService.checkedEvent.subscribe((data) => {
      this.changeUserState(data.users);
    });
    this.userService.changeUserStateEvent.subscribe((item: any) => {
       this.userSearchService.update();
    });
  }
  ngOnDestroy() {
    if (this.modalUserPlace) {
      this.modalUserPlace.destroy();
    }
    if (this.modalMoveTo) {
      this.modalMoveTo.destroy();
    }
    if (this.modalAddUserGroup) {
      this.modalAddUserGroup.destroy();
    }
    if (this.modalAddUser) {
      this.modalAddUser.destroy();
    }
    if (this.modalImport) {
      this.modalImport.destroy();
    }
    this.notification.remove();
  }
  // 全文搜索
  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }
  // do:全文搜索
  doSearch(search) {
    /* group*/
    this.userGroup.param.search = search;
    this.userGroup.initList({isActiveFist: false}).subscribe((r: any) => {
      this.userGroup.itemIsActive = {id: -3};
      /*user*/
      this.userService.param.search = search;
      this.userService.initList({isActiveFist: false}).subscribe((total: any) => {
        this.userGroup.list[0].user_count = total;
      });
    });
  }
  // 用户操作：激活，停用，，，
  changeUserState(checkedList) {
    /**
     * [用户状态]0：未激活;1：已激活;5：锁定;7：停用
     */
    this.changeUserStateDisable.active = false;
    this.changeUserStateDisable.blockUp = false;
    this.changeUserStateDisable.locking = false;
    this.changeUserStateDisable.unlocked = false;
    this.changeUserStateDisable.reload = false;
    for (let user of checkedList) {
      if (user.state === 0) {
        this.changeUserStateDisable.locking = true;
        this.changeUserStateDisable.unlocked = true;
        this.changeUserStateDisable.reload = true;
      } else if (user.state === 1) {
        this.changeUserStateDisable.reload = true;
        this.changeUserStateDisable.unlocked = true;
      } else if (user.state === 5) {
        this.changeUserStateDisable.reload = true;
      } else if (user.state === 7) {
        this.changeUserStateDisable.active = true;
        this.changeUserStateDisable.blockUp = true;
        this.changeUserStateDisable.locking = true;
        this.changeUserStateDisable.unlocked = true;
      }
    }
  }
  // 查看地理位置
  popupUserPlace() {
    let groups = [];
    let groupIds = [];
    let users = [];
    let userIds = [];
    // 用户组选中判断
    this.userGroup.checkedList.forEach((item) => {
      if (item.id > 0) {
        groups.push(item);
        groupIds.push(item.id);
      } else if (item.id === -1) {
        // this.messageService.info("不能操作’所有用户‘");
      } else if (item.id === -2) {
        // this.messageService.info("不能操作’其他用户‘");
      } else if (item.id === -3) {
        // this.messageService.info("不能操作’命中用户‘");
      }
    });
    this.userService.checkedList.forEach((item) => {
      if (item.id > 0) {
        users.push(item);
        userIds.push(item.id);
      }
    });
    // 选择的用户
    if (groupIds.length === 0 && userIds.length === 0) {
      this.messageService.info('请选择用户或者用户组进行查看！');
      return;
    }
    this.modalUserPlace = this.nzModalService.open({
      title: '查看用户位置信息',
      content: MapTrailComponent,
      footer: false, // footer默认为true
      width: 1200,
      componentParams: {
        userIds: userIds.join(','),
        userGroupIds: groupIds.join(','),
        deptIds: ''
      }
    });
  }
  // 移动到
  popupMoveTo() {
    let moveList = [];
    // 用户组选中判断
    if (this.userGroup.checkedList.length > 0) {
      this.userGroup.checkedList.forEach((item) => {
        if (item.id > 0) {
          moveList.push(item);
        } else if (item.id === -1) {
          this.messageService.info("不能操作’所有用户‘");
        } else if (item.id === -2) {
          this.messageService.info("不能操作’其他用户‘");
        } else if (item.id === -3) {
          this.messageService.info("不能操作’命中用户‘");
        }
      });
    } else if (moveList.length === 0 && this.userService.checkedList.length > 0) {
      // 用户选中判断
      this.userService.checkedList.forEach((item) => {
        if (item.id > 0) {
          moveList.push(item);
        }
      });
    } else {
      this.messageService.info("请选择移动对象！");
      return;
    }
    // 移动到的目标选择
    this.modalMoveTo = this.nzModalService.open({
      title: '移动到',
      content: UserMoveComponent,
      footer: false, // footer默认为true
      width: 600,
      zIndex: ++this.modalService.modalCount,
      componentParams: {
        isFrom: this.userGroup.itemIsActive && this.userGroup.itemIsActive.id > 0
      }
    });
    // 移动到的保存
    this.modalMoveTo.subscribe((result: any) => {
      if (result.type === "save") {
        let user_ids = [];
        let group_ids = [];
        moveList.forEach(item => item.hasOwnProperty('state') ? user_ids.push(item.id) : group_ids.push(item.id));
        let target_group_ids = [];
        result.data.groups.forEach(item => target_group_ids.push(item.id));
        if (user_ids.length > 0) {
          // 用户移动到用户组
          this.httpUser.groupMove({
            userIds: user_ids.join(','),
            toGroupIds: target_group_ids.join(','),
            fromGroupId: this.userGroup.itemIsActive && this.userGroup.itemIsActive.id > 0 ? this.userGroup.itemIsActive.id : null,
            keep: result.data.keep
          }).subscribe((res: any) => {
            this.userService.initList({isActiveFist: false});
            this.userGroup.initList({isActiveFist: false});
          });
          // this.userService.moveUser2Group(
          //   {user_ids: user_ids.join(','), from_group_id: '', to_group_id: target_group_ids.join(',')}
          //   ).subscribe((res: any) => {
          //   this.userService.initList({isActiveFist: false});
          // });
        }
        // 用户组移动到用户组
        if (group_ids.length > 0) {
          this.httpUser.groupMove({
            groupIds: group_ids.join(','),
            keep: result.data.keep,
            fromGroupId: this.userGroup.itemIsActive && this.userGroup.itemIsActive.id > 0 ? this.userGroup.itemIsActive.id : null,
            toGroupIds: target_group_ids.join(','),
          }).subscribe((res: any) => {
            this.userService.initList({isActiveFist: false});
            this.userGroup.initList({isActiveFist: false});
          });
          // this.userService.moveUser2Group(
          //   {user_ids: user_ids.join(','), from_group_id: '', to_group_id: target_group_ids.join(',')}
          // ).subscribe((res: any) => {
          //   this.userGroupService.initList({isActiveFist: false});
          // });
        }
        this.modalMoveTo.destroy();
      }
    });
  }
  // 添加用户组
  popupAddUserGroup() {
    let msg = '';
    if (this.userGroup.itemIsActive && this.userGroup.itemIsActive.id > 0) {
      msg = ' (在： ' + this.userGroup.itemIsActive['name'] + ' 中添加新用户组)';
    }
    this.modalAddUserGroup = this.nzModalService.open({
      title: '添加用户组' + msg,
      content: UserGroupFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        parentId: ''
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalAddUserGroup.subscribe((result) => {
      if (result.type === 'save') {
        this.userGroup.add(result.data).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('用户组：' + result.data.name + '创建成功！');
            this.userGroup.initList({isActiveFist: false});
            this.modalAddUserGroup.destroy();
          }
        });
      }
    });
  }
  // 添加用户
  popupAddUser() {
    this.modalAddUser = this.nzModalService.open({
      title: '添加用户',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new AddUserFormService(this.httpClient, this.messageService, this.dataService, this.userService, this.userGroup)
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalAddUser.subscribe((result) => {
      if (result.type === 'save') {
        let data = {...result.data,
          username: result.data.email,
          group_ids: result.data.group_ids.join(','),
          send: result.data.send ? 1 : 0,
        };
        this.userService.add(data).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('成功创建用户：' + data.username);
            this.userService.initList({isActiveFist: false}).subscribe((item: any) => {
              this.userGroup.initList({isActiveFist: false}).subscribe((item_: any) => {
                this.userGroup.list[0].user_count = item || 0;
              });
            });
            this.modalAddUser.destroy('onCancel');
          } else if (res.code === 'USER100003') {
            this.messageService.error("帐户已存在！");
          } else if (res.code === 'MAIL900002') {
            this.messageService.error("邮件地址无效！");
          } else {
            this.messageService.error("添加失败！");
          }
        });
      }
    });
  }
  // 批量移除
  removeUsers() {
    let fromGroupId = this.userGroup.itemIsActive.id;
    if (!fromGroupId || fromGroupId < 1) {
      // 未选择分组
      this.messageService.warning("请选择分组！");
      return;
    }
    let data: any = {
      fromGroupId: fromGroupId,
      userIds: [],
      groupIds: [],
      keep: false
    };
    /* 移除对象 用户 */
    this.userService.checkedList.forEach((item: any) => {
       data.userIds.push(item.id);
    });
    /* 移除对象 用户组 */
    this.userService.checkedGroup.forEach((item: any) => {
      data.groupIds.push(item.id);
    });
    if (data.userIds.length === 0 && data.groupIds.length === 0) {
      // 未选择移除对象
      this.messageService.warning("请选择要移除的目标！");
      return;
    }
    data.userIds = data.userIds.join(',');
    data.groupIds = data.groupIds.join(',');
    this.modalImport = this.modalService.popupConfirm('confirm_remove', () => {
      this.httpUser.groupMove(data).subscribe((res: any) => {
        if (res.code === '200') {
          this.userService.initList({isActiveFist: false});
          this.userGroup.initList({isActiveFist: false});
        }
      });
    }, '用户移出分组后，<span class="text-primary">这些用户不会被删除</span>。');
  }
  // 批量导入
  popupImport() {
    this.modalImport = this.nzModalService.open({
      title: '批量导入用户',
      content: ImportFileComponent,
      closable: false, // 如果弹出层需要做离开保护的话，不能有关闭按钮
      maskClosable: false, // 如果弹出层需要做离开保护的话，不能点击蒙层关闭
      footer: false, // footer默认为true
      width: 700,
      componentParams: {
        type: 'device',
        desc: '批量导入用户',
        url: this.dataService.url.user.upload,
      }
    });
    this.modalImport.subscribe(result => {
      // 接受弹出层中传来的数据
      if (result === 'download') {
        // 下载模板
        let platform = window.navigator.platform;
        if (platform.indexOf('Win') > -1) {
          window.location.href = environment.path + '/resources/assets/certs/userDeptImportWin.csv';
        } else if (platform.indexOf('Linux') > -1) {
          window.location.href = environment.path + '/resources/assets/certs/userDeptImportLinux.csv';
        }
      } else if (result.type === 'import') {
        // 执行导入操作
        result.uploader.onSuccessItem = (response, status, headers) => {
          let res = JSON.parse(status);
          if (res.code === '200') {
            if (res.data && res.data.total && res.data.result) {
              let total = res.data.total;  // 数据总数，当csv表头错误时不会返回total
              let error = res.data.result;
              if (error.length === 0) {
                this.notification.success(
                  '批量导入完成',
                  total + '条数据导入成功， 0失败！',
                  {
                    nzDuration: 3000
                  }
                );
              } else {
                let msg = '';
                res.data.result.forEach((item: any, index) => {
                  msg += '第' + (item.line - 1) + '条数据：';
                  switch (item.errorCode) {
                    case 'BATCH100002':
                      msg += ' csv表头错误; ';
                      break;
                    case 'BATCH100003':
                      msg += ' 部门路径中含有特殊字符; ';
                      break;
                    case 'BATCH100004':
                      msg += ' 用户姓名为空; ';
                      break;
                    case 'BATCH100005':
                      msg += ' 用户名邮箱不一致; ';
                      break;
                    case 'BATCH100006':
                      msg += ' 用户名与AD/LDAP导入的用户名冲突; ';
                      break;
                    case 'USER100022':
                      msg += ' 用户姓名长度不能超过100个字; ';
                      break;
                    case 'USER100023':
                      msg += ' 无效的邮箱地址; ';
                      break;
                    case 'USER100024':
                      msg += ' 邮箱地址不能超过67个字; ';
                      break;
                    case 'USER100025':
                      msg += ' 用户拓展属性长度不能超过255个字; ';
                      break;
                    case 'DEPT200005':
                      msg += ' 部门名称长度不能超过30个字; ';
                      break;
                  }
                });
                this.notification.info(
                  '批量导入完成',
                  (total - error.length) + '条数据导入成功， ' + error.length + '条数据导入失败（' + msg + ')',
                  {nzDuration: 0}
                );
              }
            } else {
              this.messageService.info('批量导入成功!');
            }
            this.userService.initList({isActiveFist: false});
          } else if (res.code === 'BATCH100002') {
            this.messageService.error('csv表头错误!');
          } else {
            this.messageService.error('批量导入失败!');
          }
        };
        result.uploader.uploadAll();
        this.modalImport.destroy();
      }
    });
  }
  // 数据导出
  popupExport() {
    this.nzModalService.open({
      title: '导出用户',
      content: ExportFileComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        basicData: '',
        extendData: ''
      }
    }).subscribe(result => {
    });
  }
  // 激活、停用、锁定、解锁、启用
  popupChangeUserState(type) {
    let groups = this.userGroup.checkedList;
    if (groups.length > 0) {
      this.userService.changeUserState({groups: this.userGroup.checkedList}, type);
      this.userGroup.initList({isActiveFist: false});
    } else {
      this.userService.changeUserState({users: this.userService.checkedList}, type);
      /**
       * 取消按钮禁用
       */
      this.changeUserStateDisable.active = false;
      this.changeUserStateDisable.blockUp = false;
      this.changeUserStateDisable.locking = false;
      this.changeUserStateDisable.unlocked = false;
      this.changeUserStateDisable.reload = false;
    }
  }
}
