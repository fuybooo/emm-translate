import {EventEmitter, Injectable} from "@angular/core";
@Injectable()
export class AppService {
  readonly defaultLng = 'zh';
  readonly lngKey = '__lng__';
  logoChangeEvent = new EventEmitter();
  setLng(lng?) {
    localStorage.setItem(this.lngKey, lng || this.defaultLng);
  }
  getLng() {
    let lng = localStorage.getItem(this.lngKey);
    if (!lng) {
      lng = this.defaultLng;
      this.setLng(lng);
    }
    return lng;
  }
}
