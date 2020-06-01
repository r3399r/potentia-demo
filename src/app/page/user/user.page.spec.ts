import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UserPage } from 'src/app/page/user/user.page';
import { UserService } from 'src/app/service/user.service';

describe('UserPage', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser'])
    userServiceSpy.getUser.and.returnValue(Promise.resolve({ account: 'testAccount', name: 'testName' }));

    TestBed.configureTestingModule({
      declarations: [UserPage],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser 1 time', async () => {
    expect(userServiceSpy.getUser).toHaveBeenCalledTimes(1)
  })
});
