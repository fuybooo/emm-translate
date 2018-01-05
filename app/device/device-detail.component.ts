import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as moment from 'moment';
import {DeviceService} from "./device.service";
import {DataService} from "../shared/service/data.service";
import {defaultHeight} from "./device.model";
import {Router} from "@angular/router";
import {PolicyService} from "../policy/policy.service";
import {UtilService} from "../shared/util/util.service";
import {echarts_xAxis_style, echarts_yAxis, blankImgSrc} from "../shared/shared.model";
import {PermissionService} from "../shared/service/permission.service";
import {AppSpinService} from "../shared/service/app-spin.service";
import {TranslateService} from "@ngx-translate/core";
declare let echarts: any;
declare let $: any;
@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html'
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  @Input() id; // 详情界面的id，可以时设备id，可以时设备分组id
  @Input() isSelfHelp = false;
  // 设备基本信息
  showType = 0; // 0: 显示空白 1： 显示设备详情 2： 显示设备组详情
  deviceInfo;
  deviceGroup = [];
  deviceLastLoginDate;
  deviceRegisterDate;
  deviceSystem;
  deviceSystemVersion;
  batteryUsageStyle;
  batteryUsageNum;
  memoryUsageStyle;
  memoryUsageNumber;
  memoryUsageUsed;
  memoryUsageTotal;
  storageUsageStyle;
  storageUsageNumber;
  storageUsageUsed;
  storageUsageTotal;
  sdUsageStyle;
  sdUsageNumber;
  sdUsageUsed;
  sdUsageTotal;
  deviceLog = 1;
  deviceLogData = [];
  deviceAppData = [];
  isLoading = false;
  devicePolicy = [];
  params: any = {
    pageNumber: 1,
    pageSize: 100
  };
  appParams: any = {
    pageNumber: 1,
    pageSize: 100
  };
  total;
  appTotal;
  options = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.params.pageNumber++;
        if ((this.params.pageNumber - 1) * this.params.pageSize <= this.total) {
          this.getDeviceLog(true);
        }
      }
    }
  };
  appOptions = {
    callbacks: {
      onTotalScrollOffset: 80,
      onTotalScroll: () => {
        this.appParams.pageNumber++;
        if ((this.params.pageNumber - 1) * this.appParams.pageSize <= this.appTotal) {
          this.getDeviceApp(true);
        }
      }
    }
  };
  currentMonth = new Date().getMonth() + 1;
  lastMonth = this.currentMonth - 1 === 0 ? 12 : this.currentMonth - 1;
  lastLastMonth = this.currentMonth - 2 === -1 ? 11 : (this.currentMonth - 2 === 0 ? 12 : this.currentMonth - 2);
  wifiUsageMonth = this.currentMonth;
  dataUsageMonth = this.currentMonth;
  talkUsageMonth = this.currentMonth;
  wifiSeries = [];
  dataSeries = [];
  talkSeries = [];
  xAxis = [];
  wifiChart;
  dataChart;
  talkChart;
  displayOwner = '';
  roam = '';
  deviceState = '';
  subscript1;
  subscript2;
  collapseBase = true;
  // 策略
  collapsePolicy;
  // 运营商
  collapseOperator;
  // 系统
  collapseSystemInformation;
  // 硬件信息
  collapseHardwareInformation;
  // 网络信息
  collapseNetworkInformation;
  // 应用信息
  collapseUseNetworkInformation;
  // 每天统计信息
  collapseStatistics;
  // 日志
  collapseLog;
  blankImgSrc = blankImgSrc;
  showPackUp = false;
  deviceDetailSpin = false;

  constructor(private deviceService: DeviceService,
              private dataService: DataService,
              private translateService: TranslateService,
              private router: Router,
              private util: UtilService,
              public policyService: PolicyService,
              private permissionService: PermissionService,
              private appSpinService: AppSpinService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.subscript1 = this.deviceService.searchDeviceDetailEvent.subscribe((id) => {
      this.deviceDetailSpin = true;
      this.id = id;
      this.params.id = this.id;
      this.appParams.id = this.id;
      this.showType = 1;
      this.collapseBase = true;
      // 基本信息
      this.getDeviceInfo();
      // 策略信息
      this.getDevicePolicy();
      // 日志信息
      this.getDeviceLog();
      // 用量统计
      this.getDeviceUsage();
      // 应用信息
      this.getDeviceApp();
      this.setHeight();
      this.bindEvent();
    });
    this.subscript2 = this.deviceService.selectedDeviceGroup.subscribe((selectedGroup) => {
      if (typeof selectedGroup === 'object') {
        this.showType = 2;
      } else {
        this.showType = 0;
      }
    });
    // todo 根据id查找设备详情
    // 测试代码：
    // this.deviceService.searchDeviceDetailEvent.emit(1);
  }
  ngOnDestroy() {
    if (this.subscript1) {
      this.subscript1.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }
  getDeviceInfo() {
    this.http.get(this.dataService.url.device.getDeviceInfo, this.dataService.getWholeParams({id: this.id})).subscribe((res: any) => {
      this.deviceInfo = res.data;
      if (this.deviceInfo) {
        this.displayOwner = this.deviceInfo.owner ? this.deviceInfo.owner.replace(/,/g, '、') : '';
        this.roam = this.deviceInfo.isRoam ? '是' : '否';
        if (this.deviceInfo.deviceState) {
          if (this.deviceInfo.deviceState === '登录' || this.deviceInfo.deviceState === '在线') {
            this.deviceInfo.deviceState = this.deviceInfo.deviceState.fontcolor("#10b971");
          } else if (this.deviceInfo.deviceState === '离线' || this.deviceInfo.deviceState === '未激活') {
            this.deviceInfo.deviceStat = this.deviceInfo.deviceState.fontcolor("#f6f6f6");
          } else if (this.deviceInfo.deviceState === '回收') {
            this.deviceInfo.deviceState = this.deviceInfo.deviceState.fontcolor("#fab155");
          } else {
            this.deviceInfo.deviceState = this.deviceInfo.deviceState.fontcolor("#8ad2ff");
          }
        }
        if (this.deviceInfo.deviceGroup && this.deviceInfo.deviceGroup.length) {
          this.deviceGroup = this.deviceInfo.deviceGroup;
        } else {
          this.deviceGroup = [];
        }
        if (this.deviceInfo.lastLoginDate) {
          this.deviceLastLoginDate = moment(this.deviceInfo.lastLoginDate).format('YYYY-MM-DD HH:mm:ss');
        } else {
          this.deviceLastLoginDate = '';
        }
        if (this.deviceInfo.registerDate) {
          this.deviceRegisterDate = moment(this.deviceInfo.registerDate).format('YYYY-MM-DD HH:mm:ss');
        } else {
          this.deviceRegisterDate = '';
        }
        if (this.deviceInfo.systemVersion) {
          this.deviceSystem = this.deviceInfo.systemVersion.split(' ')[0];
          this.deviceSystemVersion = this.deviceInfo.systemVersion.split(' ')[1];
        } else {
          this.deviceSystem = '';
          this.deviceSystemVersion = '';
        }
        this.batteryUsageNum = this.deviceInfo.betteryState;
        if (this.batteryUsageNum) {
          this.batteryUsageStyle = {
            'background': `linear-gradient(to right, #61e8ca ${this.batteryUsageNum}%, #fff ${this.batteryUsageNum}%)`
          };
        }
        if (this.deviceInfo.memoryTotal && this.deviceInfo.memoryFree) {
          this.memoryUsageTotal = this.deviceInfo.memoryTotal;
          this.memoryUsageUsed = this.memoryUsageTotal - this.deviceInfo.memoryFree;
          this.memoryUsageNumber = this.memoryUsageUsed / this.memoryUsageTotal * 100;
          this.memoryUsageStyle = {
            'width': `${this.memoryUsageNumber}%`
          };
        }
        if (this.deviceInfo.totalStorage && this.deviceInfo.freeSpace) {
          this.storageUsageTotal = this.deviceInfo.totalStorage;
          this.storageUsageUsed = this.storageUsageTotal - this.deviceInfo.freeSpace;
          this.storageUsageNumber = this.storageUsageUsed / this.storageUsageTotal * 100;
          this.storageUsageStyle = {
            'width': `${this.storageUsageNumber}%`
          };
        }
        if (this.deviceInfo.sdTotal && this.deviceInfo.sdFree) {
          this.sdUsageTotal = this.deviceInfo.sdTotal;
          this.sdUsageUsed = this.sdUsageTotal - this.deviceInfo.sdFree;
          this.sdUsageNumber = this.sdUsageUsed / this.sdUsageTotal * 100;
          this.sdUsageStyle = {
            'width': `${this.sdUsageNumber}%`
          };
        }
      }
      this.deviceDetailSpin = false;
    });
  }
  getDevicePolicy() {
    this.devicePolicy = [];
    this.http.get(this.dataService.url.device.get_device_policy, this.dataService.getWholeParams({id: this.id})).subscribe((res: any) => {
      for (let p in res.data) {
        res.data[p]['url'] = this.policyService.getRouteByPolicyType(res.data[p].policyType);
        this.devicePolicy.push(res.data[p]);
      }
    });
  }

  getDeviceLog(isConcat = false) {
    let url;
    if (this.deviceLog === 1) {
      url = this.dataService.url.device.getDeviceOperatingLog;
    } else if (this.deviceLog === 2) {
      url = this.dataService.url.device.getDeviceViolationLog;
    } else {
      url = this.dataService.url.device.getDeviceCirculationLog;
    }
    this.http.get(url, this.dataService.getWholeParams(this.params)).subscribe((res: any) => {
      if (isConcat) {
        this.total = res.data.total;
        this.deviceLogData = this.deviceLogData.concat(res.data.result);
      } else {
        if (res.data) {
          this.total = res.data.total;
          this.deviceLogData = res.data.result;
        }
      }
    });
  }

  getDeviceUsage(type = -1) {
    let month;
    if (type === 1) {
      month = this.wifiUsageMonth;
      this.wifiSeries = [];
    } else if (type === 2) {
      month = this.dataUsageMonth;
      this.dataSeries = [];
    } else if (type === 3) {
      month = this.talkUsageMonth;
      this.talkSeries = [];
    } else {
      month = this.currentMonth;
      this.talkSeries = [];
      this.dataSeries = [];
      this.wifiSeries = [];
    }
    this.http.get(this.dataService.url.device.getDailyUsage, this.dataService.getWholeParams({
      id: this.id,
      month: month
    })).subscribe((res: any) => {
      this.xAxis = [];
      // 更新图表数据
      // let length = res.data.length; // 使用老接口的返回值
      let length = res.data.result.length;
      for (let i = 1; i <= length; i++) {
        let item = res.data.result[i - 1];
        this.xAxis.push({
          value: i,
          mapValue: item.updateTime
        });
        if (type === 1) {
          this.wifiSeries.push(item.wifiUsage);
        } else if (type === 2) {
          this.dataSeries.push(item.dataUsage);
        } else if (type === 3) {
          this.talkSeries.push(item.totalCalltime);
        } else {
          this.wifiSeries.push(item.wifiUsage);
          this.dataSeries.push(item.dataUsage);
          this.talkSeries.push(item.totalCalltime);
        }
      }
      if (type === 1) {
        this.showWifiUsage();
      } else if (type === 2) {
        this.showDataUsage();
      } else if (type === 3) {
        this.showTalkUsage();
      } else {
        this.showWifiUsage();
        this.showDataUsage();
        this.showTalkUsage();
      }
    });
  }
  getWifiChart() {
    if (this.wifiChart || (this.wifiChart && !this.wifiChart.isDisposed)) {
      this.wifiChart.dispose();
    }
    this.wifiChart = echarts.init($('#device-detail-daily-chart-wifi')[0]);
  }
  getDataChart() {
    if (this.dataChart || (this.dataChart && !this.dataChart.isDisposed)) {
      this.dataChart.dispose();
    }
    this.dataChart = echarts.init($('#device-detail-daily-chart-data')[0]);
  }
  getTalkChart() {
    if (this.talkChart || (this.talkChart && !this.talkChart.isDisposed)) {
      this.talkChart.dispose();
    }
    this.talkChart = echarts.init($('#device-detail-daily-chart-talk')[0]);
  }

  tipFormatter(params, label, unit) {
    return moment(this.xAxis[params[0].dataIndex].mapValue).format('YYYY-MM-DD HH:mm:ss') +
      '<br>' + label + params[0].value + unit;
  }
  showWifiUsage() {
    this.getWifiChart();
    this.wifiChart.setOption({
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'bubble',
        effectOption : {
          effect: {
            n: 0 // 气泡个数为0
          }
        },
        textStyle: {
          fontSize: 20
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return this.tipFormatter(params, 'wifi用量：', 'M');
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
          ...echarts_xAxis_style,
          boundaryGap: false,
          data: this.xAxis,
        }
      ],
      yAxis: echarts_yAxis,
      series: [
        {
          name: '用量',
          type: 'line',
          stack: '用量',
          areaStyle: {normal: {
            color: '#eef8f0'
          }},
          data: this.wifiSeries
        }
      ],
      color: ['#55b671'],
      textStyle: {
        color: '#565656'
      }
    });
  }

  showDataUsage() {
    this.getDataChart();
    this.dataChart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return this.tipFormatter(params, '数据用量：', 'M');
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
          ...echarts_xAxis_style,
          boundaryGap: false,
          data: this.xAxis,
        }
      ],
      yAxis: echarts_yAxis,
      series: [
        {
          name: '用量',
          type: 'line',
          stack: '用量',
          areaStyle: {normal: {
            color: '#ebf8fe'
          }},
          data: this.dataSeries
        }
      ],
      color: ['#77daf1'],
      textStyle: {
        color: '#565656'
      }
    });
  }

  showTalkUsage() {
    this.getTalkChart();
    this.talkChart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return this.tipFormatter(params, '通话时长：', 'min');
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
          ...echarts_xAxis_style,
          boundaryGap: false,
          data: this.xAxis,
        }
      ],
      yAxis: echarts_yAxis,
      series: [
        {
          name: '用量',
          type: 'line',
          areaStyle: {normal: {
            color: '#ffeee7'
          }},
          data: this.talkSeries
        }
      ],
      color: ['#ffbc76'],
      textStyle: {
        color: '#565656'
      }
    });
  }
  getDeviceApp(isConcat = false) {
    this.http.get(this.dataService.url.device.getDeviceApp, this.dataService.getWholeParams(this.appParams)).subscribe((res: any) => {
      if (isConcat) {
        this.appTotal = res.data.total;
        this.deviceAppData = this.deviceAppData.concat(res.data.result);
      } else {
        if (res.data.result.length) {
          this.appTotal = res.data.total;
          this.deviceAppData = res.data.result;
        }
      }
    });
  }

  /**
   * 点击设备组跳转到设备组详情页面
   */
  toGroup(group) {
    // 查询所有设备组，激活点击的设备组，滚动条滚动到该设备组所在的位置
    this.deviceService.searchDeviceGroupListEvent.emit();
    this.deviceService.selectedDeviceGroup.emit(group);
  }
  bindEvent() {
    $('#device-detail-collapseset').on('click', '#collapseBase .ant-collapse-header', () => {
      this.collapseBase = !this.collapseBase;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapsePolicy .ant-collapse-header', () => {
      this.collapsePolicy = !this.collapsePolicy;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseOperator .ant-collapse-header', () => {
      this.collapseOperator = !this.collapseOperator;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseSystemInformation .ant-collapse-header', () => {
      this.collapseSystemInformation = !this.collapseSystemInformation;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseHardwareInformation .ant-collapse-header', () => {
      this.collapseHardwareInformation = !this.collapseHardwareInformation;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseNetworkInformation .ant-collapse-header', () => {
      this.collapseNetworkInformation = !this.collapseNetworkInformation;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseUseNetworkInformation .ant-collapse-header', () => {
      this.collapseUseNetworkInformation = !this.collapseUseNetworkInformation;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseStatistics .ant-collapse-header', () => {
      this.collapseStatistics = !this.collapseStatistics;
      this.setHeight();
      this.checkPackUpShow();
    }).on('click', '#collapseLog .ant-collapse-header', () => {
      this.collapseLog = !this.collapseLog;
      this.setHeight();
      this.checkPackUpShow();
    });
  }
  onClickCollapseset(collapseType, $event) {
    if ($event && $event.layerY <= 30) {
      this[collapseType] = !this[collapseType];
      this.setHeight();
    }
    this.checkPackUpShow();
  }
  toPolicy(path, id) {
    let permission = this.permissionService.getSession().permission;
    if (permission === 'add_edit102' || permission === 'add_edit103') {
      return;
    }
    this.appSpinService.spin();
    this.policyService.initSystem = false;
    this.policyService.currentPolicyId = id;
    this.policyService.currentSystem = this.deviceSystem;
    this.router.navigate([path]);
  }
  packUp() {
    this.collapsePolicy = false;
    this.collapseOperator = false;
    this.collapseSystemInformation = false;
    this.collapseHardwareInformation = false;
    this.collapseNetworkInformation = false;
    this.collapseUseNetworkInformation = false;
    this.collapseStatistics = false;
    this.collapseLog = false;
    this.checkPackUpShow();
    this.setHeight();
  }
  checkPackUpShow() {
    let collapseList = [
      this.collapsePolicy,
      this.collapseOperator,
      this.collapseSystemInformation,
      this.collapseHardwareInformation,
      this.collapseNetworkInformation,
      this.collapseUseNetworkInformation,
      this.collapseStatistics,
      this.collapseLog,
    ];
    let length = 0;
    for (let i of collapseList) {
      if (i) {
        length ++;
      }
    }
    if (length >= 1) {
      this.showPackUp = true;
    } else {
      this.showPackUp = false;
    }
  }
  setHeight() {
    setTimeout(() => {
      let height = $('.list-content-detail').height();
      this.deviceService.heightEvent.emit(height < defaultHeight ? defaultHeight : height);
    }, 200); // 需要一段回流的时间
  }
}
