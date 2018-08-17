import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthData } from '../../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MessagesService } from '../messages.service';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable()
export class AuthService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private authFailedListener = new Subject();

  constructor(private http: HttpClient,
              private router: Router,
              private messagesService: MessagesService) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthFailedListener() {
    return this.authFailedListener.asObservable();
  }

  isAuthenticated() {
    return !!this.token;
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{ type: string, token: string }>(BACKEND_URL + 'login', authData)
      .subscribe(response => {
        if (response.type === 'success') {
          this.token = response.token;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      }, error => {
        this.authFailedListener.next();
        this.messagesService.pushMessage({
          content: 'Greška prilikom prijave! Pogrešan email i/ili lozinka.',
          type: 'danger'
        });
      });
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }

}
