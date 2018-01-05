import {Component, OnInit} from "@angular/core";
import {ApplicationService, ApplicationFormService, ApplicationClassService} from "./application.service";
import {NzModalService} from "ng-zorro-antd";
import {CustomFormComponent} from "../shared/custom-form/custom-form.component";
import {CustomForm} from "../shared/custom-form/custom-form";
import {ModalService} from "../shared/service/modal.service";
import {ApplicationHttpService} from "./service/application-http.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {DataService} from "../shared/service/data.service";
import {MessageService} from "../shared/service/message.service";
import {ApplicationListTableComponent} from "./component/application-list-table.component";
import {FormControl, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {ValidatorService} from "../shared/service/validator.service";
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  providers: [
    ApplicationService,
    ApplicationFormService,
    ApplicationClassService,
  ]
})
export class ApplicationComponent implements OnInit {
  private_version = environment.private_version;
  // 默认选择[0(android) | 1(iOS)]
  nzSelectedIndexSystem = 0;
  // 操作系统 类型： [1(android) | 2(iOS)]
  platform = 1;
  // 发布类型： [0(正常) | 1(灰度)]
  publicationType = 'normalRelease';
  /* popups */
  modalApplicationClassAdd;
  modalDeleteApp;

  // 应用分类
  nzTableApplicationClassScrollbar = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.applicationClassList.nextPage();
      }
    }
  };
  // 应用
  applicationListScrollbarOptions = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.applicationList.nextPage();
      }
    }
  };

  constructor(public applicationList: ApplicationService,
              public applicationClassList: ApplicationClassService,
              private modalService: ModalService,
              private messageService: MessageService,
              private dataService: DataService,
              private http: ApplicationHttpService,
              private activateRoute: ActivatedRoute,
              private router: Router,
              private nzModalService: NzModalService) {
    this.applicationClassList.itemActiveEvent.subscribe((item: any) => {
      if (item && item.id > 0) {
        this.applicationList.param.classId = item.id;
      } else {
        this.applicationList.param.classId = null;
      }
      this.applicationList.initList({isActiveFist: false});
    });
  }

  ngOnInit() {
    this.activateRoute.paramMap
      .subscribe((params: ParamMap) => {
        let platform = this.activateRoute.snapshot.params['platform'];
        if (platform === 'android') {
          this.applicationList.param.platform = 1;
          this.nzSelectedIndexSystem = 0;
          this.platform = 1;
        } else if (platform === 'iOS') {
          this.applicationList.param.platform = 2;
          this.nzSelectedIndexSystem = 1;
          this.platform = 2;
        }
        this.applicationList.param.publishMode = 1;
        this.applicationList.initList({isActiveFist: false});
        this.applicationClassList.initList({isActiveFist: false});
      });
  }

  doSearch(search) {
    this.applicationList.param.search = search;
    this.applicationList.initList({isActiveFist: false});
    this.applicationClassList.param.search = search;
    this.applicationClassList.initList({isActiveFist: false});
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  positionAdjustment() {
    let publishMode = 1;
    switch (this.publicationType) {
      case "normalRelease":
        publishMode = 1;
        break;
      case "grayRelease":
        publishMode = 2;
        break;
    }
    this.modalApplicationClassAdd = this.nzModalService.open({
      title: '位置调整',
      content: ApplicationListTableComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        platform: this.platform,
        publishMode: publishMode
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalApplicationClassAdd.subscribe((result: any) => {
      if (result.type === 'save') {
        this.modalApplicationClassAdd.destroy();
        // this.http.addAppClass(result.data).subscribe((res: any) => {
        //   if (res.code === '200') {
        //     this.modalApplicationClassAdd.destroy();
        //     if (res.code === '200') {
        //       this.applicationClassList.initList({isActiveFist: false});
        //     }
        //   }
        // });
      }
    });
  }

  applicationSort(type) {
    switch (type) {
      case 'name':
        this.applicationList.param.sortName = 'appName';
        break;
      case 'uploadTime':
        this.applicationList.param.sortName = 'updateTime';
        break;
      case 'downTime':
        this.applicationList.param.sortName = 'downloads';
        break;
    }
    this.applicationList.initList({isActiveFist: false});
  }

  applicationPushStateChange(type) {
    switch (type) {
      case 0:
        this.applicationList.param.isOnline = null;
        break;
      case 1:
        this.applicationList.param.isOnline = 1;
        break;
      case 2:
        this.applicationList.param.isOnline = 0;
        break;
    }
    this.applicationList.initList({isActiveFist: false});
  }

  publicationTypeChange(type) {
    switch (type) {
      case "normalRelease":
        this.applicationList.param.publishMode = 1;
        break;
      case "grayRelease":
        this.applicationList.param.publishMode = 2;
        break;
    }
    this.publicationType = type;
    this.applicationList.initList({isActiveFist: false});
  }

  nzSelectSystem(type) {
    this.router.navigate(['/app/application', type], { replaceUrl: true });
  }

  /**
   * 应用分类添加
   */
  applicationClassAdd() {
    this.modalApplicationClassAdd = this.nzModalService.open({
      title: '添加应用分类',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new CustomForm(null,
          [
            {
              key: 'className',
              label: '应用分类',
              validator: [
                ValidatorService.required,
                Validators.maxLength(30),
              ],
              otherValidator: [
                (control: FormControl): any => {
                  let _this_ = this;
                  return Observable.create((observer) => {
                    _this_.http.isAppClassExist({className: control.value}).subscribe((res: any) => {
                      if (res.data.isExist) {
                        observer.next({error: true, nameAsyncValidator: true});
                      } else {
                        observer.next(null);
                      }
                      observer.complete();
                    });
                  });
                }
              ],
              explains: [
                {
                  validate: function (item) {
                    return item.dirty && item.hasError('required');
                  },
                  desc: '应用分类名称不能为空',
                }, {
                  validate: function (item) {
                    return item.dirty && item.hasError('maxlength');
                  },
                  desc: '应用分类名称不能超过30个字',
                }, {
                  validate: function (item) {
                    return item.dirty && item.hasError('nameAsyncValidator');
                  },
                  desc: '应用分类名称已存在，请重新输入',
                }
              ],
            }
          ],
          {
            labelSm: 4,
            popUp: true
          }
        )
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalApplicationClassAdd.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.addAppClass(result.data).subscribe((res: any) => {
          if (res.code === '200') {
            this.modalApplicationClassAdd.destroy();
            this.applicationClassList.initList({isActiveFist: false});
          }
        });
      }
    });
  }

  /**
   * 应用分类修改
   */
  editApplicationClass(item) {
    this.modalApplicationClassAdd = this.nzModalService.open({
      title: '添加应用分类',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new CustomForm(null,
          [
            {
              key: 'className',
              label: '应用分类',
              validator: [
                ValidatorService.required,
                Validators.maxLength(30),
              ],
              value: item.name,
              otherValidator: [
                (control: FormControl): any => {
                  let _this_ = this;
                  return Observable.create((observer) => {
                    _this_.http.isAppClassExist({className: control.value}).subscribe((res: any) => {
                      if (res.data.isExist) {
                        observer.next({error: true, nameAsyncValidator: true});
                      } else {
                        observer.next(null);
                      }
                      observer.complete();
                    });
                  });
                }
              ],
              explains: [
                {
                  validate: function (_item) {
                    return _item.dirty && _item.hasError('required');
                  },
                  desc: '应用分类名称不能为空',
                }, {
                  validate: function (__item) {
                    return __item.dirty && __item.hasError('maxlength');
                  },
                  desc: '应用分类名称不能超过30个字',
                }, {
                  validate: function (___item) {
                    return ___item.dirty && ___item.hasError('nameAsyncValidator');
                  },
                  desc: '应用分类名称已存在，请重新输入',
                }
              ],
            }
          ],
          {
            labelSm: 4,
            popUp: true
          }
        )
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalApplicationClassAdd.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.editAppClass({classId: item.id, className: result.data.className}).subscribe((res: any) => {
          if (res.code === '200') {
            this.modalApplicationClassAdd.destroy();
            this.applicationClassList.initList({isActiveFist: false});
          }
        });
      }
    });
  }
  /**
   * 应用分类删除
   */
  deleteApplicationClass(item) {
    this.modalService.confirmDelete(() => {
      this.http.deleteAppClass({classId: item.id}).subscribe((res: any) => {
        if (res.code === '200') {
          this.applicationClassList.initList({isActiveFist: false});
        }
      });
    }, '');
  }

  /**
   * 跳转应用详情
   */
  toDetail(item) {
    // 操作系统 类型： [0(android) | 1(iOS)]
    let platform = this.platform === 2 ? 'iOS' : 'android';
    this.router.navigate(['../detail', platform, item.id], {
      relativeTo: this.activateRoute
    });
  }

  /**
   * 上传应用
   */
  uploadApplication() {
    let service = new ApplicationFormService(this.dataService, this.messageService, this.http);
    service.platform = this.applicationList.param.platform;
    if (service.platform === 1) {
      // service.items[0]['uploadDesc'] = '仅支持.ipa';
    } else if (service.platform === 2) {
      service.items[0]['uploadDesc'] = '仅支持.ipa';
    }
    this.modalApplicationClassAdd = this.nzModalService.open({
      title: '上传应用',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 650,
      wrapClassName: 'upload-modal',
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalApplicationClassAdd.subscribe((result: any) => {
      if (result.type === 'save') {
        this.http.addApp(result.data).subscribe((res: any) => {
          /*
           *  应用平台错误返回code:APPLICATION800003
           上传错误格式文件返回code:APPLICATION800005

           版本校验成功,运行添加result:0
           存在新版本,可以添加result:1
           版本已存在,不允许添加result:2
           * */
          if (res.code === '200') {
            this.modalApplicationClassAdd.destroy();
            if (res.code === '200') {
              this.applicationClassList.initList({isActiveFist: false});
              this.applicationList.initList({isActiveFist: false});
            }
          } else if (res.code === 'APPLICATION800003') {

          } else if (res.code === 'APPLICATION800005') {

          } else if (res.result === '200') {

          } else if (res.result === '200') {

          } else if (res.result === '200') {

          }
        });
      }
    });
  }
  editApp(item) {
    let service = new ApplicationFormService(this.dataService, this.messageService, this.http);
    service.items[0]['value'] = 'aaaaaaaa';
    service.items[0]['hide'] = true;
    service.items[4]['value'] = item.sysVersionName;

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
    service.platform = this.applicationList.param.platform;
    this.http.getAppDetail({platform: service.platform, appId: item.id}).subscribe((res: any) => {
      if (res.code === '200') {
        service.items[1]['value'].remoteAddrImgs = res.data.screenShotUrl;
        service.remoteDateImg = (res.data.screenShotUrl && res.data.screenShotUrl.length > 0);
        this.modalApplicationClassAdd = this.nzModalService.open({
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
        this.modalApplicationClassAdd.subscribe((result: any) => {
          if (result === 'onShown') {
            // if (data.length > 0) {
            //   service.setData({publishObject: data, publishMode: '2'})
            // }
          }
          if (result.type === 'save') {
            this.http.editApp({appId: item.id, ...result.data, publishMode: null} as any).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.modalApplicationClassAdd.destroy();
                this.applicationClassList.initList({isActiveFist: false});
                this.applicationList.initList({isActiveFist: false});
              }
            });
          }
        });
      }
    });
  }
  editAppPush(item) {
    this.http.getAccessConfOfApp({platform: this.platform, appId: item.id}).subscribe((res: any) => {
      if (res.code === '200') {
        let data = [];
        res.data.forEach((_item: any) => {
          if (_item.applyType === 5) {
            // 用户组
            if (_item.applyName) {
              data.push({type: 'group', id: _item.applyValue, name: _item.applyName});
            }
          } else if (_item.applyType === 3) {
            // 设备组
            if (_item.applyName) {
              data.push({type: 'deviceGroup', id: _item.applyValue, name: _item.applyName});
            }
          } else if (_item.applyType === 1) {
            // 部门
            if (_item.applyName) {
              data.push({type: 'dept', id: _item.applyValue, name: _item.applyName});
            }
          }
        });
        this.modalApplicationClassAdd = this.nzModalService.open({
          title: '可见范围',
          content: CustomFormComponent,
          footer: false, // footer默认为true
          width: 500,
          wrapClassName: '',
          componentParams: {
            options: new CustomForm(null, [
              {
                type: "application-publishObject",
                key: 'publishObject',
                value: {
                  data: data,
                },
                labels: ['group', 'deviceGroup', 'dept'],
                selectLabel: '请选择用户组/设备组/部门',
                resultLabel: '分发对象'
              }, {
                hide: true,
                key: 'duration',
                value: item.duration || 12,
              }
            ], {popUp: true, labelSm: 0})
          },
          zIndex: ++this.modalService.modalCount
        });
        this.modalApplicationClassAdd.subscribe((result: any) => {
          if (result.type === 'save') {
            let data_ = result.data;
            let _data: any = {
              duration: data_.duration,
              appId: item.id,
              platform: this.platform, // [1|2]//平台
              // userIds: _data.publishObject.userIds ? _data.publishObject.userIds.join(',') : '',
              deviceGroupIds: data_.publishObject.deviceGroupIds.join(','),
              userGroupIds: data_.publishObject.groupIds.join(','),
              deptIds: data_.publishObject.deptIds.join(','),
            };
            this.http.setAccessConfOfApp(_data).subscribe((_res: any) => {
              if (_res.code === '200') {
                this.modalApplicationClassAdd.destroy();
                this.applicationClassList.initList({isActiveFist: false});
                this.applicationList.initList({isActiveFist: false});
              }
            });
          }
        });
      }
    });
  }
  deleteApp(item) {
    this.modalDeleteApp = this.modalService.confirmDelete(() => {
      this.http.deleteApp({
        platform: this.applicationList.param.platform,
        appId: item.id
      }).subscribe((res: any) => {
        if (res.code === '200') {
          this.applicationList.delete(item);
          this.applicationClassList.initList({isActiveFist: false});
          this.applicationList.initList({isActiveFist: false});
          this.messageService.info("已删除" + item.name);
        } else if (res.code === 'APPLICATION800004') {
          this.messageService.error('无法删除上架应用！');
        } else {
          this.messageService.error('删除失败！');
        }
      });
    }, '确定要删除，<span class="text-primary">' + item.name + '</span>这个应用吗？');
  }
  appOnline(type, item) {
    switch (type) {
      case 'down':
        this.modalDeleteApp = this.modalService.popupConfirm('您确定要下架吗？', () => {
          this.http.setAppOnline({
            isOnline: false,
            platform: this.applicationList.param.platform,
            appId: item.id
          }).subscribe((res: any) => {
            if (res.code === '200') {
              item.appUpOrDown = 0;
              this.messageService.info("已下架" + item.name);
            }
          });
        }, '确定要下架，<span class="text-primary">' + item.name + '</span>这个应用吗？');
        break;
      case 'up':
        this.modalDeleteApp = this.modalService.popupConfirm('您确定要上架吗？', () => {
          this.http.setAppOnline({
            isOnline: true,
            platform: this.applicationList.param.platform,
            appId: item.id
          }).subscribe((res: any) => {
            if (res.code === '200') {
              item.appUpOrDown = 1;
              this.messageService.info("已上架" + item.name);
            }
          });
        }, '确定要上架，<span class="text-primary">' + item.name + '</span>这个应用吗？');
        break;
    }
  }
}
