import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UtilService} from "../util/util.service";
import {MessageService} from "../service/message.service";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../service/modal.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../service/data.service";
import {DeviceService} from "../../device/device.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ValidatorService} from "../service/validator.service";
import {DeviceRemoteComponent} from "./device-remote.component";

@Component({
  selector: 'app-device-directive',
  templateUrl: './device-directive.component.html'
})
export class DeviceDirectiveComponent implements OnInit, OnDestroy {
  @Input() selectedDeviceData = [];
  moreOperators = [
    {
      cls: {'icon-allicon-95': true},
      name: '锁定',
      dir: 'lockDevice'
    },
    {
      cls: {'icon-allicon-96': true},
      name: '解锁',
      dir: 'unLockDevice'
    },
    {
      isDivision: true
    },
    {
      cls: {'icon-allicon-97': true},
      name: '冻结应用容器',
      dir: 'freezeEMM'
    },
    {
      cls: {'icon-allicon-98': true},
      name: '解冻应用容器',
      dir: 'UnFreezeEMM'
    },
    {
      isDivision: true
    },
    {
      cls: {'icon-allicon-112': true},
      name: '报警',
      dir: 'alarm'
    },
    {
      cls: {'icon-allicon-99': true},
      name: '回收',
      dir: 'recoveryDevice'
    },
    {
      cls: {'icon-allicon-100': true},
      name: '撤销',
      dir: 'revokeDevice'
    },
    {
      cls: {'icon-allicon-101': true},
      name: '启用',
      dir: 'enableDevice'
    },
    {
      isDivision: true
    },
    {
      cls: {'icon-allicon-102': true},
      name: '擦除数据',
      dir: 'eraseData'
    },
    {
      isDivision: true
    },
    {
      cls: {'icon-allicon-103': true},
      name: '清除访问限制的密码',
      dir: 'clearAccess',
      suffix: {'icon-allicon-121': true},
      title: 'iOS监管设备'
    },
    {
      isDivision: true
    },
    {
      cls: {'icon-allicon-104': true},
      name: '远程操作',
      dir: 'remote'
    },
  ];
  lockDevicePasswordModal;
  remoteModal;
  form: FormGroup;
  constructor(
    private messageService: MessageService,
    private nzModalService: NzModalService,
    private modalService: ModalService,
    private http: HttpClient,
    private dataService: DataService,
    private deviceService: DeviceService,
    private util: UtilService,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [this.validatorService.getSpecialCharacterValidator(
        this.validatorService.regExp.simplePassword, false)]]
    });
  }
  ngOnDestroy() {
    if (this.lockDevicePasswordModal) {
      this.lockDevicePasswordModal.destroy();
    }
    if (this.remoteModal) {
      this.remoteModal.destroy();
    }
  }
  sendCommand(item, titleTpl, contentTpl, footerTpl) {
    if (!this.selectedDeviceData || this.selectedDeviceData.length === 0 || this.util.getIdsByList(this.selectedDeviceData) === '') {
      this.messageService.info('请选择设备进行操作！');
      return;
    }
    if (item.dir === 'lockDevice') {
      let androidDevices = this.selectedDeviceData.filter(device => device.osVersion.indexOf('Android') === 0);
      // 如果含有Android设备，则需要输入解锁密码
      if (androidDevices.length > 0) {
        this.lockDevicePasswordModal = this.nzModalService.open({
          title: titleTpl,
          content: contentTpl,
          footer: footerTpl
        });
      } else {
        this.confirmCommand(item);
      }
    } else if (item.dir === 'remote') {
      if (this.selectedDeviceData.length === 1) {
        this.remoteModal = this.nzModalService.open({
          title: '远程控制',
          content: DeviceRemoteComponent,
          maskClosable: false,
          footer: false,
          width: 600,
          componentParams: {
            deviceId: this.selectedDeviceData[0].id,
            screenWidth: this.selectedDeviceData[0].screenWidth, // 如果是paid,有可能横竖不能区分
            screenHeight: this.selectedDeviceData[0].screenHeight,
          }
        });
      } else {
        this.messageService.info('请选择1台设备进行操作！');
      }
    } else {
      this.confirmCommand(item);
    }
  }
  confirmCommand(item) {
    this.modalService.popupConfirm('请确认是否要执行' + item.name + '指令？', () => {
      this.doCommand(item);
    });
  }
  doCommand(item) {
    this.http.post(this.dataService.url.device.sendCommandToDevices, {
      cmdCode: JSON.stringify({
        code: item.dir,
        config: item.config || {}
      }),
      deviceIds: this.util.getIdsByList(this.selectedDeviceData)
    }).subscribe((res: any) => {
      if (res.code === '200') {
        if (this.lockDevicePasswordModal) {
          this.lockDevicePasswordModal.destroy();
        }
        this.messageService.success('指令执行成功！');
        this.deviceService.searchDeviceGroupListEvent.emit();
        this.deviceService.searchDeviceListEvent.emit();
      } else if (res.code === 'DEVICE400018') {
        this.messageService.error('设备状态异常，不能执行指令！');
      } else {
        this.messageService.error('指令执行失败！');
      }
    });
  }
  handleOk() {
    this.doCommand({
      dir: 'lockDevice',
      config: {password: this.getFormControl('password').value}
    });
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
}
