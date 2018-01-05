import {DataService} from "../../shared/service/data.service";
import {MessageService} from "../../shared/service/message.service";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Inject, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {UserGroupService} from "./user-group.service";
import {UserService} from "./user-user.service";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class AddUserFormService extends CustomForm {
  gutter = 20;
  popUp = true;
  pop;
  items = [
    {
      hide: true,
      label: '用户名',
      required: true,
      key: 'username',
      placeHolder: '请输入用户名',
      // validator: [
      //   ValidatorService.required,
      //   Validators.maxLength(100)
      // ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '用户名不能为空',
        }, {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过100个字",
        }
      ],
    }, {
      label: '邮箱',
      key: 'email',
      required: true,
      placeHolder: '请输入邮箱',
      validator: [
        ValidatorService.required,
        (control: FormControl): { [s: string]: boolean } => {
          if (this.formGroup) {
            if (control.value[0] === ' ') {
              control.setValue(control.value.trim(), {
                onlySelf: true,
                emitEvent: false,
                emitModelToViewChange: false,
                emitViewToModelChange: false
              });
            }
            return Validators.email(control);
          }
          return null;
        }
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '邮箱不能为空',
        },
        {
          validate: (o) => {
            return o.dirty && o.hasError('email') && !o.hasError('required');
          },
          desc: "请输入正确的邮箱地址",
        },
      ],
    }, {
      key: 'display_name',
      required: true,
      label: '姓名',
      validator: [
        ValidatorService.required, Validators.maxLength(100)
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '用户名不能为空',
        }, {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过100个字",
        }
      ],
    }, {
      type: 'select',
      label: '用户组',
      key: 'group_ids',
      value: [],
      options: [],
      nzSearchChange: (search?) => {
        this.userGroupService.getList({search: search, page: 1, pageSize: 10})
          .subscribe((res: any) => {
            let options = [];
            for (let g of res.data.result) {
              if (this.getFormControl('group_ids').value && !this.getFormControl('group_ids').value.find(id => id === g.id)) {
                options.push({label: g.name, value: g.id});
              }
            }
            if (search && options.length === 0) {
              options.push({label: '没有匹配的结果', disabled: true, value: -1});
            }
            Object.assign(this.items[3], {options: options});
            this.getFormControl('group_ids').setValue(this.getFormControl('group_ids').value);
          });
      },
    }, {
      type: 'checkbox',
      key: 'send',
      placeHolder: '发送激活邮件'
    }, {
      key: 'dept_id',
      hide: true
    }
  ];
  itemsExtend = [
    {
      key: 'mobile',
      label: '手机号',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }, {
      key: 'telephone',
      label: '座机号码',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }, {
      key: 'fax',
      label: '传真',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }, {
      key: 'address',
      label: '地址',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }, {
      key: 'post',
      label: '岗位',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }, {
      key: 'grade',
      label: '职务级别',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        },
      ]
    }
  ];
  extends = [];
  constructor(private http: HttpClient,
              private messageService: MessageService,
              private dataService: DataService,
              private userService: UserService,
              private userGroupService: UserGroupService) {
    super();
    this.extends = Object.assign([], this.itemsExtend);
  }
  cancel() {
    if (this.pop) {
      this.pop.destroy('onCancel');
    }
  }
}
