import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let authServiceSpy: jasmine.SpyObj<AuthService>
  let dummyUser:User

  beforeAll(()=>{
    dummyUser={account:'testAccount',
  name:'testName'}
  })

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken'])

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUser should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyUser))
    expect(await service.getUser()).toBe(dummyUser)
    expect(authServiceSpy.refreshToken).toHaveBeenCalledTimes(1);
  });
});
