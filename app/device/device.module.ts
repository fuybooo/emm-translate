import {NgModule} from "@angular/core";
import {DeviceComponent} from "./device.component";
import {RouterModule} from "@angular/router";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
// import {CanDeactivateGuard} from "../shared/guard/can-deactivate-guard.service";
import {DeviceFormComponent} from "./device/device-form.component";
import {DeviceMoveComponent} from "./device-move.component";

@NgModule({
  declarations: [
    DeviceComponent,
    DeviceFormComponent,
    DeviceMoveComponent
  ],
  entryComponents: [
    DeviceFormComponent,
    DeviceMoveComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: '', component: DeviceComponent, data: {title: 'device_management'}}
    ])  // canDeactivate: [CanDeactivateGuard]
  ],
  exports: [
  ]
})
export class DeviceModule {
}
