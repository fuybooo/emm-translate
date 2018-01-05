import {Component, Input, OnInit} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";
import {DeptService} from "../service/user-dept.service";

@Component({
  selector: 'app-device-move',
  templateUrl: './user-move-dept.component.html',
  providers: [DeptService]
})
export class UserMoveDeptComponent {

  constructor(private subject: NzModalSubject, private deptService: DeptService) {
    this.deptService.param.parentId = '0';
    this.deptService.initListPopUp();
  }

  submit(event) {
    this.subject.next({type: 'save', data: this.deptService.itemIsActive});
  }
  handleCancel(event) {
    this.subject.destroy('onCancel');
  }
}
