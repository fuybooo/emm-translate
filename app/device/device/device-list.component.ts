import {Component, OnInit, Input, EventEmitter, Output, OnDestroy} from "@angular/core";
import {DeviceService} from "../device.service";
import {DataService} from "../../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {DeviceFormComponent} from "./device-form.component";
import {NzModalService} from "ng-zorro-antd";
import {MessageService} from "../../shared/service/message.service";
import {ModalService} from "../../shared/service/modal.service";
import {UtilService} from "../../shared/util/util.service";
import {defaultHeight} from "../device.model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html'
})
export class DeviceListComponent implements OnInit, OnDestroy {
  @Input() params: any = {};
  data: any[] = [];
  total = 0;
  allCheck = false;
  indeterminate = false;
  @Output() deviceDataEmitter = new EventEmitter<any>();
  popupEditDeviceModal;
  options = {
    axis: 'y',
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        if (!this.util.isEmptyObject(this.params)) {
          this.params.pageNumber ++;
          if ((this.params.pageNumber - 1) * this.params.pageSize <= this.total) {
            this.queryDeviceData(true);
          }
        }
      }
    }
  };
  isLoading = false;
  popupDeleteDeviceModal;
  containerHeight = defaultHeight;
  subscript;
  subscript2;

  constructor(private deviceService: DeviceService,
              private dataService: DataService,
              private http: HttpClient,
              private translateService: TranslateService,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private modalService: ModalService,
              public util: UtilService,
  ) {
  }

  ngOnInit() {
    if (this.util.isEmptyObject(this.params)) {
      this.isLoading = true;
      this.http.get(this.dataService.url.device.get_self_help_device_list).subscribe((res: any) => {
        this.isLoading = false;
        this.data = res.data.result;
      });
    } else {
      this.queryDeviceData();
      this.subscript = this.deviceService.searchDeviceListEvent.subscribe(() => {
        this.queryDeviceData();
      });
      this.subscript2 = this.deviceService.heightEvent.subscribe((value) => {
        this.containerHeight = value;
      });
    }
  }
  // todo 离开页面时销毁弹出层
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }
  queryDeviceData(isConcat = false) {
    if (!isConcat) {
      this.params.pageNumber = 1;
    }
    this.isLoading = true;
    this.http.get(this.dataService.url.device.getDeviceList, {params: this.dataService.getParams(this.params)}).subscribe((res: any) => {
      this.isLoading = false;
      this.allCheck = false;
      this.indeterminate = false;
      if (isConcat) {
        this.total = res.data.total;
        this.data = this.data.concat(res.data.result);
      } else {
        this.total = res.data.total;
        this.data = res.data.result;
        if (this.params.search !== '') {
          this.deviceService.hitDeviceNumberEvent.emit(this.total);
        }
      }
      // 查询完成之后需要将父组件中选中的设备清空：
      this.deviceDataEmitter.emit([]);
    });
  }

  checkAll(value) {
    this.data.forEach(item => item.isChecked = value);
    this.refreshStatus();
  }

  refreshStatus() {
    this.allCheck = this.data.every(item => item.isChecked === true);
    let unAllCheck = this.data.every(item => !item.isChecked); // item.isChecked 可能为 undefined
    this.indeterminate = !unAllCheck && !this.allCheck;
    this.emitEvent();
  }

  popupEditDevice(item) {
    this.popupEditDeviceModal = this.nzModalService.open({
      title: '修改设备',
      content: DeviceFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        type: 'edit',
        device: item
      }
    });
    this.popupEditDeviceModal.subscribe(res => {
      if (res.type === 'save') {
        res.value.owner = res.value.owner.length ? res.value.owner.join(',') : '';
        this.http.post(this.dataService.url.device.editDevice, res.value).subscribe((result: any) => {
          if (result.code === '200') {
            this.messageService.success('设备保存成功！');
            this.deviceService.searchDeviceGroupListEvent.emit();
            this.deviceService.searchDeviceListEvent.emit();
            this.popupEditDeviceModal.destroy();
          } else {
            this.messageService.error('设备保存失败！');
          }
        });
      }
    });
  }
  popupDeleteDevice(item) {
    this.popupDeleteDeviceModal = this.modalService.confirmDelete(() => {
      this.http.post(this.dataService.url.device.deleteDevice, {ids: item.id})
        .subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.success('设备删除成功！');
            // 刷新设备分组列表, 不进入搜索模式
            this.deviceService.searchDeviceGroupListEvent.emit();
            this.deviceService.searchDeviceListEvent.emit();
          } else {
            this.messageService.success('设备删除失败！');
          }
        });
    }, '');
  }
  getDeviceDetail(item) {
    this.deviceService.searchDeviceDetailEvent.emit(item.id);
  }
  onClickDeviceList(item) {
    this.util.changeActive(this.data, item);
  }

  emitEvent() {
    this.deviceDataEmitter.emit(this.data);
  }
}
