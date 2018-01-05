import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {DeviceGroupFormComponent} from "./device-group/device-group-form.component";
import {ModalService} from "../shared/service/modal.service";
import {DeviceService} from "./device.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-device-move',
  templateUrl: './device-move.component.html',
})
export class DeviceMoveComponent implements OnInit, OnDestroy {
  @Input() groupIds;
  params = {
    deviceGroupId: '-1', // -1取全部的分组，包括未分组数据
    search: '',
    pageSize: 100,
    pageNumber: 1,
    sortOrder: '',
    sortName: '',
    excludeGroupIds: this.groupIds
  };
  currentSelectedGroup;
  subscript;

  constructor(
    private subject: NzModalSubject,
    private translateService: TranslateService,
    private nzModalService: NzModalService,
    private modalService: ModalService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
    this.subscript = this.deviceService.selectedDeviceGroup.subscribe(value => this.currentSelectedGroup = value);
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  submit() {
    this.subject.next({type: 'save'});
  }
  handleCancel() {
    this.subject.destroy('onCancel');
  }
  popupAddGroup() {
    let popupAddGroupModal = this.nzModalService.open({
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
    this.deviceService.popupAddDeviceGroup(popupAddGroupModal);
  }
}
