import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ContentFileService} from "../../service/content-file.service";

@Component({
  selector: 'app-content-recycle-bin',
  templateUrl: './content-recycle-bin.component.html',
})
export class ContentRecycleBinComponent {
  @Output()
  search = new EventEmitter(true);
  @Output()
  uploadFileEvent = new EventEmitter(true);
  @Output()
  deleteRemoteEvent = new EventEmitter(true);
  @Output()
  visibleRangeEvent = new EventEmitter(true);
  @Output()
  downloadPermissionsEvent = new EventEmitter(true);
  @Output()
  newFolderEvent = new EventEmitter(true);
  @Output()
  moveEvent = new EventEmitter(true);
  @Output()
  copyEvent = new EventEmitter(true);
  @Output()
  documentPermissionsEvent = new EventEmitter(true);
  /**
   * 当前显示分发的文档对象
   */
  contentDistribute;

  constructor(private files: ContentFileService) {

  }

  /**
   * 搜索
   * @param search
   */
  doSearch(search) {
    this.search.emit(search);
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  distribute(event) {}

  /**
   * 还原
   */
  visibleRange() {
    this.files.restoreContent(false);
  }

  /**
   * 彻底删除
   */
  downloadPermissions() {
    this.files.delete(false, true);
  }
}
