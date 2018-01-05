import {Component, Input, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../service/data.service";
import {UtilService} from "../util/util.service";

@Component({
  selector: 'app-custom-transfer',
  templateUrl: './custom-transfer.component.html'
})
export class CustomTransferComponent implements OnInit {
  list: any[] = [];
  sourceData: any[] = [];
  expandDataCache;
  sourceTitle= '';
  constructor(
    private msg: NzMessageService,
    private http: HttpClient,
    private dataService: DataService,
    private util: UtilService,
  ) {}
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.get(this.dataService.url.device.getDeviceGroupList, this.dataService.getWholeParams({
      deviceGroupId: '-1', // -1取全部的分组，包括未分组数据
      search: '',
      pageSize: 100,
      pageNumber: 1,
      sortOrder: '',
      sortName: ''
    }))
      .subscribe((result: any) => {
        this.sourceData = result.data.result;
      });
  }
  collapse(array, data, $event) {
    this.util.collapse(array, data, $event);
  }
  select(ret: any) {
  }

  change(ret: any) {
  }

}
