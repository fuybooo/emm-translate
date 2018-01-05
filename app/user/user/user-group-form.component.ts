import {Component, Input, OnInit} from "@angular/core";
import {UserGroupFormService, UserGroupService} from "../user.service";
import {NzModalSubject} from "ng-zorro-antd";
import {MessageService} from "../../shared/service/message.service";
import {FormBuilder, FormGroup} from "@angular/forms";
@Component({
  selector: 'app-user-group-form',
  templateUrl: './user-group-form.component.html',
  providers: [UserGroupFormService, UserGroupService]
})
export class UserGroupFormComponent {
  constructor(public userGroup: UserGroupFormService,
              private userGroupService: UserGroupService,
              private fb: FormBuilder,
              private messageService: MessageService,
              private subject: NzModalSubject) {
    this.userGroup.popUp = true;
    userGroup.items.splice(3, 2);
    this.userGroup.submit = () => {
      // this.subject.next({type: 'save', data: this.userGroup.getData()});
    };
    this.userGroup.cancel = () => {
      this.subject.destroy();
    };
  }
}
