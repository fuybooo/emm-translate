import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {MessageService} from "../../shared/service/message.service";
import {DataService} from "../../shared/service/data.service";
import {DeptService} from "./user-dept.service";
import {UtilService} from "../../shared/util/util.service";
import {Observable} from "rxjs/Observable";
import {ValidatorService} from "../../shared/service/validator.service";

@Injectable()
export class DeptFormService extends CustomForm {
  /**
   * 异步验证用户组名称全局唯一
   * @param control
   * @returns {any}
   */
  parent_id = 0;
  dept_id = null;
  popUp = true;
  items = [
    {
      key: 'dept_id',
      hide: true,
    }, {
      key: 'parent_id',
      hide: true,
    }, {
      key: 'dept_name',
      required: true,
      label: '部门名称',
      value: '',
      validator: [
        ValidatorService.required,
        Validators.maxLength(30),
      ],
      otherValidator: [
        (control: FormControl): any => {
          let _this_ = this;
          return Observable.create((observer) => {
            _this_.http.post(
              _this_.dataService.url.user.isDeptNameExist,
              {
                dept_name: control.value,
                dept_id: this.dept_id,
                parent_id: this.parent_id
              }
            ).subscribe((res: any) => {
              if (res.code === '200') {
                observer.next(null);
              } else {
                observer.next({error: true, nameAsyncValidator: true});
              }
              observer.complete();
            });
          });
        }
      ],
      explains: [
        {
          validate: function (item) {
            return item.dirty && item.hasError('required');
          },
          desc: '部门名称不能为空',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('maxlength');
          },
          desc: '部门名称不能超过30个字',
        }, {
          validate: function (item) {
            return item.dirty && item.hasError('nameAsyncValidator');
          },
          desc: '部门名称已存在，请重新输入',
        }
      ],
    }
  ];

  constructor(private http: HttpClient,
              private messageService: MessageService,
              private dataService: DataService) {
    super();
  }

  // submit(data?) {
  //   let d = this.getData();
  //   /*dept_name:部门名称
  //    desc:部门描述
  //    parent_id:父部门id，没有则不传
  //    dept_id:本部门id，如有值则执行更新操作
  //    ```
  //    */
  //   if (this.parent_item && this.parent_item.id > 0) {
  //     /**
  //      * 添加到 this.parent_item
  //      */
  //     this.http.post(this.dataService.url.user.createDept,
  //       {
  //         dept_name: d.dept_name, parent_id: d.parent_id ? d.parent_id : null, dept_id: d.dept_id ? d.dept_id : null
  //       }).subscribe((res: any) => {
  //       if (res.code === '200') {
  //         this.messageService.info('部门：' + d.dept_name + '创建成功！');
  //         /*/!* 更新父节点（expend） *!/
  //         this.parent_item.expand = true;
  //         this.parent_item.isLastNode = false;
  //         /!* 创建一个新键的字节点 *!/
  //         let createNode = {...res.data,
  //           expand: false,
  //           level: this.parent_item.level + 1,
  //           parent: this.parent_item
  //         };
  //         /!* 查找对应的结构化数据位置 *!/
  //         let index = this.deptService.expandDataCache[this.deptService.rootId].indexOf(this.parent_item);
  //         /!* 将自己创建的字节点添加到结构化数据里 *!/
  //         if (index > -1) {
  //           this.deptService.expandDataCache[this.deptService.rootId].splice(index + 1, 0, createNode);
  //         }
  //         // this.deptService.initList({isActiveFist: false});*/
  //
  //         this.pop.destroy({type: 'success-add'});
  //       }
  //     });
  //   } else {
  //     /**
  //      * 添加到 根部门
  //      */
  //     this.http.post(this.dataService.url.user.createDept,
  //       {
  //         dept_name: d.dept_name, parent_id: d.parent_id ? d.parent_id : null, dept_id: d.dept_id ? d.dept_id : null
  //       }).subscribe((res: any) => {
  //       if (res.code === '200') {
  //         this.messageService.info('部门：' + d.dept_name + '创建成功！');
  //         this.pop.destroy('onCancel');
  //         this.pop.destroy({type: 'success-add'});
  //       }
  //     });
  //   }
  // }
}
