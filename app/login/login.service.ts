import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../shared/service/data.service";
import {PermissionService} from "../shared/service/permission.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
@Injectable()
export class LoginService {
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private permissionService: PermissionService,
    private translateService: TranslateService,
    private router: Router,
  ) {}
  doLogin(params, callback) {
    this.http.post(this.dataService.url.login.login, params).subscribe((res: any) => {
      this.doneLogin(res);
      callback(res);
    });
  }
  doneLogin(res) {
    if (res.code === '200') {
      this.http.get(this.dataService.url.user.getUserById, this.dataService.getWholeParams({userId: res.data.userId}))
        .subscribe((response: any) => {
          this.permissionService.saveSession(res.data, response.data);
          if (res.data.isAdmin) {
            this.router.navigate(['/app/dashboard']);
          } else {
            // 用户不是管理员
            this.router.navigate(['/app/selfHelp']);
          }
        });
    }
  }
}
