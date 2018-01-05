import {Component, Inject, OnInit} from "@angular/core";
import {AdminService} from "../service/admin.service";
import {MessageService} from "../../shared/service/message.service";
import {NzModalService} from "ng-zorro-antd";
import {SettingHttpService} from "../service/setting-http.service";
import {ModalService} from "../../shared/service/modal.service";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {UserHttpService} from "../../user/service/user-http.service";
@Component({
  selector: 'app-setting-admin',
  templateUrl: './setting-admin.component.html',
  providers: [
    AdminService,
    UserHttpService
  ]
})
export class SettingAdminComponent implements OnInit {
  modal;
  adminType = 'allAdministrator';
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.adminService.nextPage();
      }
    }
  };

  constructor(public adminService: AdminService,
              private http: SettingHttpService,
              private httpUser: UserHttpService,
              private modalService: ModalService,
              private nzModalService: NzModalService,
              private messageService: MessageService) {
    adminService.isLoading = false;
    adminService.initList({isActiveFist: false});
  }

  ngOnInit() {
  }

  /**
   * 搜索
   * @param search
   */
  doSearch(search) {
    this.adminService.param.search = search;
    this.adminService.initList({isActiveFist: false});
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }
  /**
   * 选择管理员类型  0：超级管理员 1：全局查看管理员 2：部门管理员 3：部门查看管理员
   */
  adminTypeCheck(type) {
    switch (type) {
      case 'allAdministrator':
        this.adminService.param.role = null;
        break;
      case 'superAdministrator':
        this.adminService.param.role = 0;
        break;
      case 'departmentAdministrator':
        this.adminService.param.role = 2;
        break;
      case 'superReadOnlyAdministrator':
        this.adminService.param.role = 1;
        break;
      case 'departmentReadOnlyAdministrator':
        this.adminService.param.role = 3;
        break;
    }
    this.adminType = type;
    this.adminService.allChecked = false;
    this.adminService.indeterminate = false;
    this.adminService.initList({isActiveFist: false});
  }
  // 添加管理员
  add() {
    class AddAdminForm extends CustomForm {
      labelSm = 5;
      popUp = true;
      items = [
        {
          hide: false,
          type: 'select',
          required: true,
          label: '管理员',
          key: 'userIds',
          value: [],
          options: [],
          nzSearchChange: (search?) => {
            this.http.getUserList({search: search, page: 1, pageSize: 10})
              .subscribe((res: any) => {
                let options = [];
                for (let g of res.data.result) {
                  if (this.getFormControl('userIds').value && !this.getFormControl('userIds').value.find(id => id === g.id)) {
                    options.push({label: g.name, value: g.id});
                  }
                }
                if (search && options.length === 0) {
                  options.push({label: '没有匹配的结果', disabled: true, value: -1});
                }
                this.items[0] = Object.assign(this.items[0], {options: options});
                this.getFormControl('userIds').setValue(this.getFormControl('userIds').value);
              });
          }
        }, {
          hide: false,
          type: "radio",
          label: "管理员角色",
          key: 'role',
          row: true,
          required: true,
          value: "add_edit100",
          options: [
            {
              label: "超级管理员",
              value: "add_edit100",
            }, {
              label: "部门管理员",
              value: "add_edit103",
            }, {
              label: "全局只读管理员",
              value: "add_edit101",
            }, {
              label: "部门只读管理员",
              value: "add_edit102",
            },
          ],
          change: (value) => {
            if (value === 'add_edit103' || value === 'add_edit102') {
              this.items[2].hide = false;
            } else {
              this.items[2].hide = true;
            }
          }
        }, {
          hide: true,
          required: true,
          type: 'select-group',
          key: 'distribution',
          value: {},
          labels: ['dept'],
          label: '选择部门',
          selectLabel: '请选择部门',
          resultLabel: '选择部门'
        }
      ];
      constructor(private http: UserHttpService) {
        super();
      }
    }
    this.modal = this.nzModalService.open({
      title: '添加管理员',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new AddAdminForm(this.httpUser)
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        if (result.data.userIds.length === 0 ) {
          this.messageService.warning("请选择用户，赋予管理员权限！");
          return ;
        }
        if (result.data.role === 'add_edit103' || result.data.role === 'add_edit102') {
          if (!result.data.distribution.deptIds || (result.data.distribution.deptIds && result.data.distribution.deptIds.length === 0)) {
            this.messageService.warning("请选择部门");
            return ;
          }
        }
        this.http.addAdmin({
          userId: result.data.userIds.join(','),
          permission: result.data.role,
          depId: result.data.distribution.deptIds ? result.data.distribution.deptIds.join(',') : null
        }).subscribe((res: any) => {
          // SETPERMISSIONDEINE500013：权限不足
          // SETADMIN500002：添加的管理员信息不全
          // SETADMIN500006：管理员已存在
          if (res.code === '200') {
            this.adminService.initList({isActiveFist: false});
            this.modal.destroy();
          } else if (res.code === 'SETPERMISSIONDEINE500013') {
            this.messageService.info("权限不足");
          } else if (res.code === 'SETADMIN500002') {
            this.messageService.info("添加的管理员信息不全");
          } else if (res.code === 'SETADMIN500006') {
            this.messageService.info("管理员已存在");
          }
        });
      }
    });
  }
  // 编辑管理员
  edit(item) {
    class AddAdminForm extends CustomForm {
      labelSm = 5;
      popUp = true;
      items = [
        {
          hide: false,
          type: "radio",
          label: "管理员角色",
          key: 'role',
          row: true,
          required: true,
          value: "0",
          options: [
            {
              label: "超级管理员",
              value: "add_edit100",
            }, {
              label: "部门管理员",
              value: "add_edit103",
            }, {
              label: "全局只读管理员",
              value: "add_edit101",
            }, {
              label: "部门只读管理员",
              value: "add_edit102",
            }
          ],
          change: (value) => {
            if (value === 'add_edit103' || value === 'add_edit102') {
              this.items[1].hide = false;
            } else {
              this.items[1].hide = true;
            }
          }
        }, {
          hide: false,
          required: true,
          type: 'select-group',
          key: 'distribution',
          value: {},
          labels: ['dept'],
          label: '选择部门',
          selectLabel: '请选择部门',
          resultLabel: '选择部门'
        }
      ];
      constructor(private http: UserHttpService) {
        super();
      }
    }
    let add = new AddAdminForm(this.httpUser);
    switch (item.role) {
      case '0':
        add.items[0].value = "add_edit100";
        add.items[1].hide = true;
        break;
      case '2':
        add.items[0].value =  "add_edit103";
        add.items[1].hide = false;
        add.items[1].value = {
          depts: item['depInfo']
        };
        break;
      case '1':
        add.items[0].value =  "add_edit101";
        add.items[1].hide = true;
        break;
      case '3':
        add.items[0].value =  "add_edit102";
        add.items[1].hide = false;
        add.items[1].value = {
          depts: item['depInfo']
        };
        break;
    }
    this.modal = this.nzModalService.open({
      title: '编辑管理员',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: add
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        if (result.data.role === 'add_edit103' || result.data.role === 'add_edit102') {
          if (!result.data.distribution.deptIds || (result.data.distribution.deptIds && result.data.distribution.deptIds.length === 0)) {
            this.messageService.warning("请选择部门");
            return ;
          }
        }
        this.http.updateAdmin({
          adminId: item.id,
          permission: result.data.role,
          depId: result.data.distribution.deptIds ? result.data.distribution.deptIds.join(',') : null
        }).subscribe((res: any) => {
          // SETADMIN500001：权限不足
          // SETADMIN500002：添加的管理员信息不全
          if (res.code === '200') {
            this.adminService.initList({isActiveFist: false});
            this.modal.destroy();
          } else if (res.code === 'SETADMIN500001') {
            this.messageService.info("权限不足");
          } else if (res.code === 'SETADMIN500002') {
            this.messageService.info("添加的管理员信息不全");
          }
        });
      }
    });
  }
  // 撤销管理员
  delete(item) {
    let ids = [];
    let name = [];
    if (item) {
      ids.push(item.id);
      name.push(item.userName);
    } else {
      this.adminService.checkedList.forEach((i: any) => {
        ids.push(i.id);
        name.push(i.userName);
      });
    }
    if (ids.length === 0 ) {
      this.messageService.warning("请选择撤销对象");
      return ;
    }
    this.modal = this.modalService.confirmDelete(() => {
      this.http.delAdmin({
        adminIds: ids.join(',')
      }).subscribe((res: any) => {
        // SETADMIN500001：权限不足
        // SETADMIN500008：管理员信息不存在
        if (res.code === '200') {
          this.messageService.info("撤销成功");
          this.adminService.checkedList = [];
          this.adminService.initList({isActiveFist: false});
        } else if (res.code === 'SETADMIN500001') {
          this.messageService.info("权限不足");
        } else if (res.code === 'SETADMIN500008') {
          this.messageService.info("管理员信息不存在");
        }
      });
    }, '确定要撤销，<span class="text-primary">' + name.join(',') + '</span>的管理员权限吗？');
  }
}
