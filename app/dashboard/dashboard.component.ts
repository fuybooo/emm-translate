import {Component, OnInit} from "@angular/core";
import * as moment from 'moment';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {UtilService} from "../shared/util/util.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {echarts_xAxis_style, echarts_yAxis} from "../shared/shared.model";
import {TranslateService} from "@ngx-translate/core";
declare let echarts: any;
declare let $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  type = 1; // 数据类型： 1：敏感词（默认值），2：违规网址，3：违规设备
  dateType = 1; // 快捷时间类型 1：今天（默认值），2：近7天，3：近30天
  deviceNumber = 0;
  userNumber = 0;
  illegalUserSummary = [];
  illegalDeptSummary = [];
  defaultLevelSummary = [
    {
      name: '1',
      count: 0
    },
    {
      name: '2',
      count: 0
    },
    {
      name: '3',
      count: 0
    },
  ];
  illegalLevelSummary = this.defaultLevelSummary;
  illegalDeviceSummary = [];
  data = [];
  // 日期控件所需属性 start
  startDate = new Date();
  // startDate = moment().subtract(1, 'month').toDate();
  endDate = new Date();
  // 日期控件所需属性 end
  searchWord = '';
  params = {
    search: '',
    queryDevice: '', // 设备名称
    queryOwner: '', // username
    queryLevel: '', // '' / 1 / 2 / 3
    queryDept: '', // 部门名称
    lastTimeFrom: moment(this.startDate).format('YYYY-MM-DD'), // 默认值 今天
    lastTimeTo: moment(this.endDate).format('YYYY-MM-DD'), // 默认值 今天
    pageSize: 100, // 默认值 100
    pageNumber: 1, // 默认值 1
    sortName: '', // 默认值 时间
    sortOrder: '', // 默认值 倒序
  };
  deptOther = '';
  deviceOther = '';
  userOther = '';
  deviceImgUrl = environment.deployPath + '/assets/img/dashboard_phone.png';
  userImgUrl = environment.deployPath + '/assets/img/dashboard_users.png';
  isLoading = false;
  summaryType = '';
  summaryItem = null;
  total;
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.params.pageNumber ++;
        if ((this.params.pageNumber - 1) * this.params.pageSize < this.total) {
          this.doSearch(false, true);
        }
      }
    }
  };
  constructor(private http: HttpClient,
              private translateService: TranslateService,
              private dataService: DataService,
              private util: UtilService,
  ) {
  }

  ngOnInit() {
    // 加载统计数据
    this.getSummary();
    // 初始化图表
    setTimeout(() => {
      this.initChart();
      // $(window).resize(() => {
      //   this.initChart();
      // });
    }, 1);
    // 进行查询
    this.doSearch();
    // Observable.fromEvent(window, 'resize')
    //   .debounceTime(100)
    //   .subscribe((e) => {
    //     this.initChart();
    //   });
  }

  onClickSummary(summaryType, item) {
    this.summaryType = summaryType;
    this.summaryItem = item;
    let list;
    if (this.summaryType === 'queryDevice') {
      list = this.illegalDeviceSummary;
    } else if (this.summaryType === 'queryOwner') {
      list = this.illegalUserSummary;
    } else if (this.summaryType === 'queryLevel') {
      list = this.illegalLevelSummary;
      this.util.sortObjectArray(list);
    } else if (this.summaryType === 'queryDept') {
      list = this.illegalDeptSummary;
    }
    this.util.changeActive(list, this.summaryItem, false);
    let queryDept = this.util.findActive(this.illegalDeptSummary)[0] || {name: ''};
    let queryDevice = this.util.findActive(this.illegalDeviceSummary)[0] || {name: ''};
    let queryOwner = this.util.findActive(this.illegalUserSummary)[0] || {userName: ''};
    let queryLevel = this.util.findActive(this.illegalLevelSummary)[0] || {name: ''};
    if (queryDept.name === 'other') {
      this.params.queryDept = this.deptOther;
    } else {
      this.params.queryDept = queryDept.name;
    }
    if (queryDevice.name === 'other') {
      this.params.queryDevice = this.deviceOther;
    } else {
      this.params.queryDevice = queryDevice.name;
    }
    if (queryOwner.name === 'other') {
      this.params.queryOwner = this.userOther;
    } else {
      this.params.queryOwner = queryOwner.userName;
    }
    this.params.queryLevel = queryLevel.name;
    this.doSearch(true);
  }
  changeType(value) {
    if (this.type === value) {
      return;
    }
    // 取消选中状态
    this.util.changeActive(this.illegalDeviceSummary);
    this.util.changeActive(this.illegalUserSummary);
    this.util.changeActive(this.illegalLevelSummary);
    this.util.changeActive(this.illegalDeptSummary);
    // 初始化条件，保留查询日期
    Object.assign(this.params, {
      search: '',
      queryDevice: '', // 设备名称
      queryOwner: '', // username
      queryLevel: '', // '' / 1 / 2 / 3
      queryDept: '', // 部门名称
      pageSize: 100, // 默认值 100
      pageNumber: 1, // 默认值 1
      sortName: '', // 默认值 时间
      sortOrder: '', // 默认值 倒序
    });
    this.type = value;
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

  doSearch(changeActive = false, concat = false) {
    this.params.search = this.searchWord;
    let url;
    if (this.type === 1) {
      url = this.dataService.url.dashboard.get_sensitive_word_list;
    } else if (this.type === 2) {
      url = this.dataService.url.dashboard.get_illegal_url_list;
    } else if (this.type === 3) {
      url = this.dataService.url.dashboard.get_illegal_device_list;
    }
    this.isLoading = true;
    this.http.get(url, this.dataService.getWholeParams(this.params)).subscribe((res: any) => {
      this.isLoading = false;
      if (res.code === '200') {
        this.total = res.data.total;
        // 获取统计区数据，统计区域数据只和日期和search条件相关
        this.illegalUserSummary = res.data.illegalUser;
        this.illegalLevelSummary = res.data.illegalLevel.length ? res.data.illegalLevel : this.defaultLevelSummary;
        this.util.sortObjectArray(this.illegalLevelSummary);
        this.illegalDeviceSummary = res.data.illegalDevice;
        this.illegalDeptSummary = res.data.illegalDep;
        if (changeActive) {
          let list;
          if (this.summaryType === 'queryDevice') {
            list = this.illegalDeviceSummary;
          } else if (this.summaryType === 'queryOwner') {
            list = this.illegalUserSummary;
          } else if (this.summaryType === 'queryLevel') {
            list = this.illegalLevelSummary;
          } else if (this.summaryType === 'queryDept') {
            list = this.illegalDeptSummary;
          }
          this.util.changeActive(list, this.summaryItem, false);
        }
        this.getOther();
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
  getOther() {
    let deptOther = '';
    if (this.illegalDeptSummary.length === 4) {
      for (let i = 0; i < 3; i++) {
        let item = this.illegalDeptSummary[i];
        deptOther += item.name + ',';
      }
    }
    this.deptOther = deptOther.slice(0, -1);
    let deviceOther = '';
    if (this.illegalDeviceSummary.length === 4) {
      for (let i = 0; i < 3; i++) {
        let item = this.illegalDeviceSummary[i];
        deviceOther += item.name + ',';
      }
    }
    this.deviceOther = deviceOther.slice(0, -1);
    let userOther = '';
    if (this.illegalUserSummary.length === 4) {
      for (let i = 0; i < 3; i++) {
        let item = this.illegalUserSummary[i];
        userOther += item.userName + ',';
      }
    }
    this.userOther = userOther.slice(0, -1);
  }
  getSummary() {
    this.http.get(this.dataService.url.dashboard.get_users_and_devices_number).subscribe((res: any) => {
      if (res.code === '200') {
        this.deviceNumber = res.data.deviceNumber;
        this.userNumber = res.data.userNumber;
      }
    });
  }

  initChart() {
    this.http.get(this.dataService.url.dashboard.get_violation_type_statistics).subscribe((res: any) => {
      if (res.code === '200') {
        let chart = echarts.init($('#dashboard-device-chart')[0]);
        chart.setOption({
          noDataLoadingOption: {
            text: '暂无数据',
            effect: 'bubble',
            effectOption: {
              effect: {
                n: 0 // 气泡个数为0
              }
            },
            textStyle: {
              fontSize: 20
            }
          },
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              data: [
                '密码错误次数过多',
                '安装违规app',
                'root或越狱',
                '系统版本低于指定版本',
                '蜂窝流量超出',
                'SIM卡更换',
                '未启用安全桌面',
              ],
              ...echarts_xAxis_style
            }
          ],
          // yAxis: {minInterval: 1, ...echarts_yAxis},
          yAxis: echarts_yAxis,
          series: [
            {
              name: '违规数量',
              type: 'bar',
              barWidth: '40%',
              data: [
                res.data.illegalPassNumber,
                res.data.illegalAppStatus,
                res.data.rootNumber,
                res.data.illegalVersionNumber,
                res.data.illegalFlowNumber,
                res.data.illegalSIMNumber,
                res.data.unuseLauncherNumber,
              ]
            }
          ],
          textStyle: {
            color: '#565656'
          }
        });
        window.onresize = chart.resize;
      }
    });
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
    let url;
    let fileName;
    if (this.type === 1) {
      url = this.dataService.url.dashboard.export_sensitive_word_list;
      fileName = '敏感词数据.xlsx';
    } else if (this.type === 2) {
      url = this.dataService.url.dashboard.export_illegal_url_list;
      fileName = '违规网址数据.xlsx';
    } else if (this.type === 3) {
      url = this.dataService.url.dashboard.export_illegal_devices_list;
      fileName = '违规设备数据.xlsx';
    }
    this.http.get(url, {
      params: this.dataService.getParams(this.params),
      responseType: 'arraybuffer' // 'arraybuffer'|'blob'|'json'|'text'
    }).subscribe((res: any) => {
      this.util.exportFile(res, fileName);
    });
  }
}
