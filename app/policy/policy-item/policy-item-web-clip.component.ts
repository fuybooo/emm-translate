import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {commonSelect} from "../policy.model";
import {PolicyService} from "../policy.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {DataService} from "../../shared/service/data.service";
import {UtilService} from "../../shared/util/util.service";
import {TranslateService} from "@ngx-translate/core";

declare let $: any;
@Component({
  selector: 'app-policy-item-web-clip',
  templateUrl: './policy-item-web-clip.component.html',
})
export class PolicyItemWebClipComponent implements OnInit, OnDestroy {
  @Input() system = 'iOS';
  @Input() type = 'view';
  @Input() config;
  imgs = [];
  forms: FormGroup[];
  uploaders: FileUploader[];
  subscript;

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private dataService: DataService,
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
            data: {WebClip: this.getFormValue()}
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
      Label: [null, [Validators.required]],
      URL: [null, [Validators.required]],
      IsRemovable: [true],
      Precomposed: [],
      FullScreen: [],
    });
  }
  getUploader() {
    let uploader = new FileUploader({
      url: this.dataService.url.content.uploadContent,
      method: "POST",
      autoUpload: true,
      // allowedFileType: ['BMP', 'bmp', 'JPEG', 'jpeg', 'GIF', 'gif', 'JPG', 'jpg', 'PNG', 'png'], // 图片
      itemAlias: "file"
    });
    // uploader.onSuccessItem = (item, response) => {
    //   let result = JSON.parse(response).data.result;
    //   let filename = result[0].filename;
    //   // this.util.replenishPush(this.data, {
    //   //   Font: '',
    //   //   Name: filename,
    //   //   Info: {
    //   //     name: filename,
    //   //     path: result[0].localfile
    //   //   }
    //   // });
    // };
    return uploader;
  }
  changeFile(i, file) {
    let reader = new FileReader();
    let img = file.files[0];
    reader.onload = (e: any) => {
      this.imgs[i] = e.target.result;
      // let preview = $('#policy-web-clip-preview-' + i)[0];
      // preview.src = e.target.result;
    };
    reader.readAsDataURL(img);
  }
  setForm() {
    this.forms = [this.getForm()];
    this.uploaders = [this.getUploader()];
    if (this.config) {
      let configs = this.config.config;
      if (configs.length !== 0) {
        this.forms = [];
      }
      for (let i = 0; i < configs.length; i++) {
        this.forms.push(this.getForm());
        this.uploaders.push(this.getUploader());
        let config = configs[i];
        this.getFormControl(i, 'Label').setValue(config.Label || null);
        this.getFormControl(i, 'URL').setValue(config.URL || null);
        this.getFormControl(i, 'IsRemovable').setValue(config.IsRemovable || null);
        this.getFormControl(i, 'Precomposed').setValue(config.Precomposed || null);
        this.getFormControl(i, 'FullScreen').setValue(config.FullScreen || null);
      }
    }
  }
  getFormControl(i, name) {
    return this.forms[i].controls[name];
  }
  onClickSelectFile(i) {
    $('#web-clip-file-' + i).click();
  }
  getFormValue() {
    let paramConfig: any = {
      id: this.config ? this.config.id : '',
      feature: 'iosdc010',
      config: []
    };
    let values = [];
    for (let i = 0; i < this.forms.length; i ++) {
      let form = this.forms[i];
      let uploader = this.uploaders[i];
      if (form.valid) {
        let value: any = this.util.getAvailableObj(form.value);
        if (uploader.queue.length > 0) {
          let info = JSON.parse(uploader.queue[0]._xhr.response).data.result[0];
          value.Info = {
            name: info.filename,
            path: info.localfile
          };
        }
        values.push(value);
      }
    }
    paramConfig.config = values;
    return paramConfig;
  }
  add() {
    this.forms.push(this.getForm());
    this.uploaders.push(this.getUploader());
  }
  del(i) {
    this.forms.splice(i, 1);
    this.uploaders.splice(i, 1);
  }
}
