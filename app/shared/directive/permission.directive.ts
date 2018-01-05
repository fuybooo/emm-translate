import {Directive, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {PermissionService} from "../service/permission.service";

@Directive({selector: '[appPermission]'})
export class PermissionDirective implements OnInit, OnChanges {
  @Input() appPermission = '2';
  @Input() appPermissionExtendOptions = {
    disabled: false
  };

  /**
   * 处理权限问题
   * add_edit100:超级管理员;add_edit101:全局查看管理员;add_edit102:部门查看管理员;add_edit103:部门管理员;
   * permission属性为1表示仅超级管理员可见
   * permission属性为2表示操作按钮 较高权限可见 目前是add_edit100 add_edit103可见，即超级管理员和部门管理员可见
   */
  constructor(private elementRef: ElementRef,
              private permissionService: PermissionService) {
  }
  ngOnInit() {
    let permission = this.permissionService.getSession().permission;
    // 普通用户permission为空
    if (permission) {
      if ((permission !== 'add_edit100' && this.appPermission === '1') ||
        ((permission === 'add_edit101' || permission === 'add_edit102') && (this.appPermission === '' || this.appPermission === '2'))
      ) {
        this.elementRef.nativeElement.disabled = true;
        this.elementRef.nativeElement.className = this.elementRef.nativeElement.className + ' permission-disabled';
        this.elementRef.nativeElement.title = '无权限';
      } else if (this.appPermissionExtendOptions.disabled) {
        this.elementRef.nativeElement.disabled = true;
      } else {
        this.elementRef.nativeElement.disabled = false;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }
}

