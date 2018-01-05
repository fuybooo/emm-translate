import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../service/auth.service";
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}
  // route: 即将激活的路由; state: 即将到达的状态
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin(state.url);
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
  checkLogin(url: string): boolean {
    // 每次切换路由都向后台发送请求，判断是否已经登录。
    // if (this.authService.isLoggedIn) {
      return true;
    // }
    // this.authService.redirectUrl = url;
    // this.router.navigate(['/login']);
    // return false;
  }
}
