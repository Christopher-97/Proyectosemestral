import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimacionesPageRoutingModule } from './animaciones-routing.module';

import { AnimacionesPage } from './animaciones.page';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimacionesPageRoutingModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  declarations: [AnimacionesPage]
})
export class AnimacionesPageModule {}
