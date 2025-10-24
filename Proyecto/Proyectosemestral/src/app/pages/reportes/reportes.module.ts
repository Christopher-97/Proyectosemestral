import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReportesPageRoutingModule } from './reportes-routing.module';
import { ReportesPage } from './reportes.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [CommonModule, IonicModule, ReportesPageRoutingModule, ComponentsModule],
  declarations: [ReportesPage],
})
export class ReportesPageModule {}
