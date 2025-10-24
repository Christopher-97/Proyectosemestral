import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Animation, AnimationController, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-animaciones',
  templateUrl: './animaciones.page.html',
  styleUrls: ['./animaciones.page.scss'],
  standalone: false,
})
export class AnimacionesPage implements OnInit {

  @ViewChildren(IonCard, {read:ElementRef})
  cardElements !: QueryList<ElementRef<HTMLIonCardElement>>;

  @ViewChild('animar1',{read:ElementRef, static:true})
  animar1!:ElementRef;


  private animation!: Animation
  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() {
  }

  
  ngAfterViewInit() {
    const cardA = this.animationCtrl
      .create()
      .addElement(this.cardElements.get(0)!.nativeElement)
      .keyframes([
        { offset: 0, transform: 'scale(0.5) rotate(0)' },
        { offset: 0.5, transform: 'scale(1) rotate(45deg)' },
        { offset: 1, transform: 'scale(0.5) rotate(0)' },
      ]);

    const cardB = this.animationCtrl
      .create()
      .addElement(this.cardElements.get(1)!.nativeElement)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1.5)', opacity: '0.3' },
        { offset: 1, transform: 'scale(1)', opacity: '1' },
      ]);

    const cardC = this.animationCtrl
      .create()
      .addElement(this.cardElements.get(2)!.nativeElement)
      .duration(5000)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '0.5' },
        { offset: 0.5, transform: 'scale(0.5)', opacity: '1' },
        { offset: 1, transform: 'scale(1)', opacity: '0.5' },
      ]);

      const cardD = this.animationCtrl
      .create()
      .addElement(this.cardElements.get(3)!.nativeElement)
      .duration(5000)
      .iterations(Infinity)
      .direction('alternate')
      .fromTo('background', 'blue', 'var(--background)');

      const h1 = this.animationCtrl
      .create()
      .addElement(this.animar1.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, background:'yellow' },
        { offset: 0.72, background: 'var(--background)' },
        { offset: 1, background:'purple' },
      ]);
      const masH1 = this.animationCtrl
      .create()
      .addElement(this.animar1.nativeElement)
      .duration(1500)
      .iterations(Infinity)
      .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      .fromTo('opacity', '1', '0.2');

    this.animation = this.animationCtrl
      .create()
      .duration(5000)
      .iterations(Infinity)
      .addAnimation([cardA, cardB, cardC,cardD,h1,masH1]);

    this.animation.play();
  }

}
