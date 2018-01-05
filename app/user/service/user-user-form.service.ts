import {Inject, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "../../shared/service/message.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class UserFormService extends CustomForm {
  gutter = 20;
  items = [
    {
      key: 'userId',
      hide: true
    }, {
      key: 'displayName',
      label: '姓名',
      required: true,
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
        },
      ]
    }, {
      hide: true,
      label: '用户名',
      required: true,
      readonly: true,
      key: 'userName',
      placeHolder: '请输入用户名',
      validator: [
        ValidatorService.required, Validators.maxLength(100),
        // (control: FormControl): { [s: string]: boolean } => {
        //   return Validators.email(control);
        // }
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
        }, /*{
         validate: (o) => {
         return o.dirty && o.hasError('email') && !o.hasError('maxlength') && !o.hasError('required');
         },
         desc: "请输入正确的邮箱地址",
         },*/
      ],
    }, {
      label: '邮箱',
      key: 'email',
      placeHolder: '请输入邮箱',
      readonly: true
    }, {
      label: '状态',
      key: 'userStatus',
      pipe: 'user-detail-status',
      readonly: true
    }, {
      label: '所在部门',
      pipe: 'user-detail-dept',
      key: 'deptPathNameList',
      readonly: true
    }, {
      label: '所在组',
      pipe: 'user-detail-group',
      key: 'groupNameList',
      readonly: true
    }, {
      label: '所持设备',
      key: 'devices',
      pipe: 'user-detail-devices',
      readonly: true
    }, {
      label: '创建时间',
      type: 'time',
      key: 'createdAt',
      value: '2017-08-01',
      readonly: true
    }, {
      type: 'string',
      label: '创建人',
      key: 'adminName',
      readonly: true
    }
  ];
  itemsExtend = [
    {
      key: 'mobile',
      label: '手机号',
    }, {
      key: 'telephone',
      label: '座机号码'
    }, {
      key: 'fax',
      label: '传真'
    }, {
      key: 'address',
      label: '地址'
    }, {
      key: 'post',
      label: '岗位'
    }, {
      key: 'grade',
      label: '职务级别'
    }
  ];
  extends = [];

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private dataService: DataService) {
    super();
    this.extends = Object.assign([], this.itemsExtend);
  }

  cancel() {}

  submit(_data = {}) {
    let data = this.getData();
    /**
     * user_id:用户id   display_name:   extend:用户拓展信息
     * @type
     * @private
     */
    let data_ = {
      user_id: data.userId,
      display_name: data.displayName,
      extend: ""
    };
    // 用户扩展属性转换
    let extend = {};
    for (let item of this.extends) {
      if (data[item.key]) {
        extend[item.key] = data[item.key];
      }
    }
    data_.extend = JSON.stringify(extend);
    this.http.post(this.dataService.url.user.updateUser, data_).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.info('更新用户：' + data.userName);
        this.readonly = true;
      }
    });
  }
}
