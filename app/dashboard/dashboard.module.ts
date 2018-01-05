import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
@NgModule({
  declarations: [
    DashboardComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: DashboardComponent, data: {title: 'dashboard'}}])
  ]
})
export class DashboardModule {}
