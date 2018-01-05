import { Component, OnInit } from '@angular/core';
import {ContentFileService} from "../../content.service";

@Component({
  selector: 'app-content-recycle-bin-table',
  templateUrl: './content-recycle-bin-table.component.html',
})
export class ContentRecycleBinTableComponent {
  // table的配置参数
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.files.nextPage();
      }
    }
  };
  allIsChecked = false;

  constructor(public files: ContentFileService) {}

  /**
   * 全选
   */
  refreshStatus(event) {}
}
