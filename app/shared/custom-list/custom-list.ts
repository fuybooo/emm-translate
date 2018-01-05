import {EventEmitter} from "@angular/core";
import {UtilService} from "../util/util.service";
export abstract class CustomList {
  isLoading = true;
  list = [];
  checkedList = [];
  checkedEvent = new EventEmitter<any>(true);
  itemIsActive;
  itemActiveEvent = new EventEmitter<any>(true);
  param: {
    search?: string | number,
    page: number,
    pageSize: number | string,
    // sortName: string, //名称:name，大小:realsize，类型:flag，修改时间:update_time
    // sortOrder: string, // asc|desc
    total?: number,
    [propName: string]: any;
  };
  paramChangeEvent = new EventEmitter<any>(true);
  _param;
  // 全选
  allChecked = false;
  // 半选
  indeterminate = false;

  constructor() {
    this._param = {...this.param};
  }

  nextPage() {
    if (this.list.length < this.param.total) {
      this.param.page++;
      this.getList()
        .subscribe((res: any) => {
          if (res.data && res.data.result) {
            this.list = this.list.concat(res.data.result);
            this.param.total = res.data.total;
          }
        });
    }
  }

  sort(type, order) {
    this.param['sortName'] = type;
    this.param['sortOrder'] = order;
    this.initList({isActiveFist: false});
  }

  initList(...other) {
    let isActiveFist = true;
    other.forEach((item: any) => {
      if (item) {
        if (item.hasOwnProperty('isActiveFist')) {
          isActiveFist = item['isActiveFist'];
        } else if (item['paramCover'] && item.hasOwnProperty('param')) {
          this.param = {...this._param, ...item.param};
        } else if (item.hasOwnProperty('param')) {
          this.param = {...this.param, ...item.param};
        }
      }
    });
    this.param.page = 1;
    this.isLoading = true;
    // 清空选中项
    this.checkedList = [];
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        if (res.data && res.data.result) {
          this.list = res.data.result;
          this.param.total = res.data.total;
          this.isLoading = false;
          if (isActiveFist && this.list.length > 0) {
            this.active(this.list[0]);
          }
        } else {
          this.list = [];
          this.param.total = 0;
          this.isLoading = false;
          this.active({id: -1});
        }
        this.paramChangeEvent.emit(this.param);
        e.emit(res);
      });
    return e;
  }

  abstract getList(_parame?, ...other);

  checked(checked, item, ...other) {
    if (checked) {
      this.checkedList.push(item);
    } else {
      const index = this.checkedList.indexOf(item);
      if (index > -1) {
        this.checkedList.splice(index, 1);
      }
    }

    // 更新全选状态
    if (this.list.every(_item => _item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.list.every(__item => __item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    this.checkedEvent.emit(this.checkedList);
  }

  /**
   * 全选/全不选
   * @param checked
   */
  checkedAll(checked: boolean) {
    this.indeterminate = false;
    if (checked) {
      this.list.forEach((item: any) => {
        item.checked = true;
      });
      this.checkedList = [...this.list];
    } else {
      this.list.forEach((item: any) => {
        item.checked = false;
      });
      this.checkedList = [];
    }
  }

  clearChecked() {
    this.checkedList.forEach(item => item.checked = false);
    this.checkedList = [];
  }

  active(item) {
    if (this.itemIsActive && this.itemIsActive.id === item.id) {
      /* 取消选中 */
      this.itemIsActive = null;
      this.itemActiveEvent.emit();
    } else {
      this.itemIsActive = item;
      this.itemActiveEvent.emit(item);
    }
  }

  // abstract delete?(item?, ...other);
  delete(item) {
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
}

export abstract class CustomListTree extends CustomList {
  /* expandDataCache */
  expandDataCache = [];
  /* 根节点id */
  rootId;

  /**
   * 默认一条数据的parentId为parentIds中的一个，有且只有一个。如果不满足需求可以再加。
   * @param data
   * @returns {string|string}
   */
  static getParentIdStr(data): string {
    let parentIds = ['parentId', 'pId', 'parent_id'];
    for (let item of parentIds) {
      if (item in data) {
        return item;
      }
    }
  }
  /**
   * 判断该节点是否为一个根节点
   */
  static isRoot(item, array): boolean {
    let parentString = this.getParentIdStr(item);
    if (item[parentString]) {
      for (let a of array) {
        if (a.id === item[parentString]) {
          return false; // 此节点存在父节点，故不是根节点
        }
      }
    }
    return true;
  }
  /**
   * 查找子元素
   * @param item
   * @param array
   * @returns {Array}
   */
  static getChildren(item, array) {
    let children = [];
    for (let data of array) {
      let parentId = this.getParentIdStr(data);
      if (item.id === data[parentId]) {
        let _children = this.getChildren(data, array);
        if (_children.length > 0) {
          data.children = _children;
        }
        children.push(data);
      }
    }
    return children;
  }
  /**
   * 将扁平数组转化为树状数组
   * @param array
   * @returns {Array}
   */
  static convertListToTree(array) {
    let list = [];
    for (let item of array) {
      if (this.isRoot(item, array)) {
        let children = this.getChildren(item, array);
        if (children.length > 0) {
          item.children = children;
        }
        list.push(item);
      }
    }
    return list;
  }
  /**
   * 去重复
   * @param node
   * @param hashMap
   * @param array
   */
  static visitNode(node, hashMap, array) {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }
  /**
   * 深度遍历
   * 将树状数据转为扁平数组
   * 数据的属性中必须包含 id (parentId | pId)
   * 不能包含 level expand parent isChecked children
   * @param root
   * @returns {Array}
   */
  static convertTreeToList(root, defaultOpt?) {
    const stack = [], array = [], hashMap = {};
    root.level = 0;
    root.expand = defaultOpt || false;
    stack.push(root);
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          node.children[i].level = node.level + 1;
          node.children[i].expand = !!node.children[i].expand;
          node.children[i].parent = node;
          stack.push(node.children[i]);
        }
      }
    }
    return array;
  }

  constructor() {
    super();
  }
  initList(...other) {
    let e = new EventEmitter(true);
    super.initList({isActiveFist: false}).subscribe(() => {
      /*
      * 原始数据 ==> 树状数据 ==> 扁平数据 ==> 结构化数据
      * */
      this.list = CustomListTree.convertListToTree(this.list);
      let stash = [];
      this.list.forEach(item => {
        stash = stash.concat(CustomListTree.convertTreeToList(item));
      });
      this.list = stash;
    });
    return e;
  }
  show(item) {
    /**
     * 由此节点的所有父级节点决定此节点是否显示
     * @param item_
     * @returns {any}
     */
    let showByParent = (item_) => {
      if (item_.expand) {
        if (item_.parent) {
          return showByParent(item_.parent);
        } else {
          return true;
        }
      } else {
        /**
         * 当此节点关闭时：关闭此节点下所有的子节点
         */
        let closeChildren = (items) => {
          items.forEach((item__: any) => {
            item__.expand = false;
            if (item__.children) {
              closeChildren(item__.children);
            }
          });
        };
        if (item_.children) {
          closeChildren(item_.children);
        }
        return false;
      }
    };
    if (item.level === 0) {
      return true;
    } else if (item.parent) {
      return showByParent(item.parent);
    } else {
      // 错误的情况（不是根节点必有父节点）
      return false;
    }
  }
  delete(item) {
    if (item.parent) {
      let index_ = item.parent.children.indexOf(item);
      if (index_ > -1) {
        item.parent.children.splice(index_, 1);
      }
      if (item.parent.children.length === 0) {
        item.parent.isLastNode = true;
      }
    }
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
  /**
   * 级联选择
   * @param checked
   * @param item
   * @param other
   */
  checkedExpand(checked, item, ...other) {
    if (checked) {
      let list = this.checkedList;
      list.push(item);
      /**
       * 级联选中
       * @param item_
       * @param list_
       */
      let getChildrenAll = (item_, list_) => {
        if (item_.children) {
          item_.children.forEach((_item: any) => {
            _item.checked = true;
            list_.push(_item);
            getChildrenAll(_item, list_);
          });
        }
      };
      getChildrenAll(item, list);
    } else {
      const index = this.checkedList.indexOf(item);
      if (index > -1) {
        this.checkedList.splice(index, 1);
      }
      /**
       * 级联取消选中
       * @param item_
       * @param list_
       */
      let getChildrenAll = (item_, list_) => {
        if (item_.children) {
          item_.children.forEach((_item: any) => {
            _item.checked = false;
            const i = list_.indexOf(_item);
            if (i > -1) {
              list_.splice(i, 1);
            }
            getChildrenAll(_item, list_);
          });
        }
      };
      getChildrenAll(item, this.checkedList);
    }
    this.checkedEvent.emit(this.checkedList);
  }
}
