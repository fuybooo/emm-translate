import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from "../service/modal.service";
import {NzModalSubject} from 'ng-zorro-antd';
import {MessageService} from "../service/message.service";
import {FileItem, FileUploader} from "ng2-file-upload";

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html'
})
export class ImportFileComponent implements OnInit {
  @Input() type;
  @Input() desc;
  @Input() url;
  @Input() fileTypeLimit = ['csv']; // 'xlsx', 'xls'
  @Input() template = true;
  @Input() itemAlias = "file";
  @Input() iconImgCls = 'icon-file xls';
  fileName = '';
  uploader: FileUploader;
  constructor(
    private subject: NzModalSubject,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.url,
      method: "POST",
      itemAlias: this.itemAlias,
      // allowedFileType: this.fileTypeLimit, // csv
    });
  }

  handleCancel() {
    this.subject.destroy();
  }

  changeFile(file) {
    if (file && file.value) {
      this.fileName = file.files[0].name;
      let suffix = this.fileName.slice(this.fileName.lastIndexOf('.') + 1, this.fileName.length);
      let isValid = false;
      for (let limit of this.fileTypeLimit) {
        if (suffix === limit) {
          isValid = true;
        }
      }
      if (!isValid) {
        this.messageService.error('文件格式不正确，请重新选择！');
        this.cancelFile(file);
      }
    } else {
      this.fileName = '';
    }
  }
  cancelFile(file) {
    file.value = '';
    this.fileName = '';
  }
  submitFile() {
    this.subject.next({
      type: 'import',
      uploader: this.uploader
    });
  }
  downloadTemplate() {
    this.subject.next('download');
  }
}
