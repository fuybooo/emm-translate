import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-content-picture-files',
  templateUrl: './content-picture-files.component.html',
})
export class ContentPictureFilesComponent {
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

  /**
   * 新建文件夹
   */
  newFolder() {
    this.newFolderEvent.emit();
  }

  /**
   * 分发
   */
  distribute(item) {
    this.contentDistribute = item;
  }

  /**
   * 上传文件
   */
  uploadFile() {
    this.uploadFileEvent.emit();
  }

  /**
   * 文档权限
   */
  documentPermissions() {
    this.documentPermissionsEvent.emit();
  }

  /**
   * 远程删除
   */
  deleteRemote() {
    this.deleteRemoteEvent.emit();
  }

  /**
   * 文档可见范围
   */
  visibleRange() {
    this.visibleRangeEvent.emit();
  }

  /**
   * 下载权限
   */
  downloadPermissions() {
    this.downloadPermissionsEvent.emit();
  }

  /**
   * move
   */
  move() {
    this.moveEvent.emit();
  }

  /**
   * copy
   */
  copy() {
    this.copyEvent.emit();
  }
}
