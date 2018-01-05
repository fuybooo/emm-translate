import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from "../util/util.service";

@Component({
  selector: 'app-application-list-widget',
  templateUrl: './application-list-widget.component.html',
})
export class ApplicationListWidgetComponent implements OnInit {
  @Input() type = 'view';
  @Input() data = [];
  @Output() outData = new EventEmitter();
  // path = 'http://192.168.7.108';
  path = '';
  constructor(
    private util: UtilService
  ) { }

  ngOnInit() {
    this.data = this.util.getReplenishArray(this.data);
  }
  changeActive(item) {
    if (this.type !== 'view') {
      if (item.name !== undefined || item.trackName !== undefined) {
        item.isActive = !item.isActive;
        this.outData.emit(this.data);
      }
    }
  }
}
