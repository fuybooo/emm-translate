import {Component, OnInit} from "@angular/core";
import {NzModalService} from "ng-zorro-antd";
import {ImportFileComponent} from "../../shared/component/import-file.component";
import {DataService} from "../../shared/service/data.service";
import {SettingHttpService} from "../service/setting-http.service";
import {DomSanitizer} from "@angular/platform-browser";
import { environment } from '../../../environments/environment';
import {MessageService} from "../../shared/service/message.service";
import {AppService} from "../../app.service";
@Component({
  selector: 'app-setting-enterprise',
  templateUrl: './setting-enterprise.component.html',
})
export class SettingEnterpriseComponent implements OnInit {
  logoImg;
  urlImgAndroidEMM;
  environment = environment;
  freeTotal; // 剩余可使用数
  total; // 已使用个数
  useTotal; // 总数
  UserAgreementContent;
  // 弹出层
  modal;

  constructor(private nzModalService: NzModalService,
              private sanitizer: DomSanitizer,
              private http: SettingHttpService,
              private messageService: MessageService,
              private appService: AppService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.http.getLogoAddress().subscribe((res: any) => {
      if (res.code === '200') {
        this.logoImg = res.data.logoAddress;
      }
    });
    this.http.getSerialNumberMessage().subscribe((res: any) => {
      if (res.code === '200') {
        this.freeTotal = res.data.freetotal;
        this.total = res.data.total;
        this.useTotal = res.data.usetotal;
      }
    });
    this.http.getUserAgreement().subscribe((res: any) => {
      if (res.code === '200') {
        this.UserAgreementContent = this.sanitizer.bypassSecurityTrustHtml(res.data);
      }
    });

    /**
     * 获取EMM二维码
     */
    // this.http.getQrcode({platform: 1}).subscribe((res: any) => {
    //   this.urlImgAndroidEMM = res.emm;
    // });
    // this.http.getQrcode({platform: 2}).subscribe((res: any) => {
    //   if (res.code === '200') {
    //
    //   }
    // });
  }

  upLoadLogo() {
    this.modal = this.nzModalService.open({
      title: '上传LOGO',
      content: ImportFileComponent,
      closable: false, // 如果弹出层需要做离开保护的话，不能有关闭按钮
      maskClosable: false, // 如果弹出层需要做离开保护的话，不能点击蒙层关闭
      footer: false, // footer默认为true
      width: 700,
      componentParams: {
        type: 'device',
        desc: 'LOGO文件',
        template: false,
        fileTypeLimit: ['png'],
        url: this.dataService.url.setting.logoSetting,
        iconImgCls: 'icon-file jpg'
      }
    });
    this.modal.subscribe(result => {
      if (result === 'download') {
      } else if (result.type === 'import') {
        result.uploader.onSuccessItem = (item, response: any, status, headers) => {
          this.http.getLogoAddress().subscribe((res: any) => {
            if (res.code === '200') {
              this.logoImg = res.data.logoAddress;
              this.appService.logoChangeEvent.emit();
            }
          });
        };
        result.uploader.queue[0].upload();
        this.modal.destroy();
      }
    });
  }

  upLoadUserAgreement() {
    this.modal = this.nzModalService.open({
      title: '上传用户协议',
      content: ImportFileComponent,
      closable: false, // 如果弹出层需要做离开保护的话，不能有关闭按钮
      maskClosable: false, // 如果弹出层需要做离开保护的话，不能点击蒙层关闭
      footer: false, // footer默认为true
      width: 700,
      componentParams: {
        type: 'device',
        desc: '协议文件',
        template: false,
        fileTypeLimit: ['txt'],
        url: this.dataService.url.setting.uploadUserProtocol,
      }
    });
    this.modal.subscribe(result => {
      if (result === 'download') {
      } else if (result.type === 'import') {
        result.uploader.onSuccessItem = (item, response: any, status, headers) => {
          let res = JSON.parse(response);
          if (res.code === '200') {
            this.http.getUserAgreement().subscribe((_res: any) => {
              if (_res.code === '200') {
                this.UserAgreementContent = this.sanitizer.bypassSecurityTrustHtml(_res.data);
              }
            });
          } else if (res.code === 'SETGETAGREEMENTFAIL500112') {
            this.messageService.warning('上传的用户协议不能为空！');
          } else if (res.code === 'SETPERMISSIONDEINE500013') {
            this.messageService.warning('权限不足！');
          } else {
            this.messageService.error('用户协议上传失败！');
          }
        };
        result.uploader.queue[0].upload();
        this.modal.destroy();
      }
    });
  }
}
