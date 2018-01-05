import {Component, Input, OnInit} from "@angular/core";
import {ApplicationService} from "../service/application.service";
import {NzModalSubject} from "ng-zorro-antd";
import {ApplicationHttpService} from "../service/application-http.service";
@Component({
  selector: 'app-application',
  templateUrl: './application-list-table.component.html',
  providers: [
    ApplicationService
  ]
})
export class ApplicationListTableComponent implements OnInit {
  @Input()
  platform = 1;
  @Input()
  publishMode = null;
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.list.nextPage();
      }
    }
  };
  constructor(public list: ApplicationService,
              public http: ApplicationHttpService,
              private subject: NzModalSubject) {
      // this.subject.next({type: 'save', data: this.user.getData()});
      // this.subject.destroy();
  }
  ngOnInit() {
    this.list.param.platform = this.platform;
    this.list.param.sortName = "serialsNum";
    this.list.param.publishMode = this.publishMode;
    this.list.initList({isActiveFist: false});
  }
  positionAdjustment(type, item, index) {
    let adjustmentIndex;
    if (type === 'up') {
      adjustmentIndex = index - 1;
    } else if (type === 'down') {
      adjustmentIndex = index + 1;
    }
    this.http.switchAppPosition({
      platform: this.list.param.platform,
      appIds: item.id + "," + this.list.list[adjustmentIndex].id
    }).subscribe((res: any) => {
      if (res.code === '200') {
        // 交换位置
        this.list.list[index] = this.list.list.splice(adjustmentIndex, 1, this.list.list[index])[0];
      }
    });
  }
}
