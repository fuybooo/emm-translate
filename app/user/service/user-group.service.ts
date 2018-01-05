import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {CustomList} from "../../shared/custom-list/custom-list";
import {MessageService} from "../../shared/service/message.service";
import {ModalService} from "../../shared/service/modal.service";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class UserGroupService extends CustomList {
  itemIsActive = null;
  param = {
    search: '',
    group_id: null,
    dept_id: null,
    page: 1,
    pageSize: 50,
    total: 0,
    none: 0,
    all: 0,
    searchResultToTal: '' // 命中用户的数量
  };
  /**
   * 异步验证用户组名称全局唯一
   * @param control
   * @returns {any}
   */
  nameAsyncValidator = (control: FormControl): any => {
    let _this_ = this;
    return Observable.create((observer) => {
      let id = null;
      if (_this_.itemIsActive && _this_.itemIsActive.id > 0) {
        id = _this_.itemIsActive.id;
      }
      _this_.http.post(
        _this_.dataService.url.user.checkGroupName,
        {group_name: control.value, group_id: id}
      ).subscribe((res: any) => {
        if (res.data.isExist) {
          observer.next({error: true, nameAsyncValidator: true});
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }

  constructor(private dataService: DataService,
              private modalService: ModalService,
              private messageService: MessageService,
              private http: HttpClient) {
    super();
  }

  initList(...other) {
    this.param.page = 1;
    this.isLoading = true;
    this.checkedList = [];
    let e = new EventEmitter<any>(true);
    this.getList()
      .subscribe((res: any) => {
        this.list = [];
        if (this.param.search) {
          /**
           * 所有命中用户
           */
          this.list.push({
            id: -3,
            name: "命中用户",
            source: 2,
            user_count: ''
          });
          if (res.data.hasOwnProperty('total')) {
            this.param.total = res.data.total + 1;
          }
        } else {
          /**
           * 所有用户
           */
          this.list.push({
            id: -1,
            name: "所有用户",
            source: 2,
            user_count: res.data.all
          });
          /**
           * 其他用户
           */
          this.list.push({
            id: -2,
            name: "其他用户",
            source: 2,
            user_count: res.data.none
          });
          if (res.data.hasOwnProperty('total')) {
            this.param.total = res.data.total + 2;
          }
        }

        this.list = this.list.concat(res.data.result);

        /**
         * 所有停用用户
         */
        this.list.push({
          id: -4,
          name: "所有停用用户",
          source: 2,
          user_count: res.data.block || ''
        });
        if (res.data.hasOwnProperty('none')) {
          this.param.none = res.data.none;
        }
        if (res.data.hasOwnProperty('page')) {
          this.param.page = res.data.page;
        }
        if (res.data.hasOwnProperty('all')) {
          this.param.all = res.data.all;
        }
        this.isLoading = false;
        e.emit();
      });
    return e;
  }
  initListSimple() {
    this.param.page = 1;
    this.isLoading = true;
    this.checkedList = [];
    this.getList()
      .subscribe((res: any) => {
        this.list = [];
        this.list = this.list.concat(res.data.result);
        if (res.data.hasOwnProperty('total')) {
          this.param.total = res.data.total;
        }
        if (res.data.hasOwnProperty('none')) {
          this.param.none = res.data.none;
        }
        if (res.data.hasOwnProperty('page')) {
          this.param.page = res.data.page;
        }
        if (res.data.hasOwnProperty('all')) {
          this.param.all = res.data.all;
        }
        this.isLoading = false;
      });
  }

  initListPopUp() {
    this.isLoading = true;
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        this.list = res.data.result;
        if (res.data.hasOwnProperty('total')) {
          this.param.total = res.data.total;
        }
        if (res.data.hasOwnProperty('none')) {
          this.param.none = res.data.none;
        }
        if (res.data.hasOwnProperty('page')) {
          this.param.page = res.data.page;
        }
        if (res.data.hasOwnProperty('all')) {
          this.param.all = res.data.all;
        }
        this.isLoading = false;
        e.emit();
      });
    return e;
  }

  nextPage() {
    if (this.list.length < this.param.total) {
      this.param.page++;
      this.getList()
        .subscribe((res: any) => {
          this.list = this.list.concat(res.data.result);
          if (res.data.hasOwnProperty('total')) {
            this.param.total = res.data.total;
          }
          if (res.data.hasOwnProperty('none')) {
            this.param.none = res.data.none;
          }
          if (res.data.hasOwnProperty('page')) {
            this.param.page = res.data.page;
          }
          if (res.data.hasOwnProperty('all')) {
            this.param.all = res.data.all;
          }
        });
    }
  }

  getList(_parame = {}) {
    return this.http.post(this.dataService.url.user.userGroupList, Object.assign({}, this.param, _parame));
  }

  // todo: otherItems 删除其他
  delete(item?, otherItems?: any[]) {
    if (item) {
      this.http.post(this.dataService.url.user.deleteUserGroup,
        {group_id: item.id}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('已删除用户组:' + item.name);
          let index = this.list.indexOf(item);
          if (index > -1) {
            this.list.splice(index, 1);
            this.param.total--;
          }
          index = this.checkedList.indexOf(item);
          if (index > -1) {
            this.checkedList.splice(index, 1);
          }
        }
      });
    } else {
      if (this.checkedList.length < 1) {
        this.messageService.warning('请选择要删除的用户组');
      } else {
        let items = this.checkedList;
        let ids = [];
        let names = [];
        for (let i of items) {
          ids.push(i.id);
          names.push(i.name);
        }
        this.modalService.confirmDelete(() => {
          this.http.post(this.dataService.url.user.deleteUserGroup,
            {group_id: ids.join(',')}).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('已删除用户组:' + names.join(','));
              for (let i of items) {
                let index = this.list.indexOf(i);
                this.list.splice(index, 1);
                this.param.total--;
              }
              this.checkedList = [];
            }
          });
        }, '用户组：<span class="text-primary">' + names.join(',') + '</span> 删除后，<span class="text-primary">这些分组下的用户不会被删除</span>。');
      }
    }
  }

  // add
  add(data: {
    name: string,
    desc: string
  }) {
    return this.http.post(this.dataService.url.user.addUserGroup, data);
  }
  // 添加
  edit(data: {
    group_id: string | number,
    name?: string,
    desc?: string
  }) {
    return this.http.post(this.dataService.url.user.editUserGroup, data);
  }
}
