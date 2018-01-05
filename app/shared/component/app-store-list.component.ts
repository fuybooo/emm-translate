import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../service/data.service";
import {UtilService} from "../util/util.service";
import {MessageService} from "../service/message.service";
import {Jsonp} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-app-store-list',
  templateUrl: './app-store-list.component.html',
})
export class AppStoreListComponent implements OnInit {
  @Input() multiple = false;
  @Input() widthLocalApp = false;
  data = [];
  params = {
    term: '',
    country: 'us',
    entity: 'software'
  };
  searchWord = '';
  isLoading = false;
  constructor(
    private subject: NzModalSubject,
    private http: HttpClient,
    private util: UtilService,
    private messageService: MessageService,
    private dataService: DataService,
    private jsonp: Jsonp,
  ) { }

  ngOnInit() {
    this.searchList();
  }
  changeChecked(data) {
    this.util.changeActive(this.data, data, true, 'bundleId');
  }
  searchList() {
    this.isLoading = true;
    this.data = [];
    ((this.jsonp.get(`https://itunes.apple.com/search?term=${this.searchWord}&country=us&entity=software&callback=JSONP_CALLBACK`)
      .map(res => res.json()) as Observable<Response>)
      .debounceTime(500) as Observable<Response>)
      .subscribe((data: any) => {
      this.isLoading = false;
      if (this.widthLocalApp) {
        this.http.get(this.dataService.url.application.getAppList, this.dataService.getWholeParams({
          search: this.searchWord,
          platform: 2
        })).subscribe((response: any) => {
          this.data = this.data.concat(this.getStoreData(response.data.result)).concat(data.results);
        });
      } else {
        this.data = data.results;
      }
    });
  }
  getStoreData(list) {
    let storeData = [];
    for (let item of list) {
      storeData.push({
        artworkUrl60: item.iconUrl,
        trackName: item.name,
        bundleId: item.packageName,
      });
    }
    return storeData;
  }
  doSearch() {
    this.searchList();
  }
  changeSearchWord() {
    this.searchList();
  }
  submit() {
    let checkedList = this.util.findActive(this.data);
    if (this.multiple) {
      checkedList = this.util.getCheckedData(this.data);
    }
    if (checkedList.length === 0) {
      this.messageService.error('请选择应用');
    } else {
      this.subject.next({type: 'save', data: checkedList});
    }
  }
  handleCancel() {
    this.subject.destroy();
  }
}
