import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AppHeaderComponent } from './app-header/app-header.component';
import { MovementItemComponent } from './movement-item/movement-item.component';

@NgModule({
  declarations: [AppHeaderComponent, MovementItemComponent],
  imports: [CommonModule, IonicModule],
  exports: [AppHeaderComponent, MovementItemComponent]
})
export class ComponentsModule {}
