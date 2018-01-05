import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataService} from "../shared/service/data.service";
import {UserSearchService, UserService} from "./user.service";
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html'
})
export class UserSummaryComponent implements OnInit {

  constructor(private http: HttpClient,
              private dataService: DataService,
              public userSearch: UserSearchService) {
  }

  ngOnInit() {
    this.userSearch.update();
  }

  userStateToggle(state) {
    state.isActive = !state.isActive;
    let _state = [];
    for (let i of this.userSearch.userStateStatistics) {
      if (i.isActive) {
        _state.push( i.state);
      }
    }
    this.userSearch.userStateCheckedEvent.emit({value: _state.join(',')});
  }
}
