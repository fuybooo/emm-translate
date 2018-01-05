import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {TranslateService} from "@ngx-translate/core";

/**
 * 重写nzMessageService
 * 重写目的: 1.提供默认的国际化支持;2.提供一个默认的持续时间，2秒后提示自动消失
 */
@Injectable()
export class MessageService {
  option = {
    nzDuration: 3000
  };
  constructor(private messageService: NzMessageService,
              private translateService: TranslateService) {}
  loading(content: string, options: any = this.option) {
    this.create('info', content, options);
  }
  success(content: string, options: any = this.option) {
    this.create('success', content, options);
  }
  error(content: string, options: any = this.option) {
    this.create('error', content, options);
  }
  warning(content: string, options: any = this.option) {
    this.create('warning', content, options);
  }
  info(content: string, options: any = this.option) {
    this.create('info', content, options);
  }
  html(content: string, options: any = this.option) {
    this.create('html', content, options);
  }
  private create(method, content, options) {
    // 开发阶段使用中文
    this.messageService[method](content, options);
    // 开发多语言时替换为key
    // this.messageService[method](this.translateService.instant(content), options);
  }
}
