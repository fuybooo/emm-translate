import {Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {DataService} from "../../shared/service/data.service";
import {FileUploader} from "ng2-file-upload";
import {ContentFilesHttpService} from "./content-http.service";
import {FormControl} from "@angular/forms";
import {MessageService} from "../../shared/service/message.service";
@Injectable()
export class ContentFileFormService extends CustomForm {
  labelSm = 4;
  items = [
    {
      type: 'file',
      key: 'upLoadFiles',
      required: true,
      label: '选择文件',
      validator: [
        (control: FormControl): { [s: string]: boolean } => {
          return control.value ? null : {required: true};
        }
      ],
      uploader: new FileUploader({
        url: this.dataService.url.content.uploadContent,
        method: "POST",
        autoUpload: true,
        itemAlias: "file"
      })
    }, {
      type: 'checkbox',
      key: 'isEncrypt',
      label: '是否加密',
      placeHolder: '加密'
    }, {
      type: 'select',
      label: '选择标签',
      placeHolder: '在此输入标签，最多不能超过10个字，按Enter进行添加',
      key: 'tagIds',
      value: [],
      options: [],
      nzSearchChange: (search?) => {
        this.http.getTagList({search: search, page: 1, pageSize: 10})
          .subscribe((res: any) => {
            let options = [];
            for (let g of res.data.result) {
              if (this.getFormControl('tagIds').value && !this.getFormControl('tagIds').value.find(id => id === g.id)) {
                options.push({label: g.tagName, value: g.id});
              }
            }
            if (search && options.length === 0) {
              options.push({label: '没有匹配的结果', disabled: true, value: -1});
            }
            this.items[2] = Object.assign(this.items[2], {options: options});
            this.getFormControl('tagIds').setValue(this.getFormControl('tagIds').value);
          });
      }
    }, {
      type: 'select-group',
      key: 'distribution',
      value: {},
      label: '分发对象',
      selectLabel: '请选择用户/用户组/部门',
      resultLabel: '分发对象'
    }, {
      type: 'checkbox',
      key: 'isPermission',
      label: '下载设置',
      placeHolder: '下载设置',
      describe: '不勾选此项，客户端只能预览文档，不能下载'
    }
  ];
  contentNames = [];
  localNames = [];
  constructor (private dataService: DataService,
               private messageService: MessageService,
               private http: ContentFilesHttpService) {
    super();
    this.items[0]['uploader'].onAfterAddingFile = (fileItem, form: any): any => {
      if (fileItem.file.name.length > 70) {
        this.messageService.warning('上传文件的名称不能超过70个字符！');
        fileItem.remove();
      } else {
        let value = fileItem._file.name.substring((fileItem._file.name.lastIndexOf(".") + 1), fileItem._file.name.length).toLowerCase();
        let icon = 'et';
        // 支持的文件图标
        let icon_file = ['db', 'doc', 'docx', 'dps', 'epub', 'et', 'folder', 'gif', 'jpg', 'jpeg', 'png', 'md', 'moren', 'mp3', 'wav',
          'mp4', 'avi', 'pdf', 'ppt', 'pptx', 'ttf', 'ttc', 'txt', 'txt2', 'wps', 'xls', 'xlsx', 'zip', 'gz', 'rar'];
        switch (value) {
          case '':
            icon = 'et';
            break;
          case 'db':
            icon = 'db-icon';
            break;
          default:
            icon = value;
        }
        if (icon_file.indexOf(value) < 0) {
          icon = 'et';
        }
        fileItem.icon = icon;
      }
    };
    this.items[0]['uploader'].onSuccessItem = (item, response, status, headers) => {
      let res = JSON.parse(response);
      if (res.code === '200') {
        this.getFormControl('upLoadFiles').setValue(JSON.parse(response).data.result[0].localfile);
        this.contentNames.push(JSON.parse(response).data.result[0].filename);
        this.localNames.push(JSON.parse(response).data.result[0].localfile);
        if (this.items[0]['uploader'].queue.length > 1) {
          this.items[0]['uploader'].queue.forEach((_item: any, index) => {
            if (index !== (this.items[0]['uploader'].queue.length - 1)) {
              _item.remove();
            }
          });
        }
      } else {
        this.messageService.error("文件上传失败！");
      }
    };
  }
}
