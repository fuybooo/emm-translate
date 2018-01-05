import {Component, OnDestroy, OnInit} from "@angular/core";
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {ExportFileComponent} from "../shared/component/export-file.component";
import {deviceExportField, deviceExtendData, userExtendData, userDataExportField, userState} from "./log.model";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {UtilService} from "../shared/util/util.service";
import {ApplicationListComponent} from "../shared/component/application-list.component";
import {TranslateService} from "@ngx-translate/core";

declare let $: any;

@Component({
  selector: 'app-log-report-report',
  templateUrl: './report.component.html'
})
export class ReportComponent implements OnInit , OnDestroy {
  exportReportModal;
  params = {};
  list = [
    {
      label: '设备报表',
      name: 'device'
    },
    {
      label: '用户报表',
      name: 'user'
    },
    {
      label: '策略报表',
      name: 'policy'
    },
    {
      label: '应用报表',
      name: 'application'
    },
  ];

  constructor(private nzModalService: NzModalService,
              private dataService: DataService,
              private translateService: TranslateService,
              private util: UtilService,
              private subject: NzModalSubject,
              private http: HttpClient) {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.exportReportModal) {
      this.exportReportModal.destroy();
    }
  }

  exportReport(name, titleTpl, contentTpl, footerTpl) {
    if (name === 'device' || name === 'user') {
      let params: any = {
        basicData: deviceExportField,
        extendData: deviceExtendData,
      };
      if (name === 'user') {
        params = {
          userData: userState,
          basicData: userDataExportField,
          extendData: userExtendData,
        };
      }
      this.exportReportModal = this.nzModalService.open({
        title: name === 'device' ? '设备数据导出' : '用户报表导出',
        content: ExportFileComponent,
        footer: false, // footer默认为true
        width: 600,
        componentParams: params
      });
      this.exportReportModal.subscribe(result => {
        if (result.type === 'save') {
          let url = '';
          let fileName = '';
          if (name === 'device') {
            url = this.dataService.url.logReport.get_device;
            fileName = '设备数据.xlsx';
            let checkedList = result.data.extendData.filter(item => item.isChecked);
            this.params = {expand: this.util.getIdsByList(checkedList, true, 'field')};
          } else if (name === 'user') {
            url = this.dataService.url.logReport.get_user;
            fileName = '用户报表.xlsx';
            let expandCheckedList = result.data.extendData.filter(item => item.isChecked);
            let userStatusCheckedList = result.data.userState.filter(item => item.isChecked);
            this.params = {
              expand: this.util.getIdsByList(expandCheckedList, true, 'field'),
              userStatus: this.util.getIdsByList(userStatusCheckedList, true, 'field')
            };
          }
          this.http.get(url, {
            params: this.dataService.getParams(this.params),
            responseType: 'arraybuffer' // 'arraybuffer'|'blob'|'json'|'text'
          }).subscribe((res: any) => {
            this.util.exportFile(res, fileName);
            this.exportReportModal.destroy();
          });
        }
      });
    } else if (name === 'policy') {
      this.exportReportModal = this.nzModalService.open({
        title: titleTpl,
        content: contentTpl,
        footer: footerTpl,
      });
    } else if (name === 'application') {
      this.exportReportModal = this.nzModalService.open({
        title: '应用数据导出',
        content: ApplicationListComponent,
        footer: false,
        componentParams: {
          showPlatform: true
        }
      });
      this.exportReportModal.subscribe((res: any) => {
        if (res.type === 'save') {
          this.http.get(this.dataService.url.logReport.get_application, {
            params: this.dataService.getParams({
              apkIds: this.util.getIdsByList(res.data, true),
              platform: res.platform // 1: Android, 2: iOS
            }),
            responseType: 'arraybuffer' // 'arraybuffer'|'blob'|'json'|'text'
          }).subscribe((response: any) => {
            this.util.exportFile(response, '应用报表.xlsx');
            this.exportReportModal.destroy();
          });
        }
      });
    }
  }
  policyHandleOk() {
    this.http.get(this.dataService.url.logReport.get_policy, {
      responseType: 'arraybuffer' // 'arraybuffer'|'blob'|'json'|'text'
    }).subscribe((res: any) => {
      this.util.exportFile(res, '策略报表.xlsx');
      this.exportReportModal.destroy();
    });
  }
  handleCancel() {
    this.exportReportModal.destroy();
  }
}
