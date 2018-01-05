import {CustomList} from "../../shared/custom-list/custom-list";
import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../../shared/service/message.service";
import {ModalService} from "../../shared/service/modal.service";
import {DataService} from "../../shared/service/data.service";
import {UserHttpService} from "./user-http.service";
@Injectable()
export class UserService extends CustomList {
  isLoading = true;
  // 用户
  list = [];
  disabledCheckeds = false;
  checkedList = [];
  checkedEvent = new EventEmitter<any>();
  // 用户组
  group = [];
  checkedGroup = [];
  // 当前选择的对象
  itemIsActive = {id: -1};
  itemActiveEvent = new EventEmitter<any>();
  // 用户状态修改
  changeUserStateEvent = new EventEmitter<any>(true);
  // 参数
  param: any = {
    page: 1,
    pageSize: 50,
    group_id: null,
    state: null,
    dept_id: null,
    search: '',
    total: 0
  };

  constructor(private dataService: DataService,
              private httpUser: UserHttpService,
              private modalService: ModalService,
              private messageService: MessageService,
              private http: HttpClient) {
    super();
  }

  initList(...other) {
    let isActiveFist = true;
    this.disabledCheckeds = false;
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
    this.checkedList = [];
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        this.list = res.data.result;
        this.param.total = res.data.total;
        this.isLoading = false;
        if (isActiveFist && this.list.length > 0) {
          this.active(this.list[0]);
        }
        e.emit(res.data.total);
      });
    return e;
  }

  nextPage() {
    if (this.list.length < this.param.total) {
      this.param.page++;
      this.getList()
        .subscribe((res: any) => {
          this.list = this.list.concat(res.data.result);
          this.param.total = res.data.total || 0;
        });
    }
  }

  getList(_parame = {}) {
    return this.http.get(this.dataService.url.user.getUserList, this.dataService.getWholeParams(Object.assign({}, this.param, _parame)));
  }

  checked(checked, item, type?) {
    let checkedList = type && type === 'group' ? this.checkedGroup : this.checkedList;
    if (checked) {
      checkedList.push(item);
    } else {
      const index = checkedList.indexOf(item);
      if (index > -1) {
        checkedList.splice(index, 1);
      }
    }
    this.checkedEvent.emit({users: this.checkedList, groups: this.checkedGroup});
  }

  changeUserState(list: { users?: any[], groups?: any[], depts?: any[] }, type) {
    let user_ids = [],
      group_ids = [],
      dept_ids = [];
    let accounts = [];
    let group = [];
    let dept = [];

    if (list.users) {
      for (let user of list.users) {
        user_ids.push(user.id);
        accounts.push(user.name);
      }
    }
    if (list.groups) {
      for (let user of list.groups) {
        group_ids.push(user.id);
        group.push(user.name);
      }
    }
    if (list.depts) {
      for (let user of list.depts) {
        dept_ids.push(user.id);
        dept.push(user.name);
      }
    }
    if (user_ids.length === 0 && group_ids.length === 0 && dept_ids.length === 0) {
      this.messageService.info("请选择用户/用户组/部门，进行操作！");
      return;
    }
    let msg = '';
    if (accounts.length > 0) {
      msg += accounts.join(', ');
    }
    if (group.length > 0) {
      msg += group.join(', ');
    }
    if (dept.length > 0) {
      msg += dept.join(', ');
    }

    switch (type) {
      // 激活
      case 'active':
        this.modalService.popupConfirm('激活用户', () => {
          this._changeUserState(user_ids.join(','), group_ids.join(','), dept_ids.join(','), type).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('激活:' + msg);
              this.changeUserStateEvent.emit();
              this.initList({isActiveFist: false});
            } else {
              this.messageService.error('激活失败:' + msg);
            }
          });
        }, '是否需要激活<span class="text-primary">' + msg + '</span>?<br>' +
          '激活电子邮件将发送到此用户的邮箱，请登录邮箱进行激活！');
        break;
      // 停用
      case 'blockUp':
        this.modalService.popupConfirm('停用用户', () => {
          this._changeUserState(user_ids.join(','), group_ids.join(','), dept_ids.join(','), type).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('停用:' + msg);
              this.changeUserStateEvent.emit();
              this.initList({isActiveFist: false});
            } else {
              this.messageService.error('停用失败:' + msg);
            }
          });
        }, '是否需要停用<span class="text-primary">' + msg + '</span>?<br>' +
          '停用后，此用户的所有信息将会全部清除。管理员可重新启用此帐号，并发送激活邮件。');
        break;
      // 锁定
      case 'locking':
        this.modalService.popupConfirm('锁定用户', () => {
          this._changeUserState(user_ids.join(','), group_ids.join(','), dept_ids.join(','), type).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('锁定:' + msg);
              this.changeUserStateEvent.emit();
              this.initList({isActiveFist: false});
            } else {
              this.messageService.error('锁定失败:' + msg);
            }
          });
        }, '是否需要锁定<span class="text-primary">' + msg + '</span>?<br>' +
          '锁定后，此用户将无法再登录到ThunderEMM。需要通过管理员解锁或用户自助解锁，但是他们必须重新设置密码方可激活！</span>');
        break;
      // 解锁
      case 'unlocked':
        this.modalService.popupConfirm('解锁用户', () => {
          this._changeUserState(user_ids.join(','), group_ids.join(','), dept_ids.join(','), 'active').subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('解锁:' + msg);
              this.changeUserStateEvent.emit();
              this.initList({isActiveFist: false});
            } else {
              this.messageService.error('解锁失败:' + msg);
            }
          });
        }, '是否需要解锁<span class="text-primary">' + msg + '</span>?<br>');
        break;
      // 启用
      case 'reload':
        this.modalService.popupConfirm('启用用户', () => {
          this._changeUserState(user_ids.join(','), group_ids.join(','), dept_ids.join(','), type).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('启用:' + msg);
              this.changeUserStateEvent.emit();
              this.initList({isActiveFist: false});
            } else {
              this.messageService.error('启用失败:' + msg);
            }
          });
        }, '是否需要启用<span class="text-primary">' + msg + '</span>?<br>' +
          '启用后，此用户状态将会变为未激活状态，可再次发送激活邮件提醒此用户去重置密码，激活帐号。');
        break;
    }
  }

  // 用户状态修改的后台交互
  _changeUserState(user_ids, group_ids, dept_ids, type) {
    return this.http.post(this.dataService.url.user.updateUserStatus, {
      user_ids: user_ids ? user_ids : null,
      dept_ids: dept_ids ? dept_ids : null,
      group_ids: group_ids ? group_ids : null,
      state: type
    });
  }

  // 添加
  add(data: {
    groupIds?: string,
    dept_id?: string,
    username?: string,
    display_name?: string,
    email?: string,
    send?: string | number,
    // 扩展属性
    extend?: string
  }, extend?: string) {
    if (extend) {
      data.extend = extend;
    }
    // :用户组id，多id使用逗号分隔
    // deptId:部门id
    // username:用户帐号
    // display_name:用户名字
    // email:
    //   send:是否发送激活邮件；0:不发送，1:发送
    return this.http.post(this.dataService.url.user.createUser, data);
  }

  // moveUser2Group
  // + URL:/moveUser2Group
  // + RequestMethod:POST
  // + 参数:
  // ```
  // user_ids:用户id，多个用户用逗号隔开
  // from_group_id:从fromGroupId用户组移出
  // to_group_id:移动到toGroupId
  // ```
  // + 返回值:
  // ```
  // {
  //     "code": "200",
  //     "msg": "移动用户成功！"
  // }
  moveUser2Group(data: {
    user_ids: string,
    from_group_id: string,
    to_group_id: string,
  }) {
    return this.http.post(this.dataService.url.user.moveUser2Group, data);
  }
}
