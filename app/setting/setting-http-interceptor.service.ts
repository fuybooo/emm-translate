import {Injectable} from '@angular/core';
import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {MessageService} from "../shared/service/message.service";
import {TranslateService} from "@ngx-translate/core";
import {NzMessageService} from "ng-zorro-antd";

@Injectable()
export class SettingHttpInterceptorService implements HttpInterceptor {


  constructor(private router: Router,
              private messageService: NzMessageService,
              private translateService: TranslateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let message = new MessageService(this.messageService, this.translateService);
    return next
    // 调用下一个拦截器
      .handle(req)
      .do(
        // 响应成功拦截：200 （处理响应）
        (res: HttpResponse<any>) => {
          /*-------------start: 响应拦截 (统一处理响应结果)-------------------------*/
          if (res.body && res.body.code) {
            switch (res.body.code) {
              case 'SETEMMLOWER5000113':
                message.error('版本过低,无法设置为默认版本');
                break;
            }
          }
          /*-------------end: 响应处理完成-------------------------*/
        },
        // 响应异常拦截
        (error: HttpErrorResponse) => {
          if (error.status === 403) {
            // 定义: 403为未登录状态, 跳转登录
            this.router.navigate(['/login']);
          } else if (environment.env === 'dev') {
            // 开发环境下提示服务器异常
            window.alert("服务端异常（此提示仅存在于开发阶段：environment.env === 'dev'）:详情参见日志（console）");
          }
        }
      );
  }
}

