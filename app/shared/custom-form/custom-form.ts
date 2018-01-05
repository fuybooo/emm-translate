import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {EventEmitter} from "@angular/core";
export class CustomForm {
  /**
   * 布局：'horizontal', 'vertical', 'inline'
   */
  layout = 'horizontal';
  /**
   * loading
   */
  loading?;
  /**
   * label 间隔
   * @type {number}
   */
  gutter = 8;
  /**
   * label 的长度
   * @type {number}
   */
  labelSm = 6;
  labelXs = 24;
  labelLeft = false; // label 左对齐， 默认右对齐
  /**
   * nzSize
   * @type {string}
   */
  inputSize = 'large';
  /**
   * read or edit
   */
  readonly = false;
  /**
   * 是否需要显示按钮组
   */
  showButton = true;
  showSubmitButton = true;
  showCancelButton = true;
  popUp = false;
  /**
   * 编辑按钮：设置当前表单是可编辑的
   */
  editLabel = '编辑';
  /**
   * 提交按钮的提示信息
   */
  submitLabel = '保存';
  /**
   * form 的每一项内容
   */
    // items: CustomFormItem[];
  items: any[];
  // itemsExtend?: CustomFormItem[];
  itemsExtend?: any[];

  // extends?: CustomFormItem[];
  extends?: any[];

  /**
   * 响应式表单对象
   */
  formGroup: FormGroup;
  /**
   * formBuilder
   */
  formBuilder: FormBuilder;
  /**
   * group
   */
  group = {
    init: (items: CustomFormItem[]) => {
      let controls = {};
      for (let item of items) {
        // 设置每一项的初始值 以及按类型回显的回显方案
        let value: any = '';
        if (item.hasOwnProperty('value')) {
          value = item.value;
        } else {
          switch (item.type) {
            case 'select-group':
            case 'select-group-box':
              value = {
                userIds: [],
                users: [],
                groupIds: [],
                groups: [],
                deptIds: [],
                depts: [],
                deviceGroup: [],
                deviceGroupIds: [],
                data: []
              };
              break;
            default:
              value = '';
          }
        }
        controls[item.key] = [value, item.validator || [], item.otherValidator || []];
      }
      if (this.itemsExtend) {
        controls['itemsExtendKey'] = [this.itemsExtend[0].key];
        controls['itemsExtendValue'] = ['', [Validators.maxLength(255)]];
      }
      this.formGroup = this.formBuilder.group(controls);
    },
    add: (item: CustomFormItem) => {
      this.formGroup.addControl(item.key, new FormControl(item.value, item.validator, item.otherValidator));
    },
    remove: (key) => {
      this.formGroup.removeControl(key);
    },
    getData: () => {
      let result = this.formGroup.value;
      for (let key in this.formGroup.controls) {
        if (this.formGroup.controls[key].value && this.formGroup.controls[key].value.trim) {
          result[key] = this.formGroup.controls[key].value.trim();
        }
      }
      return result;
    }
  };

  submitBeforeEvent = new EventEmitter<any>();
  cancelBeforeEvent = new EventEmitter<any>();

  constructor(formBuilder?: FormBuilder, items?: any[], options?: {}) {
    if (formBuilder) {
      this.formBuilder = formBuilder;
    }
    if (this.itemsExtend) {
      this.extends = this.itemsExtend;
    }
    if (items) {
      this.items = items;
    }
    if (options) {
      for (let o in options) {
        if (options.hasOwnProperty(o) && this.hasOwnProperty(o)) {
          this[o] = options[o];
        }
      }
    }
  }

  /**
   *
   */
  init(items?: CustomFormItem[]) {
    if (items) {
      this.group.init(items);
    } else {
      this.group.init(this.items);
    }
  }

  /**
   * @param key
   * @returns {AbstractControl}
   */
  getFormControl(key): FormControl {
    return this.formGroup.controls[key] as FormControl;
  }

  /**
   * set Form
   */
  setForm(): void {
  }

  /**
   * @param e
   */
  addItem(item: CustomFormItem) {
    this.items.push(item);
    this.group.add(item);
  }

  getData(): any {
    let data = this.group.getData();
    // 调用一次添加扩展属性
    if (data.hasOwnProperty('itemsExtendKey') && data.hasOwnProperty('itemsExtendValue')) {
      this.addItemsExtend();
    }
    data = this.group.getData();
    // 去除自定义功能属性
    if (data.hasOwnProperty('itemsExtendKey')) {
      delete data['itemsExtendKey'];
    }
    if (data.hasOwnProperty('itemsExtendValue')) {
      delete data['itemsExtendValue'];
    }
    // 把扩展属性隔离
    if (this.extends && this.extends.length > 0) {
      let extend = {};
      for (let item of this.extends) {
        if (data[item.key]) {
          extend[item.key] = data[item.key];
        }
      }
      data['extend'] = JSON.stringify(extend);
    }
    return data;
  }

  /**
   * 更新每一项的信息
   */
  setData(data) {
    for (let item of this.items) {
      if (data.hasOwnProperty(item.key)) {
        item.value = data[item.key];
      }
    }
    if (this.formGroup) {
      for (let key in data) {
        if (data.hasOwnProperty(key) && this.getFormControl(key)) {
          this.getFormControl(key).reset(data[key]);
        }
      }
    }
    // 把扩展属性隔离
    if (this.extends && this.extends.length > 0) {
      this.extends.forEach((item: any) => {
        this.removeItemsExtend(item);
      });
      this.extends.forEach((item: any) => {
        if (data[item.key]) {
          this.getFormControl('itemsExtendKey').setValue(item.key);
          this.getFormControl('itemsExtendValue').setValue(data[item.key]);
          this.addItemsExtend();
        }
      });
    }
  }

  /**
   * 添加扩展属性
   */
  addItemsExtend() {
    let itemsExtendKey = this.getFormControl('itemsExtendKey').value;
    let itemsExtendValue = this.getFormControl('itemsExtendValue').value;
    if (itemsExtendKey && itemsExtendValue) {
      let item;
      for (let i of this.itemsExtend) {
        if (itemsExtendKey === i.key) {
          item = i;
        }
      }
      item.value = itemsExtendValue;
      this.group.add(item);
      item.removeItemsExtendShow = true;
      this.items.push(item);
      let indexOfExtend = this.itemsExtend.indexOf(item);
      if (indexOfExtend > -1) {
        this.itemsExtend.splice(indexOfExtend, 1);
      }
      if (this.itemsExtend.length > 0) {
        this.getFormControl('itemsExtendKey').setValue(this.itemsExtend[0].key);
        this.getFormControl('itemsExtendValue').setValue('');
      } else {
        this.getFormControl('itemsExtendKey').setValue('');
        this.getFormControl('itemsExtendValue').setValue('');
      }
    } else {
      // todo:
    }
  }

  /**
   * 移除扩展属性
   */
  removeItemsExtend(em) {
    if (em) {
      let item;
      for (let i of this.items) {
        if (em.key === i.key) {
          item = i;
        }
      }
      if (item) {
        this.group.remove(item.key);
        this.itemsExtend.push(item);
        let index = this.items.indexOf(item);
        if (index > -1) {
          this.items.splice(index, 1);
        }
      }
    }
  }

  toEdit() {
    this.readonly = false;
  }

  submitButton() {
    this.submitBeforeEvent.emit();
    let data = this.getData();
    this.submit(data);
  }

  submit(data?) {
  }

  handleCancel(event) {
    this.cancelBeforeEvent.emit();
    this.cancel(event);
  }

  cancel(e?) {
  }
}

export abstract class CustomFormItem {
  /**
   * type ：
   * 'string'
   * 'text'
   * 'stringArray'
   * 'stringTree'
   */
  type? = 'string';
  /**
   * type为 'string'|'stringArray'|'stringTree' & readonly 时有效
   */
  style?;
  /**
   * gutter
   */
  gutter?;
  /**
   * labelSm
   */
  labelSm?;
  /**
   * labelXs
   */
  labelXs?;
  /**
   * labelCue
   */
  labelCue?;
  /**
   * loading
   */
  loading?;
  /**
   * hide
   */
  hide? = false;
  /**
   * key
   */
  key: string;
  /**
   * lable
   */
  label? = '';
  /**
   * required
   */
  required? = false;
  /**
   * readonly
   * @type {boolean}
   */
  readonly? = false;
  /**
   * value
   */
  value?: any = '';
  /**
   * enter
   */
  enter?: EventEmitter<any>;
  /**
   * options
   */
  options?: { label: string, value: string | number | any }[];
  /**
   * validator 简单验证
   */
  validator?: any[] = [];
  /**
   * otherValidator 复杂验证
   */
  otherValidator?: any[] = [];
  /**
   * type为 'string' & edit 时有效
   */
  placeHolder? = '';
  /**
   * 提示信息: validate 验证方法， desc 提示信息
   */
  explains?: { validate: Function, desc: string }[];
  /**
   * 移除扩展项
   */
  removeItemsExtendShow?;
  [propName: string]: any;
}
