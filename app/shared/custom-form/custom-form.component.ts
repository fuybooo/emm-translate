import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {copyStyles} from "@angular/animations/browser/src/util";
import {CustomForm} from "./custom-form";
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {ModalService} from "../service/modal.service";

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html'
})
export class CustomFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  options: CustomForm;
  @Output() optionsChange = new EventEmitter(true);
  // 所有弹出层
  private modalSelectGroup;

  constructor(private subject: NzModalSubject,
              private nzModalService: NzModalService,
              private modalService: ModalService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (!this.options.formGroup) {
      this.options.formBuilder = this.formBuilder;
      this.options.init();
      this.options.submitBeforeEvent.subscribe(() => {
        this.subject.next({type: 'save', data: this.options.getData()});
      });
      this.options.cancelBeforeEvent.subscribe(() => {
        this.subject.destroy('onCancel');
      });
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.modalSelectGroup) {
      this.modalSelectGroup.destroy();
    }
  }
  setFormControl(event, key) {
    let data = {};
    data[key] = event;
    this.options.setData(data);
  }

  transfer_change(item, ret: any) {
    let value = this.options.getFormControl(item.key).value;
    value.forEach((_item: any) => {
      ret.list.forEach((r: any) => {
         if (r.applyValue === _item.applyValue) {
           _item.direction = ret.to;
         }
      });
      return _item;
    });
    this.options.getFormControl(item.key).setValue(value);
  }

  // 推送 （特例）
  popupSelectGroup(key) {
    class Service extends CustomForm {
      popUp = true;
      labelSm = 5;
      items = [
        {
          type: 'select-group',
          key: 'distribution',
          label: '选择推送对象',
          resultLabel: '推送对象'
        }
      ];
    }
    let service = new Service();
    let value = this.options.getFormControl(key).value;
    if (value) {
      service.setData({distribution: value});
    }
    this.modalSelectGroup = this.nzModalService.open({
      title: '添加推送对象',
      content: CustomFormComponent,
      footer: false, // footer默认为true
      width: 600,
      componentParams: {
        options: service
      },
      zIndex: ++this.modalService.modalCount
    });
    this.modalSelectGroup.subscribe((result: any) => {
      if (result.type === 'save') {
        let data = {};
        data[key] = result.data.distribution;
        this.options.setData(data);
        this.modalSelectGroup.destroy();
      }
    });
  }
}
