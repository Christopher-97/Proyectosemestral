import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MovimientosPageRoutingModule } from './movimientos-routing.module';
import { MovimientosPage } from './movimientos.page';

import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovimientosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [MovimientosPage]
})
export class MovimientosPageModule {}
