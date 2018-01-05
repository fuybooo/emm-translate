import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalSubject} from "ng-zorro-antd";
import {DeviceService} from "../device.service";
import {DataService} from "../../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {ValidatorService} from "../../shared/service/validator.service";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
})
export class DeviceFormComponent implements OnInit {
  @Input() type;
  @Input() device: any = {};
  deviceForm: FormGroup = new FormGroup({});
  uidTypeOptions = [
    {
      label: 'IMEI',
      value: 'IMEI'
    },
    {
      label: 'SN',
      value: 'SN'
    },
    {
      label: 'MEID',
      value: 'MEID'
    },
  ];
  deviceGroup;
  searchOwnerOptions = [];
  searchGroupOptions = [];
  currentUidType = 'IMEI';
  isDisabled;

  constructor(private subject: NzModalSubject,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private deviceService: DeviceService,
              private dataService: DataService,
              private http: HttpClient,
              private util: UtilService,
              private validatorService: ValidatorService,
  ) {
  }

  ngOnInit() {
    // todo 根据是否是编辑状态和是否是未激活状态判断IMEI和设备型号和系统是否可以编辑 2017-11-01
    // 根据type的值设置默认值
    // this.searchOwnerOptions = [['abc'], ['123']];
    // 注意：输入属性的取值只能在ngOnInit中，如果在constructor中，则只能取到undefined

    this.deviceForm = this.fb.group({
      uidType: ['IMEI'],
      uid: ['', [Validators.required, Validators.maxLength(32),
        this.validatorService.getSpecialCharacterValidator(/^[a-zA-Z\d\-_@#]+$/, false)],
        [this.validatorService.getSyncValidator(this.dataService.url.device.validDeviceFlag,
          {uidType: this.currentUidType, id: this.device ? this.device.id : ''})]],
      model: ['', [Validators.maxLength(30)]],
      system: ['Android'],
      assetId: ['', [Validators.maxLength(30), Validators.pattern(/^(\W*)[a-zA-Z\d\-_]+(\W*)$/),
        // this.validatorService.getSpecialCharacterValidator(/^(\W*)[a-zA-Z\d\-_]+(\W*)$/, false) // 只能包含这些字符
        ],
        [this.validatorService.getSyncValidator(this.dataService.url.device.validAssetId, {id: this.device ? this.device.id : ''})]],
      owner: [[]],
      deviceGroup: [''],
    });
    if (this.type === 'edit') {
      this.http.get(this.dataService.url.device.getDeviceById, {params: this.dataService.getParams({id: this.device.id})})
        .subscribe((res: any) => {
          // todo 根据设备状态判断是否需要启动禁用
          this.isDisabled = res.data.status !== '未激活';
          this.getFormControl('uidType').setValue(res.data.uidType);
          this.getFormControl('uid').setValue(res.data.uid);
          this.getFormControl('model').setValue(res.data.model || '');
          this.getFormControl('system').setValue(res.data.system);
          this.getFormControl('assetId').setValue(res.data.assetId || '');
          this.getFormControl('owner').setValue(res.data.owner ? this.getUserNamesByOwners(res.data.owner) : '');
          this.deviceForm.addControl('id', new FormControl(this.device.id));
          // 更新验证函数
          this.getFormControl('uid').setAsyncValidators(
            this.validatorService.getSyncValidator(this.dataService.url.device.validDeviceFlag,
            {uidType: res.data.uidType, id: this.device.id}));
          // 通过owner得到默认的持有人选项
          if (res.data.owner) {
            this.http.get(this.dataService.url.user.getUsersByUserNames, {
              params: this.dataService.getParams({userNames: this.getUserNamesByOwners(res.data.owner)})
            })
              .subscribe((data: any) => {
                this.searchOwnerOptions = data.data.result;
              });
          }
          // 通过deviceGroup获取单个设备组信息
          if (res.data.groupId) {
            this.http.get(this.dataService.url.device.getDeviceGroupById, {params: this.dataService.getParams({id: res.data.groupId})})
              .subscribe((data: any) => {
                this.searchGroupOptions = [data.data];
                this.getFormControl('deviceGroup').setValue(data.data.id);
              });
          }
        });
    }
  }
  getUserNamesByOwners(owners) {
    let userNames = [];
    let _owners = owners.split(',');
    for (let owner of _owners) {
      userNames.push(owner.slice(owner.indexOf('(') + 1, owner.length - 1));
    }
    return userNames;
  }

  submit() {
    this.subject.next({type: 'save', value: this.deviceForm.value});
  }

  handleCancel() {
    this.subject.destroy('onCancel');
  }

  getFormControl(name) {
    return this.deviceForm.controls[name];
  }

  changeValidators() {
    this.currentUidType = this.getFormControl('uidType').value;
    this.getFormControl('uid').setValue('');
    let param: any = {uidType: this.currentUidType};
    if (this.type === 'edit') {
      param.id = this.device.id;
    }
    // 更新验证函数
    this.getFormControl('uid').setAsyncValidators(this.validatorService.getSyncValidator(this.dataService.url.device.validDeviceFlag,
      param));
  }
  changeUidType($event) {
    // 关闭时执行
    if (!$event) {
      this.changeValidators();
      let system = this.getFormControl('system').value;
      let uidType = this.getFormControl('uidType').value;
      if (system === 'iOS' && uidType !== 'IMEI') {
        this.getFormControl('system').setValue('Android');
      }
    }
  }
  syncSystemWithUid() {
    let system = this.getFormControl('system').value;
    let uidType = this.getFormControl('uidType').value;
    if (system === 'iOS') {
      this.uidTypeOptions = [{
        label: 'IMEI',
        value: 'IMEI'
      }];
      this.getFormControl('uidType').setValue('IMEI');
      this.changeValidators();
    }
    if (system === 'Android') {
      this.uidTypeOptions = [
        {
          label: 'IMEI',
          value: 'IMEI'
        },
        {
          label: 'SN',
          value: 'SN'
        },
        {
          label: 'MEID',
          value: 'MEID'
        },
      ];
    }
  }
  changeSystem($event) {
    if (!$event) {
      this.syncSystemWithUid();
    }
  }

  searchOwnerChange(searchText) {
    this.http.get(this.dataService.url.user.getUserBySearch, {params: this.dataService.getParams({name: searchText})})
      .subscribe((data: any) => {
        this.searchOwnerOptions = data.data.result;
      });
  }
  searchGroupChange(searchText) {
    this.http.get(this.dataService.url.device.findGroupByName, {params: this.dataService.getParams({name: searchText})})
      .subscribe((data: any) => {
      // todo 显示设备分组时是否需要显示设备分组的full name
      this.searchGroupOptions = data.data.result;
    });
  }

}
