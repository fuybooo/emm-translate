import {Component, OnInit} from "@angular/core";
import {UserGroupService, UserService} from "./user.service";
import {UserGroupFormService} from "./service/user-group-form.service";
import {UserSearchService} from "./service/user-search.service";
import {UserFormService} from "./service/user-user-form.service";
import {AddUserFormService} from "./service/user-user-add-form.service";
import {DeptFormService} from "./service/user-dept-form.service";
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  providers: [
    UserSearchService,
  ]
})
export class UserComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
