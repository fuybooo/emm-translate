import {Component, OnInit} from "@angular/core";
import {NzModalService} from "ng-zorro-antd";
import {ApplicationHttpService} from "./service/application-http.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationVersionService} from "./service/application-version.service";
import {ModalService} from "../shared/service/modal.service";
import {DataService} from "../shared/service/data.service";
import {ApplicationFormService} from "./service/application-form.service";
import {CustomFormComponent} from "../shared/custom-form/custom-form.component";
import {MessageService} from "../shared/service/message.service";
@Component({
  selector: 'app-application',
  templateUrl: './application-detail.component.html',
  providers: [
    ApplicationVersionService
  ]
})
export class ApplicationDetailComponent implements OnInit {
  platform = 'android';
  public applicationDetail: any;
  // EMM分发详情
  users = [];
  groups = [];
  depts = [];
  scrollbarAppVersionList = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.appVersionList.nextPage();
      }
    }
  };
  // 弹出层
  modal;
  constructor(private http: ApplicationHttpService,
              public appVersionList: ApplicationVersionService,
              private modalService: ModalService,
              private activatedRoute: ActivatedRoute,
              private dataService: DataService,
              private messageService: MessageService,
              private router: Router,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.platform = this.activatedRoute.snapshot.params['platform'];
    let param = {
      platform: 1,
      appId: null,
    };
    if (this.platform === 'android') {
      param.platform = 1;
    } else if (this.platform === 'iOS') {
      param.platform = 2;
    } else {
      // todo 其他平台
      return;
    }
    // 编辑推送
    if (this.activatedRoute.snapshot.params['id'] > 0) {
      param.appId = this.activatedRoute.snapshot.params['id'];
      this.http.getAppDetail(param).subscribe((res: any) => {
        if (res.code === '200') {
          this.applicationDetail = res.data;
        }
      });
      // 应用历史版本记录
      this.appVersionList.param.appId = param.appId;
      this.appVersionList.param.platform = param.platform;
      this.appVersionList.initList({isActiveFist: false});
      this.http.getAccessConfOfApp({platform: 1, appId: param.appId}).subscribe((res: any) => {
        if (res.code === '200') {
          this.users = [];
          this.groups = [];
          this.depts = [];
          res.data.forEach((item: any) => {
            if (item.applyType === 5) {
              // 用户组
              if (item.applyName) {
                this.users.push({id: item.applyValue, name: item.applyName});
              }
            } else if (item.applyType === 3) {
              // 设备组
              if (item.applyName) {
                this.groups.push({id: item.applyValue, name: item.applyName});
              }
            } else if (item.applyType === 1) {
              // 部门
              if (item.applyName) {
                this.depts.push({id: item.applyValue, name: item.applyName});
              }
            }
          });
        }
      });
    }
  }
  // 灰度发布转正式发布
  appPushGrayToNormal(item) {
    let param = {
      platform: 1,
      appId: item.id,
      publishMode: 1, // [1|2]//正常发布|灰度发布
    };
    if (this.platform === 'android') {
      param.platform = 1;
    } else if (this.platform === 'iOS') {
      param.platform = 2;
    } else {
      // todo 其他平台
      return;
    }
    this.modal = this.modalService.popupConfirm('您确定要正式发布吗？', () => {
      this.http.publishApp(param).subscribe((res: any) => {
        if (res.code === '200') {
          this.ngOnInit();
        }
      });
    }, '确定要把，<span class="text-primary">' + item.name + '</span>，从“灰度发布”转换为“正式发布吗”吗？');
  }

  editApp(item) {
    let service = new ApplicationFormService(this.dataService, this.messageService, this.http);
    service.items[0]['value'] = 'aaaaaaaa';
    service.items[0]['hide'] = true;
    service.items[4]['value'] = item.sysVersionName;
    service.remoteDateImg = (item.screenShotUrl && item.screenShotUrl.length > 0);

    let values = [];
    let options = [];
    item.appClasses.forEach((_item: any) => {
      values.push(_item.classId);
      options.push({label: _item.className, value: _item.classId});
    });
    service.items[3]['value'] = values;
    service.items[3]['options'] = options;

    service.items[5]['hide'] = true;
    service.setData(item);
    if (this.platform === 'android') {
      service.platform = 1;
    } else if (this.platform === 'iOS') {
      service.platform = 2;
    } else {
      // todo 其他平台
      return;
    }
    this.http.getAppDetail({platform: service.platform, appId: item.id}).subscribe((res: any) => {
      if (res.code === '200') {
        service.items[1]['value'].remoteAddrImgs = res.data.screenShotUrl;
        this.modal = this.nzModalService.open({
          title: '编辑应用',
          content: CustomFormComponent,
          footer: false, // footer默认为true
          width: 600,
          wrapClassName: 'upload-modal',
          componentParams: {
            options: service
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modal.subscribe((result: any) => {
          if (result === 'onShown') {
            // if (data.length > 0) {
            //   service.setData({publishObject: data, publishMode: '2'})
            // }
          }
          if (result.type === 'save') {
            this.http.editApp({appId: item.id, ...result.data, publishMode: null} as any).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.modal.destroy();
                this.ngOnInit();
              }
            });
          }
        });
      }
    });
  }

  appOnline(type, item) {
    let platform = 1;
    if (this.platform === 'android') {
      platform = 1;
    } else if (this.platform === 'iOS') {
      platform = 2;
    } else {
      // todo 其他平台
      return;
    }
    switch (type) {
      case 'up':
        this.modal = this.modalService.popupConfirm('您确定要上架此应用吗？', () => {
          this.http.setAppOnline({
            isOnline: true,
            platform: platform,
            appId: item.id
          }).subscribe((res: any) => {
            if (res.code === '200') {
              item.appUpOrDown = 1;
              this.messageService.info("已上架" + item.name);
            }
          });
        }, '确定要上架，<span class="text-primary">' + item.name + '</span>这个应用吗？');
        break;
      case 'down':
        this.modal = this.modalService.popupConfirm('您确定要下架此应用吗？', () => {
          this.http.setAppOnline({
            isOnline: false,
            platform: platform,
            appId: item.id
          }).subscribe((res: any) => {
            if (res.code === '200') {
              item.appUpOrDown = 0;
              this.messageService.info("已下架" + item.name);
            }
          });
        }, '确定要下架，<span class="text-primary">' + item.name + '</span>这个应用吗？');
        break;
    }
  }
}
