import {NgModule} from "@angular/core";
import {PushComponent} from "./push.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import * as service from "./push.service";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {PushNewComponent} from "./push-new.component";
@NgModule({
  declarations: [
    PushComponent,
    PushNewComponent
  ],
  providers: [
    service.PushHttpService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(
      [
        {
          path: '', children:
          [
            // {path: ':type', component: PushComponent, data: {title: '内容管理'}},
            {path: 'list', component: PushComponent, data: {title: '推送管理'}},
            {path: 'new/:id', component: PushNewComponent, data: {title: '推送管理'}},
            {path: '**', redirectTo: 'list', pathMatch: 'full'}
          ]
        }
      ]
    )
  ]
})
export class PushModule {
}
