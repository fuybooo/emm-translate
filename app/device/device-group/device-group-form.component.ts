import {Component, OnInit, Input, OnDestroy} from "@angular/core";
import {NzModalSubject} from "ng-zorro-antd";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DeviceService} from "../device.service";
import {Observable} from "rxjs/Observable";
import {DataService} from "../../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {ValidatorService} from "../../shared/service/validator.service";
import {MessageService} from "../../shared/service/message.service";

@Component({
  selector: 'app-device-group-form',
  templateUrl: './device-group-form.component.html'
})
export class DeviceGroupFormComponent implements OnInit, OnDestroy {
  @Input() type = 'view';
  @Input() id;
  @Input() group = {id: '', name: '', desc: ''};
  @Input() parentGroup: any = {};
  deviceGroupForm: FormGroup;
  deviceGroupId;
  deviceGroup;
  subscript;

  constructor(private subject: NzModalSubject,
              private fb: FormBuilder,
              private deviceService: DeviceService,
              private dataService: DataService,
              private http: HttpClient,
              private validatorService: ValidatorService,
              private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.deviceGroupForm = this.fb.group({
      id: [''],
      parentId: [this.parentGroup ? this.parentGroup.id : ''],
      parentGroupName: [''],
      groupName: ['', [
        Validators.required,
        Validators.maxLength(30),
        this.validatorService.getSpecialCharacterValidator(/,/) // 设备组名称不能包含英文逗号（,）
      ],
        [this.validatorService.getSyncValidator(this.dataService.url.device.validDeviceGroupName,
          {parentId: (this.parentGroup ? this.parentGroup.id : '')})]
      ],
      groupDesc: ['', [Validators.maxLength(200)]]
    });
    /* 点击列表中的设备时会触发 */
    this.subscript = this.deviceService.selectedDeviceGroup.subscribe(selectedGroup => {
      // 在移动设备时，点击设备组也会发送此事件，此处不订阅这种情况的事件
      if (!selectedGroup.isMove) {
        if (typeof selectedGroup === 'object') {
          this.type = 'view';
          this.deviceGroupId = selectedGroup.id;
          this.getDeviceGroup(this.deviceGroupId);
        } else {
          this.deviceGroupId = -1;
        }
      }
    });
    /* 点击添加设备分组时触发 */
    if (this.type === 'add') {
      // 查找父级节点的信息
      if (this.parentGroup && this.parentGroup.id) {
        this.getDeviceGroup(this.parentGroup.id);
      }
    }
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }
  getDeviceGroup(groupId) {
    this.http.get(this.dataService.url.device.getDeviceGroupById, this.dataService.getWholeParams({id: groupId}))
      .subscribe((res: any) => {
        this.showForm(res.data);
      });
  }
  showForm(data) {
    if (this.type === 'add') {
      this.parentGroup.fullName = data.fullName.replace(/,/g, ' > ');
    } else {
      this.deviceGroup = data;
      this.deviceGroup._fullName = this.deviceGroup.fullName.slice(0, this.deviceGroup.fullName.lastIndexOf(',')).replace(/,/g, ' > ');
      this.getFormControl('id').setValue(data.id);
      // this.getFormControl('parentId').setValue(data.parentId);
      // this.getFormControl('parentGroupName').setValue(data.parentGroupName || '');
      this.getFormControl('groupName').setValue(data.name);
      this.getFormControl('groupDesc').setValue(data.desc || '');
      // 更新验证函数
      this.getFormControl('groupName').setAsyncValidators(
        this.validatorService.getSyncValidator(this.dataService.url.device.validDeviceGroupName,
          {parentId: (this.parentGroup ? this.parentGroup.id : ''), id: data.id}));
    }
  }

  submit() {
    if (this.type === 'add') {
      this.subject.next({
        type: 'save',
        value: this.deviceGroupForm.value
      });
    } else {
      this.type = 'view';
      this.http.post(this.dataService.url.device.editDeviceGroup, this.deviceGroupForm.value).subscribe((res: any) => {
        if (res.code === '200') {
          this.getDeviceGroup(this.deviceGroupId);
          this.deviceService.searchDeviceGroupListEvent.emit();
          this.messageService.success('设备组修改成功！');
        } else {
          this.messageService.error('设备组修改失败！');
        }
      });
    }
  }

  handleCancel() {
    if (this.type === 'edit') {
      this.getDeviceGroup(this.deviceGroupId);
      this.type = 'view';
    } else {
      this.subject.destroy('onCancel');
    }
  }

  getFormControl(name) {
    return this.deviceGroupForm.controls[name];
  }

}
