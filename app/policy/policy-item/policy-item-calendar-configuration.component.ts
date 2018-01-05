import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from '../policy.model';
import {PolicyService} from '../policy.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-policy-item-calendar-configuration',
  templateUrl: './policy-item-calendar-configuration.component.html',
})
export class PolicyItemCalendarConfigurationComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  forms: FormGroup[];
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.setForm();
    if (this.type !== 'view') {
      this.subscript = this.policyService.policyConfigEvent.subscribe((event) => {
        if (event.type === 1) {
          this.policyService.policyConfigEvent.emit({
            type: 2,
            data: {CalendarConfiguration: this.getFormValue()}
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
      CalDAVAccountDescription: [],
      CalDAVHostName: ['', [Validators.required, Validators.maxLength(255)]],
      CalDAVPort: ['443', [Validators.required]],
      CalDAVUsername: [],
      CalDAVPassword: [],
      CalDAVUseSSL: [true],
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
        this.getFormControl(i, 'CalDAVAccountDescription').setValue(config.CalDAVAccountDescription || null);
        this.getFormControl(i, 'CalDAVHostName').setValue(config.CalDAVHostName || null);
        this.getFormControl(i, 'CalDAVPort').setValue(config.CalDAVPort || null);
        this.getFormControl(i, 'CalDAVUsername').setValue(config.CalDAVUsername || null);
        this.getFormControl(i, 'CalDAVPassword').setValue(config.CalDAVPassword || null);
        this.getFormControl(i, 'CalDAVUseSSL').setValue(config.CalDAVUseSSL || true);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc006',
      config: {}
    };
    let values = [];
    for (let form of this.forms) {
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        // 必填项不能为空
        if (value && value.CalDAVHostName && value.CalDAVPort) {
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
}
