import {Component, OnDestroy, OnInit} from "@angular/core";
import {MessageService} from "../../shared/service/message.service";
import {ModalService} from "../../shared/service/modal.service";
import {NzModalService, NzNotificationService} from "ng-zorro-antd";
import {UserSearchService, UserService} from "../user.service";
import {DeptService} from "../service/user-dept.service";
import {UserGroupService} from "../service/user-group.service";
import {ImportFileComponent} from "../../shared/component/import-file.component";
import {UserMoveDeptComponent} from "./user-move-dept.component";
import {UserFormService} from "../service/user-user-form.service";
import {AddUserFormService} from "../service/user-user-add-form.service";
import {UserHttpService} from "../service/user-http.service";
import {environment} from "../../../environments/environment";
import {DataService} from "../../shared/service/data.service";
import {UserGroupFormService} from "../service/user-group-form.service";
import {DeptFormService} from "../service/user-dept-form.service";
import {MapTrailComponent} from "../../shared/custom-map/map-trail.component";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {HttpClient} from "@angular/common/http";
@Component({
  selector: 'app-user-dept-content',
  templateUrl: './user-dept-content.component.html',
  providers: [
    UserService,
    UserFormService,
    DeptService,
    AddUserFormService,
    UserGroupFormService,
    DeptFormService,
    UserGroupService
  ]
})
export class UserDeptContentComponent implements OnDestroy {
  searchWord = '';
  // Disable:用户 激活，启用，停用，锁定，解锁
  changeUserStateDisable = {
    active: false,
    blockUp: false,
    locking: false,
    unlocked: false,
    reload: false,
  };
  // disabled：添加用户到部门不可点
  disabled_addUserToDept = true;
  // 所有弹层
  modalUserPlace;
  modalMoveTo;
  modalAddDept;
  modalAddUser;
  modalAddUserToDept;
  modalImport;

  constructor(private nzModalService: NzModalService,
              private notification: NzNotificationService,
              private modalService: ModalService,
              private messageService: MessageService,
              private httpUser: UserHttpService,
              private httpClient: HttpClient,
              private dataService: DataService,
              private userSearchService: UserSearchService,
              public deptService: DeptService,
              private userGroup: UserGroupService,
              private userService: UserService) {
    // init dept
    this.deptService.initList({isActiveFist: false});
    this.userService.checkedEvent.subscribe((data) => {
      this.changeUserState(data.users);
    });
    this.deptService.itemActiveEvent.subscribe((item) => {
      if (item && item.id > 0) {
        this.disabled_addUserToDept = false;
      } else {
        this.disabled_addUserToDept = true;
      }
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
    if (this.modalAddDept) {
      this.modalAddDept.destroy();
    }
    if (this.modalAddUser) {
      this.modalAddUser.destroy();
    }
    if (this.modalImport) {
      this.modalImport.destroy();
    }
    if (this.modalAddUserToDept) {
      this.modalAddUserToDept.destroy();
    }
    this.notification.remove();
  }

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

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  doSearch(search) {
    /* dept*/
    this.deptService.param.search = search;
    this.deptService.initList({isActiveFist: false}).subscribe((r: any) => {
      this.deptService.itemIsActive = {id: -3};
      /*user*/
      this.userService.param.search = search;
      this.userService.initList({isActiveFist: false}).subscribe((total: any) => {
        this.deptService.list[0].user_count = total || 0;
      });
    });
  }
  // 查看地理位置
  popupUserPlace() {
    let depts = [];
    let deptIds = [];
    let users = [];
    let userIds = [];
    // 部门选中判断
    this.deptService.checkedList.forEach((item) => {
      if (item.id > 0) {
        depts.push(item);
        deptIds.push(item.id);
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
    if (deptIds.length === 0 && userIds.length === 0) {
      this.messageService.info('请选择用户或者部门进行查看！');
      return;
    }
    this.modalUserPlace = this.nzModalService.open({
      title: '查看用户位置信息',
      content: MapTrailComponent,
      footer: false, // footer默认为true
      width: 1200,
      componentParams: {
        userIds: userIds.join(','),
        userGroupIds: '',
        deptIds: deptIds.join(',')
      }
    });
  }
  // 移动到
  popupMoveTo() {
    let moveList = [];
    let type = '';
    // 部门选中判断
    if (this.deptService.checkedList.length > 0) {
      this.deptService.checkedList.forEach((item) => {
        if (item.id > 0) {
          type = 'dept';
          moveList.push(item);
        } else if (item.id === -1) {
          this.messageService.info("不能操作’所有用户‘");
        } else if (item.id === -2) {
          this.messageService.info("不能操作’其他用户‘");
        } else if (item.id === -3) {
          this.messageService.info("不能操作’命中用户‘");
        }
      });
    } else if (this.userService.checkedList.length > 0) {
      // 用户选中判断
      this.userService.checkedList.forEach((item) => {
        if (item.id > 0) {
          type = 'user';
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
      content: UserMoveDeptComponent,
      footer: false, // footer默认为true
      width: 600,
      zIndex: ++this.modalService.modalCount,
    });
    // 移动到的保存
    this.modalMoveTo.subscribe((result: any) => {
      if (result.type === "save") {
        let target_ids = [];
        if (result.data && result.data.id) {
          target_ids.push(result.data.id);
        } else {
          this.messageService.info("请选择部门");
          return;
        }
        if (type === 'dept') {
          let ids = [];
          moveList.forEach(item => ids.push(item.id));
          this.httpUser.deptMove({
            deptIds: ids.join(','),
            toDeptId: target_ids.join(',')
          }).subscribe((res: any) => {
            if (res.code === '200') {
              this.deptService.initList({isActiveFist: false});
              this.userService.disabledCheckeds = false;
            } else if (res.code === 'DEPT200003') {
              this.messageService.error('移动失败，目标部门下已经存在相同名称的部门!');
            } else {
              this.messageService.error('移动失败!');
            }
          });
          // this.deptService.moveDept({toDeptId: target_ids.join(','), deptId: ids.join(',')}).subscribe((res: any) => {
          //   this.deptService.initList({isActiveFist: false});
          // });
        } else if (type === 'user') {
          let ids = [];
          moveList.forEach(item => ids.push(item.id));
          this.httpUser.deptMove({
            toDeptId: target_ids.join(','),
            userIds: ids.join(',')
          }).subscribe((res: any) => {
            this.userService.initList({isActiveFist: false});
            this.deptService.initList({isActiveFist: false});
          });
          // this.deptService.moveUser({target_dept_id: target_ids.join(','),
          //   dep_id: this.deptService.itemIsActive.id, user_id: ids.join(',')}).subscribe((res: any) => {
          //   this.userService.initList({isActiveFist: false});
          // });
        }
        this.modalMoveTo.destroy();
      }
    });
  }
  // 添加部门
  popupAddDept() {
    let msg = '';
    let form = new DeptFormService(this.httpClient, this.messageService, this.dataService);
    if (this.deptService.itemIsActive && this.deptService.itemIsActive.id > 0) {
      msg = ' (在： ' + this.deptService.itemIsActive.name + ' 中添加新部门)';
      form.parent_id = this.deptService.itemIsActive.id;
      form.setData({parent_id: this.deptService.itemIsActive.id});
    }
    this.modalAddDept = this.nzModalService.open({
      title: '添加部门' + msg,
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: form
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalAddDept.subscribe((result) => {
      if (result.type === 'save') {
        let d = result.data;
        this.httpClient.post(this.dataService.url.user.createDept,
          {
            dept_name: d.dept_name, parent_id: d.parent_id ? d.parent_id : null, dept_id: d.dept_id ? d.dept_id : null
          }).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('部门添加成功！');
            if (this.deptService.itemIsActive && this.deptService.itemIsActive.id > 0) {
              let act_index = this.deptService.list.indexOf(this.deptService.itemIsActive);
              let add = {
                level: this.deptService.itemIsActive.level + 1,
                expand: false,
                parent: this.deptService.itemIsActive,
                id: res.data.id,
                isLastNode: res.data.isLastNode,
                name: res.data.name,
                parent_id: res.data.parent_id,
                source: res.data.source,
                user_count: res.data.user_count
              };
              this.deptService.itemIsActive.children = this.deptService.itemIsActive.children || [];
              this.deptService.itemIsActive.children.push(add);
              this.deptService.list.splice(act_index + 1, 0, add);
              this.deptService.itemIsActive.isLastNode = false;
              this.deptService.itemIsActive.expand = true;
            } else {
              this.deptService.list.splice(2, 0, {
                level: 0,
                expand: false,
                id: res.data.id,
                isLastNode: res.data.isLastNode,
                name: res.data.name,
                parent_id: res.data.parent_id,
                source: res.data.source,
                user_count: res.data.user_count
              });
            }
            this.modalAddDept.destroy();
          }
        });
      }
    });
  }
  // 删除部门
  deleteDepts() {
    this.deptService.delete();
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
              this.deptService.list[0].user_count = item || 0;
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
  remove() {
    let data: any = {
      toDeptId: 0,
      userIds: []
    };
    /* 移除对象 用户 */
    this.userService.checkedList.forEach((item: any) => {
      data.userIds.push(item.id);
    });
    if (data.userIds.length === 0) {
      // 未选择移除对象
      this.messageService.warning("请选择要移除的目标！");
      return;
    }
    data.userIds = data.userIds.join(',');
    this.modalImport = this.modalService.popupConfirm('confirm_remove', () => {
      this.httpUser.deptMove(data).subscribe((res: any) => {
        if (res.code === '200') {
          this.deptService.initList({isActiveFist: false});
          this.userService.initList({isActiveFist: false});
        }
      });
    }, '用户移出部门后，<span class="text-primary">这些用户不会被删除</span>。');
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
        window.location.href = environment.path + '/resources/assets/certs/userDeptImportDemo.csv';
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
  popupChangeUserState(type) {
    let depts = this.deptService.checkedList;
    if (depts.length > 0) {
      this.userService.changeUserState({depts: depts}, type);
      this.deptService.initList({isActiveFist: false});
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
