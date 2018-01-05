import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../shared/util/util.service";
import {AppStoreListComponent} from "../../shared/component/app-store-list.component";
import {NzModalService} from "ng-zorro-antd";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-address-book-synchronization',
  templateUrl: './policy-item-address-book-synchronization.component.html',
})
export class PolicyItemAddressBookSynchronizationComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  selectedApps: any[] = [null];
  subscript;
  addModal;

  constructor(
    private policyService: PolicyService,
    private nzModalService: NzModalService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {AddressBookSynchronization: this.getFormValue()}
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
  getForm() {
    return this.fb.group({
      CardDAVAccountDescription: [],
      CardDAVHostName: [null, [Validators.required]],
      CardDAVPrincipalURL: [],
      CardDAVUsername: [],
      CardDAVPassword: [],
      CardDAVUseSSL: [true],
      CardDAVPort: [],
    });
  }
  setForm() {
    this.forms = [this.getForm()];
    if (this.config) {
      let configs = this.config.config;
      if (configs.length !== 0) {
        this.forms = [];
      }
      for (let i = 0; i < configs.length; i++) {
        this.forms.push(this.getForm());
        let config = configs[i];
        this.getFormControl(i, 'CardDAVAccountDescription').setValue(config.CardDAVAccountDescription || null);
        this.getFormControl(i, 'CardDAVHostName').setValue(config.CardDAVHostName || null);
        this.getFormControl(i, 'CardDAVPrincipalURL').setValue(config.CardDAVPrincipalURL || null);
        this.getFormControl(i, 'CardDAVUsername').setValue(config.CardDAVUsername || null);
        this.getFormControl(i, 'CardDAVPassword').setValue(config.CardDAVPassword || null);
        this.getFormControl(i, 'CardDAVUseSSL').setValue(config.CardDAVUseSSL || true);
        this.getFormControl(i, 'CardDAVPort').setValue(config.CardDAVPort || null);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc008',
      config: []
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i++) {
      let form = this.forms[i];
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        if (value && value.CardDAVHostName && value.CardDAVPort) {
          value.AudioCall = this.selectedApps[i] ? this.selectedApps[i].bundleId : '';
          values.push(value);
        }
      }
    }
    paramConfig.config = values;
    return paramConfig;
  }
  add() {
    this.forms.push(this.getForm());
  }
  del(i) {
    this.forms.splice(i, 1);
  }
  selectApp(i) {
    this.addModal = this.nzModalService.open({
      title: '选取应用',
      content: AppStoreListComponent,
      footer: false,
      width: 800
    });
    this.addModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.selectedApps[i] = res.data[0];
        this.addModal.destroy();
      }
    });
  }

}
