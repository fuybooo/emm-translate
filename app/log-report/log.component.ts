import {Component, OnInit} from "@angular/core";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {PermissionService} from "../shared/service/permission.service";
import {UtilService} from "../shared/util/util.service";
import {DataService} from "../shared/service/data.service";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-log-report-log',
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {
  dateType = 1; // 快捷时间类型 1：今天（默认值），2：近7天，3：近30天
  typeList = [
    {
      label: '全部日志',
      name: 'allLog',
    },
    {
      label: '用户日志',
      name: 'usersLog',
    },
    {
      label: '应用日志',
      name: 'appLog',
    },
    {
      label: '设备日志',
      name: 'deviceLog',
    },
    {
      label: '策略日志',
      name: 'policyLog',
    },
    {
      label: '内容日志',
      name: 'contentLog',
    },
    {
      label: '推送日志',
      name: 'pushLog',
    },
  ];
  type = 'allLog';
  data = [];
  // 日期控件所需属性 start
  startDate = new Date();
  // startDate = moment().subtract(1, 'month').toDate();
  endDate = new Date();
  // 日期控件所需属性 end
  searchWord = '';
  params = {
    search: '',
    logType: this.type, // 设备名称
    lastTimeFrom: moment(this.startDate).format('YYYY-MM-DD'), // 默认值 今天
    lastTimeTo: moment(this.endDate).format('YYYY-MM-DD'), // 默认值 今天
    pageSize: 100, // 默认值 100
    pageNumber: 1, // 默认值 1
    // sortName: '', // 默认值 时间
    // sortOrder: '', // 默认值 倒序
  };
  isLoading = false;
  total;
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.params.pageNumber ++;
        if ((this.params.pageNumber - 1) * this.params.pageSize < this.total) {
          this.doSearch(true);
        }
      }
    }
  };
  currentUser;
  constructor(private http: HttpClient,
              private dataService: DataService,
              private translateService: TranslateService,
              private util: UtilService,
              private router: Router,
              private permissionService: PermissionService
  ) {
  }
  ngOnInit() {
    this.currentUser = this.permissionService.getSession();
    this.doSearch();
  }

  changeType(value) {
    if (this.type === value) {
      return;
    }
    // 初始化条件，保留查询日期
    this.type = value;
    Object.assign(this.params, {
      search: '',
      logType: this.type,
      pageSize: 100, // 默认值 100
      pageNumber: 1, // 默认值 1
      // sortName: '', // 默认值 时间
      // sortOrder: '', // 默认值 倒序
    });
    this.doSearch();
  }
  changeDate(value) {
    this.params.lastTimeTo = moment().format('YYYY-MM-DD');
    if (value === 1) {
      this.params.lastTimeFrom = moment().format('YYYY-MM-DD');
      this.startDate = new Date();
    } else if (value === 2) {
      this.params.lastTimeFrom = moment().subtract(7, 'day').format('YYYY-MM-DD');
      this.startDate = moment().subtract(7, 'day').toDate();
    } else if (value === 3) {
      this.params.lastTimeFrom = moment().subtract(30, 'day').format('YYYY-MM-DD');
      this.startDate = moment().subtract(30, 'day').toDate();
    }
    this.doSearch();
  }
  doSearch(concat = false) {
    this.params.search = this.searchWord;
    this.isLoading = true;
    this.http.get(this.dataService.url.logReport.get_log_list, this.dataService.getWholeParams(this.params)).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code === '200') {
        this.total = res.data.total;
        if (concat) {
          this.data = this.data.concat(res.data.result);
        } else {
          this.data = res.data.result || [];
        }
      }
    });
  }
  changeSearchWord(value) {
    if (value === '') {
      this.doSearch();
    }
  }

// ---- 操作日期控件的方法 start----
  startValueChange() {
    if (this.startDate > this.endDate) {
      this.endDate = null;
      this.params.lastTimeTo = '';
    }
    this.params.lastTimeFrom = moment(this.startDate).format('YYYY-MM-DD');
    this.doSearch();
  }
  disabledStartDate(startValue) {
    if (!startValue || !this.endDate) {
      return false;
    }
  }

  endValueChange() {
    if (this.startDate > this.endDate) {
      this.startDate = null;
      this.params.lastTimeFrom = '';
    }
    this.params.lastTimeTo = moment(this.endDate).format('YYYY-MM-DD');
    this.doSearch();
  }

  disabledEndDate(endValue) {
    if (!endValue || !this.startDate) {
      return false;
    }
  }
  // ---- 操作日期控件的方法 end----

  exportData() {
    this.params.search = this.searchWord;
    let fileName = this.util.getObjectByField(this.typeList, this.type, 'name').label + '.xlsx';
    this.http.get(this.dataService.url.logReport.export_log, {
      params: this.dataService.getParams(Object.assign({}, this.params, {logType: this.type})),
      // params: this.dataService.getParams(this.params),
      responseType: 'arraybuffer' // 'arraybuffer'|'blob'|'json'|'text'
    }).subscribe((res: any) => {
      this.util.exportFile(res, fileName);
    });
  }
}
