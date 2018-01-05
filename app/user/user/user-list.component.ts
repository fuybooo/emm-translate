import {Component, Input, OnInit} from "@angular/core";
import {DataService} from "../../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user.service";
import {UserSearchService} from "../service/user-search.service";
import {UserGroupService} from "../service/user-group.service";
import {DeptService} from "../service/user-dept.service";
import {UserHttpService} from "../service/user-http.service";
import {MessageService} from "../../shared/service/message.service";
import {ModalService} from "../../shared/service/modal.service";
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  // table的配置参数
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.users.nextPage();
      }
    }
  };

  constructor(private dataService: DataService,
              public users: UserService,
              private userSearchService: UserSearchService,
              public userGroupService: UserGroupService,
              public deptService: DeptService,
              private httpUser: UserHttpService,
              private modalService: ModalService,
              private messageService: MessageService,
              private http: HttpClient
  ) {
    this.userSearchService.userSearchEvent.subscribe((userState) => {
      this.users.param.state = userState;
      this.users.initList({isActiveFist: false});
    });
    this.userGroupService.checkedEvent.subscribe((list) => {
      if (list.length > 0) {
        this.users.disabledCheckeds = true;
      } else {
        this.users.disabledCheckeds = false;
      }
    });
    this.userGroupService.itemActiveEvent.subscribe((item) => {
      if (item && item.id > 0) {
        // 查询子用户组
        this.userGroupService.getList({search: '', parent_id: item.id}).subscribe((res: any) => {
          this.users.group = res.data.result;
        });
        // 查询用户
        this.users.param.group_id = item.id;
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -1) {
        // 所有用户
        this.users.group = [];
        this.users.param.page = 1;
        this.users.param.group_id = null;
        this.users.param.dept_id = null;
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -2) {
        // 其他用户
        this.users.group = [];
        this.users.param.page = 1;
        this.users.param.group_id = -2;
        this.users.param.dept_id = null;
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -3) {
        // 全文搜索 命中的用户
        this.users.group = [];
        this.users.param.page = 1;
        this.users.param.group_id = null;
        this.users.param.dept_id = null;
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -4) {
        // 所有停用的用户
        this.users.group = [];
        this.users.param.page = 1;
        this.users.param.group_id = -4;
        this.users.param.dept_id = null;
        this.users.initList({isActiveFist: false});
      } else {
        // 取消用户组选中状态时的情况
        this.users.group = [];
        this.users.param.page = 1;
        this.users.param.group_id = null;
        this.users.param.dept_id = null;
        this.users.initList({isActiveFist: false});
      }
    });
    this.deptService.checkedEvent.subscribe((list) => {
      if (list.length > 0) {
        this.users.disabledCheckeds = true;
      } else {
        this.users.disabledCheckeds = false;
      }
    });
    /* dept：active */
    this.deptService.itemActiveEvent.subscribe((item) => {
      if (item && item.id > 0) {
        this.users.param.dept_id = item.id;
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -1) {
        // 所有用户
        this.users.param = {...this.users.param,
          page: 1,
          pageSize: 50,
          dept_id: null,
        };
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -2) {
        // 其他用户
        this.users.param = {...this.users.param,
          page: 1,
          pageSize: 50,
          dept_id: -2,
        };
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -3) {
        // 命中用户
        this.users.param = {...this.users.param,
          page: 1,
          pageSize: 50,
          dept_id: null,
        };
        this.users.initList({isActiveFist: false});
      } else if (item && item.id === -4) {
        // 所有停用用户
        this.users.param = {...this.users.param,
          page: 1,
          pageSize: 50,
          dept_id: -4,
        };
        this.users.initList({isActiveFist: false});
      } else {
        // 取消选中
        this.users.param = {...this.users.param,
          page: 1,
          pageSize: 50,
          dept_id: null,
        };
        this.users.initList({isActiveFist: false});
      }
    });
  }
  ngOnInit() {
    this.users.initList({isActiveFist: false});
  }

  userStateChange() {}

  // 从用户组中移除用户/用户组
  remove(item, type) {
    let fromGroupId = this.userGroupService.itemIsActive.id;
    if (!fromGroupId || fromGroupId < 1) {
      // 未选择分组
      this.messageService.warning("请选择分组！");
      return;
    }
    let data: any = {
      fromGroupId: fromGroupId,
      keep: false
    };
    if (type && type === 'user') {
      data.userIds = item.id;
    } else if (type && type === 'group') {
      data.groupIds = item.id;
    }
    this.httpUser.groupMove(data).subscribe((res: any) => {
      if (res.code === '200') {
        this.users.initList({isActiveFist: false});
        this.userGroupService.initList({isActiveFist: false});
      }
    });
  }
  // 从部门中移除用户
  removeForDept(item, type) {
    let data: any = {
      toDeptId: 0,
      userIds: item.id
    };
    this.httpUser.deptMove(data).subscribe((res: any) => {
      if (res.code === '200') {
        this.deptService.initList({isActiveFist: false});
        this.users.initList({isActiveFist: false});
      }
    });
  }

  deleteUser(item) {
    this.modalService.confirmDelete(() => {
      // 获取此用户的详细信息
      this.httpUser.getUserById({userId: item.id}).subscribe((resDetail: any) => {
        // 部门ids
        let deptIdList = resDetail.data.deptIdList;
        // 用户组ids
        let groupIdList = resDetail.data.groupIdList;
        this.httpUser.deleteUser({userIds: item.id}).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info("删除成功");
            if (this.userGroupService.list[0]) {
              this.userGroupService.list[0].user_count--;
              groupIdList.forEach((_item: any) => {
                this.userGroupService.list.forEach((item__: any) => {
                  if (item__.id === _item) {
                    item__.user_count--;
                  }
                });
              });
            }
            if (this.deptService.list[0]) {
              this.deptService.list[0].user_count--;
              deptIdList.forEach((_item: any) => {
                this.deptService.list.forEach((item__: any) => {
                  if (item__.id === _item) {
                    item__.user_count--;
                  }
                });
              });
            }
            this.users.delete(item);
          }
        });
      });
    });
  }
  deleteGroup(item) {
    this.httpUser.deleteUserGroup({group_id: item.id}).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.info("删除成功");
        this.users.delete(item);
      }
    });
  }
}




