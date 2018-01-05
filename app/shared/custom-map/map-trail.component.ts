import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../../shared/service/data.service";
import * as moment from 'moment';
import {MessageService} from "../service/message.service";
declare let AMap: any;
@Component({
  selector: 'app-map-trail',
  templateUrl: './map-trail.component.html'
})
export class MapTrailComponent implements OnInit {

  @Input() ids = '';
  @Input() groupIds = '';
  @Input() userIds = '';
  @Input() userGroupIds = '';
  @Input() deptIds = '';
  map;
  allPoints = []; // 所有设备的点（最近一次）
  linePoints = []; // 单个设备指定时间内容所有的点
  polyline;
  markers = [];
  hideSearch = true;
  // 日期控件所需属性 start
  startDate = moment().subtract(1, 'month').toDate();
  endDate = new Date();
  // 日期控件所需属性 end
  isLine;
  searchOptions = [];
  params;
  currentDeviceId;
  searchComplete = false;
  searchText = '';
  showSearchRes = false;

  constructor(private http: HttpClient,
              private dataService: DataService,
              private messageService: MessageService
  ) {
  }

  ngOnInit() {
    // 创建地图
    this.map = new AMap.Map('map', {
      resizeEnable: true,
      zoom: 13,
      mapStyle: "normal"
    });
    // 设置语言
    this.map.setLang(localStorage.getItem('currentLang'));
    this.params = {
      ids: this.ids,
      groupIds: this.groupIds,
      userIds: this.userIds,
      userGroupIds: this.userGroupIds,
      deptIds: this.deptIds
    };
    this.getAllDevicePosition();
  }

  getAllDevicePosition() {
    this.searchComplete = false;
    this.http.get(this.dataService.url.device.getDeviceTrail, this.dataService.getWholeParams(this.params)).subscribe((res: any) => {
      if (res.code === '200') {
        if (!res.data.result.length) {
          this.messageService.info('没有查询到轨迹或点');
        }
        // todo 判断是否是轨迹，如果是，则显示成轨迹，否则显示成点
        if (res.data.isTrail) {
          this.linePoints = res.data.result;
          this.showDeviceLine();
        } else {
          this.allPoints = res.data.result;
          this.showDevicePositions();
        }
        this.searchComplete = true;
      }
    });
  }

  showDevicePositions() {
    this.markers = [];
    let lastPoint;
    for (let i = 0; i < this.allPoints.length; i++) {
      let position = this.allPoints[i];
      if (i === this.allPoints.length - 1) {
        lastPoint = position;
      }
      let marker = new AMap.Marker({
        position: [+position.longitude, +position.latitude],
        map: this.map
      });
      this.markers.push(marker);
    }
    this.setCenter([+lastPoint.longitude, +lastPoint.latitude]);
    this.bindMarkerEvent();
  }

  showDeviceLine() {
    this.clearLine();
    this.isLine = true;
    this.clearPoint();
    let lineArr = [];
    for (let point of this.linePoints) {
      lineArr.push([+point.longitude, +point.latitude]);
    }
    this.polyline = new AMap.Polyline({
      path: lineArr,
      strokeColor: "#3366FF", // 线颜色
      strokeOpacity: 1,       // 线透明度
      strokeWeight: 5,        // 线宽
      strokeStyle: "solid",   // 线样式
      strokeDasharray: [10, 5] // 补充线样式
    });
    this.polyline.setMap(this.map);
    this.setCenter([+lineArr[lineArr.length - 1].lng, +lineArr[lineArr.length - 1].lat]);
  }

  bindMarkerEvent() {
    for (let i = 0; i < this.allPoints.length; i++) {
      let marker = this.markers[i];
      marker.on('click', () => {
        this.currentDeviceId = this.allPoints[i].deviceId;
        this.params = {
          ids: this.currentDeviceId
        };
        // 查询该点的轨迹
        this.getAllDevicePosition();
      });
    }
  }

  getLine() {
    this.params = {
      ids: this.currentDeviceId,
      startTime: moment(this.startDate).format('YYYY-MM-DD'),
      endTime: moment(this.endDate).format('YYYY-MM-DD'),
    };
    this.getAllDevicePosition();
  }

  clearPoint() {
    this.markers.forEach(marker => {
      marker.setMap(null);
      marker = null;
    });
    this.markers = [];
  }

  clearLine() {
    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }
  setCenter(position) {
    this.map.setZoomAndCenter(18, position);
  }

  searchPoint() {
    let text = this.searchText.trim().toLowerCase();
    let points = [];
    for (let i = 0; i < this.allPoints.length; i++) {
      let point = this.allPoints[i];
        if (
          point.userDisplayName && point.userDisplayName.toLowerCase().includes(text) ||
          point.userName && point.userName.toLowerCase().includes(text) ||
          point.deviceIMEI && point.deviceIMEI.toLowerCase().includes(text) ||
          point.deviceModel && point.deviceModel.toLowerCase().includes(text)
        ) {
          points.push(point);
        }
    }
    this.searchOptions = points;
    if (this.searchOptions.length) {
      this.showSearchRes = true;
    }
  }
  showPoint(id) {
    this.showSearchRes = false;
    // 定位
    let point = this.findPoint(id);
    if (point) {
      this.setCenter(point);
    }
  }
  findPoint(id) {
    for (let i = 0; i < this.allPoints.length; i++) {
      let point = this.allPoints[i];
      if (point.deviceId === id) {
        return [point.longitude, point.latitude];
      }
    }
  }
  back() {
    this.params = {
      deviceIds: this.ids,
      deviceGroupIds: this.groupIds,
    };
    this.clearLine();
    this.isLine = false;
    this.showDevicePositions();
  }

  // ---- 操作日期控件的方法 start----
  startValueChange() {
    if (this.startDate > this.endDate) {
      this.endDate = null;
    }
  }

  disabledStartDate(startValue) {
    if (!startValue || !this.endDate) {
      return false;
    }
  }

  endValueChange() {
    if (this.startDate > this.endDate) {
      this.startDate = null;
    }
  }

  disabledEndDate(endValue) {
    if (!endValue || !this.startDate) {
      return false;
    }
  }
  // ---- 操作日期控件的方法 end----
}
