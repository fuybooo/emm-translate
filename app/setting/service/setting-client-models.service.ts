import {EventEmitter, Injectable} from '@angular/core';
import {CustomList} from "../../shared/custom-list/custom-list";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {SettingHttpService} from "./setting-http.service";
@Injectable()
export class SettingClientModelService extends CustomList {
  param = {
    search: '',
    pageSize: 50,
    page: 1,
    total: 0
  };
  constructor(private http: SettingHttpService) {
    super();
  }
  initList(...other) {
    this.isLoading = true;
    let e = new EventEmitter(true);
    this.getList()
      .subscribe((res: any) => {
        if (res.data && res.data.result) {
          this.list = res.data.result;
          this.param.total = res.data.total;
          this.isLoading = false;
        } else {
          this.list = [];
          this.param.total = 0;
          this.isLoading = false;
        }
      });
    return e;
  }
  getList() {
    return this.http.getDeviceModelList(this.param);
  }
  /**
   * 异步验证名称全局唯一
   * @param control
   * @returns {any}
   */
  // nameAsyncValidator = (control: FormControl): any => {
  //   let _this_ = this;
  //   return Observable.create((observer) => {
  //     _this_.http.isTagExist({tagName: control.value}).subscribe((res: any) => {
  //       if (res.data.isExist) {
  //         observer.next({error: true, nameAsyncValidator: true});
  //       } else {
  //         observer.next(null);
  //       }
  //       observer.complete();
  //     });
  //   });
  // }

}
