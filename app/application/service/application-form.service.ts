import {Injectable} from "@angular/core";
import {CustomForm} from "../../shared/custom-form/custom-form";
import {DataService} from "../../shared/service/data.service";
import {FileUploader} from "ng2-file-upload";
import {ApplicationHttpService} from "./application-http.service";
import {FileItem} from "../../../../node_modules/ng2-file-upload/file-upload/file-item.class";
import {FormControl, Validators} from "@angular/forms";
import {MessageService} from "../../shared/service/message.service";
import {ValidatorService} from "../../shared/service/validator.service";
@Injectable()
export class ApplicationFormService extends CustomForm {
  // 平台
  platform = 1;
  labelSm = 5;
  popUp = true;
  items = [
    {
      type: 'file-app',
      key: 'appFiles',
      required: true,
      label: '上传应用文件',
      uploadDesc: '仅支持.apk',
      uploader: new FileUploader({
        url: this.dataService.url.application.uploadApp,
        method: "POST",
        autoUpload: true,
        // allowedFileType: ['apk', 'ipa'],
        itemAlias: "file"
      }),
      validator: [
        (control: FormControl): { [s: string]: boolean } => {
          return control.value ? null : {required: true};
        }
      ],
    }, {
      type: 'file-app-img',
      key: 'imagesFiles',
      label: '上传应用截图',
      uploadDesc: '请上传4张应用截图, 仅支持.png、 .jpg、 .bmp',
      multiple: true, // 多选
      value: new FileUploader({
        url: this.dataService.url.application.uploadFile,
        method: "POST",
        autoUpload: true,
        // allowedFileType: ['.png', '.jpg', '.bmp'],
        itemAlias: "files"
      })
    }, {
      type: 'text',
      key: 'description',
      label: '描述',
      validator: [Validators.maxLength(255)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过255个字",
        }
      ],
    }, {
      type: 'select',
      label: '类型',
      key: 'classIds',
      value: [],
      options: [],
      nzSearchChange: (search?) => {
        this.http.getAppClassList({search: search, page: 1, pageSize: 10})
          .subscribe((res: any) => {
            let options = [];
            for (let g of res.data.result) {
              if (this.getFormControl('classIds').value && !this.getFormControl('classIds').value.find(id => id === g.id)) {
                options.push({label: g.name, value: g.id});
              }
            }
            if (search && options.length === 0) {
              options.push({label: '没有匹配的结果', disabled: true, value: -1});
            }
            this.items[3] = Object.assign(this.items[3], {options: options});
            this.getFormControl('classIds').setValue(this.getFormControl('classIds').value);
          });
      }
    }, {
      key: 'supportSysVersion',
      label: '系统版本',
      placeHolder: '此版本应用的最低系统',
      validator: [Validators.maxLength(100)],
      explains: [
        {
          validate: (o) => {
            return o.dirty && o.hasError('maxlength');
          },
          desc: "最多不超过100个字",
        }
      ],
    }, {
      type: 'application-publishingType',
      label: '发布类型',
      key: 'publishMode',
      value: '1',
      options: [
        {
          label: "正常发布",
          placeHolder: "所有人都可见",
          value: '1',
        }, {
          label: "灰度发布",
          placeHolder: "仅指定的人可见",
          value: '2',
        }
      ],
      validator: [
        (control: FormControl): { [s: string]: boolean } => {
          if (this.formGroup) {
            this.getFormControl('publishObject').setValue(this.getFormControl('publishObject').value);
          }
          return null;
        }
      ],
    }, {
      hide: true,
      key: 'publishObject',
      value: {},
      labels: ['group', 'deviceGroup', 'dept'],
      selectLabel: '请选择用户组/设备组/部门',
      resultLabel: '分发对象',
      validator: [
        (control: FormControl): { [s: string]: boolean } => {
          let b = false;
          let value = control.value;
          if ((this.formGroup && (this.getFormControl('publishMode').value === '2') &&
            (value && value.data && value.data.length === 0))) {
            b = true;
          }
          return b ? {isHave: b} : null;
        }
      ],
    }, {
      hide: true,
      key: 'duration',
      value: 12,
    }
  ];
  appPath = [];
  imgPath = [];
  // 编辑对象
  remoteDate: any;
  // 编辑对象截图
  remoteDateImg = false;

  constructor(private dataService: DataService,
              private messageService: MessageService,
              private http: ApplicationHttpService) {
    super();
    // 上传应用
    this.items[0]['uploader'].onAfterAddingFile = (fileItem, form: any): any => {
      // let type = 'android.package';
      // let fileType = fileItem._file.type;
      // if (this.platform === 1) {
      //   type = 'android.package';
      // } else if (this.platform === 2) {
      //   fileType = fileItem._file.name.substring(fileItem._file.name.lastIndexOf("."), fileItem._file.name.length).toLowerCase();
      //   type = 'ipa';
      // }
      let type = 'apk';
      let fileType = fileItem._file.name.substring(fileItem._file.name.lastIndexOf("."), fileItem._file.name.length).toLowerCase();
      if (this.platform === 1) {
        type = 'apk';
      } else if (this.platform === 2) {
        type = 'ipa';
      }
      if (fileType.indexOf(type) === -1) {
        if (this.platform === 1) {
          this.messageService.warning('请上传.apk文件！');
        } else if (this.platform === 2) {
          this.messageService.warning('请上传.ipa文件！');
        }
        fileItem.remove();
      }
    };
    this.items[0]['uploader'].onBuildItemForm = (fileItem: FileItem, form: any): any => {
      // if (!!fileItem["platform"]) {
      //   form.append("platform", fileItem["realFileName"]);
      // }
      form.append("platform", this.platform);
    };
    this.items[0]['uploader'].onSuccessItem = (item, response, status, headers) => {
      // 应用平台错误返回code:APPLICATION800003
      // 上传错误格式文件返回code:APPLICATION800005
      //
      // 版本校验成功,运行添加result:0
      // 存在新版本,可以添加result:1
      // 版本已存在,不允许添加result:2

      // /**     * 应用ID为空     */
      // public static final String APPLICATION_APP_ID_IS_NULL = "APPLICATION800001";
      // /**     * 应用不存在     */
      // public static final String APPLICATION_APP_IS_NULL = "APPLICATION800002";
      // /**     * 应用平台错误     */
      // public static final String APPLICATION_APP_TYPE_WRONG = "APPLICATION800003";
      // /**     * 应用删除失败     */
      // public static final String APPLICATION_DELETE_FAIL = "APPLICATION800004";
      // /**     * 非法的应用包     */
      // public static final String APPLICATION_INVALID_PACKAGE = "APPLICATION800005";
      // /**     * 应用版本已存在     */
      // public static final String APPLICATION_EXIST = "APPLICATION800006";
      // /**     * 应用版本太旧     */
      // public static final String APPLICATION_OLD = "APPLICATION800007";

      /*else if(JSON.parse(response).code === 'APPLICATION800001') {
        this.messageService.error("修改失败，请重新选择ＥＭＭ版本！");
      }else if(JSON.parse(response).code === 'APPLICATION800002') {
        this.messageService.error("修改失败，此应用不存在！");
      }else if(JSON.parse(response).code === 'APPLICATION800003') {
        this.messageService.error("修改失败，应用平台错误！");
      }else if(JSON.parse(response).code === 'APPLICATION800004') {
        this.messageService.error("修改失败，请重新选择ＥＭＭ版本");
      }else if(JSON.parse(response).code === 'APPLICATION800005') {
        this.messageService.error("修改失败，请重新选择ＥＭＭ版本");
      }*/
      if (JSON.parse(response).code === '200') {
        let index = this.items[0]['uploader'].getIndexOfItem(item);
        this.appPath.push(JSON.parse(response).data.localName);
        this.getFormControl('appFiles').setValue(JSON.parse(response).data.localName);
        if (this.items[0]['uploader'].queue.length > 1) {
          this.items[0]['uploader'].queue.forEach((_item: any, _index) => {
            if (_index !== (this.items[0]['uploader'].queue.length - 1)) {
              _item.remove();
            }
          });
        }
      } else if (JSON.parse(response).code === 'APPLICATION800006') {
        this.messageService.error("已存在当前版本的此应用");
        // this.items[0]['uploader'].clearQueue();
        item.remove();
        this.getFormControl('appFiles').setValue('');
      } else if (JSON.parse(response).code === 'APPLICATION800007') {
        this.messageService.error("系统中已存在更高的版本，您确认要上传此版本吗？");
        let index = this.items[0]['uploader'].getIndexOfItem(item);
        this.appPath.push(JSON.parse(response).data.localName);
        this.getFormControl('appFiles').setValue(JSON.parse(response).data.localName);
        if (this.items[0]['uploader'].queue.length > 1) {
          this.items[0]['uploader'].queue.forEach((_item: any, _index) => {
            if (_index !== (this.items[0]['uploader'].queue.length - 1)) {
              _item.remove();
            }
          });
         }
      } else {
        this.messageService.error('上传失败，请上传其他' + (this.platform === 1 ? '.apk' : '.ipa') + '文件！');
        // this.items[0]['uploader'].clearQueue();
        item.remove();
        this.getFormControl('appFiles').setValue('');
      }
    };

    // this.items[0]['uploader'].onWhenAddingFileFailed = () => {
    //   this.messageService.warning('请选择正确的文件格式');
    // };
    // 上传截图
    this.items[1]['value'].onAfterAddingFile = (fileItem, form: any): any => {
      if (
        (
          fileItem._file.type.indexOf('png') > -1 ||
          fileItem._file.type.indexOf('jpg') > -1 ||
          fileItem._file.type.indexOf('jpeg') > -1 ||
          fileItem._file.type.indexOf('bmp') > -1
        )
        && (this.getFormControl('imagesFiles').value.queue.length < 5)
      ) {
        let reader = new FileReader();
        reader.readAsDataURL(fileItem._file);
        reader.onload = function (evt: any) {
          fileItem.src_file = evt.target.result;
        };
      } else {
        if (
          (
            fileItem._file.type.indexOf('png') > -1 ||
            fileItem._file.type.indexOf('jpg') > -1 ||
            fileItem._file.type.indexOf('jpeg') > -1 ||
            fileItem._file.type.indexOf('bmp') > -1
          )
        ) {
          this.messageService.warning('只能上传四张截图');
        } else if (this.getFormControl('imagesFiles').value.queue.length < 5) {
          this.messageService.warning('请选择正确的文件格式');
        }
        fileItem.remove();
      }
    };
    // this.items[1]['value'].onWhenAddingFileFailed = () => {
    //   this.messageService.warning('请选择正确的文件格式');
    // };
    this.items[1]['value'].onSuccessItem = (item, response, status, headers) => {
      let res = JSON.parse(response);
      if (res.code === '200') {
        JSON.parse(response).data.result.forEach((imgs: any) => {
          this.imgPath.push(imgs.localfile);
          item.localfile ? item.localfile.push(imgs.localfile) : item.localfile = [imgs.localfile];
          this.getFormControl('imagesFiles').setValue(this.getFormControl('imagesFiles').value);
        });
      }
    };
  }

  getData(): any {
    let data = super.getData();
    // 截图 编辑时有回显截图的情况
    let imgScreenURLs = null;
    if (this.remoteDateImg) {
      // 回显的截图没有被删除
      if (data.imagesFiles.remoteAddrImgs) {
        imgScreenURLs = null;
      } else {
        // 回显的截图被删除
        imgScreenURLs = "";
        if (this.imgPath.length > 0) {
          imgScreenURLs = this.imgPath.join(';');
        }
      }
    } else {
      imgScreenURLs = this.imgPath.length === 0 ? null : this.imgPath.join(';');
    }
    return {
      description: data.description,
      supportSysVersion: data.supportSysVersion,
      publishMode: data.publishMode,
      classIds: data.classIds.join(','),
      duration: data.duration,
      platform: this.platform, // [1|2]//平台
      imgScreenURLs: imgScreenURLs,
      // userIds: data.publishObject.userIds ? data.publishObject.userIds.join(',') : '',
      deviceGroupIds: data.publishObject.deviceGroupIds ? data.publishObject.deviceGroupIds.join(',') : '',
      userGroupIds: data.publishObject.groupIds ? data.publishObject.groupIds.join(',') : '',
      deptIds: data.publishObject.deptIds ? data.publishObject.deptIds.join(',') : '',
      localName: this.appPath.join(','), // 应用本地名
    };
  }
}
