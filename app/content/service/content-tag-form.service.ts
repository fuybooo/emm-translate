import {EventEmitter, Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {Validators} from "@angular/forms";
import {ContentTagService} from "./content-tag.service";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class ContentTagFormService extends CustomForm {
  showButton = false;
  items = [
    {
      key: 'name',
      required: true,
      label: '名称',
      placeHolder: '在此输入标签，最多不能超过10个字，按Enter进行添加',
      value: '',
      enter: new EventEmitter(true),
      validator: [
        ValidatorService.required,
        Validators.maxLength(10),
      ],
      otherValidator: [
        // TODO： Tag名称异步重复验证 nameAsyncValidator,
        this.tagService.nameAsyncValidator,
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '标签名称不能为空',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '标签名称不能超过10个字',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('nameAsyncValidator');
          },
          desc: '标签名称已存在，请重新输入',
        }
      ],
    }
  ];
  constructor (private tagService: ContentTagService) {
    super();
  }
}
