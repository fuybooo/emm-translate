import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgZorroAntdModule, NZ_LOCALE, NZ_MESSAGE_CONFIG, zhCN} from "ng-zorro-antd";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppComponent} from './app.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AppRoutingModule} from "./app-routing.module";
import {AuthService} from "./shared/service/auth.service";
import {AuthGuard} from "./shared/guard/auth-guard.service";
import {ModalService} from "./shared/service/modal.service";
import {MessageService} from "./shared/service/message.service";
import {CanDeactivateGuard} from "./shared/guard/can-deactivate-guard.service";
import {DeviceService} from "./device/device.service";
import {HttpInterceptorService} from "./shared/service/http-interceptor.service";
import {UtilService} from "./shared/util/util.service";
import {DataService} from "./shared/service/data.service";
import {RouteService} from "./shared/service/route.service";
import {environment} from "../environments/environment";
import {ValidatorService} from "./shared/service/validator.service";
import {MainService} from "./main/main.service";
import {LoginGuard} from "./shared/guard/login-guard.service";
import {PolicyService} from "./policy/policy.service";
import {JsonpModule} from "@angular/http";
import {PermissionService} from "./shared/service/permission.service";
import {AppSpinService} from "./shared/service/app-spin.service";
import {AppSpinComponent} from "./app-spin.component";
import {AppService} from "./app.service";

export function createTranslateHttpLoader(http: any) { // HttpClient
  return new TranslateHttpLoader(http, environment.deployPath + '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AppSpinComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    JsonpModule,
    NgZorroAntdModule.forRoot({extraFontName: 'anticon', extraFontUrl: environment.deployPath + '/assets/fonts/iconfont'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        deps: [HttpClient]
      }
    }),
    // AngularEchartsModule,
    AppRoutingModule
  ],
  providers: [
    {provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000, nzMaxStack: 1} },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: NZ_LOCALE, useValue: zhCN},
    AuthGuard,
    AuthService,
    LoginGuard,
    DataService,
    MessageService,
    ModalService,
    CanDeactivateGuard,
    DeviceService,
    UtilService,
    RouteService,
    ValidatorService,
    MainService,
    PolicyService,
    PermissionService,
    AppSpinService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
