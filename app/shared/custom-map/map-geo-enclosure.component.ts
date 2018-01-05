import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";
declare let AMap: any;
@Component({
  selector: 'app-map-geo-enclosure',
  templateUrl: './map-geo-enclosure.component.html'
})
export class MapGeoEnclosureComponent implements OnInit {
  @Input() longitude;
  @Input() latitude;
  @Input() radius;
  map;
  editor: any = {};

  constructor(
    private subject: NzModalSubject
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
    this.updateEnclosure();
    this.map.on('click', (e) => {
      this.longitude = e.lnglat.getLng();
      this.latitude = e.lnglat.getLat();
      this.updateEnclosure();
    });
    let auto = new AMap.Autocomplete({
      input: "map-search-input"
    });
    let placeSearch = new AMap.PlaceSearch({
      map: this.map
    });
    AMap.event.addListener(auto, "select", (e) => {
      if (e.poi && e.poi.location) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
        this.map.setZoom(15);
        this.map.setCenter(e.poi.location);
        this.longitude = e.poi.location.lng;
        this.latitude = e.poi.location.lat;
        this.updateEnclosure();
      }
    });
  }

  updateEnclosure() {
    if (this.editor._circleEditor) {
      this.editor._circleEditor.close();
      this.editor._circle.hide();
      this.editor._circleEditor = {};
      this.editor._circle = {};
    }
    this.editor._circle = (() => {
      let circle = new AMap.Circle({
        center: [this.longitude || 116.39, this.latitude || 39.91], // 圆心位置
        radius: this.radius, // 半径
        strokeColor: "#F33", // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 3, // 线粗细度
        fillColor: "#ee2200", // 填充颜色
        fillOpacity: 0.35 // 填充透明度
      });
      circle.setMap(this.map);
      return circle;
    })();
    this.map.setFitView();
    this.editor._circleEditor = new AMap.CircleEditor(this.map, this.editor._circle);
    this.editor._circleEditor.open();
    this.editor._circleEditor.on("move", (e) => {
      this.longitude = e.lnglat.lng;
      this.latitude = e.lnglat.lat;
    });
    this.editor._circleEditor.on("adjust", (e) => {
      this.radius = e.radius;
    });
  }
  submit() {
    this.subject.next({
      type: 'ok',
      data: {
        longitude: this.longitude,
        latitude: this.latitude,
        radius: this.radius,
      }
    });
  }
  handleCancel() {
    this.subject.destroy();
  }
}
