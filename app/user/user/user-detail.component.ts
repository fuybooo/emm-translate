import {Component, Input, OnInit} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserFormService, UserGroupFormService, UserGroupService, UserService} from "../user.service";
import {DeptFormService} from "../service/user-dept-form.service";
import {DeptService} from "../service/user-dept.service";
import {MessageService} from "../../shared/service/message.service";
import {blankImgSrc} from "../../shared/shared.model";
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  providers: [UserFormService]
})
export class UserDetailComponent implements OnInit {
  type = '';
  blankImgSrc = blankImgSrc;
  public userForm_: UserFormService = null;
  constructor(private fb: FormBuilder,
              private dataService: DataService,
              private http: HttpClient,
              private userService: UserService,
              private messageService: MessageService,
              public userGroupForm: UserGroupFormService,
              public userForm: UserFormService,
              private deptService: DeptService,
              public deptForm: DeptFormService,
              private userGroupService: UserGroupService) {
    this.userGroupForm.submit = () => {
      let data: any = {...this.userGroupForm.getData(), group_id: this.userGroupForm.getData().id};
      this.userGroupService.edit(data).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('用户组：' + data.name + '修改成功！');
          this.userGroupForm.readonly = true;
          this.userGroupService.initList({isActiveFist: false});
        }
      });
    };
    this.userGroupService.itemActiveEvent.subscribe((data) => {
      if (data && data.id > 0) {
        this.type = 'userGroup';
        this.userGroupForm.loading = true;
        this.userGroupForm.readonly = true;
        this.http.get(this.dataService.url.user.getUserGroupById, this.dataService.getWholeParams({group_id: data.id}))
          .subscribe((res: any) => {
            this.userGroupForm.setData(res.data);
            this.userGroupForm.loading = false;
          });
      } else if (data && data.id === -1) {
        // 所有用户
        this.type = '';
      } else if (data && data.id === -2) {
        // 其他用户
        this.type = '';
      } else if (data && data.id === -3) {
        // 命中用户
        this.type = '';
      } else {
        this.type = '';
      }
    });
    this.deptService.itemActiveEvent.subscribe((item) => {
      this.type = '';
    });
    this.userService.itemActiveEvent.subscribe((item) => {
      if (item && item.hasOwnProperty('state')) {
        this.type = 'user';
        this.userForm_ = new UserFormService(this.http, this.messageService, this.dataService);
        this.userForm.items = this.userForm_.items;
        this.userForm.extends = this.userForm_.extends;
        this.userForm.itemsExtend = this.userForm_.itemsExtend;
        this.userForm.loading = true;
        this.userForm.readonly = true;
        this.userForm.cancel = () => {
          this.userService.itemActiveEvent.emit(item);
        };
        this.http.get(this.dataService.url.user.getUserById, this.dataService.getWholeParams({userId: item.id}))
          .subscribe((res: any) => {
            this.userForm.setData(Object.assign(res.data));
            this.userForm.loading = false;
          });
      } else if (item) {
        this.type = 'userGroup';
        this.userGroupForm.loading = true;
        this.userGroupForm.readonly = true;
        this.http.get(this.dataService.url.user.getUserGroupById, this.dataService.getWholeParams({group_id: item.id}))
          .subscribe((res: any) => {
            this.userGroupForm.setData(res.data);
            this.userGroupForm.loading = false;
          });
      } else {
        // todo : 取消（用户/用户组/部门）选中状态时的情况
        this.type = '';
      }
    });
  }

  ngOnInit() {
  }
}
