import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ContentDistributeService} from "../../service/content-distribute.service";
import {FileUploader} from "ng2-file-upload";
import {ContentFilesHttpService} from "../../service/content-http.service";
import {DataService} from "../../../shared/service/data.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NzModalSubject} from "ng-zorro-antd";

@Component({
  selector: 'app-content-upload-files',
  templateUrl: './content-upload-files.component.html',
})
export class ContentUploadFilesComponent implements OnInit {
  form: FormGroup;
  /**
   * 上传文件
   */
  uploader: FileUploader;
  // 文档名，逗号分割?
  private contentNames = [];
  // 上传文件后返回的文档名，逗号分割?
  private localNames = [];
  tags = [];

  /**
   * 分发对象
   */
  distributionObject = {
    userIds: [],
    groupIds: [],
    deptIds: []
  };

  constructor(public distributes: ContentDistributeService,
              private dataService: DataService,
              private subject: NzModalSubject,
              private fb: FormBuilder,
              private http: ContentFilesHttpService) {
    this.form = this.fb.group({
      isEncryption: [false],
      tags: [[]],
      isDownload: [false],
    });
  }
  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.dataService.url.content.uploadContent,
      method: "POST",
      autoUpload: true,
      itemAlias: "file"
    });
    this.uploader.onAfterAddingFile = (fileItem) => {
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.contentNames.push(JSON.parse(response).data.result[0].filename);
      this.localNames.push(JSON.parse(response).data.result[0].localfile);
    };
  }

  tagsSearchChange(search?) {
    this.http.getTagList({search: search, page: 1, pageSize: 10})
      .subscribe((res: any) => {
        let options = [];
        for (let g of res.data.result) {
          options.push({label: g.tagName, value: g.id});
        }
        this.tags = options;
      });
  }

  submit() {
    this.subject.next({type: 'save', data: {
      contentNames: this.contentNames.join(','),
      localNames: this.localNames.join(','),
      userIds: this.distributionObject.userIds,
      userGroupIds: this.distributionObject.groupIds,
      depIds: this.distributionObject.deptIds,
      tagIds: this.form.controls['tags'].value.join(','),
      isEncrypt: this.form.controls['isEncryption'].value,
      isPermission:  this.form.controls['isDownload'].value,
    }});
  }

  handleCancel () {
    this.subject.destroy('OnDestroy');
  }
}
