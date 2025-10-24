import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimationController, IonicModule } from '@ionic/angular';
import { AnimacionesPage } from './animaciones.page';

describe('AnimacionesPage', () => {
  let component: AnimacionesPage;
  let fixture: ComponentFixture<AnimacionesPage>;
  let animationControllerSpy: jasmine.SpyObj<AnimationController>;

  beforeEach(async () => {
    const animationMock = jasmine.createSpyObj('AnimationController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AnimacionesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AnimationController, useValue: animationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimacionesPage);
    component = fixture.componentInstance;
    animationControllerSpy = TestBed.inject(AnimationController) as jasmine.SpyObj<AnimationController>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize animation controller', () => {
    expect(component).toBeDefined();
  });

  it('should have ViewChildren for card elements', () => {
    expect(component.cardElements).toBeDefined();
  });

  it('should have ViewChild for animar1 element', () => {
    expect(component.animar1).toBeDefined();
  });

  it('should create animations in ngAfterViewInit', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();

    // Trigger ngAfterViewInit
    component.ngAfterViewInit();

    // Verify animation controller was called
    expect(animationControllerSpy.create).toHaveBeenCalled();
  });

  it('should play animations', () => {
    const mockAnimation = jasmine.createSpyObj('Animation', ['play']);
    animationControllerSpy.create.and.returnValue(mockAnimation);

    component.ngAfterViewInit();

    // The animation should be played
    expect(mockAnimation.play).toHaveBeenCalled();
  });
});
