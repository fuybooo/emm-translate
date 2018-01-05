import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PolicyService} from "../policy.service";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {FileItem, FileUploader} from "ng2-file-upload";
import {DataService} from "../../shared/service/data.service";
import {MessageService} from "../../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-font-configuration',
  templateUrl: './policy-item-font-configuration.component.html',
})
export class PolicyItemFontConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  data: any[] = [];
  addModal;
  uploader: FileUploader;
  subscript;

  constructor(private policyService: PolicyService,
              private util: UtilService,
              private dataService: DataService,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.setData();
    if (this.type !== 'view') {
      this.uploader = new FileUploader({
        url: this.dataService.url.content.uploadContent,
        method: "POST",
        autoUpload: true,
        // allowedFileType: ['ttf', 'otf', 'ttc'],
        itemAlias: "file"
      });
      this.uploader.onSuccessItem = (item, response: any, status, headers) => {
        let result = JSON.parse(response).data.result;
        let filename = result[0].filename;
        // 此处不能使用push方法直接给data push值，需要使用replenishPush
        this.util.replenishPush(this.data, {
          Font: '',
          Name: filename,
          Info: {
            name: filename,
            path: result[0].localfile
          }
        });
      };
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {FontConfiguration: this.getConfig()}
          });
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  setData() {
    if (this.config) {
      this.data = this.util.getReplenishArray(this.config.config);
    } else {
      this.data = this.util.getReplenishArray([]);
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc009',
      config: []
    };
    paramConfig.config = this.util.getUnReplenishArray(this.data);
    return paramConfig;
  }

  del() {
    let isDeleted = false;
    for (let i = 0; i < this.data.length; i++) {
      let data = this.data[i];
      if (data.isActive) {
        isDeleted = true;
        this.data.splice(i, 1);
        i--;
      }
    }
    if (!isDeleted) {
      // 提示没有选中任何条目
      this.messageService.error('请选择要删除的内容！');
    }
    this.data = this.util.getReplenishArray(this.data);
  }

  changeActive(item) {
    if (this.type !== 'view') {
      if (item.Name !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
}
