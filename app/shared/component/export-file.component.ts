import {Component, Input, OnInit} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";

@Component({
  selector: 'app-export-file',
  templateUrl: './export-file.component.html'
})
export class ExportFileComponent implements OnInit {
  @Input() userData = [];
  @Input() basicData = [];
  @Input() extendData = [];

  constructor(private subject: NzModalSubject) {
  }

  ngOnInit() {
  }

  doExport() {
    let data: any = {extendData: this.extendData};
    if (this.userData.length) {
      data.userState = this.userData;
    }
    this.subject.next({
      type: 'save',
      data: data
    });
  }

  handleCancel() {
    this.subject.destroy('onCancel');
  }
}

