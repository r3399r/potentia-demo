import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from 'src/app/page/login/login.page';
import { RouterTestingModule } from '@angular/router/testing';
import { SplitPaneService } from 'src/app/service/split-pane.service';
import { AuthService } from 'src/app/service/auth.service';

describe('LoginPage', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let splitPaneServiceSpy: jasmine.SpyObj<SplitPaneService>;
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    splitPaneServiceSpy = jasmine.createSpyObj('SplitPaneService', ['setDisable']);

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SplitPaneService, useValue: splitPaneServiceSpy },
      ],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onClick should work', async () => {
    await component.onClick()
    expect(splitPaneServiceSpy.setDisable).toHaveBeenCalledTimes(1)
  })

  it('onClick should create alert when error', async () => {
    authServiceSpy.login.and.rejectWith()
    await component.onClick()
    expect(splitPaneServiceSpy.setDisable).toHaveBeenCalledTimes(0)
  },10000)
});
