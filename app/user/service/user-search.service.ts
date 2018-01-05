import {EventEmitter, Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
@Injectable()
export class UserSearchService {
  userSearchEvent = new EventEmitter<any>();
  // 当前选择的用户状态
  userState = '';
  userStateCheckedEvent = new EventEmitter<any>();
  data: any;
  // 用户统计
  userStateStatistics = [
    {
      state: 'NotActive',
      title: '未激活',
      number: 0,
      percentage: '0',
      isActive: false,
    },
    {
      state: 'Activation',
      title: '已激活',
      number: 0,
      percentage: '0',
      isActive: false,
    },
    {
      state: 'Locking',
      title: '锁定',
      number: 0,
      percentage: '0',
      isActive: false,
    },
    {
      state: 'Disable',
      title: '停用',
      number: 0,
      percentage: '0',
      isActive: false,
    }
  ];

  constructor(private http: HttpClient, private dataService: DataService) {
    this.userStateCheckedEvent.subscribe((data) => {
      this.userState = data.value;
      this.userSearchEvent.emit(this.userState);
    });
  }

  update() {
    this.http.get(this.dataService.url.user.userStateStatistics)
      .subscribe((res: any) => {
        this.userStateStatistics = res.data.result;
        this.data = res.data.result;
      });
  }
}
