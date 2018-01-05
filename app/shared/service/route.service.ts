import {Injectable, EventEmitter} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import {PolicyService} from "../../policy/policy.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class RouteService {
  routerEmitter = new EventEmitter();

  constructor(private translateService: TranslateService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private policyService: PolicyService,
              private titleService: Title) {
  }

  watchRoute() {
    // 监听路由变化
    (((((this.router.events
      .filter(event => event instanceof NavigationEnd) as Observable<any>)
      .map(() => this.activatedRoute)) as Observable<any>)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }) as Observable<any>)
      .filter(route => route.outlet === 'primary') as Observable<any>)
      .subscribe((route) => {
        // 设置页面标题
        this.titleService.setTitle(this.translateService.instant(route.snapshot.data['title']));
        // 根据路由路径设置面包导航栏的内容
        let _event;
        if (route.snapshot.url[0] && route.snapshot.url[0].path === 'operate') {
          let textMap = {
            add: '添加',
            edit: '修改'
          };
          let rootPath = '';
          let policyType = route.snapshot.params.policyType;
          if (policyType === 'devPolicy') {
            rootPath = 'device';
          } else if (policyType === 'devConfig') {
            rootPath = 'deviceConfig';
          } else if (policyType === 'fencing') {
            rootPath = 'fencing';
          } else if (policyType === 'securityDesk') {
            rootPath = 'securityDesk';
          } else if (policyType === 'simpleDesk') {
            rootPath = 'simpleDesk';
          }
          _event = {
            root: {url: '/app/policy/' + rootPath},
            last: {
              name: `${textMap[route.snapshot.params.operate]}${route.snapshot.params.system}策略`,
              code: `add_policy_device_android`,
            }
          };
        } else {
          // this.policyService.currentSystem = 'Android';
          // 在从operate界面跳转到策略界面时需要保持原来的系统，在其他情况下切换需要初始化为Android
          if (this.policyService.initSystem) {
            this.policyService.currentSystem = 'Android';
            if (route.snapshot.url[0] && route.snapshot.url[0].path === 'simpleDesk') {
              this.policyService.currentSystem = 'iOS';
            }
          } else {
            this.policyService.initSystem = true;
          }
        }
        if (route.snapshot.url[0] && route.snapshot.url[0].path === 'detail') {
          _event = {
            root: {url: '/app/application'},
            last: {
              name: `应用详情`,
              code: `application_detail`,
            }
          };
        }
        this.routerEmitter.emit(_event);
      });
  }

}
