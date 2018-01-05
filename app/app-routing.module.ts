import {RouterModule, Routes, PreloadAllModules} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginGuard} from "./shared/guard/login-guard.service";
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: 'app/login/login.module#LoginModule',
    data: {
      title: 'login'
    }
  },
  {
    path: 'app',
    loadChildren: 'app/main/main.module#MainModule'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/login'
  }
];
@NgModule({
  imports: [
    // 预加载所有模块，所以在首次访问应用时会很慢，但是进入应用之后再访问页面就会很快
    RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})
    // 不适用预加载策略，在首次访问应用时速度提升了，大概需要5秒，但是进入应用后首次访问单个模块时还是会有一点延迟
    // RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
