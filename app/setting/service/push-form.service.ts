import {EventEmitter, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {Validators} from "@angular/forms";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class PushFormService extends CustomForm {
  labelSm = 3;
  showButton = false;
  // labelLeft = true;
  /**
   * pushId: number | string, // 推送id,新建为空
   title: string, // 表题
   content: string, // 推送内容
   sendType: string, // 立即推送|定时推送
   userIds: string, // 用户ids
   deptIds: string, // 部门ids
   userGroupIds: string, // 分组ids
   sendDate: string, // 推送时间
   draft: string | number, //  0不是草稿，1是草稿
   platformType: string, // 平台 : [iOS(苹果) | Android(安卓) | iOS,Android(两个都勾选)]
   messageType: string, // 消息类型 0：普通消息，1：需要目标进行回复的消息
   */
  items = [
    {
      key: 'pushId',
      hide: true
    }, {
      key: 'title',
      label: '标题',
      required: true,
      validator: [
        ValidatorService.required,
        Validators.maxLength(30),
      ],
      // otherValidator: [
      //   this.deptService.nameAsyncValidator,
      // ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '推送标题不能为空',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '推送标题不能超过30个字',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('nameAsyncValidator');
          },
          desc: '推送已存在，请重新输入',
        }
      ],
    }, {
      type: 'text',
      key: 'content',
      label: '内容',
      required: true,
      validator: [
        ValidatorService.required,
        Validators.maxLength(300),
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '推送内容不能为空',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '推送内容不能超过300个字',
        }
      ],
    }, {
      type: 'select',
      key: 'platformType',
      label: '平台',
      options: [
        {
          label: '苹果',
          value: 'iOS'
        }, {
          label: '安卓',
          value: 'Android'
        }
      ],
      required: true,
      validator: [
        ValidatorService.required,
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '推送平台不能为空'
        }
      ],
    }, {
      type: 'select-group-box',
      key: 'obj',
      label: '推送对象',
      required: true,
    }, {
      type: 'radio-push',
      key: 'sendType',
      label: '推送时间',
      value: '0',
      options: [
        {
          label: '立即',
          value: '0'
        }, {
          label: '定时',
          value: '1'
        }
      ],
      required: true,
    }, {
      key: 'time',
      hide: true,
    }, {
      key: 'date',
      hide: true,
    }, {
      key: 'createDate',
      label: '创建时间',
      readonly: true,
      hide: true,
    }, {
      key: 'totalCount',
      label: '总设备数',
      readonly: true,
      hide: true,
    }, {
      key: 'successCount',
      label: '已阅读',
      readonly: true,
      hide: true,
    }
  ];

  constructor() {
    super();
  }
}
