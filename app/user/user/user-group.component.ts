import {Component, Input, OnInit} from "@angular/core";
import {DataService} from "../../shared/service/data.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserGroupService, UserSearchService} from "../user.service";
@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html'
})
export class UserGroupComponent {
  @Input()
  type = ''; //  [type]="'simply'"
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.userGroup.nextPage();
      }
    }
  };
  constructor(public userGroup: UserGroupService) {}
}
