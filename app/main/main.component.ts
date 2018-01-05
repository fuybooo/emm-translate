import {Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {MenuData} from "./main.model";
import {RouteService} from "../shared/service/route.service";
import {PermissionService} from "../shared/service/permission.service";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {environment} from "../../environments/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {enUS, NzLocaleService, NzModalService, zhCN} from "ng-zorro-antd";
import {MessageService} from "../shared/service/message.service";
import {ModifyPasswordComponent} from "../shared/component/modify-password.component";
import {AppService} from "../app.service";
import {AppSpinService} from "../shared/service/app-spin.service";

declare let $: any;
export const langMap = {
  zh: '简体中文',
  en: 'English'
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, OnDestroy {
  private_version = environment.private_version;
  currentLangStr;
  currentUser;
  currentUserInfo;
  lng;
  defaultMenu: MenuData = {
    name: '仪表盘',
    code: 'dashboard',
    url: '/app/dashboard'
  };
  breadcrumb: any[] = [this.defaultMenu];
  menu: MenuData[] = [];
  isAdmin = true;
  subscript;
  logoUrl: any = 'url("assets/img/logo.png") no-repeat';
  passwordModal;
  subscript2;

  constructor(private router: Router,
              private permissionService: PermissionService,
              private http: HttpClient,
              private dataService: DataService,
              private domSanitizer: DomSanitizer,
              private nzModalService: NzModalService,
              private messageService: MessageService,
              private appService: AppService,
              private appSpinService: AppSpinService,
              private nzLocalService: NzLocaleService,
              private translateService: TranslateService,
              private routeService: RouteService) {
    this.lng = this.appService.getLng();
    this.currentLangStr = langMap[this.translateService.currentLang];
    this.currentUserInfo = this.permissionService.getSession(); // 用户的登录信息
    this.currentUser = this.permissionService.getUser(); // 用户的详细信息
    this.appSpinService.spin();
    // 判断用户是否为管理员
    if (this.currentUserInfo && this.currentUserInfo.currentIsAdmin) {
      this.initNav();
      this.resetMenu();
    }
    this.subscript = this.routeService.routerEmitter.subscribe((event) => {
      this.currentUserInfo = this.permissionService.getSession();
      if (!this.currentUserInfo) {
        this.appSpinService.spin(false);
        this.router.navigate(['/login']);
        return;
      }
      // else if (!this.currentUserInfo.isAdmin || !this.currentUserInfo.currentIsAdmin) {
      //   this.appSpinService.spin(false);
      //   this.router.navigate(['/app/selfHelp']);
      //   return;
      // }
      this.appSpinService.spin(false);
      if (this.currentUserInfo && this.currentUserInfo.currentIsAdmin) {
        this.changeMenu(1);
        this.clickCurrentMenu();
        if (event) {
          this.changeMenu(2, event.root.url);
          this.breadcrumb.push(event.last);
        }
      }
    });
  }

  ngOnInit() {
    this.initLogo();
    this.subscript2 = this.appService.logoChangeEvent.subscribe(() => {
      this.initLogo();
    });
  }
  ngOnDestroy() {
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
    if (this.subscript2) {
      this.subscript2.unsubscribe();
    }
  }

  initNav() {
    this.menu = [
      {
        name: '仪表盘',
        code: 'dashboard',
        url: '/app/dashboard'
      },
      {
        name: '设备管理',
        code: 'device_management',
        url: '/app/device'
      },
      {
        name: '用户管理',
        code: 'user_management',
        isParent: true,
        children: [
          {
            name: '用户',
            code: 'user_list',
            url: '/app/user/user'
          },
          {
            name: '部门',
            code: 'department',
            url: '/app/user/department'
          }
        ]
      },
      {
        name: '应用管理',
        code: 'application_management',
        url: '/app/application'
      },
      {
        name: '策略管理',
        code: 'policy_management',
        isParent: true,
        children: [
          {
            name: '安全策略',
            code: 'policy_security',
            url: '/app/policy/security',
          },
          {
            name: '设备策略',
            code: 'policy_device',
            url: '/app/policy/device'
          },
          {
            name: '设备配置',
            code: 'policy_deviceConfig',
            url: '/app/policy/deviceConfig'
          },
          {
            name: '围栏设置',
            code: 'policy_enclosure',
            url: '/app/policy/fencing'
          },
          {
            name: '违规策略',
            code: 'policy_violation',
            url: '/app/policy/violation'
          },
          {
            name: '安全桌面',
            code: 'policy_launcher',
            url: '/app/policy/securityDesk',
            suffix: 'icon-allicon-90 c-12'
          },
          {
            name: '单一应用',
            code: 'policy_app',
            url: '/app/policy/simpleDesk',
            suffix: 'icon-allicon-91 c-11'
          },
          {
            name: '违规网址',
            code: 'policy_url',
            url: '/app/policy/url',
            suffix: this.lng === 'zh' ? 'icon-allicon-118' : 'icon-allicon-117',
            advanced: true
          },
          {
            name: '敏感词',
            code: 'policy_sensitiveWord',
            url: '/app/policy/sensitiveWord',
            suffix: this.lng === 'zh' ? 'icon-allicon-118' : 'icon-allicon-117',
            advanced: true
          },
        ]
      },
      {
        name: '内容管理',
        code: 'content_management',
        url: '/app/content'
      },
      {
        name: '推送管理',
        code: 'push_management',
        url: '/app/push'
      },
      {
        name: '日志报表',
        code: '日志报表',
        isParent: true,
        children: [
          {
            name: '日志',
            code: 'log',
            url: '/app/logReport/log'
          },
          {
            name: '报表',
            code: 'report',
            url: '/app/logReport/report'
          },
        ]
      },
      {
        name: '设置',
        code: 'setting',
        isParent: true,
        children: [
          {
            name: '管理员',
            code: 'setting_admin',
            url: '/app/setting/admin'
          },
          {
            name: '企业信息配置',
            code: 'setting_enterprise',
            url: '/app/setting/enterprise'
          },
          {
            name: '客户端版本升级',
            code: 'setting_client',
            url: '/app/setting/client'
          },
          {
            name: '托管认证',
            code: 'setting_trusteeship',
            url: '/app/setting/trusteeship'
          }
        ]
      },
    ];
    if (this.private_version === 1) {
      // 隐藏推送和策略中的单一应用
      this.deleteMenu(['policy_app', 'push_management']);
    }
    if (this.currentUserInfo.permission === 'add_edit102' || this.currentUserInfo.permission === 'add_edit103') {
      // 部门管理员 隐藏应用和策略
      this.deleteMenu(['application_management', 'policy_management']);
    }
  }

  deleteMenu(menuCode: string[]) {
    for (let code of menuCode) {
      for (let i = 0; i < this.menu.length; i++) {
        let m = this.menu[i];
        if (m.code === code) {
          this.menu.splice(i, 1);
          i--;
        } else if (m.children) {
          for (let j = 0; j < m.children.length; j++) {
            let _m = m.children[j];
            if (_m.code === code) {
              m.children.splice(j, 1);
              j--;
            }
          }
        }
      }
    }
  }

  initLogo() {
    this.http.get(this.dataService.url.setting.getLogoAddress).subscribe((res: any) => {
      this.logoUrl = this.domSanitizer.bypassSecurityTrustStyle('url("' +
        environment.staticPath + res.data.logoAddress + '") no-repeat center');
    });
  }

  toSelfHelp() {
    this.permissionService.saveSession(Object.assign(this.currentUserInfo, {currentIsAdmin: false}));
    this.router.navigate(['/app/selfHelp']);
  }

  toAdmin() {
    this.permissionService.saveSession(Object.assign(this.currentUserInfo, {currentIsAdmin: true}));
    this.router.navigate(['/app/dashboard']);
  }

  changeRouter(m = this.defaultMenu) {
    // debugger // 测试二级菜单的断点
    let url;
    if (m.isParent) {
      url = m.children[0].url;
    } else {
      url = m.url;
    }
    // 导航成功之后重设菜单样式
    this.appSpinService.spin();
    this.router.navigate([url]).then(val => {
      this.appSpinService.spin(false);
      // 路由失败后选中状态应该停留在当前菜单
      // if (!val) {
      //   this.clickCurrentMenu();
      // }
      // 路由成功后设置面包屑导航栏
    });
    // 阻止事件传播
    return false;
  }

  clickCurrentMenu() {
    // 模拟点击一下菜单
    let currentMenu = this.changeMenu(2, this.router.routerState.snapshot.url);
    if (currentMenu) {
      let currentLi = $('#main-menu-' + currentMenu.code);
      if (!currentLi.hasClass('ant-menu-submenu-selected') && !currentLi.hasClass('ant-menu-item-selected')) {
        currentLi.click(); // 激活菜单的样式，不会做路由跳转
      }
    }
  }

  /**
   * 根据不同类型的条件查找菜单对象
   * @param type 1：找到isActive属性为true的,将其设置为false；2：找到url与参数相同的，将对应的相关菜单设置为激活，返回对应的子菜单；
   * @param url type 为2时，根据url的值查找menu
   */
  changeMenu(type, url?) {
    for (let m of this.menu) {
      if (m && m.children) {
        for (let _m of m.children) {
          if (type === 1) {
            if (_m && _m.isActive) {
              _m.isActive = false;
              m.isActive = false;
              return;
            }
          } else if (type === 2) {
            if (_m && _m.url === url) {
              _m.isActive = true;
              m.isActive = true;
              // todo 此处的name在国际化需求下需要改为code，并将code对应的值在json文件中进行翻译
              this.breadcrumb = [
                m,
                _m
              ];
              return _m;
            }
          }
        }
      } else {
        if (type === 1) {
          if (m && m.isActive) {
            m.isActive = false;
            return;
          }
        } else if (type === 2) {
          if (m && url.includes(m.url)) {
            m.isActive = true;
            if (m.code === 'dashboard') {
              this.breadcrumb = [];
            } else {
              this.breadcrumb = [m];
            }
            return m;
          }
        }
      }
    }
  }

  resetMenu(current?: string) {
    let currentRouter = this.router.routerState.snapshot.url;
    if (!current) {
      if (currentRouter) {
        current = currentRouter;
      } else {
        current = this.defaultMenu.url;
      }
    }
    // this.clearMenu();
    this.changeMenu(1);
    this.changeMenu(2, current);
  }

  logout() {
    this.permissionService.clearSession();
    this.http.post(this.dataService.url.login.logout, {}).subscribe((res: any) => {
    });
    this.router.navigate(['/login']);
  }

  changeLang(lang: string) {
    this.appService.setLng(lang);
    this.translateService.use(lang);
    this.currentLangStr = langMap[lang];
    let local = zhCN;
    if (lang === 'zh') {
      local = zhCN;
    } else if (lang === 'en') {
      local = enUS;
    }
    this.nzLocalService.setLocale(local);
    window.location.reload();
  }

  modifyPassword() {
    this.passwordModal = this.nzModalService.open({
      title: '修改密码',
      content: ModifyPasswordComponent,
      footer: false
    });
    this.passwordModal.subscribe((res: any) => {
      if (res.type === 'save') {
        this.http.post(this.dataService.url.login.reset_pwd, res.data).subscribe((response: any) => {
          if (response.code === '200') {
            this.messageService.success('密码修改成功！');
            this.passwordModal.destroy();
          } else if (response.code === 'USER100015') {
            this.messageService.error('用户不存在！');
          } else if (response.code === 'USER100016') {
            this.messageService.error('旧密码输入有误！');
          } else if (response.code === 'PARAM200002') {
            this.messageService.error('新密码不能为空！');
          } else if (response.code === 'USER100021') {
            this.messageService.error('AD或LDAP用户不能修改密码！');
          } else {
            this.messageService.error('密码修改失败！');
          }
        });
      }
    });
  }
}
