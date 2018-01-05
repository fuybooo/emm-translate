import {Component, OnDestroy, OnInit} from "@angular/core";
import {MessageService} from "../../shared/service/message.service";
import {NzModalService} from "ng-zorro-antd";
import {ModalService} from "../../shared/service/modal.service";
import {SettingHttpService} from "../service/setting-http.service";
import {TrusteeshipService} from "../service/trusteeship.service";
import {CustomFormComponent} from "../../shared/custom-form/custom-form.component";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ValidatorService} from "../../shared/service/validator.service";
@Component({
  selector: 'app-setting-trusteeship',
  templateUrl: './setting-trusteeship.component.html',
  providers: [
    TrusteeshipService
  ]
})
export class SettingTrusteeshipComponent implements OnInit, OnDestroy {
  form: FormGroup;
  edit = false;

  dirList = [];
  dirLoading = true;

  modal;

  connectorState = 'all';
  connectNumber = {
    all: 0,
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
  };
  options = {
    scrollInertia: 100,
    callbacks: {
      onTotalScrollOffset: 100,
      onTotalScroll: () => {
        this.trusteeship.nextPage();
      }
    }
  };

  constructor(private modalService: ModalService,
              public trusteeship: TrusteeshipService,
              private http: SettingHttpService,
              private fb: FormBuilder,
              private nzModalService: NzModalService,
              private messageService: MessageService) {
    // Connect detail
    this.form = this.fb.group({
      description: ['', [Validators.maxLength(150), ValidatorService.required]],
    });
    this.trusteeship.itemActiveEvent.subscribe(item => {
      if (item && item.id > 0) {
        this.edit = false;
        this.getFormControl('description').reset(item.description);
        // 获取托管认证的连接目录
        this.dirLoading = true;
        this.http.getDetails({id: item.id}).subscribe((res: any) => {
          if (res.code === '200') {
            this.dirLoading = false;
            this.dirList = res.data.data.plugin;
          }
        });
      }
    });
    // 更新统计数
    this.trusteeship.paramChangeEvent.subscribe(data => {
      if (!data.search) {
        switch (data.status) {
          case null:
            this.connectNumber.all = data.total;
            break;
          case '0':
            this.connectNumber['0'] = data.total;
            break;
          case '1':
            this.connectNumber['1'] = data.total;
            break;
          case '2':
            this.connectNumber['2'] = data.total;
            break;
          case '3':
            this.connectNumber['3'] = data.total;
            break;
        }
      }
    });
  }

  ngOnInit() {
    this.trusteeship.initList({isActiveFist: false});
    // 查询统计数量
    this.http.getConnectorList({
      pageSize: 0,
      page: 1,
      search: '',
      status: null
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectNumber.all = res.data ? res.data.total : 0;
      }
    });
    this.http.getConnectorList({
      pageSize: 0,
      page: 1,
      search: '',
      status: '0'
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectNumber['0'] = res.data ? res.data.total : 0;
      }
    });
    this.http.getConnectorList({
      pageSize: 0,
      page: 1,
      search: '',
      status: '1'
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectNumber['1'] = res.data ? res.data.total : 0;
      }
    });
    this.http.getConnectorList({
      pageSize: 0,
      page: 1,
      search: '',
      status: '2'
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectNumber['2'] = res.data ? res.data.total : 0;
      }
    });
    this.http.getConnectorList({
      pageSize: 0,
      page: 1,
      search: '',
      status: '3'
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectNumber['3'] = res.data ? res.data.total : 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.modal) {
      this.modal.destroy();
    }
  }

  /**
   * 搜索
   * @param search
   */
  doSearch(search) {
    this.trusteeship.param.search = search;
    this.trusteeship.initList({isActiveFist: false});
  }

  searchChange(search) {
    if (!search) {
      this.doSearch('');
    }
  }

  ConnectorStateChange(type) {
    switch (type) {
      case 'all':
        this.trusteeship.param.status = null;
        break;
      default:
        this.trusteeship.param.status = type;
    }
    this.connectorState = type;
    this.trusteeship.initList({isActiveFist: false});
  }

  // 添加connect
  newTrusteeship () {
    this.modal = this.nzModalService.open({
      title: '添加Connector',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: new CustomForm(null,
          [
            {
              key: 'name',
              required: true,
              label: 'Connector名称',
              placeHolder: '请输入Connector名称',
              value: '',
              validator: [
                ValidatorService.required,
                Validators.maxLength(30),
              ],
              otherValidator: [
                // this.userGroupService.nameAsyncValidator,
              ],
              explains: [
                {
                  validate: function (item) {
                    return item.dirty && item.hasError('required');
                  },
                  desc: 'Connector名称不能为空',
                }, {
                  validate: function (item) {
                    return item.dirty && item.hasError('maxlength');
                  },
                  desc: 'Connector名称不能超过30个字',
                }, {
                  validate: function (item) {
                    return item.dirty && item.hasError('nameAsyncValidator');
                  },
                  desc: 'Connector名称已存在，请重新输入',
                }
              ],
            }, {
              type: 'text',
              required: true,
              key: 'description',
              label: 'Connector描述',
              placeHolder: '请输入Connector描述',
              value: '',
              validator: [
                ValidatorService.required,
                Validators.maxLength(150),
              ],
              explains: [
                {
                  validate: function (item) {
                    return item.dirty && item.hasError('maxlength');
                  },
                  desc: 'Connector描述不能超过150个字',
                }, {
                  validate: function (item) {
                    return item.dirty && item.hasError('required');
                  },
                  desc: 'Connector描述不能为空',
                },
              ],
            }
          ], {
            labelSm: 6,
            popUp: true
          }
        )
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modal.subscribe((result) => {
      if (result.type === 'save') {
        this.http.addConnector(result.data).subscribe((res: any) => {
          if (res.code === '200') {
            this.modal.destroy();
            this.trusteeship.initList({isActiveFist: false});
          } else if (res.code === 'SETADMIN500023') {
            this.messageService.error("Connector名称已存在");
          } else {
            this.messageService.error("添加失败");
          }
        });
      }
    });
  }

  // 删除Connect
  deleteConnector() {
    let ids = [];
    let names = [];
    this.trusteeship.checkedList.forEach((item: any) => {
       ids.push(item.id);
       names.push(item.name);
    });
    if (ids.length === 0) {
      this.messageService.warning("请选择要删除的Connector");
      return ;
    }
    this.modalService.popupConfirm('激活用户', () => {
      this.http.delConnector({
        id: ids.join(',')
      }).subscribe((res: any) => {
        if (res.code === '200') {
          this.messageService.info('删除成功！');
          this.trusteeship.initList({isActiveFist: false});
        } else if (res.code === "SETADMIN500003") {
          this.messageService.warning('删除失败！');
        } else {
          this.messageService.warning('删除失败！');
        }
      });
    }, '确定要删除<span class="text-primary">' + names.join(',') + '</span>吗?');
  }

  getFormControl(name) {
    return this.form.controls[name];
  }

  submit() {
    this.http.updateConnector({
      id: this.trusteeship.itemIsActive.id,
      description: this.getFormControl('description').value
    }).subscribe((res: any) => {
      if (res.code === '200') {
        this.trusteeship.itemIsActive.description = this.getFormControl('description').value;
        this.edit = false;
      } else if (res.code === 'SETADMIN500003') {
        this.messageService.warning('connector信息修改失败');
      }
    });
  }

  cancel() {
    this.edit = false;
    this.getFormControl('description').reset(this.trusteeship.itemIsActive.description);
  }
}
