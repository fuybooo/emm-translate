import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SelfHelpComponent} from "./self-help.component";
@NgModule({
  declarations: [
    SelfHelpComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: SelfHelpComponent, data: {title: '自助服务'}}])
  ]
})
export class SelfHelpModule {}
