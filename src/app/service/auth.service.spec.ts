import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoginResponse } from 'src/app/model/LoginResponse';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let localStorageGetSpy: jasmine.Spy
  let localStorageSetSpy: jasmine.Spy
  let sessionStorageGetSpy: jasmine.Spy
  let sessionStorageSetSpy: jasmine.Spy
  let service: AuthService;
  let dummyResponse: LoginResponse;

  beforeAll(() => {
    dummyResponse = {
      token: 'abc',
      accessible_until: 123,
      refreshable_until: 123
    }
  })

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of(dummyResponse))

    localStorageGetSpy = spyOn(localStorage, 'getItem').and.callFake(() => { return 'value' })
    localStorageSetSpy = spyOn(localStorage, 'setItem').and.callFake((): void => { })

    sessionStorageGetSpy = spyOn(sessionStorage, 'getItem').and.callFake(() => { return 'value' })
    sessionStorageSetSpy = spyOn(sessionStorage, 'setItem').and.callFake((): void => { })

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should work with keepAlive', async () => {
    await service.login('testAccount', 'textPwd', true)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(1)
  })

  it('login should work with  not keepAlive', async () => {
    await service.login('testAccount', 'textPwd', false)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(3)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(1)
  })

  it('refresh should work', async () => {
    await service.refreshToken('a')
    expect(localStorageSetSpy).toHaveBeenCalledTimes(3)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(1)
  })

  it('isAuth should return fail when no loginResponse in localStorage', async () => {
    localStorageGetSpy.and.returnValue(null)
    expect(await service.isAuth()).toBe(false)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(0)
  })

  it('isAuth should return fail when keepAlive is not true', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'false'
      else return 'value'
    })
    expect(await service.isAuth()).toBe(false)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(0)
  })

  it('isAuth should return fail when keepAlive is not true and logined is not true', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'false'
      else return 'value'
    })
    sessionStorageGetSpy.and.returnValue('false')
    expect(await service.isAuth()).toBe(false)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(0)
  })

  it('isAuth should return true when keepAlive is not true but loginned is true', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'false'
      else if (key === 'refreshable_until') return String(Date.now() + 100)
      else return 'value'
    })
    sessionStorageGetSpy.and.returnValue('true')
    expect(await service.isAuth()).toBe(true)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(3)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(1)
  })

  it('isAuth should return true when keepAlive true but not refreshable', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'true'
      else return String(Date.now() - 5000)
    })
    expect(await service.isAuth()).toBe(false)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(0)
  })

  it('isAuth should return true when keepAlive true and refreshable', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'true'
      else return String(Date.now() + 5000)
    })
    expect(await service.isAuth()).toBe(true)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(3)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(1)
  })

  it('isAuth should return false when api fails', async () => {
    localStorageGetSpy.and.callFake((key: string): string => {
      if (key === 'keep_alive') return 'true'
      else return String(Date.now() + 5000)
    })
    httpClientSpy.post.and.returnValue(throwError({}))
    expect(await service.isAuth()).toBe(false)
    expect(localStorageGetSpy).toHaveBeenCalledTimes(4)
    expect(sessionStorageGetSpy).toHaveBeenCalledTimes(1)
    expect(localStorageSetSpy).toHaveBeenCalledTimes(0)
    expect(sessionStorageSetSpy).toHaveBeenCalledTimes(0)
  })
});
