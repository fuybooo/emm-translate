import {Component, Input, OnInit} from '@angular/core';
import {ContentFolderTreeService} from "../../service/content-folder-tree.service";
import {NzModalSubject} from "ng-zorro-antd";
import {ContentFileService} from "../../service/content-file.service";

@Component({
  selector: 'app-folder-tree-table',
  templateUrl: './content-folder-tree.component.html',
  providers: [
    ContentFolderTreeService
  ]
})
export class ContentFolderTreeComponent implements OnInit {
  @Input()
  content;
  @Input()
  excludeIds: any[] = null;
  allIsChecked = false;

  constructor(private subject: NzModalSubject,
              public folders: ContentFolderTreeService) {
  }

  ngOnInit() {
    this.folders.param.excludeIds = this.excludeIds.join(',');
    this.folders.initList({isActiveFist: false});
  }

  submit(event) {
    this.subject.next({type: "save", data: this.folders.checkedList});
  }

  handleCancel(event) {
    this.subject.destroy('onCancel');
  }
}
