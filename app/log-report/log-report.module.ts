import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {LogReportComponent} from "./log-report.component";
import {ReportComponent} from "./report.component";
import {LogComponent} from "./log.component";
@NgModule({
  declarations: [
    LogReportComponent,
    LogComponent,
    ReportComponent
  ],
  entryComponents: [
    LogComponent,
    ReportComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: LogReportComponent, children:
          [
            {path: 'log', component: LogComponent, data: {title: '日志'}},
            {path: 'report', component: ReportComponent, data: {title: '报表'}},
          ]
      }])
  ]
})
export class LogReportModule {}
