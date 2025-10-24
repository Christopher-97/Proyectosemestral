import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [CommonModule, IonicModule, TabsPageRoutingModule, ComponentsModule],
  declarations: [TabsPage]
})
export class TabsPageModule {}
