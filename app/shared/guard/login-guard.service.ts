import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}
  // route: 即将激活的路由; state: 即将到达的状态
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true;
  }
}
