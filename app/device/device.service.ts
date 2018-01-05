import {EventEmitter, Injectable} from '@angular/core';
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../shared/service/modal.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {MessageService} from "../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
@Injectable()
export class DeviceService {
  public isSearchMode = false;
  // 点击设备组查询设备
  searchDeviceListEvent = new EventEmitter();
  // 发送查询设备组的条件
  searchDeviceGroupListEvent = new EventEmitter();
  // 发送查询设备详情的条件
  searchDeviceDetailEvent = new EventEmitter();
  // 发送查询设备组详情的条件
  searchDeviceGroupDetailEvent = new EventEmitter();
  hitDeviceNumberEvent = new EventEmitter();
  selectedDeviceGroup = new EventEmitter();
  heightEvent = new EventEmitter();
  constructor(
    private nzModalService: NzModalService,
    private modalService: ModalService,
    private messageService: MessageService,
    private http: HttpClient,
    private translateService: TranslateService,
    private dataService: DataService,
  ) {
  }
  popupAddDeviceGroup(popupAddGroupModal) {
    popupAddGroupModal.subscribe(result => {
      // 接受弹出层中传来的数据
      if (result.type === 'save') {
        // 执行保存事件
        this.http.post(this.dataService.url.device.addDeviceGroup, result.value).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('保存成功！');
            // 刷新设备分组列表, 不进入搜索模式
            this.searchDeviceGroupListEvent.emit('clearChecked');
            popupAddGroupModal.destroy();
          } else if (res.code === '1') {
            this.messageService.error('设备组名称重复！');
          }
        });
      }
    });
  }
}
