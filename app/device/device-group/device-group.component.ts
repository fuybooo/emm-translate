import {Component, OnInit, Output, EventEmitter, Input, OnDestroy} from "@angular/core";
import {defaultHeight, DeviceGroup} from "../device.model";
import {DeviceGroupFormComponent} from "./device-group-form.component";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {DeviceService} from "../device.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import {MessageService} from "../../shared/service/message.service";
declare let $: any;
@Component({
  selector: 'app-device-group',
  templateUrl: './device-group.component.html'
})
export class DeviceGroupComponent implements OnInit, OnDestroy {
  @Input() isPopupMove = false;
  @Input() isPopupSelect = false;
  @Input() params;
  sourceData: any;
  data: any[] = [];
  isSearchMode = false;
  currentSelected: any;
  @Output() expandDataCache = {};
  @Output() deviceGroupCheckData = new EventEmitter<any>();
  @Output() deleteGroupEvent = new EventEmitter<any>();
  @Output() specialIsCheckedEvent = new EventEmitter<any>(); // 所有设备，未分组，命中被选中
  allIsChecked = false; // 所有设备是否被选中
  noneIsChecked = false; // 未分组是否被选中
  hitIsChecked = false; // 命中设备是否被选中
  revokeIsChecked = false; // 命中设备是否被选中
  isLoading = false;
  clickedType = 0; // 1 所有设备 2 未分组设备 3 命中设备
  allNumber;
  noneNumber;
  hitNumber;
  revokeNumber;
  indeterminate;
  options = {
    axis: 'yx',
    callbacks: {
      // onTotalScroll: () => {
        // this.data[0].children[2].children[0].children.push({
        //   key: 1327,
        //   name: '新来的',
        //   deviceCount: 18,
        // });
        // this.changeTableData();
      // }
    }
  };
  activatedGroupId; // 当前需要被激活的设备组id
  allGroupIsChecked = false;
  popupEditGroupModal;
  containerHeight = defaultHeight; // 容器高度根据右侧详细信息的高度的变化而变化
  subscript1;
  subscript2;
  subscript3;

  constructor(private nzModalService: NzModalService,
              private util: UtilService,
              private messageService: MessageService,
              private modalService: ModalService,
              private deviceService: DeviceService,
              private http: HttpClient,
              private dataService: DataService) {
  }

  ngOnInit() {
    window.onresize = () => {
      this.setTableWidth();
    };
    if (this.isPopupSelect) {
      this.containerHeight = 260;
    }
    this.queryDeviceGroupData();
    this.subscript1 = this.deviceService.searchDeviceGroupListEvent.subscribe((params) => {
      if (typeof params === 'object') {
        this.isSearchMode = params.search && params.search !== '';
        this.activatedGroupId = params.activatedGroupId;
      } else if (typeof params === 'boolean') {
        this.isSearchMode = params;
      } else if (typeof params === 'string') {
        if (params === 'clearChecked') {
          this.util.clearExpandChecked(this.expandDataCache);
          this.util.clearChecked(this.sourceData);
        }
      }
      this.queryDeviceGroupData();
    });
    this.subscript2 = this.deviceService.hitDeviceNumberEvent.subscribe((value) => {
      this.hitNumber = value;
    });
    this.subscript3 = this.deviceService.heightEvent.subscribe((value) => {
      if (!this.isPopupSelect && !this.isPopupMove) {
        this.containerHeight = value;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscript1) {
      this.subscript1.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
    if (this.subscript3) {
      this.subscript3.unsubscribe();
    }
  }

  collapse(array, data, $event) {
    this.util.collapse(array, data, $event);
    this.setTableWidth();
  }
  setTableWidth() {
    let maxNode = this.util.getMaxLevel4Expanded(this.expandDataCache);
    let defaultMin = 271;
    let factMin = document.body.clientWidth * 0.85 * 0.25;
    if (maxNode) {
      // checkbox delete number padding * 2 + expand + device + marginRight + space + level + text + extra
      let tableWidth = 36 + 33 + 55 + 8 * 2 + 25 + 16 + 5 + 3 + (maxNode.level + 1) * 20 + 81 + 50;
      $('.x-axis-scroll-table .ant-table-wrapper').width(Math.max(defaultMin, factMin, tableWidth));
      $('.x-axis-scroll-table .mCSB_container').width(Math.max(defaultMin, factMin, tableWidth));
    } else {
      $('.x-axis-scroll-table .ant-table-wrapper').width(Math.max(defaultMin, factMin));
      $('.x-axis-scroll-table .mCSB_container').width(Math.max(defaultMin, factMin));
    }
  }

  changeTableData(defaultOpt = false) {
    if (!this.util.isEmptyObject(this.expandDataCache)) {
      this.util.syncStatusFormExpandDataToSource(this.expandDataCache, this.sourceData);
    }
    this.data = this.util.convertListToTree(this.sourceData);
    this.data.forEach(item => {
      this.expandDataCache[item.id] = this.util.convertTreeToList(item, defaultOpt);
    });
  }
  queryDeviceGroupData(params = {}, isConcat = false) {
    this.isLoading = true;
    // 根据条件查询设备组数据
    let _params = Object.assign({}, this.params, params);
    this.http.get(this.dataService.url.device.getDeviceGroupList, this.dataService.getWholeParams(_params))
      .subscribe((result: any) => {
        this.isLoading = false;
        this.allIsChecked = false;
        this.indeterminate = false;
        if (isConcat) {
          this.sourceData = this.sourceData.concat(result.data.result);
        } else {
          this.sourceData = result.data.result;
          this.allNumber = result.data.all;
          this.noneNumber = result.data.none;
          this.revokeNumber = result.data.revoke;
          this.deviceGroupCheckData.emit([]); // 清空父组件中的选中的设备组
          this.specialIsCheckedEvent.emit(0); // 清空父组件中的选中的特殊设备组
        }
        this.changeTableData(isConcat);
      });
  }
  onClickChangeAllGroupChecked(value) {
    this.sourceData.forEach(item => item.isChecked = value);
    this.util.syncStatusFormSourceToExpandData(this.sourceData, this.expandDataCache);
    this.onClickChangeChecked(true);
  }
  /**
   * 勾选设备组发送数据
   */
  onClickChangeChecked(isChangeAll = false) {
    if (!this.isPopupMove) {
      // 点击勾选时同步
      if (!isChangeAll) {
        this.util.syncStatusFormExpandDataToSource(this.expandDataCache, this.sourceData);
      }
      // 勾选所有设备组
      this.allGroupIsChecked = this.sourceData.every(item => item.isChecked === true);
      let allGroupIsUnchecked = this.sourceData.every(item => !item.isChecked);
      this.indeterminate = !allGroupIsUnchecked && !this.allGroupIsChecked; // 既不是全选，也不是全不选
      let selectedData = this.util.getSelectedData(this.expandDataCache);
      this.deviceGroupCheckData.emit(selectedData);
      // 勾选所有设备组 -- 1
      // 勾选未分组 -- 2
      // 勾选命中设备组
      let type = 0;
      if (this.allIsChecked) {
        type = 1;
      } else if (this.noneIsChecked) {
        type = 2;
      } else if (this.hitIsChecked) {
        type = 3;
      } else if (this.revokeIsChecked) {
        type = 4;
      }
      this.specialIsCheckedEvent.emit(type);
    }
  }

  popupEditGroup(item) {
    this.popupEditGroupModal = this.nzModalService.open({
      title: '修改设备分组',
      content: DeviceGroupFormComponent,
      footer: false, // footer默认为true
      componentParams: {
        type: 'edit',
        group: item,
        parentGroup: this.currentSelected
      },
      zIndex: ++this.modalService.modalCount
    });
    this.popupEditGroupModal.subscribe(result => {
      // 接受弹出层中传来的数据
      if (result.type === 'save') {
        this.http.post(this.dataService.url.device.editDeviceGroup, result.value).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('设备组修改成功！');
            this.popupEditGroupModal.destroy();
          } else {
            this.messageService.error('设备组修改失败！');
          }
        });
      }
    });
  }

  /**
   * 点击设备组发送事件
   * @param item
   */
  onClickDeviceGroup(item?) {
    if (item) {
        this.clickedType = 0;
        // 发送给deviceService一个查询事件，让device-list.component订阅该事件
        // 将当前数据变为选中，并且将其他数据变为未选中
        // item.isChecked = true;
        this.util.changeExpandActive(this.expandDataCache, item);
        this.currentSelected = {id: item.id};
        if (this.isPopupMove) {
          this.currentSelected.isMove = true;
        }
        this.deviceService.selectedDeviceGroup.emit(this.currentSelected);
    } else {
      this.util.changeExpandActive(this.expandDataCache);
      this.deviceService.selectedDeviceGroup.emit(this.clickedType);
    }
  }
  popupDeleteGroup(item) {
    this.deleteGroupEvent.emit(item);
  }
}
