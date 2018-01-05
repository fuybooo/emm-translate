import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {RouteService} from "./shared/service/route.service";
import {AppService} from "./app.service";
import {enUS, NzLocaleService, zhCN} from "ng-zorro-antd";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  lang;

  constructor(private translateService: TranslateService,
              private routeService: RouteService,
              private nzLocalService: NzLocaleService,
              private appService: AppService) {
    // 配置当前语言
    this.lang = this.appService.getLng();
  }

  ngOnInit() {
    // 设置语言
    this.translateService.addLangs([
      'zh',
      'en'
    ]);
    this.translateService.setDefaultLang(this.lang);
    this.translateService.use(this.lang);
    let local = zhCN;
    if (this.lang === 'zh') {
      local = zhCN;
    } else if (this.lang === 'en') {
      local = enUS;
    }
    this.nzLocalService.setLocale(local);
    // 监听路由
    this.routeService.watchRoute();
  }
}
