import {Component, Input, OnInit} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";
import {AddUserFormService} from "../service/user-user-add-form.service";
import {UserService} from "../service/user-user.service";
import {UserGroupService} from "../service/user-group.service";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  providers: [
    AddUserFormService,
    UserGroupService,
    UserService
  ]
})
export class UserFormComponent implements OnInit {
  @Input()
  group;
  @Input()
  dept;
  constructor(public user: AddUserFormService,
              private subject: NzModalSubject) {
    this.user.submit = () => {
      // this.subject.next({type: 'save', data: this.user.getData()});
    };
    this.user.cancel = () => {
      // this.subject.destroy();
    };
  }
  ngOnInit() {
    if (this.group) {
      this.user.items.forEach((item) => {
        if (item.key === 'group_ids' && item.hasOwnProperty('options')) {
          item['options'] = [{label: this.group.name, value: this.group.id}];
          item['value'] = [this.group.id];
        }
      });
    }
  }
}
