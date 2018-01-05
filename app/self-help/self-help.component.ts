import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {PermissionService} from "../shared/service/permission.service";
import {UserFormService} from "../user/service/user-user-form.service";
import {NzModalService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {UtilService} from "../shared/util/util.service";
import {MapTrailComponent} from "../shared/custom-map/map-trail.component";
import {MessageService} from "../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-self-help',
  templateUrl: './self-help.component.html',
  providers: [UserFormService]
})
export class SelfHelpComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUserInfo;
  currentUser;
  isViewDevice = true;
  isViewUser = true;
  passwordExpiredModal;
  selectedDeviceData;
  popupDeviceTrailModal;
  constructor(
    private permissionService: PermissionService,
    public userForm: UserFormService,
    private router: Router,
    private util: UtilService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private nzModalService: NzModalService
  ) {}
  ngOnInit() {
    this.currentUserInfo = this.permissionService.getSession();
    if (this.currentUserInfo.currentIsAdmin) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = this.permissionService.getUser();
    this.userForm.readonly = true;
    this.userForm.showButton = false;
    this.userForm.showSubmitButton = false;
    this.userForm.showCancelButton = false;
    // 判断密码是否过期
    if (this.currentUser.isPasswordExpired) {
      setTimeout(() => {
        this.passwordExpiredModal = this.nzModalService.warning({
          title: '密码过期提醒',
          content: '亲爱的'
          + this.currentUser.userName +
          '，您好：<br>' +
          '您的密码已经过期，为确保您的账户安全，请修改密码。',
          okText: '立即修改',
          cancelText: '稍后修改',
          onOk: () => {
            $('#modify-password').click();
          }
        });
      }, 500); // 需要等待一段时间调用弹出方法
    }
  }
  ngOnDestroy() {
    if (this.passwordExpiredModal) {
      this.passwordExpiredModal.destroy();
    }
  }
  ngAfterViewInit() {
    this.userForm.setData(this.currentUser || {});
  }
  onChangeDeviceCheckData(selectedDeviceData) {
    this.selectedDeviceData = this.util.getCheckedData(selectedDeviceData);
  }
  saveUserInfo() {
    this.userForm.readonly = true;
    this.userForm.submit();
  }
  popupDeviceTrail() {
    if (!this.selectedDeviceData || this.selectedDeviceData.length === 0) {
      this.messageService.info('请选择设备进行查看！');
      return;
    }
    this.popupDeviceTrailModal = this.nzModalService.open({
      title: '查看设备位置信息',
      content: MapTrailComponent,
      footer: false, // footer默认为true
      width: 1200,
      componentParams: {
        ids: this.util.getIdsByList(this.selectedDeviceData)
      }
    });
  }
}
