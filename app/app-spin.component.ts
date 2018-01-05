import {Component, OnInit} from '@angular/core';
import {AppSpinService} from "./shared/service/app-spin.service";
declare let $: any;
/**
 * 使用方法
 * 注入服务： AppSpinService
 * 开启loading
 * this.appSpinService.spin();
 * 关闭loading
 * this.appSpinService.spin(false);
 */
@Component({
  selector: 'app-spin',
  template: `<div class="app-mask" [class.dn]="!spin"></div><nz-spin class="app-spin" [nzSize]="'large'" [nzSpinning]="spin"></nz-spin>`,
})
export class AppSpinComponent implements OnInit {
  spin = false;
  constructor(
    private spinService: AppSpinService
  ) {
  }

  ngOnInit() {
    this.spinService.spinEvent.subscribe((res: boolean) => {
      this.spin = res;
    });
  }
}
