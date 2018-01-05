import {Component, OnDestroy, OnInit} from "@angular/core";
import {DeviceGroupFormComponent} from "./device-group/device-group-form.component";
import {NzModalService} from 'ng-zorro-antd';
import {MessageService} from "../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
import {ModalService} from "../shared/service/modal.service";
import {DeviceFormComponent} from "./device/device-form.component";
import {DeviceMoveComponent} from "./device-move.component";
import {DataService} from "../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {DeviceService} from "./device.service";
import {deviceExportField, deviceExtendData} from "./device.model";
import {UtilService} from "../shared/util/util.service";
import {MapTrailComponent} from "../shared/custom-map/map-trail.component";
import {ImportFileComponent} from "../shared/component/import-file.component";
import {ExportFileComponent} from "../shared/component/export-file.component";
import {environment} from "../../environments/environment";
import {PermissionService} from "../shared/service/permission.service";
import {AppService} from "../app.service";

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html'
})
export class DeviceComponent implements OnInit, OnDestroy {
  // 统计区数据模型
  devicePanel = {
    status: {
      logged: {
        number: 0,
        isActive: false
      },
      logout: {
        number: 0,
        isActive: false
      },
      unactivated: {
        number: 0,
        isActive: false
      },
      recovery: {
        number: 0,
        isActive: false
      },
    },
    security: {
      locked: {
        number: 0,
        isActive: false
      },
      breakout: {
        number: 0,
        isActive: false
      }
    },
    system: {
      Android: {
        number: 0,
        isActive: false
      },
      iOS: {
        number: 0,
        isActive: false
      },
      Windows: {
        number: 0,
        isActive: false
      },
      macOS: {
        number: 0,
        isActive: false
      }
    },
    activity: {
      online: {
        number: 0,
        isActive: false
      },
      offline: {
        number: 0,
        isActive: false
      }
    }
  };
  // 搜索关键字
  searchWord = '';
  // 品牌
  selectedBrand = '';
  brandOptions;
  isDeviceListChecked: boolean;
  // 列表中选中的设备组数据
  selectedGroupData;
  // 列表中选中的设备数据
  selectedDeviceData;
  // 当前选中的设备组
  currentSelectedGroup;
  // 当前选中需要移动的设备组
  currentSelectedMoveGroupId; // 移动页面选中的设备组
  // 所有弹出层
  popupAddGroupModal;
  popupImportModal;
  popupDeleteGroupModal;
  popupDeleteDeviceModal;
  popupDeviceTrailModal;
  popupExportModal;
  popupAddDeviceModal;
  popupMoveToModal;
  // 远程操控
  remoteModal;
  // 设备组查询条件
  deviceGroupParams = {
    deviceGroupId: '-1', // -1取全部的分组，包括未分组数据
    search: '',
    pageSize: 100,
    pageNumber: 1,
    sortOrder: '',
    sortName: ''
  };
  deviceParams = {
    status: '',
    security: '',
    system: '',
    activity: '',
    brand: '',
    deviceGroupId: 'all', // 为'all'则取所有设备组，为'none'则取未分组，为其他值则取对应的设备组
    search: '', // 搜索关键字，为空时进入查询模式，否则进入搜索模式,例外情况，点击设备组进行查询时忽略此参数
    pageSize: 100,
    pageNumber: 1,
    sortOrder: '',
    sortName: '',
  };
  specialCheckType = 0;
  subscript;
  // canDeactivate() {
  //   // 根据当前路由状态下的需要提醒的表单是否完成的状态判断是否能够离开该路由
  // }
  constructor(private nzModalService: NzModalService,
              private modalService: ModalService,
              private messageService: MessageService,
              private translateService: TranslateService,
              private dataService: DataService,
              private http: HttpClient,
              private util: UtilService,
              private deviceService: DeviceService,
              private appService: AppService,
              private permisionService: PermissionService
  ) {
  }

  ngOnInit() {
    // 初始化数据
    // 查询统计数据
    this.http.get(this.dataService.url.device.devicePanel.status).subscribe((data: any) => {
      this.devicePanel.status.logged.number = data.data.logged;
      this.devicePanel.status.logout.number = data.data.logout;
      this.devicePanel.status.unactivated.number = data.data.unactivated;
      this.devicePanel.status.recovery.number = data.data.recovery;
    });
    this.http.get(this.dataService.url.device.devicePanel.security).subscribe((data: any) => {
      this.devicePanel.security.locked.number = data.data.locked;
      this.devicePanel.security.breakout.number = data.data.breakout;
    });
    this.http.get(this.dataService.url.device.devicePanel.system).subscribe((data: any) => {
      this.devicePanel.system.Android.number = data.data.android;
      this.devicePanel.system.iOS.number = data.data.ios;
      this.devicePanel.system.Windows.number = data.data.windows;
      this.devicePanel.system.macOS.number = data.data.macOS;
    });
    this.http.get(this.dataService.url.device.devicePanel.activity).subscribe((data: any) => {
      this.devicePanel.activity.online.number = data.data.online;
      this.devicePanel.activity.offline.number = data.data.offline;
    });
    // 查询所有品牌
    this.http.get(this.dataService.url.device.getDeviceBrand).subscribe((data: any) => {
      this.brandOptions = [{brand: '全部', value: ''}];
      for (let item of data.data.result) {
        this.brandOptions.push({
          value: item.brand,
          brand: item.brand
        });
      }
    });
    this.subscript = this.deviceService.selectedDeviceGroup.subscribe(selectedGroup => {
      if (!selectedGroup.isMove) {
        this.onChangeDeviceGroupSelected(selectedGroup);
      } else {
        this.currentSelectedMoveGroupId = selectedGroup.id;
      }
    });
  }
  ngOnDestroy() {
    if (this.popupAddGroupModal) {
      this.popupAddGroupModal.destroy();
    }
    if (this.popupDeleteGroupModal) {
      this.popupDeleteGroupModal.destroy();
    }
    if (this.popupDeleteDeviceModal) {
      this.popupDeleteDeviceModal.destroy();
    }
    if (this.popupDeviceTrailModal) {
      this.popupDeviceTrailModal.destroy();
    }
    if (this.popupImportModal) {
      this.popupImportModal.destroy();
    }
    if (this.popupExportModal) {
      this.popupExportModal.destroy();
    }
    if (this.popupAddDeviceModal) {
      this.popupAddDeviceModal.destroy();
    }
    if (this.popupMoveToModal) {
      this.popupMoveToModal.destroy();
    }
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  isDeviceListCheckedChange(event: any) {
  }

  popupAddGroup() {
    this.popupAddGroupModal = this.nzModalService.open({
      title: '添加设备分组',
      content: DeviceGroupFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        type: 'add',
        parentGroup: this.currentSelectedGroup
      },
      zIndex: ++this.modalService.modalCount
    });
    this.deviceService.popupAddDeviceGroup(this.popupAddGroupModal);
  }

  popupDeleteGroup() {
    if (!this.selectedGroupData || this.selectedGroupData.length === 0) {
      this.messageService.info('请选择要删除的设备组');
      return;
    }
    this.doDeleteGroup(this.selectedGroupData);
    // this.popupDeleteGroupModal = this.modalService.confirmDelete(() => {
    //   this.doDeleteGroup(this.selectedGroupData);
    // }, '分组删除后，<span class="text-primary">这些分组下的设备不会被删除</span>。');
  }
  doDeleteGroup(groupData, isAll = false) {
    this.popupDeleteGroupModal = this.modalService.confirmDelete(() => {
      this.http.post(this.dataService.url.device.deleteDeviceGroup, {ids: this.util.getIdsByList(groupData, isAll)})
        .subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('设备组删除成功！');
            this.selectedGroupData = [];
            // 刷新设备分组列表, 不进入搜索模式
            this.deviceService.searchDeviceGroupListEvent.emit('clearChecked');
          } else {
            this.messageService.success('设备组删除失败！');
          }
        });
    }, '分组删除后，<span class="text-primary">这些分组下的设备不会被删除</span>。');
  }
  popupDeleteDevice() {
    if (!this.selectedDeviceData || this.selectedDeviceData.length === 0) {
      this.messageService.info('请选择要移出的设备');
      return;
    }
    this.popupDeleteDeviceModal = this.modalService.popupConfirm('confirm_remove', () => {
      this.http.post(this.dataService.url.device.removeDevice, {ids: this.util.getIdsByList(this.selectedDeviceData)})
        .subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('设备删除成功！');
            this.selectedDeviceData = [];
            // 刷新设备分组列表, 不进入搜索模式
            // this.deviceService.searchDeviceGroupListEvent.emit();
            // this.deviceService.searchDeviceListEvent.emit();
            this.clearDataAndSearch();
          } else {
            this.messageService.success('设备删除失败！');
          }
        });
    }, '设备移出分组后，<span class="text-primary">这些设备不会被删除</span>。');
  }
  popupDeviceTrail() {
    if ((!this.selectedGroupData || this.selectedGroupData.length === 0) &&
      (!this.selectedDeviceData || this.selectedDeviceData.length === 0)) {
      this.messageService.info('请选择设备或者设备组进行查看！');
      return;
    }
    this.popupDeviceTrailModal = this.nzModalService.open({
      title: '查看设备位置信息',
      content: MapTrailComponent,
      footer: false, // footer默认为true
      width: 1200,
      componentParams: {
        ids: this.util.getIdsByList(this.selectedDeviceData),
        groupIds: this.util.getIdsByList(this.selectedGroupData)
      }
    });
  }
  popupImport() {
    this.popupImportModal = this.nzModalService.open({
      title: '批量导入设备',
      content: ImportFileComponent,
      // closable: false, // 如果弹出层需要做离开保护的话，不能有关闭按钮
      maskClosable: false, // 如果弹出层需要做离开保护的话，不能点击蒙层关闭
      footer: false, // footer默认为true
      width: 700,
      componentParams: {
        type: 'device',
        desc: '批量导入设备',
        url: this.dataService.url.device.importDevice
      }
    });
    this.popupImportModal
      .subscribe(result => {
      // 接受弹出层中传来的数据
      if (result === 'download') {
        if (this.util.isLinux()) {
          if (this.appService.getLng() === 'zh') {
            // 下载模板
            window.location.href = environment.path + '/resources/assets/certs/devicetest.csv';
          } else if (this.appService.getLng() === 'en') {
            window.location.href = environment.path + '/resources/assets/certs/devicetest_us.csv';
          }
        } else {
          if (this.appService.getLng() === 'zh') {
            // 下载模板
            window.location.href = environment.path + '/resources/assets/certs/devicetestwin.csv';
          } else if (this.appService.getLng() === 'en') {
            window.location.href = environment.path + '/resources/assets/certs/devicetestwin_us.csv';
          }
        }
      } else if (result.type === 'import') {
        result.uploader.uploadAll();
        result.uploader.queue[0].onSuccess = (response, status, headers) => {
          let res = JSON.parse(response);
          if (res.code === '200') {
            // this.popupImportModal.destroy();
          } else if (res.code === '500') {
            this.messageService.error('导入失败!');
            return;
          }
          this.nzModalService.info({
            content: `导入成功${res.data.successNumber}条，导入失败${res.data.errorNumber}条`,
            zIndex: 1001,
            okText: '确定',
            onOk: () => {
              this.popupImportModal.destroy();
            }
          });
          if (res.data.successNumber > 0) {
            // this.deviceService.searchDeviceGroupListEvent.emit();
            // this.deviceService.searchDeviceListEvent.emit();
            this.clearDataAndSearch();
          }
        };
      }
    });
  }
  popupExport() {
    this.popupExportModal = this.nzModalService.open({
      title: '导出设备',
      content: ExportFileComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        basicData: deviceExportField,
        extendData: deviceExtendData
      }
    });
    this.popupExportModal.subscribe(result => {
    });
  }

  /**
   * 弹出新增设备
   */
  popupAddDevice() {
    this.popupAddDeviceModal = this.nzModalService.open({
      title: '添加设备',
      content: DeviceFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        type: 'add'
      }
    });
    this.popupAddDeviceModal.subscribe(res => {
      if (res.type === 'save') {
        res.value.owner = res.value.owner.length ? res.value.owner.join(',') : '';
        this.http.post(this.dataService.url.device.addDevice, res.value).subscribe((result: any) => {
          if (result.code === '200') {
            this.messageService.success('设备保存成功！');
            // this.deviceService.searchDeviceGroupListEvent.emit();
            // this.deviceService.searchDeviceListEvent.emit();
            this.clearDataAndSearch();
            this.popupAddDeviceModal.destroy();
          } else {
            this.messageService.error('设备保存失败！');
            // this.messageService.error(this.translateService.instant('dc-001'));
          }
        });
      }
    });
  }

  /**
   * 勾选设备组时监听设备组变化情况
   */
  onChangeDeviceGroupCheckData(selectedGroupData) {
    this.selectedGroupData = selectedGroupData;
  }
  /**
   * 勾选设备时监听设备变化情况
   */
  onChangeDeviceCheckData(selectedDeviceData) {
    this.selectedDeviceData = this.util.getCheckedData(selectedDeviceData);
  }
  onChangeDeleteGroupEvent($event) {
    this.doDeleteGroup([$event], true);
  }
  onChangeSpecialIsCheckedEvent($event) {
    // todo 为查询设备轨迹，移动设备服务
    this.specialCheckType = $event;
  }

  /**
   * 选中设备组时触发
   * @param selectedGroup
   */
  onChangeDeviceGroupSelected(selectedGroup) {
    this.selectedDeviceData = [];
    if (typeof selectedGroup === 'number') {
      this.currentSelectedGroup = null;
      if (selectedGroup === 1) {
        this.deviceParams.deviceGroupId = 'all';
        this.deviceService.searchDeviceListEvent.emit();
      } else if (selectedGroup === 2) {
        this.deviceParams.deviceGroupId = 'none';
        this.deviceService.searchDeviceListEvent.emit();
      } else if (selectedGroup === 4) {
        this.deviceParams.deviceGroupId = 'revoke';
        this.deviceService.searchDeviceListEvent.emit();
      } else {
        this.deviceParams.deviceGroupId = 'all';
        this.deviceParams.search = this.searchWord;
        this.deviceService.searchDeviceListEvent.emit(true);
      }
    } else {
      this.currentSelectedGroup = selectedGroup;
      this.deviceParams.deviceGroupId = selectedGroup.id;
      this.deviceParams.search = '';
      this.deviceService.searchDeviceListEvent.emit();
    }
  }


  /**
   * 切换品牌
   */
  changeBrand($event) {
    if (!$event && this.deviceParams.brand !== this.selectedBrand) {
      this.deviceParams.brand = this.selectedBrand;
      this.selectedDeviceData = [];
      this.deviceService.searchDeviceListEvent.emit();
    }
  }

  /**
   * 改变统计数据对设备进行查询
   */
  changePanelState(field: string, condition?: string) {
    if (condition) {
      this.devicePanel[field][condition].isActive = !this.devicePanel[field][condition].isActive;
    } else {
      for (let c in this.devicePanel[field]) {
        this.devicePanel[field][c].isActive = false;
      }
    }
    // 根据统计构造设备查询条件
    for (let panel in this.devicePanel) {
      this.deviceParams[panel] = '';
      let item = this.devicePanel[panel];
      for (let c in item) {
        if (item[c].isActive) {
          this.deviceParams[panel] += c + ',';
        }
      }
      this.deviceParams[panel] = this.deviceParams[panel].slice(0, -1);
    }
    this.selectedDeviceData = [];
    this.deviceService.searchDeviceListEvent.emit();
  }
  popupMoveTo() {
    if ((!this.selectedGroupData || this.selectedGroupData.length === 0) &&
      (!this.selectedDeviceData || this.selectedDeviceData.length === 0)) {
      this.messageService.info('请选择设备或者设备组进行移动！');
      return;
    }
    if (this.selectedGroupData && this.selectedGroupData.length > 1) {
      this.messageService.info('不能同时移动多个设备组！');
      return;
    }
    if (this.selectedGroupData && this.selectedGroupData.length > 0 && this.selectedDeviceData && this.selectedDeviceData.length > 0 ) {
      this.messageService.info('不能同时移动设备组和设备！');
      return;
    }
    this.popupMoveToModal = this.nzModalService.open({
      title: '移动到',
      content: DeviceMoveComponent,
      footer: false, // footer默认为true
      width: 600,
      zIndex: ++this.modalService.modalCount,
      componentParams: {
        groupIds: this.util.getIdsByList(this.selectedGroupData)
      }
    });
    this.popupMoveToModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.http.post(this.dataService.url.device.move, {
          deviceIds: this.util.getIdsByList(this.selectedDeviceData),
          deviceGroupId: this.util.getIdsByList(this.selectedGroupData),
          toDeviceGroupId: this.currentSelectedMoveGroupId
        }).subscribe((result: any) => {
          if (result.code === '200') {
            this.messageService.success('设备（组）移动成功！');
            // this.deviceService.searchDeviceGroupListEvent.emit();
            // this.deviceService.searchDeviceListEvent.emit();
            this.clearDataAndSearch();
            this.popupMoveToModal.destroy();
          } else {
            this.messageService.error('设备（组）移动失败！');
          }
        });
      }
    });
  }

  // 监听到输入框的值为空，则进行一次查询
  changeSearchWord(value) {
    if (value === '') {
      this.doSearch();
    }
  }
  clearDataAndSearch() {
    this.selectedDeviceData = [];
    this.selectedGroupData = [];
    this.deviceService.searchDeviceGroupListEvent.emit('clearChecked');
    this.deviceService.searchDeviceListEvent.emit();
  }


  /**
   * 进行搜索
   */
  doSearch() {
    this.deviceGroupParams.search = this.searchWord;
    this.deviceParams.search = this.searchWord;
    if (this.searchWord !== '') {
      this.deviceGroupParams.deviceGroupId = '-1';
      this.deviceParams.deviceGroupId = 'all';
    }
    this.deviceService.searchDeviceGroupListEvent.emit(this.searchWord !== '');
    this.deviceService.searchDeviceListEvent.emit(this.searchWord !== '');
  }

}
