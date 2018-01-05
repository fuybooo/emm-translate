import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {NzModalSubject} from "ng-zorro-antd";
import {UserService} from "../../user/service/user-user.service";
import {UserGroupService} from "../../user/service/user-group.service";
import {DeptService} from "../../user/service/user-dept.service";
import {UserSearchService} from "../../user/service/user-search.service";
import {MessageService} from "../service/message.service";
import {UserHttpService} from "../../user/service/user-http.service";
import {DeviceService} from "../../device/device.service";
import {FormControl} from "@angular/forms";
@Component({
  selector: 'app-custom-select-group',
  templateUrl: './custom-select-group.component.html',
  providers: [
    UserService,
    UserGroupService,
    DeptService,
    // todo: 解耦合 date: 2017-12-9 已解耦
    // UserSearchService,
    UserHttpService,
  ]
})
export class CustomSelectGroupComponent implements OnInit {
  @Input()
  popup = false;
  @Input()
  selectLabel;
  @Input()
  resultLabel;
  @Input() formItem: FormControl;
  // formControl: FormControl;
  /**
   * result: ObjectService.result, result.objects, result.objectIds, result.data  （四维数据同步）
   */
  @Input()
  result: {
    userIds?: number[],
    users?: any[],
    groupIds?: number[],
    groups?: any[],
    deptIds?: number[],
    depts?: any[],
    deviceGroup?: any[],
    deviceGroupIds?: number[],
    data?: any[]
  } = {data: []};
  @Input() labels = ['user', 'group', 'dept'];
  @Output()
  resultChange = new EventEmitter(true);

  deviceGroupParams = {
    deviceGroupId: '-1', // -1取全部的分组，包括未分组数据
    search: '',
    pageSize: 100,
    pageNumber: 1,
    sortOrder: '',
    sortName: ''
  };

  usersOptions = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.users.nextPage();
      }
    }
  };
  groupsOptions = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.groups.nextPage();
      }
    }
  };
  /**
   * 当前选择的类型： users,groups,depts
   */
  activeType;
  deviceGroup: any = {};

  constructor(public users: UserService,
              public groups: UserGroupService,
              public depts: DeptService,
              public deviceService: DeviceService,
              private message: MessageService,
              private subject: NzModalSubject) {
    users['label'] = 'user';
    users['result'] = [];
    groups['label'] = 'group';
    groups['result'] = [];
    depts['label'] = 'dept';
    depts['result'] = [];
    this.deviceGroup['label'] = 'deviceGroup';
    this.deviceGroup['result'] = [];
  }

  ngOnInit() {
    // 设置默认栏目
    if (!this.labels || this.labels.length < 1) {
      this.labels = ['user', 'group', 'dept'];
    }
    // 默认选择第一栏目
    this.changeSelectType(this.labels[0]);
    /********************==========  以下为：结果回显的 三种方式  ==============************************/
    /*---------------  ObjectService.result, result.objects, result.objectIds, result.data 四维结果同步 ------------------*/
    if (!this.result) {
      // 没有 result对象 =>=>=>> 初始化结果集
      this.result = {
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
    } else if (!this.result.data || !this.result.data.length) {
      // result.data 不存在时： 使用【user,group,dep, ...】 ===>> 同步结果集
      this.result.data = [];
      // result.objects =======>>>>>>> ObjectService.result, result.data
      if (this.result.users) {
        this.users['result'] = this.result.users;
        this.result.users.forEach(item => {
          this.result.data.push({type: 'user', ...item});
        });
      }
      if (this.result.groups) {
        this.groups['result'] = this.result.groups;
        this.result.groups.forEach(item => {
          this.result.data.push({type: 'group', ...item});
        });
      }
      if (this.result.depts) {
        this.depts['result'] = this.result.depts;
        this.result.depts.forEach(item => {
          this.result.data.push({type: 'dept', ...item});
        });
      }
      if (this.result.deviceGroup) {
        this.deviceGroup.result = this.result.deviceGroup;
        this.result.deviceGroup.forEach(item => {
          this.result.data.push({type: 'deviceGroup', ...item});
        });
      }
      // ObjectService.result =======>>>>>>> result.objects, result.objectIds
      this.refreshResult();
    } else {
      // result.data =======>>>>>>> ObjectService.result, result.objects, result.objectIds
      this.result = {
        userIds: [],
        users: [],
        groupIds: [],
        groups: [],
        deptIds: [],
        depts: [],
        deviceGroup: [],
        deviceGroupIds: [],
        data: this.result.data
      };
      // result.data =======>>>>>>> result.objects, result.objectIds
      this.result.data.forEach((item) => {
        switch (item.type) {
          case 'user':
            this.result.userIds.push(item.id);
            this.result.users.push(item);
            break;
          case 'group':
            this.result.groupIds.push(item.id);
            this.result.groups.push(item);
            break;
          case 'dept':
            this.result.deptIds.push(item.id);
            this.result.depts.push(item);
            break;
          case 'deviceGroup':
            this.result.deviceGroupIds.push(item.id);
            this.result.deviceGroup.push(item);
            break;
        }
      });
      // result.objects =======>>>>>>> ObjectService.result
      this.users['result'] = this.result.users;
      this.groups['result'] = this.result.groups;
      this.depts['result'] = this.result.depts;
      this.deviceGroup['result'] = this.result.deviceGroup;
    }
    if (this.formItem) {
      this.formItem.setValue(this.result);
    }
  }

  onChangeDeviceGroupCheckData($event) {
    if (this.activeType.label === 'deviceGroup') {
      this.activeType.checkedList = $event;
    }
  }

  initData() {
    this.users.param.pageSize = 10;
    this.users.initList({isActiveFist: false});
    this.groups.param.pageSize = 10;
    this.groups.initListSimple();
    this.depts.initListSingle();
  }

  /**
   * ObjectService.result =======>>>>>>> result.objects, result.objectIds,   ( 没有同步 result.data)
   */
  refreshResult() {
    this.result.users = this.users['result'];
    this.result.userIds = [];
    this.result.users.forEach(item => this.result.userIds.push(item.id));

    this.result.groups = this.groups['result'];
    this.result.groupIds = [];
    this.result.groups.forEach(item => this.result.groupIds.push(item.id));

    this.result.depts = this.depts['result'];
    this.result.deptIds = [];
    this.result.depts.forEach(item => this.result.deptIds.push(item.id));

    this.result.deviceGroup = this.deviceGroup['result'];
    this.result.deviceGroupIds = [];
    this.result.deviceGroup.forEach(item => this.result.deviceGroupIds.push(item.id));

    this.resultChange.emit(this.result);
    this.formItem.setValue(this.result);
  }

  changeSelectType(type) {
    switch (type) {
      case 'user':
        this.activeType = this.users;
        this.selectLabel = '请输入用户关键字进行搜索';
        this.users.param.page = 1;
        this.users.param.pageSize = 10;
        this.users.initList({isActiveFist: false});
        break;
      case 'group':
        this.activeType = this.groups;
        this.selectLabel = '请输入用户组关键字进行搜索';
        this.users.param.page = 1;
        this.groups.param.pageSize = 10;
        this.groups.initListSimple();
        break;
      case 'dept':
        this.activeType = this.depts;
        this.selectLabel = '请输入部门关键字进行搜索';
        this.depts.initListSingle();
        break;
      case 'deviceGroup':
        this.selectLabel = '请输入设备组关键字进行搜索';
        this.deviceGroup.checkedList = [];
        this.activeType = this.deviceGroup;
        break;
      default :
        // 默认选择 user
        this.activeType = this.users;
        this.users.param.page = 1;
        this.users.param.pageSize = 10;
        this.users.initList({isActiveFist: false});
    }
  }

  toRight() {
    this.result.data = this.result.data || [];
    this.activeType.checkedList.forEach((item) => {
      // 取消选中状态
      item.checked = false;
      // 遍历结果去重
      let exit = false;
      this.activeType.result.forEach((res) => {
        if (res.id === item.id) {
          exit = true;
        }
      });
      if (!exit) {
        this.activeType.result.push(item);
        this.result.data.push({type: this.activeType.label, ...item});
      } else {
        this.message.warning(item.name + "，已存在！");
      }
    });
    this.activeType.checkedList = [];
    this.refreshResult();
  }

  toLeft() {
    let resultData = [];
    this.result.data.forEach((item) => {
      if (item.checked) {
        let index = -1;
        switch (item.type) {
          case 'user':
            for (let i = 0; i < this.users['result'].length; i++) {
              if (this.users['result'][i].id === item.id) {
                index = i;
              }
            }
            this.users['result'].splice(index, 1);
            break;
          case 'group':
            for (let i = 0; i < this.groups['result'].length; i++) {
              if (this.groups['result'][i].id === item.id) {
                index = i;
              }
            }
            this.groups['result'].splice(index, 1);
            break;
          case 'dept':
            for (let i = 0; i < this.depts['result'].length; i++) {
              if (this.depts['result'][i].id === item.id) {
                index = i;
              }
            }
            this.depts['result'].splice(index, 1);
            break;
          case 'deviceGroup':
            for (let i = 0; i < this.deviceGroup['result'].length; i++) {
              if (this.deviceGroup['result'][i].id === item.id) {
                index = i;
              }
            }
            this.deviceGroup['result'].splice(index, 1);
            break;
        }
      } else {
        resultData.push(item);
      }
    });
    this.result.data = resultData;
    this.refreshResult();
  }

  /**
   * 搜索
   * @param search
   */
  doSearch(search) {
    if (this.activeType.label === 'deviceGroup') {
      this.deviceGroupParams.search = search;
      this.deviceService.searchDeviceGroupListEvent.emit(this.deviceGroupParams.search);
    } else {
      this.activeType.param.search = search;
      this.activeType.initList({isActiveFist: false});
    }
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  submit() {
    this.subject.next({type: 'save', data: this.result});
  }

  handleCancel() {
    this.subject.destroy('onCancel');
  }
}
