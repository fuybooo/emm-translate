import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from "../util/util.service";
import {HttpClient} from "@angular/common/http";
import {ApplicationService} from "../../application/service/application.service";
import {ApplicationHttpService} from "../../application/service/application-http.service";
import {NzModalSubject} from "ng-zorro-antd";
import {environment} from "../../../environments/environment";
import {MessageService} from "../service/message.service";

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  providers: [ApplicationService, ApplicationHttpService]
})
export class ApplicationListComponent implements OnInit {
  @Input() system = 'Android';
  @Input() showPlatform = false;
  data = [];
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.applicationList.nextPage();
      }
    }
  };
  value;
  platformOptions = [
    {
      label: 'Android',
      value: 1
    },
    {
      label: 'iOS',
      value: 2
    },
  ];
  constructor(
    public applicationList: ApplicationService,
    public subject: NzModalSubject,
    public messageService: MessageService
  ) { }

  ngOnInit() {
    // todo ios list 参数
    if (!this.value) {
      this.value = this.system === 'Android' ? 1 : 2;
    }
    this.applicationList.param.platform = this.value;
    delete this.applicationList.param.publishMode;
    // this.value = this.applicationList.param.platform;
    this.applicationList.initList({isActiveFist: false});
  }
  submit() {
    let data = this.applicationList.checkedList;
    if (data.length === 0) {
      this.messageService.error('请选择应用');
      return;
    }
    this.subject.next({type: 'save', data: this.applicationList.checkedList, platform: this.value});
  }
  handleCancel() {
    this.subject.destroy();
  }
  changePlatform(value) {
    if (!value) {
      this.ngOnInit();
    }
  }
}
