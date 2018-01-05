import {EventEmitter, Injectable} from '@angular/core';
@Injectable()
export class ContentBreadcrumbService {
  toTargetEvent = new EventEmitter(true);
  curr = {id: null};
  breadcrumb = [];
  add(item) {
    this.breadcrumb.push(item);
    this.curr = item;
  }
  toTarget(item) {
    if (item) {
      let index = this.breadcrumb.indexOf(item);
      if (index > -1) {
        this.breadcrumb = this.breadcrumb.slice(0, index + 1);
        this.curr = item;
        this.toTargetEvent.emit(item);
      }
    }
  }
}
