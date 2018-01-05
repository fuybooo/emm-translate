import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ContentTagFormService} from "../../service/content-tag-form.service";
import {MessageService} from "../../../shared/service/message.service";
import {NzModalSubject} from "ng-zorro-antd";
import {ContentTagService} from "../../service/content-tag.service";
import {ContentFilesHttpService} from "../../service/content-http.service";
import {ContentFileService} from "../../content.service";

@Component({
  selector: 'app-content-tags-all',
  templateUrl: './content-tags-all.component.html',
  providers: [
    ContentTagFormService,
    ContentTagService
  ]
})
export class ContentTagsAllComponent implements OnInit {
  @Input()
  files: ContentFileService = null;
  @Input()
  tags_: ContentTagService = null;
  form: FormGroup;
  constructor(public tagForm: ContentTagFormService,
              private fb: FormBuilder,
              public tags: ContentTagService,
              private http: ContentFilesHttpService,
              private messageService: MessageService,
              private subject: NzModalSubject) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.tags.initList({isActiveFist: false});
    this.tagForm.items[0].enter.subscribe(() => {
      if (this.tagForm.formGroup && this.tagForm.formGroup.valid) {
        this.http.addTag({tagNames: this.tagForm.getData().name}).subscribe(() => {
          this.tagForm.setData({name: ''});
          this.tags.initList({isActiveFist: false});
        });
      }
    });
  }
  delete(even, id) {
    this.http.deleteTag({tagId: id}).subscribe(() => {
      this.tags.initList({isActiveFist: false});
      if (this.files) {
        this.files.initList({isActiveFist: false});
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
