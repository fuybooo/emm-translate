import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataService} from "../shared/service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "../shared/service/message.service";
import {LoginService} from "./login.service";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-login-reset-password',
  templateUrl: './login-reset-password.component.html'
})
export class LoginResetPasswordComponent implements OnInit {
  step = 1;
  resetForm: FormGroup;
  routeParams;
  pwdPolicyArray;
  pwdLength;
  pwdRequireStr = '';
  pageType = 1;
  disableSubmit = false;

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private translateService: TranslateService,
              private loginService: LoginService,
              private dataService: DataService) {
  }

  ngOnInit() {
    // 获取参数
    this.routeParams = this.route.snapshot.params;
    if (this.route.snapshot.url[0].path === 'resetPassword') {
      this.pageType = 2;
    } else if (this.route.snapshot.url[0].path === 'activate') {
      this.pageType = 1;
    }
    this.pwdPolicyArray = this.routeParams.pwdPolicy.split('_');
    this.pwdLength = this.pwdPolicyArray[0];
    let str = '';
    if (this.pwdPolicyArray[1] === '1') {
      str += '大写字母、';
    }
    if (this.pwdPolicyArray[2] === '1') {
      str += '小写字母、';
    }
    if (this.pwdPolicyArray[3] === '1') {
      str += '数字、';
    }
    if (this.pwdPolicyArray[4] === '1') {
      str += '特殊字符、';
    }
    if (str !== '') {
      this.pwdRequireStr = '必须包含' + str.slice(0, -1) + '，';
    }
    this.resetForm = this.fb.group({
      newPwd: [null],
      confirmPwd: [null]
    });
    this.getFormControl('newPwd').setValidators([Validators.required, this.passwordValidator(this.pwdPolicyArray)]);
    this.getFormControl('confirmPwd').setValidators([Validators.required, this.passwordValidator(this.pwdPolicyArray),
      this.confirmationPassword('newPwd')]);
  }
  updateConfirmValidator() {
    setTimeout(() => {
      this.getFormControl('confirmPwd').updateValueAndValidity();
    }, 10);
  }
  getFormControl(name) {
    return this.resetForm.controls[name];
  }
  confirmationPassword(anotherControlName) {
    let _this = this;
    return function(control: FormControl) {
      let anotherControl = _this.getFormControl(anotherControlName);
      if (control.value !== '' && anotherControl.value !== '') {
        if (control.value !== anotherControl.value) {
          return {error: true, confirm: true};
        }
      }
    };
  }
  passwordValidator(pwdPolicyArray) {
    return function(control: FormControl) {
      let result = null;
      if (control.value) {
        // 符合基本要求
        // 1.不能包含空格，不能包含汉字
        if (control.value.includes(' ') || /[\u4E00-\u9FA5]/.test(control.value)) {
          result = {error: true, pwdPolicy: true};
        }
        if (control.value.length < + pwdPolicyArray[0]) {
          // 长度至少为pwdLength
          result = {error: true, pwdPolicy: true};
        }
        if (pwdPolicyArray[1] === '1') {
          // 必须包含大写字母
          if (!/[A-Z]/.test(control.value)) {
            result = {error: true, pwdPolicy: true};
          }
        }
        if (pwdPolicyArray[2] === '1') {
          // 必须包含小写字母
          if (!/[a-z]/.test(control.value)) {
            result = {error: true, pwdPolicy: true};
          }
        }
        if (pwdPolicyArray[3] === '1') {
          // 必须包含数字
          if (!/[0-9]/.test(control.value)) {
            result = {error: true, pwdPolicy: true};
          }
        }
        if (pwdPolicyArray[4] === '1') {
          // 必须包含特殊字符
          if (!/[!@#$%^&*]/.test(control.value)) {
            result = {error: true, pwdPolicy: true};
          }
        }
      }
      return result;
    };
  }

  submit() {
    this.disableSubmit = true;
    if (this.pageType === 1) {
      this.http.post(this.dataService.url.login.activate, {
        username: this.routeParams.username,
        password: this.getFormControl('newPwd').value,
        timestamp: this.routeParams.timestamp,
        incId: this.routeParams.incId,
        sign: this.routeParams.sign,
      }).subscribe((res: any) => {
        this.disableSubmit = false;
        if (res.code === '200') {
          // 弹出密码重置成功
          this.step = 2;
        } else if (res.code === 'PARAM200002') {
          // 用户不存在
          this.messageService.error('密码不能为空');
        }  else if (res.code === 'USER100005') {
          // 用户重置密码URL链接失效
          this.messageService.error('用户重置密码URL链接失效');
        } else if (res.code === 'USER100002') {
          // 用户状态转换失败
          this.messageService.error('用户状态转换失败');
        } else if (res.code === 'USER100004') {
          // 用户状态转换失败
          this.messageService.error('签名验证失效');
        }
      });
    } else if (this.pageType === 2) {
      if (this.resetForm.valid) {
        this.http.post(this.dataService.url.login.reset_password, {
          username: this.routeParams.username,
          password: this.getFormControl('newPwd').value,
          timestamp: this.routeParams.timestamp,
          incId: this.routeParams.incId,
          sign: this.routeParams.sign,
          resetType: this.routeParams.resetType,
          pwdPolicy: this.routeParams.pwdPolicy,
        }).subscribe((res: any) => {
          this.disableSubmit = false;
          if (res.code === '200') {
            // 弹出密码重置成功
            this.step = 2;
          } else if (res.code === 'USER100015') {
            // 用户不存在
            this.messageService.error('用户不存在');
          }  else if (res.code === 'USER100019') {
            // 用户重置密码URL链接失效
            this.messageService.error('用户重置密码URL链接失效');
          } else if (res.code === 'USER100002') {
            // 用户状态转换失败
            this.messageService.error('用户状态转换失败');
          }
        });
      }
    }
  }
  doLogin() {
    this.loginService.doLogin({
      username: this.routeParams.username,
      password: this.getFormControl('newPwd').value,
      lng: 'zh'
    }, (res: any) => {
      if (res.code !== '200') {
        let errorMsg = '';
        if (res.code === 'USER100011') {
          errorMsg = '您的帐户未激活，请直接联系管理员！';
        } else if (res.code === 'USER100012') {
          errorMsg = '您的帐户已被管理员锁定，请直接联系管理员！';
        } else if (res.code === 'USER100014') {
          errorMsg = '您的帐户已停用，请直接联系管理员！';
        } else if (res.code === 'USER100017') {
          // todo 如何设置新密码
          errorMsg = '您的帐户密码已经过期，请设置新密码。';
        }
        this.messageService.error(errorMsg);
      }
    });
  }
}
