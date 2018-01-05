import {NgModule} from "@angular/core";
import {ApplicationComponent} from "./application.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import * as service from "./application.service";
import {ApplicationDetailComponent} from "./application-detail.component";
import {ApplicationPublishingTypeComponent} from "./component/application-publishing-type.component";
import {ApplicationListTableComponent} from "./component/application-list-table.component";
import {environment} from "../../environments/environment";

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationDetailComponent,
    ApplicationPublishingTypeComponent,
    ApplicationListTableComponent,
  ],
  entryComponents: [
    ApplicationPublishingTypeComponent,
    ApplicationListTableComponent
  ],
  providers: [
    service.ApplicationHttpService,
    {provide: 'ApplicationIconDefault', useValue: {
      android: environment.deployPath + '/assets/img/apk-store/android.png',
      ios: environment.deployPath + '/assets/img/apk-store/ios.png'
    }},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '', children:
        [
          {path: ':platform', component: ApplicationComponent, data: {title: '应用管理'}},
          {path: 'detail/:platform/:id', component: ApplicationDetailComponent, data: {title: '应用管理'}},
          // 默认跳转
          {path: '**', redirectTo: 'android', pathMatch: 'full'}
        ]
      }
    ])
  ]
})
export class ApplicationModule {}
