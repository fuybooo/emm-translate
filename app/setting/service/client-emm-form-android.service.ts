import {Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {SettingHttpService} from "./setting-http.service";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {FileItem} from "../../../../node_modules/ng2-file-upload/file-upload/file-item.class";
import {DataService} from "../../shared/service/data.service";
import {FileUploader} from "../../../../node_modules/ng2-file-upload/file-upload/file-uploader.class";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {SettingClientModelComponent} from "../client/setting-client-model.component";
import {FormControl} from "@angular/forms";
import {MessageService} from "../../shared/service/message.service";

@Injectable()
export class ClientEMMFormAndroidService extends CustomForm {
  modal;
  // 平台
  platform = 1;
  labelSm = 5;
  popUp = true;
  items = [
    {
      type: 'file-app',
      key: 'appFiles',
      required: true,
      label: '选择文件',
      uploadDesc: '仅支持正确的EMM客户端版本',
      uploader: new FileUploader({
        url: this.dataService.url.application.uploadApp,
        method: "POST",
        autoUpload: true,
        itemAlias: "file"
      }),
      validator: [
        (control: FormControl): { [s: string]: boolean } => {
          return control.value ? null : {required: true};
        }
      ],
    }, {
      type: "radio",
      label: "分配范围",
      key: 'isDefault',
      row: false,
      required: true,
      value: true,
      options: [
        {
          label: "设为默认版本",
          value: true,
        }, {
          label: "设置分配范围",
          value: false,
        }
      ],
      change: event => {
        if (event) {
          this.items[2]['hide'] = true;
          this.items[3]['hide'] = true;
        } else {
          this.items[2]['hide'] = false;
          this.items[3]['hide'] = false;
        }
      }
    }, {
      hide: true,
      type: 'select',
      label: '分配设备型号',
      key: 'deviceModelIds',
      value: [],
      options: [],
      nzSearchChange: (search?) => {
        this.http.getDeviceModelList({search: search, page: 1, pageSize: 10})
          .subscribe((res: any) => {
            let options = [];
            for (let g of res.data.result) {
              if (this.getFormControl('deviceModelIds').value && !this.getFormControl('deviceModelIds').value.find(id => id === g.id)) {
                options.push({label: g.model, value: JSON.stringify({label: g.model, value: g.id})});
              }
            }
            if (search && options.length === 0) {
              options.push({label: '没有匹配的结果', disabled: true, value: -1});
            }
            this.items[2] = Object.assign(this.items[2], {options: options});
            this.getFormControl('deviceModelIds').setValue(this.getFormControl('deviceModelIds').value);
          });
      },
      add: true,
      addEvent: () => {
        this.modal = this.nzModalService.open({
          title: '设备型号管理',
          content: SettingClientModelComponent,
          footer: false, // footer默认为true
          width: 500,
          componentParams: {
            xx: ''
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modal.subscribe((result) => {
          if (result.type === 'save') {

          }
        });
      }
    }, {
      hide: true,
      type: 'select-group',
      key: 'publishObject',
      label: '分配对象',
      value: {},
      labels: ['group', 'deviceGroup', 'dept'],
      selectLabel: '请选择用户组/设备组/部门',
      resultLabel: '分配对象'
    }
  ];
  appPath = [];

  constructor(private dataService: DataService,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private modalService: ModalService,
              private http: SettingHttpService) {
    super();
    // 上传应用
    this.items[0]['uploader'].onBuildItemForm = (fileItem: FileItem, form: any): any => {
      form.append("platform", this.platform);
      // appType:[0|1|2]//默认不传为0;EMM为1,安全桌面为2
      form.append("appType", 1);
    };
    this.items[0]['uploader'].onSuccessItem = (item, response, status, headers) => {
      let res = JSON.parse(response);
      if (res.code === '200') {
        this.appPath.push(JSON.parse(response).data.localName);
        this.getFormControl('appFiles').setValue(JSON.parse(response).data.localName);
        if (this.items[0]['uploader'].queue.length > 1) {
          this.items[0]['uploader'].queue.forEach((_item: any, index) => {
             if (index !== (this.items[0]['uploader'].queue.length - 1)) {
                _item.remove();
             }
          });
        }
      } else if (res.code === 'APPLICATION800007') {
        this.messageService.warning("系统中已存在更高的版本！");
        this.appPath.push(JSON.parse(response).data.localName);
        this.getFormControl('appFiles').setValue(JSON.parse(response).data.localName);
        if (this.items[0]['uploader'].queue.length > 1) {
          this.items[0]['uploader'].queue.forEach((_item: any, index) => {
            if (index !== (this.items[0]['uploader'].queue.length - 1)) {
              _item.remove();
            }
          });
        }
      } else if (res.code === 'APPLICATION800006') {
        this.messageService.error("此版本已存在！");
        // this.items[0]['uploader'].clearQueue();
        item.remove();
      } else {
        this.messageService.error("请上传正确的EMM客户端版本！");
        // this.items[0]['uploader'].clearQueue();
        item.remove();
      }
    };
  }

  getSourceData(): any {
    return super.getData();
  }

  getData(): any {
    let data = super.getData();
    let deviceModelIds = [];
    data.deviceModelIds.forEach((item: any) => {
       deviceModelIds.push(JSON.parse(item).value);
    });
    return {
      isDefault: data.isDefault, // [true|false]是否默认版本
      platform: this.platform, // [1|2]//平台
      deviceModelIds: deviceModelIds.join(','),
      // userIds: data.publishObject.userIds ? data.publishObject.userIds.join(',') : '',
      deviceGroupIds: data.publishObject.deviceGroupIds ? data.publishObject.deviceGroupIds.join(',') : '',
      userGroupIds: data.publishObject.groupIds ? data.publishObject.groupIds.join(',') : '',
      deptIds: data.publishObject.deptIds ? data.publishObject.deptIds.join(',') : '',
      localName: this.appPath.join(','), // 应用本地名
    };
  }
}
