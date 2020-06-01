import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from 'src/app/model/LoginResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public async isAuth(): Promise<boolean> {
    const loginResponse: LoginResponse = this.getDataStorage();
    const keepAlive: string | null = localStorage.getItem('keep_alive')
    const logined: string | null = sessionStorage.getItem('logined')

    if (loginResponse.token === 'null') {
      return false
    }
    if (keepAlive !== 'true' && logined !== 'true') {
      return false
    }
    if (loginResponse.refreshable_until < Date.now()) {
      console.log('idle too long')
      return false
    }
    try {
      console.log('refresh')
      await this.refreshToken(loginResponse.token)
      return true;
    } catch{
      console.log('server error')
      return false
    }
  }

  public async login(account: string, password: string, keepAlive: boolean): Promise<void> {
    const loginResponse: LoginResponse = await this.http.post<LoginResponse>(
      'https://api-test.potentia.tech/api/login',
      {
        account,
        password
      }
    ).toPromise()

    this.saveDataStorage(loginResponse, keepAlive)
  }

  public async refreshToken(accessToken: string): Promise<void> {
    const refreshResponse: LoginResponse = await this.http.post<LoginResponse>(
      'https://api-test.potentia.tech/api/refresh',
      {},
      { headers: { 'X-Access-Token': accessToken } }
    ).toPromise()
    this.saveDataStorage(refreshResponse)
  }

  private saveDataStorage(loginResponse: LoginResponse, keepAlive?: boolean) {
    if (keepAlive === true) {
      localStorage.setItem('keep_alive', 'true');
    } else if (keepAlive === false) {
      localStorage.removeItem('keep_alive');
    }

    sessionStorage.setItem('logined', 'true');
    localStorage.setItem('access_token', loginResponse.token);
    localStorage.setItem('accessible_until', String(loginResponse.accessible_until));
    localStorage.setItem('refreshable_until', String(loginResponse.refreshable_until));
  }

  private getDataStorage(): LoginResponse {
    return {
      token: String(localStorage.getItem('access_token')),
      accessible_until: Number(localStorage.getItem('accessible_until')),
      refreshable_until: Number(localStorage.getItem('refreshable_until'))
    }
  }
}
