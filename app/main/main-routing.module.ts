import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {NgModule} from "@angular/core";
import {AuthGuard} from "../shared/guard/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          {path: 'application', loadChildren: 'app/application/application.module#ApplicationModule'},
          {path: 'content', loadChildren: 'app/content/content.module#ContentModule'},
          {path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule'},
          {path: 'device', loadChildren: 'app/device/device.module#DeviceModule'},
          {path: 'policy', loadChildren: 'app/policy/policy.module#PolicyModule'},
          {path: 'push', loadChildren: 'app/push/push.module#PushModule'},
          {path: 'setting', loadChildren: 'app/setting/setting.module#SettingModule'},
          {path: 'user', loadChildren: 'app/user/user.module#UserModule'},
          {path: 'selfHelp', loadChildren: 'app/self-help/self-help.module#SelfHelpModule'},
          {path: 'logReport', loadChildren: 'app/log-report/log-report.module#LogReportModule'},
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule {
}
