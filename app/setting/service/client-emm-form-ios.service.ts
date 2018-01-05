import {Injectable} from '@angular/core';
import {CustomForm} from "../../shared/custom-form/custom-form";
import {DataService} from "../../shared/service/data.service";
import {FileUploader} from "../../../../node_modules/ng2-file-upload/file-upload/file-uploader.class";
import {FileItem} from "../../../../node_modules/ng2-file-upload/file-upload/file-item.class";
import {FormControl} from "@angular/forms";
import {MessageService} from "../../shared/service/message.service";

@Injectable()
export class ClientEMMFormIOSService extends CustomForm {
  // 平台
  platform = 2;
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
    }
  ];
  appPath = [];

  constructor(private dataService: DataService,
              private messageService: MessageService) {
    super();
    // 上传应用
    this.items[0]['uploader'].onBuildItemForm = (fileItem: FileItem, form: any): any => {
      form.append("platform", this.platform);
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

  getData(): any {
    let data = super.getData();
    return {
      platform: this.platform, // [1|2]//平台
      localName: this.appPath.join(','), // 应用本地名
    };
  }
}
