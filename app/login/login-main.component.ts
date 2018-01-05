import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataService} from "../shared/service/data.service";
import {TranslateService} from "@ngx-translate/core";
declare let $: any;
@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html'
})
export class LoginMainComponent implements OnInit {
  type = 1;
  registerForm: FormGroup;
  loginForm: FormGroup;
  errorMsg = '';
  k = 0;

  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private translateService: TranslateService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.test();
    this.registerForm = this.fb.group({
      newPwd: [ null, [ Validators.required ] ],
      confirmPwd: [ null, [ Validators.required ] ]
    });
    this.loginForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ false ],
    });
  }
  login() {
    if (this.type === 2) {
      this.k ++;
      if (this.k === 1) {
        this.errorMsg = '您的帐号与密码不匹配，请重新输入';
      } else if (this.k === 2) {
        this.errorMsg = '您的帐户密码输入错误次数过多，已经被锁定，请点击“申请解锁”请求解锁，也可以等待5分钟后自动解锁！04:59';
      } else if (this.k === 3) {
        this.errorMsg = '您的帐户已被管理员锁定，请直接联系管理员！';
      } else if (this.k === 4) {
        this.k = 0;
        this.errorMsg = '';
      }
    }
    if (this.type === 1) {
      this.http.post(this.dataService.url.login, {
        userName: 'admin',
        // password: 'admina',
        password: 'adminA',
        incCode: 'undefined',
        verifyCode: 'undefined',
        status: 1,
        languageType: '简体中文',
      }).subscribe((res: any) => {
        if (res.code === 200 || res.code === '200') {
          this.router.navigate(['/app/dashboard']);
        }
      });
    }
  }
  getFormControl(name) {
    return this.registerForm.controls[name];
  }
  createAccount() {
    this.login();
  }
  doLogin() {
    this.login();
  }
  next() {
    ++this.type;
    if (this.type === 7) {
      this.type = 1;
    }
  }
  prev() {
    --this.type;
    if (this.type === 0) {
      this.type = 6;
    }
  }
  test() {
    let _this = this;
    $('body').on('keydown', function(e) {
      if (e.which === 39) {
        _this.next();
      }
    });
  }
}
