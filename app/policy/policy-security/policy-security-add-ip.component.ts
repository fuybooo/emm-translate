import {Component, OnDestroy, OnInit} from "@angular/core";
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {MessageService} from "../../shared/service/message.service";
@Component({
  selector: 'app-policy-security-add-ip',
  templateUrl: './policy-security-add-ip.component.html'
})
export class PolicySecurityAddIpComponent implements OnInit {
  radioValue = 'simple'; // simple simpleSection complexSection
  startIp1;
  startIp2;
  startIp3;
  startIp4;
  startIp5;
  startIp6;
  startIp7;
  startIp8;
  subnetMask;
  constructor(
    private subject: NzModalSubject,
    private messageService: MessageService,
    private nzModalService: NzModalService,
    private modalService: ModalService,
  ) {}
  ngOnInit() {}
  submit() {
    let config = '';
    if (this.radioValue === 'simple') {
      if (!(this.startIp1 === undefined || this.startIp2 === undefined || this.startIp3 === undefined || this.startIp4 === undefined)) {
        config = `${this.startIp1}.${this.startIp2}.${this.startIp3}.${this.startIp4}`;
      } else {
        this.messageService.error('IP不能为空！');
        return;
      }
    } else if (this.radioValue === 'simpleSection') {
      if (!(this.startIp1 === undefined || this.startIp2 === undefined || this.startIp3 === undefined || this.startIp4 === undefined ||
        this.startIp5 === undefined || this.startIp6 === undefined || this.startIp7 === undefined || this.startIp8 === undefined)) {
        config = `${this.startIp1}.${this.startIp2}.${this.startIp3}.${this.startIp4
          } - ${this.startIp5}.${this.startIp6}.${this.startIp7}.${this.startIp8}`;
      } else {
        this.messageService.error('IP不能为空！');
        return;
      }
    } else if (this.radioValue === 'complexSection') {
      if (!(this.startIp1 === undefined || this.startIp2 === undefined || this.startIp3 === undefined || this.startIp4 === undefined
        || this.subnetMask === undefined)) {
        config = `${this.startIp1}.${this.startIp2}.${this.startIp3}.${this.startIp4} / ${this.subnetMask}`;
      } else {
        this.messageService.error('IP不能为空！');
        return;
      }
    }
    this.subject.next({
      type: 'save',
      item: {
        type: this.radioValue,
        config: config
      }
    });
  }
  handleCancel() {
    this.subject.destroy('onCancel');
  }
}
