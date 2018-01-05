import {Injectable} from "@angular/core";

@Injectable()
export class UtilService {
  /**
   * 展开树状数据
   * @param array
   * @param data
   * @param $event
   */
  collapse(array, data, $event) {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
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
  convertTreeToList(root, defaultOpt?) {
    const stack = [], array = [], hashMap = {};
    stack.push({...root, level: 0, expand: defaultOpt || false});
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({...node.children[i], level: node.level + 1, expand: !!node.children[i].expand, parent: node});
        }
      }
    }
    return array;
  }


  /**
   * 改变结构化数据的激活状态，传入data时激活data项，否则清空其选中装填
   * @param expandDataCache
   * @param data
   */
  changeExpandActive(expandDataCache, data?) {
    for (let i in expandDataCache) {
      let array = expandDataCache[i];
      for (let item of array) {
        if (item.isActive) {
          item.isActive = false;
        }
      }
    }
    if (data) {
      for (let i in expandDataCache) {
        let array = expandDataCache[i];
        for (let item of array) {
          if (item.id === data.id) {
            item.isActive = true;
          }
        }
      }
    }
  }

  /**
   * 获取结构化数据中展开着的最大级别的节点
   */
  getMaxLevel4Expanded(expandDataCache) {
    let nodes = [];
    for (let p in expandDataCache) {
      if (expandDataCache.hasOwnProperty(p)) {
        let array = expandDataCache[p];
        for (let item of array) {
          if (item.expand) {
            nodes.push(item);
          }
        }
      }
    }
    this.bubbleSort(nodes);
    return nodes.pop();
  }

  /**
   * 冒泡排序
   */
  bubbleSort(array) {
    let length = array.length;
    for (let outer = length; outer >= 2;  --outer) {
      for (let inner = 0; inner < outer - 1; ++inner) {
        if (array[inner].level > array[inner + 1].level) {
          this.swap(array, inner, inner + 1);
        }
      }
    }
  }

  /**
   * swap
   */
  swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  /**
   * 改变结构化数据的选中状态
   * @param expandDataCache
   */
  clearExpandChecked(expandDataCache) {
    for (let i in expandDataCache) {
      let array = expandDataCache[i];
      for (let item of array) {
        if (item.isChecked) {
          item.isChecked = false;
        }
      }
    }
  }

  clearChecked(list) {
    for (let item of list) {
      if (item.isChecked) {
        item.isChecked = false;
      }
    }
  }

  /**
   * 设置数据的是否激活状态
   * @param list
   * @param data
   * @param field
   * @param isActive true：直接将data设置为true，false，将其设置为它原来的状态的反面
   */
  changeActive(list, data?, isActive = true, field = '') {
    this.clearActive(list);
    if (data) {
      for (let item of list) {
        let key;
        if (field === '') {
          key = this.getKey(data);
        } else {
          key = field;
        }
        if (item[key] === data[key]) {
          if (isActive) {
            item.isActive = true;
          } else {
            item.isActive = !item.isActive;
          }
        }
      }
    }
  }

  clearActive(list) {
    for (let item of list) {
      if (item.isActive) {
        item.isActive = false;
      }
    }
  }

  findActive(list) {
    let activeArray = [];
    for (let item of list) {
      if (item.isActive) {
        activeArray.push(item);
      }
    }
    return activeArray;
  }

  /**
   * 去重复
   * @param node
   * @param hashMap
   * @param array
   */
  private visitNode(node, hashMap, array) {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }

  /**
   * 将扁平数组转化为树状数组
   * @param array
   * @returns {Array}
   */
  convertListToTree(array) {
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
   * 判断该节点是否为一个根节点
   */
  isRoot(item, array): boolean {
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
   * 查找元素
   */
  findMatchNode(array, value, field = 'id'): any {
    for (let item of array) {
      if (value === item[field]) {
        return item;
      }
    }
  }

  findParentNode(array, pid) {
    for (let item of array) {
      if (pid === item.id) {
        return item;
      }
    }
  }

  findFullName(array, id, nameStr = 'name', split = ' > ') {
    let names = '';
    let _array = this.findAllParent(array, id);
    for (let item of _array) {
      names += item[nameStr] + split;
    }
    return names + this.findMatchNode(array, id)[nameStr];
  }

  findAllParent(array, id, _array = []): any[] {
    let me = this.findMatchNode(array, id);
    let parentString = this.getParentIdStr(me);
    let parent = this.findParentNode(array, me[parentString]);
    if (parent) {
      _array.unshift(parent);
      return this.findAllParent(array, parent.id, _array);
    } else {
      return _array;
    }
  }

  /**
   * 获取选中的数据，如果勾选的数据中有父子关系的数据，则只保留其中的父级
   * @returns {any[]}
   */
  getSelectedData(expandDataCache) {
    let selected = [];
    let _selected = [];
    for (let i in expandDataCache) {
      let array = expandDataCache[i];
      for (let item of array) {
        if (item.isChecked) {
          selected.push(item);
        }
      }
    }
    let uniqueObject: any = {};
    selected.forEach(item => {
      if (!uniqueObject[item.id]) {
        _selected.push(item);
        uniqueObject[item.id] = 1;
      }
    });
    // 判断每一项在这些选中的数据中都有没有父节点，如果有则排除掉
    // return _selected.filter(item => {
    //   return !this.findParentNode(_selected, item.parentId);
    // });

    // 直接返回被勾选的数据
    return _selected;
  }

  /**
   * 同步是否选中状态
   * @param expandDataCache
   * @param dest
   */
  syncStatusFormExpandDataToSource(expandDataCache, dest) {
    for (let i in expandDataCache) {
      let array = expandDataCache[i];
      for (let item of array) {
        for (let d of dest) {
          if (item.id === d.id) {
            d.isChecked = item.isChecked;
            d.expand = item.expand;
          }
        }
      }
    }
  }

  getDisplayData(expandDataCache, dest) {
  }

  /**
   * 同步是否选中状态
   * @param source
   * @param expandDataCache
   */
  syncStatusFormSourceToExpandData(source, expandDataCache) {
    let count = 0;
    for (let item of source) {
      for (let i in expandDataCache) {
        let array = expandDataCache[i];
        for (let a of array) {
          if (a.id === item.id) {
            count++;
            a.isChecked = item.isChecked;
            a.expand = item.expand;
          }
        }
      }
    }
  }
  getMaxDepth(expandDataCache) {
    let depthArray = [];
    for (let p in expandDataCache) {
      if (expandDataCache.hasOwnProperty(p)) {
        let childTree = expandDataCache[p];

      }
    }
  }
  getMaxDepth2(expandDataCache) {
    let depthArray = [];
    for (let p in expandDataCache) {
      if (expandDataCache.hasOwnProperty(p)) {
        let childTree = expandDataCache[p];
        if (childTree.length > 0) {
          let hasChild = false;
          for (let p2 in childTree) {
            if (childTree.hasOwnProperty(p2)) {
              let childTree2 = childTree[p2];
              if (childTree2.children && childTree2.children.length) {
                hasChild = true;
              }
            }
          }
          if (hasChild) {

          }
        }
      }
    }
  }

  /**
   * 查找子元素
   * @param item
   * @param array
   * @returns {Array}
   */
  private getChildren(item, array) {
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
   * 默认一条数据的parentId为parentIds中的一个，有且只有一个。如果不满足需求可以再加。
   * @param data
   * @returns {string|string}
   */
  private getParentIdStr(data): string {
    let parentIds = ['parentId', 'pId', 'parent_id'];
    for (let item of parentIds) {
      if (item in data) {
        return item;
      }
    }
  }

  /**
   * 默认一条数据的关键字
   * @param data
   * @returns {string|string}
   */
  getKey(data): string {
    let keys = ['id', 'userName', 'name', 'label'];
    for (let item of keys) {
      if (item in data) {
        return item;
      }
    }
  }

  /**
   * 获取所有勾选选中的项，无层级分别
   */
  getCheckedData(list) {
    let checkedArray = [];
    for (let i = 0; list && i < list.length; i++) {
      let item = list[i];
      if (item.isChecked) {
        checkedArray.push(item);
      }
    }
    return checkedArray;
  }

  /**
   * 根据数组获取所有的id
   */
  getIdsByList(list, isAll = false, key = 'id') {
    let ids = '';
    for (let i = 0; list && i < list.length; i++) {
      let item = list[i];
      if (isAll) {
        ids += item[key] + ',';
      } else {
        if (item.isChecked) {
          ids += item[key] + ',';
        }
      }
    }
    return ids.slice(0, -1);
  }

  /**
   * 获取用户字符串
   */
  getUsersByList(list) {
    let users = '';
    for (let i = 0; list && i < list.length; i++) {
      let item = list[i];
      users += item.displayName + ',';
    }
    return users.slice(0, -1);
  }

  isEmptyObject(object) {
    let hasPro = false;
    if (object && typeof object === 'object') {
      for (let i in object) {
        if (object.hasOwnProperty(i)) {
          hasPro = true;
          break;
        }
      }
    }
    return !hasPro;
  }

  /**
   * 判断两个字符串数组中是否有相同的项
   * @param list
   * @param _list
   * @returns {boolean}
   */
  isContainSameElement(list, _list) {
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      for (let j = 0; j < _list.length; j++) {
        let _item = _list[j];
        if (item === _item) {
          return true;
        }
      }
    }
    return false;
  }

  getReplenishArray(list, length = 5) {
    list = list || [];
    let len = list.length;
    if (len >= length) {
      return list;
    }
    let result = [];
    for (let i = 0; i < length; i++) {
      if (i < len) {
        result.push(list[i]);
      } else {
        result.push({});
      }
    }
    return result;
  }

  getUnReplenishArray(list) {
    let _list = [];
    for (let item of list) {
      if (!this.isEmptyObject(item)) {
        _list.push(item);
      }
    }
    return _list;
  }

  /**
   * 填充性push，遇到{}则替换掉，否则push到最后
   * @param list
   * @param data
   * @param field
   * @param length
   */
  replenishPush(list, data, field = '', length = 5) {
    list = this.getReplenishArray(list, length);
    let hasPushed = false;
    // 判断是否重复
    if (field !== '') {
      let isSame = false;
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item[field] === data[field]) {
          isSame = true;
          break;
        }
      }
      if (isSame) {
        return false;
      }
    }
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      if (this.isEmptyObject(item) || item[field] === '') {
        list[i] = data;
        hasPushed = true;
        break;
      }
    }
    if (!hasPushed) {
      list.push(data);
    }
    return list;
  }

  replenishConcat(list, _list, field = '', length = 5) {
    for (let item of _list) {
      let result = this.replenishPush(list, item, field, length);
      if (result) {
        list = result;
      }
    }
    return list;
  }

  getAvailableObj(object) {
    let _object = {};
    for (let p in object) {
      if (object.hasOwnProperty(p)) {
        if (object[p] !== null && object[p] !== '--' && object[p] !== '') {
          _object[p] = object[p];
        }
      }
    }
    return this.isEmptyObject(_object) ? false : _object;
  }

  getObjectList(list, field = 'URL') {
    let objectList = [];
    if (list && list.length) {
      for (let i = 0; i < list.length; i ++) {
        objectList.push({
          [field]: list[i]
        });
      }
    }
    return objectList;
  }
  getSimpleList(list, ...fields) {
    let _list = [];
    for (let item of list) {
      if (item[fields[0]]) {
        let _obj: any = {};
        for (let _i of fields) {
          _obj[_i] = item[_i];
        }
        _list.push(_obj);
      }
    }
    return _list;
  }

  getSimpleStringList(list, field = 'id') {
    let _list = [];
    if (list && list.length) {
      for (let item of list) {
        if (item[field]) {
          _list.push(item[field]);
        }
      }
    }
    return _list;
  }

  getLabelList(list, labelField = 'name', valueField = 'id') {
    let _list = [];
    for (let item of list) {
      if (item[valueField]) {
        _list.push({
          label: item[labelField],
          value: item[valueField],
        });
      }
    }
    return _list;
  }

  getLabelByValue(list, value) {
    for (let item of list) {
      if (item.value === value) {
        return item.label;
      }
    }
  }

  getObjectByField(list, value, field = 'value') {
    for (let item of list) {
      if (item[field] === value) {
        return item;
      }
    }
  }

  getLeftTime(milliseconds) {
    let time = '';
    let hour = Math.floor(milliseconds / (1000 * 60 * 60));
    let min = Math.floor((milliseconds - hour * (1000 * 60 * 60)) / (1000 * 60));
    let second = Math.floor((milliseconds - hour * (1000 * 60 * 60) - min * (1000 * 60)) / (1000));
    return (hour === 0 ? '' : (('0' + hour).slice(-2) + ':')) + ('0' + min).slice(-2) + ':' + ('0' + second).slice(-2);
  }

  /**
   * 取list中与_list不重复的项
   * @param list
   * @param _list
   * @param field
   */
  removeRepeat(list, _list, field = 'id') {
    let result = [];
    for (let item of list) {
      let isRepeat = false;
      for (let _item of _list) {
        if (item[field] === _item[field]) {
          isRepeat = true;
          break;
        }
      }
      if (!isRepeat) {
        result.push(item);
      }
    }
    return result;
  }

  exportFile(res, fileName) {
    let blob = new Blob([res], {type: 'application/vnd.ms-excel'});
    let objUrl = URL.createObjectURL(blob);
    let ele = document.createElement('a');
    document.body.appendChild(ele);
    ele.setAttribute('style', 'display: none');
    ele.setAttribute('href', objUrl);
    ele.setAttribute('download', fileName);
    ele.click();
    URL.revokeObjectURL(objUrl);
    setTimeout(() => {
      ele.remove();
    }, 10);
  }

  sortObjectArray(list: Array<any>, pro = 'name') {
    list.sort((a, b) => {
      return a[pro] > b[pro] ? 1 : -1;
    });
  }

  /**
   * 只执行一次的方法，第二个参数可以使函数再次执行
   * @param {Function} fn
   * @param {object} thisArg 执行环境
   * @returns {() => void}
   */
  onceFun(fn: Function, thisArg = null) {
    let isFirst = true;
    return () => {
      if (isFirst) {
        isFirst = false;
        fn.call(thisArg);
      }
    };
  }

  getMaxWidth(list, styleObj: any = {}, field = 'name') {
    let widths = [];
    for (let item of list) {
      let textSpan = document.createElement('span');
      textSpan.innerHTML = item[field];
      textSpan.style.fontSize = styleObj.fontSize || '12px';
      textSpan.style.position = 'absolute';
      textSpan.style.opacity = '0';
      textSpan.style.zIndex = '-99';
      document.body.appendChild(textSpan);
      widths.push(textSpan.clientWidth);
    }
    return Math.max(...widths);
  }

  getPlatform() {
    let _pf = navigator.platform;
    let appVer = navigator.userAgent;
    let _bit;
    if (_pf === "Win32" || _pf === "Windows") {
      if (appVer.indexOf("WOW64") > -1) {
        _bit = "64位";
      } else {
        _bit = "32位";
      }
      if (appVer.indexOf("Windows NT 6.0") > -1 || appVer.indexOf("Windows Vista") > -1) {
        if (_bit === '64位' || appVer.indexOf("Windows Vista") > -1) {
          return 'Windows_vista ' + _bit;
        } else {
          return "Unknown";
        }
      } else if (appVer.indexOf("Windows NT 6.1") > -1 || appVer.indexOf("Windows 7") > -1) {
        if (_bit === '32位' || appVer.indexOf("Windows 7") > -1) {
          return 'Windows_7 ' + _bit;
        } else {
          return "Unknown";
        }
      } else {
        try {
          let _winName = Array('2000', 'XP', '2003');
          let _ntNum = appVer.match(/Windows NT 5.\d/i).toString();
          return 'Windows_' + _winName[_ntNum.replace(/Windows NT 5.(\d)/i, "$1")] + " " + _bit;
        } catch (e) {
          return 'Windows';
        }
      }
    } else if (_pf === "Mac68K" || _pf === "MacPPC" || _pf === "Macintosh") {
      return "Mac";
    } else if (_pf === "X11") {
      return "Unix";
    } else if (String(_pf).indexOf("Linux") > -1) {
      return "Linux";
    } else {
      return "Unknown";
    }
  }
  isLinux() {
    return this.getPlatform().indexOf('Linux') === 0;
  }
}
