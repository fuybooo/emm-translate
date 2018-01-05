import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {LoginMainComponent} from "./login-main.component";
import {LoginResetPasswordComponent} from "./login-reset-password.component";
import {LoginService} from "./login.service";
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '', component: LoginMainComponent, children: [
        {path: '', component: LoginComponent},
        {path: 'activate/:sign/:username/:timestamp/:incId/:pwdPolicy', component: LoginResetPasswordComponent, data: {title: '激活用户'}},
        {path: 'resetPassword/:sign/:username/:timestamp/:incId/:resetType/:pwdPolicy',
          component: LoginResetPasswordComponent, data: {title: '重置密码'}},
      ]
    }])
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    LoginService
    ],
  declarations: [
    LoginMainComponent,
    LoginComponent,
    LoginResetPasswordComponent
  ]
})
export class LoginModule {
}
