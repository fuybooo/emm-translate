import {NgModule} from "@angular/core";
import {MainComponent} from "./main.component";
import {MainRoutingModule} from "./main-routing.module";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
@NgModule({
  declarations: [
    MainComponent,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}],
  imports: [
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule {}
