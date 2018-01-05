import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataService} from "../shared/service/data.service";
import {UtilService} from "../shared/util/util.service";
import {MessageService} from "../shared/service/message.service";
import {environment} from "../../environments/environment";
import {PermissionService} from "../shared/service/permission.service";
import {LoginService} from "./login.service";
import {AppService} from "../app.service";
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  sendEmailForm: FormGroup;
  errorMsg = '';
  isLock = false;
  unlockLeftTimeStr = '';
  unlockLeftTime = 0;
  step = 1;
  vcodeUrl = environment.path + '/verifyCode';
  timer;
  disableUnlock = false;
  sendEmailFn;
  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private translateService: TranslateService,
              private dataService: DataService,
              private messageService: MessageService,
              private appService: AppService,
              private util: UtilService,
              private loginService: LoginService,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [ '', [ Validators.required ] ],
      password: [ '', [ Validators.required ] ],
      remember: [ false ],
    });
    this.sendEmailForm = this.fb.group({
      username: [ '', [ Validators.required ] ],
      vcode: [ '', [ Validators.required ] ],
      agreeProtocol: [ true, [ Validators.required ] ],
    });
    setTimeout(() => $('#input-username input').focus(), 100);
    this.refreshVcode();
    this.sendEmailFn = this.util.onceFun(this.doSendEmail, this);
  }
  login() {
    this.loginService.doLogin({
      username: this.getFormControl('username').value,
      password: this.getFormControl('password').value,
      lng: this.appService.getLng()
    }, ((res: any) => {
      this.isLock = false;
      // 此处只处理错误的情况
      if (res.code === 'USER100011') {
        this.errorMsg = '您的帐户未激活，请直接联系管理员！';
      } else if (res.code === 'USER100012') {
        this.errorMsg = '您的帐户已被管理员锁定，请直接联系管理员！';
      } else if (res.code === 'USER100013') {
        this.errorMsg = '';
        this.isLock = true;
        this.unlockLeftTimeStr = this.util.getLeftTime(res.data.unlockLeftTime);
        this.unlockLeftTime = res.data.unlockLeftTime;
        this.startTimeInterval();
      } else if (res.code === 'USER100014') {
        this.errorMsg = '您的帐户已停用，请直接联系管理员！';
      } else if (res.code === 'USER100015') {
        this.errorMsg = '您的帐户不存在。';
      } else if (res.code === 'USER100016') {
        this.errorMsg = '您的帐户与密码不匹配，请重新输入。';
      } else if (res.code === 'USER100017') {
        // todo 如何设置新密码
        this.errorMsg = '您的帐户密码已经过期，请设置新密码。';
      }
    }));
  }
  getFormControl(name) {
    return this.loginForm.controls[name];
  }
  doLogin() {
    if (this.loginForm.valid) {
      this.login();
    }
  }
  doSendEmail() {
    if (this.sendEmailForm.valid) {
      if (this.sendEmailForm.controls['agreeProtocol'].value) {
        this.http.post(this.dataService.url.login.sendEmail, {
          username: this.sendEmailForm.controls['username'].value,
          captcha: this.sendEmailForm.controls['vcode'].value,
          lng: this.appService.getLng()
        }).debounceTime(1000).subscribe((res: any) => {
          setTimeout(() => {
            this.sendEmailFn = this.util.onceFun(this.doSendEmail, this);
          }, 1000);
          this.refreshVcode();
          if (res.code === '200') {
            this.step = 3;
          } else if (res.code === 'USER100015') {
            this.messageService.error('用户名不存在！');
          } else if (res.code === 'CAPTCHA200002') {
            this.messageService.error('验证码错误！');
          } else if (res.code === 'USER100011') {
            this.messageService.error('用户状态未激活！');
          } else if (res.code === 'USER100012') {
            this.messageService.error('用户被管理员锁定！');
          } else if (res.code === 'USER100013') {
            this.messageService.error('用户密码错误次数过多，已被锁定！');
          } else if (res.code === 'USER100014') {
            this.messageService.error('用户已停用！');
          }
        });
      } else {
        this.messageService.error('请阅读并同意《云创远景网络协议》！');
      }
    }
  }
  onClickSendEmail() {
    this.sendEmailFn();
  }

  /**
   * todo 申请解锁
   */
  toUnlock() {
    this.disableUnlock = true;
    this.http.post(this.dataService.url.login.sendUnlockEmail, {
      username: this.getFormControl('username').value,
      lng: this.appService.getLng()
    }).subscribe((res: any) => {
      this.disableUnlock = false;
      if (res.code === '200') {
        this.step = 3;
      } else if (res.code === 'USER100015') {
        this.messageService.error('用户名不存在！');
      } else if (res.code === 'USER100002') {
        this.messageService.error('用户当前状态不是密码输入次数过多造成的锁定！');
      } else if (res.code === 'USER100021') {
        this.messageService.error('AD、LDAP用户不能修改密码！');
      }
    });
  }
  startTimeInterval() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      if (this.unlockLeftTime > 1000) {
        this.unlockLeftTime = this.unlockLeftTime - 1000;
        this.unlockLeftTimeStr = this.util.getLeftTime(this.unlockLeftTime);
      } else {
        clearInterval(this.timer);
        this.isLock = false;
      }
    }, 1000);
  }
  refreshVcode() {
    this.vcodeUrl = environment.path + '/verifyCode?' + Math.random();
  }
  forgetPassword() {
    this.step = 2;
    setTimeout(() => $('#forget-username-input input').focus(), 100);
  }
  switchLogin() {
    this.step = 1;
    setTimeout(() => $('#input-username input').focus(), 100);
  }
}
