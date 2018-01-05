import {NgModule} from "@angular/core";
import {UserComponent} from "./user.component";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {UserContentComponent} from "./user/user-content.component";
import {UserDeptContentComponent} from "./user-dept/user-dept-content.component";
import {UserSummaryComponent} from "./user-summary.component";
import {UserListComponent} from "./user/user-list.component";
import {UserDetailComponent} from "./user/user-detail.component";
import {UserHttpService} from "./user.service";
import {UserGroupFormComponent} from "./user/user-group-form.component";
import {UserDeptListComponent} from "./user-dept/user-dept-list.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpInterceptorService} from "../shared/service/http-interceptor.service";
import {UserGroupComponent} from "./user/user-group.component";
import {UserFormComponent} from "./user/user-form.component";
import {JsonpModule} from "@angular/http";
import {UserMoveComponent} from "./user/user-move.component";
import {UserMoveDeptComponent} from "./user-dept/user-move-dept.component";

@NgModule({
  declarations: [
    UserComponent,
    UserSummaryComponent,
    UserGroupComponent,
    UserContentComponent,
    UserDeptContentComponent,
    UserListComponent,
    UserMoveComponent,
    UserMoveDeptComponent,
    UserDetailComponent,
    UserGroupFormComponent,
    UserDeptListComponent,
    UserFormComponent
  ],
  entryComponents: [
    UserDetailComponent,
    UserFormComponent,
    UserGroupFormComponent,
    UserMoveComponent,
    UserMoveDeptComponent
  ],
  providers: [
    UserHttpService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  imports: [
    JsonpModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '', component: UserComponent, children:
        [
          {path: 'user', component: UserContentComponent , data: {title: '用户'}},
          {path: 'department', component: UserDeptContentComponent , data: {title: '部门'}}
        ]
      },
    ])
  ]
})
export class UserModule {
}
