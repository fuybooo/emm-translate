import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {NzModalService} from "ng-zorro-antd";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-air-print',
  templateUrl: './policy-item-air-print.component.html',
})
export class PolicyItemAirPrintComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  form: FormGroup;
  data: any[] = [];
  addModal;
  subscript;

  constructor(private policyService: PolicyService,
              private util: UtilService,
              private fb: FormBuilder,
              private translateService: TranslateService,
              private nzModalService: NzModalService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      IPAddress: [''],
      ResourcePath: ['']
    });
    this.setData();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {AirPrint: this.getConfig()}
          });
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  setData() {
    if (this.config) {
      this.data = this.util.getReplenishArray(this.config.config.AirPrint);
    } else {
      this.data = this.util.getReplenishArray([]);
    }
  }

  getConfig() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc004',
      config: {}
    };
    let _data = this.util.getUnReplenishArray(this.data);
    if (_data.length > 0) {
      paramConfig.config.AirPrint = this.util.getUnReplenishArray(this.data);
    }
    return paramConfig;
  }

  add(titleTpl, contentTpl, footerTpl) {
    this.addModal = this.nzModalService.open({
      title: titleTpl,
      content: contentTpl,
      footer: footerTpl,
    });
  }

  del() {
    let isDeleted = false;
    for (let i = 0; i < this.data.length; i++) {
      let data = this.data[i];
      if (data.isActive) {
        isDeleted = true;
        this.data.splice(i, 1);
        i--;
      }
    }
    if (!isDeleted) {
      // 提示没有选中任何条目
    }
    this.data = this.util.getReplenishArray(this.data);
  }

  handleOk() {
    // this.data.push({
    //   IPAddress: this.getFormControl('IPAddress').value,
    //   ResourcePath: this.getFormControl('ResourcePath').value,
    // });
    this.util.replenishPush(this.data, {
      IPAddress: this.getFormControl('IPAddress').value,
      ResourcePath: this.getFormControl('ResourcePath').value,
    }, 'IPAddress');
    this.data = this.util.getReplenishArray(this.data);
    this.form.reset();
    this.addModal.destroy();
  }
  changeActive(item) {
    if (this.type !== 'view') {
      if (item.IPAddress !== undefined) {
        item.isActive = !item.isActive;
      }
    }
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
}
