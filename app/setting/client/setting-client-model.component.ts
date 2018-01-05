import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalSubject} from "ng-zorro-antd";
import {SettingClientModelFormService} from "../service/setting-client-model-form.service";
import {MessageService} from "../../shared/service/message.service";
import {SettingClientModelService} from "../service/setting-client-models.service";
import {SettingHttpService} from "../service/setting-http.service";

@Component({
  selector: 'app-content-tags-all',
  templateUrl: './setting-client-model.component.html',
  providers: [
    SettingClientModelFormService,
    SettingClientModelService,
  ]
})
export class SettingClientModelComponent implements OnInit {
  form: FormGroup;
  constructor(public modelForm: SettingClientModelFormService,
              public models: SettingClientModelService,
              private http: SettingHttpService,
              private fb: FormBuilder,
              private messageService: MessageService,
              private subject: NzModalSubject) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.models.initList({isActiveFist: false});
    this.modelForm.items[0].enter.subscribe(() => {
      if (this.modelForm.formGroup && this.modelForm.formGroup.valid) {
        this.http.addDeviceModel({model: this.modelForm.getData().name}).subscribe(() => {
          this.modelForm.setData({name: ''});
          this.models.initList({isActiveFist: false});
        });
      }
    });
  }
  delete(even, item) {
    this.http.deleteDeviceModel({id: item.id}).subscribe((res: any) => {
      if (res.code === '200') {
        this.messageService.info("删除成功！");
        this.models.delete(item);
      }
    });
  }

  submit() {
    this.subject.destroy('onCancel');
  }

  handleCancel(e) {
    this.subject.destroy('onCancel');
  }
}
