import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {NzModalService, NzModalSubject} from "ng-zorro-antd";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {DataService} from "../service/data.service";
import {UtilService} from "../util/util.service";
import {environment} from "../../../environments/environment";

declare let $: any;
declare let videojs: any;

@Component({
  selector: 'app-device-remote',
  templateUrl: './device-remote.component.html'
})
export class DeviceRemoteComponent implements OnInit, OnDestroy {
  @Input() deviceId;
  @Input() screenWidth;
  @Input() screenHeight;
  defaultVideoWidth = 210;
  defaultVideoHeight = 370;
  videoWidth = 0;
  videoHeight = 0;
  containerWidth = 210;
  containerHeight = 370;
  gapTop = 0;
  gapLeft = 0;
  rate = 1;
  // videoWidth = '270px';
  // videoHeight = '480px';
  connectId;
  rmtp;
  timer;
  minWidth = 10; // 最小移动间距
  isLoading = true;
  list = [
    {
      name: 'HOME',
      dir: 'home',
      img: 'icon-allicon-106',
    },
    {
      name: '返回',
      dir: 'back',
      img: 'icon-allicon-63',
    },
    {
      name: '锁屏',
      dir: 'power',
      img: 'icon-allicon-108',
    },
    {
      name: '音量+',
      dir: 'volume+',
      img: 'icon-allicon-114',
    },
    {
      name: '音量-',
      dir: 'volume-',
      img: 'icon-allicon-115',
    }
  ];
  constructor(private subject: NzModalSubject,
              private nzModalService: NzModalService,
              private http: HttpClient,
              private dataService: DataService,
              private domSanitizer: DomSanitizer,
              private util: UtilService,
              ) {
  }

  ngOnInit() {
    if (this.deviceId) {
      // if (!this.screenWidth) {
      //   this.screenWidth = this.defaultVideoWidth;
      // }
      // if (!this.screenHeight) {
      //   this.screenHeight = this.defaultVideoHeight;
      // }
      // 自动适配屏幕大小 固定屏幕大小
      this.screenWidth = this.defaultVideoWidth;
      this.screenHeight = this.defaultVideoHeight;
      this.startRemoteControl();
    }
    this.subject.on('onDestroy', () => {
      clearInterval(this.timer);
      this.stopRemoteCtrl();
    });
  }
  ngOnDestroy() {
    videojs('device-remote-video').dispose();
  }
  startRemoteControl() {
    this.http.post(this.dataService.url.device.startRemoteCtrl, {deviceId: this.deviceId}).subscribe((res: any) => {
      if (res.code === '200') {
        this.connectId = res.data.connectId;
        this.rmtp = this.domSanitizer.bypassSecurityTrustUrl(res.data.url);
        this.initVideoContainer();
        // $('#device-remote-video')
        //   // .height(this.videoHeight)
        //   // .width(this.videoWidth)
        //   .css({
        //     top: this.top,
        //     left: this.left
        //   });
        this.play();
        this.remoteControl();
        this.updateRemoteCtrl();
      }
    });
  }
  initVideoContainer() {
    this.rate = (this.screenHeight / this.containerHeight) > (this.screenWidth / this.containerWidth) ?
      (this.screenHeight / this.containerHeight) : (this.screenWidth / this.containerWidth);
    this.videoWidth = this.screenWidth / this.rate;
    this.videoHeight = this.screenHeight / this.rate;
    this.gapTop = (this.containerHeight - this.videoHeight) / 2;
    this.gapLeft = (this.containerWidth - this.videoWidth) / 2;
  }
  getRealPosition(x, y) {
    return {
      x: (x - this.gapLeft) / this.videoWidth,
      y: (y - this.gapTop) / this.videoHeight,
    };
  }
  updateRemoteCtrl() {
    this.timer = setInterval(() => {
      this.http.post(this.dataService.url.device.updateRemoteCtrl, {connectId: this.connectId}).subscribe((res: any) => {});
    }, 60000);
  }
  play() {
    // this.isLoading = true;
    videojs.options.flash.swf = environment.deployPath + '/assets/vendor/VideoJS.swf';
    let _this = this;
    setTimeout(() => {
      videojs('device-remote-video').ready(function() {
        let player = videojs('device-remote-video');
        player.play();
        _this.isLoading = false;
      });
    }, 100);
  }
  remoteControl() {
    let mousedownX;
    let mousedownY;
    $('#device-video-mask').mousedown((e) => {
      mousedownX = e.offsetX;
      mousedownY = e.offsetY;
    });
    $('#device-video-mask').mouseup((e) => {
      if (mousedownX && mousedownY) {
        let toP = this.getRealPosition(e.offsetX, e.offsetY);
        if (toP.x >= 0 && toP.x <= 1 && toP.y >= 0 && toP.y <= 1) {
          if (Math.abs(e.offsetX - mousedownX) > this.minWidth || Math.abs(e.offsetY - mousedownY) > this.minWidth) {
            let fromP = this.getRealPosition(mousedownX, mousedownY);
            if (fromP.x >= 0 && fromP.x <= 1 && fromP.y >= 0 && fromP.y <= 1) {
              this.sendRpc('move', JSON.stringify({
                from: fromP,
                to: toP
              }));
            }
          } else {
            this.sendRpc('click', JSON.stringify({
              pos: toP
            }));
          }
        }
      }
    });
  }
  sendRpc(action, data?) {
    this.http.post(this.dataService.url.device.sendRpc, {
      connectId: this.connectId,
      action: action,
      data: data
    }).subscribe((res: any) => {});
  }

  stopRemoteCtrl() {
    this.http.post(this.dataService.url.device.stopRemoteCtrl, {connectId: this.connectId}).subscribe((res: any) => {});
  }
}
