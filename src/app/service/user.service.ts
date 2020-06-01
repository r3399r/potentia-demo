import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http: HttpClient;
  private readonly authService: AuthService

  constructor(http: HttpClient, authService: AuthService) {
    this.http = http;
    this.authService = authService;
  }

  public async getUser(): Promise<User> {
    await this.authService.refreshToken(String(localStorage.getItem('access_token')))
    return await this.http.get<User>(
      'https://api-test.potentia.tech/api/me',
      {
        headers: { 'X-Access-Token': String(localStorage.getItem('access_token')) }
      }
    ).toPromise()
  }
}
