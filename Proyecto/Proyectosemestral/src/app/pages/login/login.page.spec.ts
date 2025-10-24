import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const alertMock = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate email field', () => {
    const email = component.loginForm.get('email');
    email?.setValue('');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['required']).toBeTruthy();

    email?.setValue('invalid-email');
    expect(email?.errors?.['email']).toBeTruthy();

    email?.setValue('test@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password');
    password?.setValue('');
    expect(password?.valid).toBeFalsy();
    expect(password?.errors?.['required']).toBeTruthy();

    password?.setValue('12345');
    expect(password?.errors?.['minlength']).toBeTruthy();

    password?.setValue('123456');
    expect(password?.valid).toBeTruthy();
  });

  it('should navigate to tabs on successful login', async () => {
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('123456');

    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

    await component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs']);
  });

  it('should show error alert on invalid form submission', async () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

    await component.onSubmit();

    expect(alertControllerSpy.create).toHaveBeenCalled();
  });
});
