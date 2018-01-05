import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NzModalSubject} from "ng-zorro-antd";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {DataService} from "../service/data.service";
import {PermissionService} from "../service/permission.service";

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html'
})
export class ModifyPasswordComponent implements OnInit {
  form: FormGroup;
  pwdPolicy: any = {};
  pwdPolicyStr = '';
  currentUser;
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
    this.currentUser = this.permissionService.getUser();
    this.form = this.fb.group({
      // username: '',
      username: this.currentUser.userName,
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
    this.http.get(this.dataService.url.login.pwd_policy, this.dataService.getWholeParams({userId: this.currentUser.userId}))
      .subscribe((res: any) => {
      this.pwdPolicy = res.data;
      this.pwdPolicyStr = `至少${this.pwdPolicy.minLength}位`;
        let str = '';
        if (this.pwdPolicy.upperCase) {
          str += '大写字母、';
        }
        if (this.pwdPolicy.lowerCase) {
          str += '小写字母、';
        }
        if (this.pwdPolicy.number) {
          str += '数字、';
        }
        if (this.pwdPolicy.specialCharacter) {
          str += '特殊字符、';
        }
        if (str !== '') {
          this.pwdPolicyStr += `,必须包含${this.pwdPolicyStr.slice(0, -1)}`;
        }
      this.getFormControl('newPassword').setValidators([Validators.required, this.passwordValidator(this.pwdPolicy)]);
      this.getFormControl('confirmPassword').setValidators([Validators.required, this.passwordValidator(this.pwdPolicy),
        this.confirmationPassword('newPassword')]);
    });
  }
  updateConfirmValidator() {
    setTimeout(() => {
      this.getFormControl('confirmPassword').updateValueAndValidity();
    }, 10);
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
  passwordValidator(pwdPolicy) {
    return function(control: FormControl) {
      if (control.value) {
        // 符合基本要求
        // 1.不能包含空格，不能包含汉字
        if (control.value.includes(' ') || /[\u4E00-\u9FA5]/.test(control.value)) {
          return {error: true, pwdPolicy: true};
        }
        if (control.value.length < pwdPolicy.minLength) {
          // 长度至少为pwdLength
          return {error: true, pwdPolicy: true};
        } else if (pwdPolicy.upperCase) {
          // 必须包含大写字母
          if (!/[A-Z]/.test(control.value)) {
            return {error: true, pwdPolicy: true};
          }
        } else if (pwdPolicy.lowerCase) {
          // 必须包含小写字母
          if (!/[a-z]/.test(control.value)) {
            return {error: true, pwdPolicy: true};
          }
        } else if (pwdPolicy.number) {
          // 必须包含数字
          if (!/[0-9]/.test(control.value)) {
            return {error: true, pwdPolicy: true};
          }
        } else if (pwdPolicy.specialCharacter) {
          // 必须包含特殊字符
          if (!/[!@#$%^&*]/.test(control.value)) {
            return {error: true, pwdPolicy: true};
          }
        }
      }
    };
  }
  handleCancel() {
    this.subject.destroy('onCancel');
  }
  submit() {
    this.subject.next({
      type: 'save',
      data: this.form.value
    });
  }
  getFormControl(name) {
    return this.form.controls[name];
  }
  test1() {
    console.log(this.getFormControl('oldPassword'));
    console.log(this.getFormControl('oldPassword').dirty);
    console.log(this.getFormControl('oldPassword').hasError('required'));
    console.log(this.getFormControl('oldPassword').dirty && this.getFormControl('oldPassword').hasError('required'));
  }
}
