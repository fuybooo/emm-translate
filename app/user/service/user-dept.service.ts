import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomListTree} from "../../shared/custom-list/custom-list";
import {DataService} from "../../shared/service/data.service";
import {ModalService} from "../../shared/service/modal.service";
import {MessageService} from "../../shared/service/message.service";
import {UtilService} from "../../shared/util/util.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
declare let $: any;
@Injectable()
export class DeptService extends CustomListTree {
  param = {
    search: '',
    dept_ids: null,
    parentId: '',
    page: 1,
    pageSize: 500,
    total: 0,
    none: 0,
    all: 0,
    searchResultToTal: '' // 命中用户的数量
  };

  constructor(private dataService: DataService,
              private modalService: ModalService,
              private messageService: MessageService,
              private util: UtilService,
              private http: HttpClient) {
    super();
    // 初始选择‘所有用户’
    // this.active({id: -1});
  }

  getList(_parame = {}) {
    return this.http.post(this.dataService.url.user.getDepList, Object.assign(_parame, this.param));
  }

  initList(...other) {
    this.param.page = 1;
    this.isLoading = true;
    this.checkedList = [];
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        this.list = [];
        if (this.param.search) {
          /**
           * 所有命中用户
           */
          this.list.push({
            id: -3,
            isLastNode: true,
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
            isLastNode: true,
            name: "所有用户",
            source: 2,
            user_count: res.data.all
          });
          /**
           * 其他用户
           */
          this.list.push({
            id: -2,
            isLastNode: true,
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
          isLastNode: true,
          name: "所有停用用户",
          source: 2,
          user_count: res.data.block || ''
        });
        // this.list = this.util.convertListToTree(this.list);
        // this.list.forEach(item => {
        //   this.expandDataCache[item.id] = this.util.convertTreeToList(item);
        // });
        /*
         * 原始数据 ==> 树状数据 ==> 扁平数据 ==> 结构化数据
         * */
        this.list = CustomListTree.convertListToTree(this.list);
        let stash = [];
        this.list.forEach(item => {
          stash = stash.concat(CustomListTree.convertTreeToList(item));
        });
        this.list = stash;
        this.param.page = res.data.page || this.param.page;
        this.param.none = res.data.none || this.param.none;
        this.param.total = res.total || this.param.total;
        this.param.all = res.data.all || this.param.all;
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
        this.list = this.util.convertListToTree(this.list);
        this.list.forEach(item => {
          this.expandDataCache[item.id] = this.util.convertTreeToList(item);
        });
        this.param.total = res.data.total || this.param.total;
        this.param.page = res.data.page || this.param.page;
        this.param.none = res.data.none || this.param.none;
        this.param.total = res.total || this.param.total;
        this.param.all = res.data.all || this.param.all;
        this.isLoading = false;
      });
  }
  initListSingle() {
    this.param.page = 1;
    this.isLoading = true;
    this.checkedList = [];
    this.getList()
      .subscribe((res: any) => {
        this.list = [];
        this.list = this.list.concat(res.data.result);
        this.list = CustomListTree.convertListToTree(this.list);
        let stash = [];
        this.list.forEach(item => {
          stash = stash.concat(CustomListTree.convertTreeToList(item));
        });
        this.list = stash;
        this.param.total = res.data.total || this.param.total;
        this.param.page = res.data.page || this.param.page;
        this.param.none = res.data.none || this.param.none;
        this.param.total = res.total || this.param.total;
        this.param.all = res.data.all || this.param.all;
        this.isLoading = false;
      });
  }

  initListPopUp() {
    this.isLoading = true;
    this.getList()
      .subscribe((res: any) => {
        this.list = res.data.result;
        this.list = this.util.convertListToTree(this.list);
        this.list.forEach(item => {
          this.expandDataCache[item.id] = this.util.convertTreeToList(item);
        });
        this.param.total = res.data.total || this.param.total;
        this.param.page = res.data.page || this.param.page;
        this.param.none = res.data.none || this.param.none;
        this.param.total = res.total || this.param.total;
        this.param.all = res.data.all || this.param.all;
        this.isLoading = false;
      });
  }
  // 展开 array:expandDataCache[data.id]
  collapse(array: any[], data, $event) {
    this.util.collapse(array, data, $event);
  }

  // todo: otherItems 删除其他
  delete(item?) {
    if (item) {
      this.http.post(this.dataService.url.user.deleteDept,
        {dept_ids: item.id}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('已删除部门:' + item.name);
          super.delete(item);
        } else if (res.code = "DEPT200004") {
          this.messageService.error('不可删除拥有员工的部门！/不可删除拥有子部门的部门！');
        }
      });
    } else {
      if (this.checkedList.length < 1) {
        this.messageService.info('请选择要删除的部门');
      } else {
        let items = this.checkedList;
        let ids = [];
        let names = [];
        for (let i of items) {
          ids.push(i.id);
          names.push(i.name);
        }
        this.modalService.confirmDelete(() => {
          this.http.post(this.dataService.url.user.deleteDept,
            {dept_ids: ids.join(',')}).subscribe((res: any) => {
            if (res.code === '200') {
              this.messageService.info('已删除部门:' + names.join(','));
              this.initList({isActiveFist: false});
              this.checkedList = [];
            } else if (res.code = "DEPT200004") {
              this.messageService.error('不可删除拥有员工的部门！/不可删除拥有子部门的部门！');
            }
          });
        }, '部门：<span class="text-primary">' + names.join(',') + '</span>');
      }
    }
  }

  /**
   * 异步验证用户组名称全局唯一
   * @param control
   * @returns {any}
   */
  nameAsyncValidator = (control: FormControl): any => {
    let _this_ = this;
    let parent_id;
    if (_this_.itemIsActive && _this_.itemIsActive.id > 0) {
      parent_id = _this_.itemIsActive.id;
    }
    return Observable.create((observer) => {
      _this_.http.post(
        _this_.dataService.url.user.isDeptNameExist,
        {dept_name: control.value, parent_id: parent_id}
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

  /**
   * create
   * @param data
   */
  create(data: {
    dept_name: string,
    parent_id: string | number | null,
    dept_id: string | number | null,
  }) {
    return this.http.post(this.dataService.url.user.createDept, data);
  }

  /**
   * 部门移动参数
     ```
     toDeptId 移动到的deptId
     deptId 被移动的deptId
     ```
     + 返回结果:
     ```
     {
     code: 200,
     msg: 'move success!',
     }
     ```
   */
  moveDept(data: {
    toDeptId: string | number,
    deptId: string | number,
  }) {
    return this.http.post(this.dataService.url.user.moveDept, data);
  }

  /**
   * 移动用户到新部门
   * 参数
   ```
   user_id 被移动的用户Id
   dep_id 被移动用户的当前部门Id
   target_dept_id 被移动用户需要移动到的部门的Id
   ```
   + 返回结果:
   ```
   {
   code: 200,
   msg: 'move success!',
   }
   ```
   */
  moveUser(data: {
    user_id: string | number,
    dep_id: string | number,
    target_dept_id: string | number,
  }) {
    return this.http.post(this.dataService.url.user.moveUser, data);
  }

  show(item) {
    let show = super.show(item);
    /*** start --- y轴滚动条宽度自适应（根据节点调节） ----------------------------- ***/
    let maxNodeLevel = 0;
    this.list.forEach((item_: any) => {
      if (item_.expand && item_.level > maxNodeLevel) {
        maxNodeLevel = item_.level;
      }
    });
    let defaultMin = 271;
    let factMin = document.body.clientWidth * 0.85 * 0.25;
    if (maxNodeLevel) {
      // checkbox delete number padding * 2 + expand + device + marginRight + space + level + text + extra
      let tableWidth = 36 + 33 + 55 + 8 * 2 + 25 + 16 + 5 + 3 + (maxNodeLevel + 1) * 20 + 81 + 50;
      $('.x-axis-scroll-table .ant-table-wrapper').width(Math.max(defaultMin, factMin, tableWidth));
      $('.x-axis-scroll-table .mCSB_container').width(Math.max(defaultMin, factMin, tableWidth));
    } else {
      $('.x-axis-scroll-table .ant-table-wrapper').width(Math.max(defaultMin, factMin));
      $('.x-axis-scroll-table .mCSB_container').width(Math.max(defaultMin, factMin));
    }
    /*** end -------------------------------- ***/
    return show;
  }
}
