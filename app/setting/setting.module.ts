import {NgModule} from "@angular/core";
import {SettingComponent} from "./setting.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import * as service from './setting.service';
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SettingAdminComponent} from "./admin/setting-admin.component";
import {SettingClientComponent} from "./client/setting-client.component";
import {SettingEnterpriseComponent} from "./enterprise/setting-enterprise.component";
import {SettingTrusteeshipComponent} from "./trusteeship/setting-trusteeship.component";
import {SettingAdminType, SettingConnectorState, SettingEMMModel} from "./setting.pipe";
import {SettingClientModelComponent} from "./client/setting-client-model.component";
import {SettingHttpInterceptorService} from "./setting-http-interceptor.service";

@NgModule({
  declarations: [
    SettingComponent,
    SettingAdminComponent,
    SettingClientComponent,
    SettingEnterpriseComponent,
    SettingTrusteeshipComponent,
    SettingAdminType,
    SettingConnectorState,
    SettingEMMModel,
    SettingClientModelComponent,
  ],
  providers: [
    service.SettingHttpService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: SettingHttpInterceptorService, multi: true}
  ],
  entryComponents: [
    SettingClientModelComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(
      [
        {
          path: '', children:
          [
            // 管理员
            {path: 'admin', component: SettingAdminComponent, data: {title: '管理员'}},
            // 企业
            {path: 'enterprise', component: SettingEnterpriseComponent, data: {title: '企业信息配置'}},
            // 客户端
            {path: 'client', component: SettingClientComponent, data: {title: '客户端版本升级'}},
            // 托管认证
            {path: 'trusteeship', component: SettingTrusteeshipComponent, data: {title: '托管认证'}},
            // 默认跳转admin
            {path: '**', redirectTo: 'admin', pathMatch: 'full'}
          ]
        }
      ]
    )
  ]
})
export class SettingModule {}
