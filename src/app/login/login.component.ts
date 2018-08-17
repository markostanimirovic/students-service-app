import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/guards/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading = false;
  loginForm: FormGroup;
  private authFailedSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required])
    });

    this.authFailedSubscription = this.authService.getAuthFailedListener()
      .subscribe(() => {
        this.loading = false;
      });
  }

  onSubmit() {
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  isEmptyEmail() {
    return this.loginForm.hasError('required', ['email'])
      && (this.loginForm.get('email').touched || this.loginForm.get('email').dirty);
  }

  isNotEmailValid() {
    return this.loginForm.hasError('email', ['email'])
      && !this.isEmptyEmail() && this.loginForm.get('email').touched;
  }

  isEmptyPassword() {
    return this.loginForm.hasError('required', ['password'])
      && (this.loginForm.get('password').touched || this.loginForm.get('password').dirty);
  }

  ngOnDestroy() {

  }

}
