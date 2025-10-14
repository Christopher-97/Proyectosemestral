import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../inicio/inicio.module').then(m => m.InicioPageModule),
      },
      {
        path: 'movimientos',
        loadChildren: () =>
          import('../movimientos/movimientos.module').then(m => m.MovimientosPageModule),
      },
      {
        path: 'reportes',
        loadChildren: () =>
          import('../reportes/reportes.module').then(m => m.ReportesPageModule),
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
