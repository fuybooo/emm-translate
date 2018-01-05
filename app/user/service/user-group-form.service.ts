import {Inject, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {FormBuilder, Validators} from "@angular/forms";
import {DataService} from "../../shared/service/data.service";
import {MessageService} from "../../shared/service/message.service";
import {HttpClient} from "@angular/common/http";
import {UserGroupService} from "./user-group.service";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class UserGroupFormService extends CustomForm {
  items = [
    {
      key: 'id',
      hide: true,
    }, {
      key: 'name',
      required: true,
      label: '用户组名称',
      value: '',
      validator: [
        ValidatorService.required,
        Validators.maxLength(30),
      ],
      otherValidator: [
        this.userGroupService.nameAsyncValidator,
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '用户组名称不能为空',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '用户组名称不能超过30个字',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('nameAsyncValidator');
          },
          desc: '用户组名称已存在，请重新输入',
        }
      ],
    }, {
      type: 'text',
      key: 'desc',
      label: '用户组描述',
      value: '',
      validator: [
        Validators.maxLength(150),
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '用户组描述不能超过150个字',
        },
      ],
    }, {
      key: 'created_by',
      label: '创建人',
      value: '',
      readonly: true,
    }, {
      key: 'created_at',
      label: '创建时间',
      value: '',
      readonly: true,
    }
  ];

  constructor(public http: HttpClient,
              private userGroupService: UserGroupService,
              private messageService: MessageService,
              private dataService: DataService) {
    super();
  }
  cancel() {
    this.readonly = true;
  }
}
