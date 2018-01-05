import {Component, Input, OnInit} from '@angular/core';
import {ContentDistributeService} from "../../service/content-distribute.service";

@Component({
  selector: 'app-content-tags-edit',
  templateUrl: './content-tags-edit.component.html',
})
export class ContentTagsEditComponent implements OnInit {
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
