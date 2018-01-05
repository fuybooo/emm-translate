import {Component, OnInit} from "@angular/core";
import {MessageService} from "../../shared/service/message.service";
import {NzModalService} from "ng-zorro-antd";
import {SettingHttpService} from "../service/setting-http.service";
import {ModalService} from "../../shared/service/modal.service";
import {ClientEMMService} from "../service/client-emm.service";
import {ClientSecurityDesktopService} from "../service/client-security-desktop.service";
import {DataService} from "../../shared/service/data.service";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {ClientEMMFormAndroidService} from "../service/client-emm-form-android.service";
import {ClientEMMFormIOSService} from "../service/client-emm-form-ios.service";
import {ClientSecurityDesktopFormService} from "../service/client-security-desktop-form-ios.service";
import {ApplicationHttpService} from "../../application/service/application-http.service";
import {environment} from "../../../environments/environment";
@Component({
  selector: 'app-setting-client',
  templateUrl: './setting-client.component.html',
  providers: [
    ClientEMMService,
    ApplicationHttpService,
    ClientSecurityDesktopService
  ]
})
export class SettingClientComponent implements OnInit {
  private_version = environment.private_version;
  modal;
  systemType = 'Android';

  // EMM分发详情
  users = [];
  groups = [];
  depts = [];
  // client
  ScrollbarOptionsEMM = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.clientEMMList.nextPage();
      }
    }
  };
  // 安全桌面
  ScrollbarOptionsSecurityDesktop = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.clientSecurityDesktopList.nextPage();
      }
    }
  };
  constructor(private modalService: ModalService,
              private dataService: DataService,
              public clientEMMList: ClientEMMService,
              public clientSecurityDesktopList: ClientSecurityDesktopService,
              private http: SettingHttpService,
              private httpApp: ApplicationHttpService,
              private nzModalService: NzModalService,
              private messageService: MessageService) {
    clientEMMList.initList({isActiveFist: false});
    clientSecurityDesktopList.initList({isActiveFist: false});
  }
  ngOnInit() {
    this.clientEMMList.itemActiveEvent.subscribe((item: any) => {
      if (item && item.id > -1) {
        this.httpApp.getAccessConfOfApp({platform: 1, appId: item.id}).subscribe((res: any) => {
          if (res.code === '200') {
            this.users = [];
            this.groups = [];
            this.depts = [];
            res.data.forEach((_item: any) => {
              if (_item.applyType === 5) {
                // 用户组
                if (_item.applyName) {
                  this.users.push({id: _item.applyValue, name: _item.applyName});
                }
              } else if (_item.applyType === 3) {
                // 设备组
                if (_item.applyName) {
                  this.groups.push({id: _item.applyValue, name: _item.applyName});
                }
              } else if (_item.applyType === 1) {
                // 部门
                if (_item.applyName) {
                  this.depts.push({id: _item.applyValue, name: _item.applyName});
                }
              }
            });
          }
        });
      }
    });
  }

  systemTypeChange(type) {
    switch (type) {
      case 'Android':
        this.clientEMMList.param.platform = 1;
        break;
      case 'iOS':
        this.clientEMMList.param.platform = 2;
        break;
    }
    this.clientEMMList.initList({isActiveFist: false});
    this.systemType = type;
  }

  // 上传EMM应用
  upLoadEMM() {
    if (this.systemType === 'Android') {
      let service = new ClientEMMFormAndroidService(
        this.dataService, this.nzModalService, this.messageService, this.modalService, this.http
      );
      this.modal = this.nzModalService.open({
        title: '上传新版本',
        content: CustomFormComponent,
        footer: false, // footer默认为true
        width: 650,
        wrapClassName: '',
        componentParams: {
          options: service
        },
        zIndex: ++this.modalService.modalCount
      });
    } else if (this.systemType === 'iOS') {
      if (this.clientEMMList.list.length > 0) {
        this.messageService.warning("请先删除原有iOS版本，才可上传新版本！");
        return ;
      }
      let service = new ClientEMMFormIOSService(this.dataService, this.messageService);
      this.modal = this.nzModalService.open({
        title: '上传新版本',
        content: CustomFormComponent,
        footer: false, // footer默认为true
        width: 650,
        wrapClassName: '',
        componentParams: {
          options: service
        },
        zIndex: ++this.modalService.modalCount
      });
    }
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        if (result.data.isDefault) {
          this.modalService.popupConfirm('设为默认版本', () => {
            this.http.addEMM(result.data).subscribe((res: any) => {
              if (res.code === '200') {
                this.modal.destroy();
                this.clientEMMList.initList({isActiveFist: false});
              }/* else {
               this.messageService.warning("上传失败！");
               }*/
            });
          }, '当前版本会覆盖原有默认版本！');
        } else {
          this.http.addEMM(result.data).subscribe((res: any) => {
            if (res.code === '200') {
              this.modal.destroy();
              this.clientEMMList.initList({isActiveFist: false});
            }/* else {
             this.messageService.warning("上传失败！");
             }*/
          });
        }
      }
    });
  }

  // 编辑EMM应用
  editEMM() {
    let service = new ClientEMMFormAndroidService(this.dataService, this.nzModalService, this.messageService, this.modalService, this.http);
    service.items[0]['value'] = 'aaaaaaaa';
    service.items[0]['hide'] = true;
    if (this.clientEMMList.itemIsActive.isDefault !== 1) {
      service.items[1]['value'] = false;

      service.items[2]['hide'] = false;

      let value1 = [];
      let option1 = [];
      this.clientEMMList.itemIsActive.deviceModels.forEach((item: any) => {
        value1.push(JSON.stringify({label: item.model, value: item.id}));
        option1.push({label: item.model, value: JSON.stringify({label: item.model, value: item.id})});
      });

      service.items[2]['value'] = value1;
      service.items[2]['options'] = option1;

      service.items[3]['hide'] = false;
      service.items[3]['value'] = {
        groups: this.users,
        deviceGroup: this.groups,
        depts: this.depts
      };
    }
    this.modal = this.nzModalService.open({
      title: '编辑',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 650,
      wrapClassName: '',
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        if (result.data.isDefault) {
          this.modalService.popupConfirm('设为默认版本', () => {
            this.http.editEmm({apkId: this.clientEMMList.itemIsActive.id, ...result.data}).subscribe((res: any) => {
              if (res.code === '200') {
                this.clientEMMList.itemIsActive.isDefault = 1;
                this.modal.destroy();
              }/* else {
               this.messageService.warning("上传失败！");
               }*/
            });
          }, '当前版本会覆盖原有默认版本！');
        } else {
          this.http.editEmm({apkId: this.clientEMMList.itemIsActive.id, ...result.data}).subscribe((res: any) => {
            if (res.code === '200') {
              this.clientEMMList.itemIsActive.isDefault = 0;
              this.httpApp.getAccessConfOfApp({platform: 1, appId: this.clientEMMList.itemIsActive.id}).subscribe((_res: any) => {
                if (_res.code === '200') {
                  let data = service.getSourceData();
                  let deviceModel = [];
                  data.deviceModelIds.forEach((item: any) => {
                    deviceModel.push({id: JSON.parse(item).value , model: JSON.parse(item).label});
                  });
                  this.clientEMMList.itemIsActive.deviceModels = deviceModel;

                  this.users = data.publishObject.groups;
                  this.groups = data.publishObject.deviceGroup;
                  this.depts = data.publishObject.depts;
                }
              });
              this.modal.destroy();
            }/* else {
             this.messageService.warning("上传失败！");
             }*/
          });
        }
      }
    });
  }

  // 上传安全桌面
  upLoadSecurityDesktop() {
    let service = new ClientSecurityDesktopFormService(this.dataService, this.messageService);
    this.modal = this.nzModalService.open({
      title: '上传新版本',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 650,
      wrapClassName: '',
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.addSecureStore(result.data).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.clientSecurityDesktopList.initList({isActiveFist: false});
          }/* else {
            this.messageService.warning("上传失败！");
          }*/
        });
      }
    });
  }

  // 删除
  deleteEMM(item) {
    let ids = [];
    let names = [];
    if (item) {
      ids.push(item.id);
      names.push(item.name);
    } else {
      this.clientEMMList.checkedList.forEach( (_item: any) => {
         ids.push(_item.id);
         names.push(_item.name);
      });
    }
    if (ids.length === 0) {
      this.messageService.warning("请选择删除对象");
      return ;
    }
    this.modalService.confirmDelete(() => {
      this.http.deleteEMM({platform: this.clientEMMList.param.platform, appId: ids.join(',')}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('删除成功！');
          this.clientEMMList.initList({isActiveFist: false});
        }/* else {
          this.messageService.error('删除失败！');
        }*/
      });
    }, '确认删除：<span class="text-primary">' + names.join(',') + '</span>');

  }

  defaultForEMM(item) {
    let ids = [];
    if (item) {
      ids.push(item.id);
    } else {
      this.clientEMMList.checkedList.forEach((_item: any) => {
        ids.push(_item.id);
      });
    }
    if (!(ids.length === 1)) {
      this.messageService.warning("请选择一个EMM版本作为默认版本！");
      return ;
    }
    let b = false;
    let a = false;
    this.clientEMMList.list.forEach((_item: any) => {
      if (_item.isDefault === 1) {
        if (_item.id === ids[0]) {
          a = true;
        }
        b = true;
      }
    });
    if (a) {
      this.messageService.warning('您选择的版本已经是默认版本！');
      return ;
    }
    if (b) {
      this.modalService.popupConfirm('设为默认版本', () => {
        this.http.setDefaultEMM({emmId: ids.join(',')}).subscribe((res: any) => {
          if (res.code === '200') {
            this.messageService.info('设置成功！');
            this.clientEMMList.initList({isActiveFist: false});
          }/* else {
            this.messageService.error('设置失败！');
          }*/
        });
      }, '当前版本会覆盖原有默认版本！');
    } else {
      this.http.setDefaultEMM({emmId: ids.join(',')}).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('设置成功！');
          this.clientEMMList.initList({isActiveFist: false});
        }/* else {
          this.messageService.error('设置失败！');
        }*/
      });
    }
  }

  // 删除
  deleteS(item) {
    let ids = [];
    if (item) {
      ids.push(item.id);
    } else {
      this.clientSecurityDesktopList.checkedList.forEach((_item: any) => {
        ids.push(_item.id);
      });
    }
    if (ids.length === 0) {
      this.messageService.warning("请选择删除对象");
      return ;
    }
    this.httpApp.deleteApp({platform: 1, appId: ids.join(',')}).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.info('删除成功！');
        this.clientSecurityDesktopList.initList({isActiveFist: false});
      } else {
        this.messageService.error('删除失败！');
      }
    });
  }
}
