import {Component, Input, OnInit} from '@angular/core';
import {ContentDistributeService} from "../../service/content-distribute.service";

@Component({
  selector: 'app-content-distribute-table',
  templateUrl: './content-distribute-table.component.html',
})
export class ContentDistributeTableComponent implements OnInit {
  @Input()
  content;
  // table的配置参数
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.distributes.nextPage();
      }
    }
  };
  allIsChecked = false;

  constructor(public distributes: ContentDistributeService) {}

  ngOnInit() {
    this.distributes.param.contentId = this.content.id;
    this.distributes.initList({isActiveFist: false});
  }
  /**
   * 全选
   */
  refreshStatus() {}
}
