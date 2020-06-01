import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from 'src/app/auth.guard';
import { AuthService } from 'src/app/service/auth.service';
import { SplitPaneService } from 'src/app/service/split-pane.service';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>
  let splitPaneServiceSpy: jasmine.SpyObj<SplitPaneService>
  let guard: AuthGuard;
  const dummyRoute: any = { queryParams: 'dummyQueryParams' };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuth'])
    splitPaneServiceSpy = jasmine.createSpyObj('SplitPaneService', ['setDisable'])

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SplitPaneService, useValue: splitPaneServiceSpy },
      ],
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate should work when isAuth return true', async () => {
    authServiceSpy.isAuth.and.resolveTo(true)
    expect(await guard.canActivate(dummyRoute)).toBe(true)
    expect(authServiceSpy.isAuth).toHaveBeenCalledTimes(1);
    expect(splitPaneServiceSpy.setDisable).toHaveBeenCalledTimes(0);
  });

  it('canActivate should work when isAuth return false', async () => {
    authServiceSpy.isAuth.and.resolveTo(false)
    expect(await guard.canActivate(dummyRoute)).toBe(false)
    expect(authServiceSpy.isAuth).toHaveBeenCalledTimes(1);
    expect(splitPaneServiceSpy.setDisable).toHaveBeenCalledTimes(1);
  });
});
