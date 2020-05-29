import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from 'src/app/model/LoginResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient;
  private keepAlive: string | null

  constructor(http: HttpClient) {
    this.http = http;
    this.keepAlive = localStorage.getItem('keep_alive')
  }

  public async isAuth(): Promise<boolean> {

    const loginResponse: LoginResponse = this.getDataStorage();
    // const accessToken: string | null = sessionStorage.getItem('access_token')
    // const refreshableUntil: number = Number(sessionStorage.getItem('refreshable_until'))

    if (loginResponse.token === '') {
      console.log('null storage')
      return false
    }
    if (loginResponse.refreshable_until < Date.now()) {
      console.log('cannot refresh')
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
    // this.useLocalStorage = checked
    const loginResponse: LoginResponse = await this.http.post<LoginResponse>(
      'https://api-test.potentia.tech/api/login',
      {
        account,
        password
      }
    ).toPromise()

    this.saveDataStorage(loginResponse, keepAlive)
  }

  private async refreshToken(accessToken: string): Promise<any> {
    const refreshResponse: LoginResponse = await this.http.post<LoginResponse>(
      'https://api-test.potentia.tech/api/refresh',
      {},
      { headers: { 'X-Access-Token': accessToken } }
    ).toPromise()
    this.saveDataStorage(refreshResponse)
  }

  private saveDataStorage(loginResponse: LoginResponse, keepAlive?: boolean) {
    if (keepAlive === true) {
      localStorage.setItem('keep_alive', '1');
    } else if (keepAlive === false) {
      localStorage.removeItem('keep_alive');
    }

    localStorage.setItem('access_token', loginResponse.token);
    localStorage.setItem('accessible_until', String(loginResponse.accessible_until));
    localStorage.setItem('refreshable_until', String(loginResponse.refreshable_until));
    //   } else {
    //   sessionStorage.setItem('access_token', loginResponse.token);
    //   sessionStorage.setItem('accessible_until', String(loginResponse.accessible_until));
    //   sessionStorage.setItem('refreshable_until', String(loginResponse.refreshable_until));
    // }
  }

  private getDataStorage(): LoginResponse {
    // if (localStorage.getItem('use_local_storage') !== null) {
    //   this.useLocalStorage = true
    return {
      token: String(localStorage.getItem('access_token')),
      accessible_until: Number(localStorage.getItem('accessible_until')),
      refreshable_until: Number(localStorage.getItem('refreshable_until'))
    }
    // } else {
    //   this.useLocalStorage = false
    //   return {
    //     token: String(sessionStorage.getItem('access_token')),
    //     accessible_until: Number(sessionStorage.getItem('accessible_until')),
    //     refreshable_until: Number(sessionStorage.getItem('refreshable_until'))
    //   }
    // }
  }
}
