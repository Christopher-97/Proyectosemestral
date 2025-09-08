import { Component } from '@angular/core';

type Tipo = 'ingreso' | 'egreso';

interface Movimiento {
  description: string;
  category: string;
  amount: number;
  type: Tipo;
}

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
  standalone: false,
})
export class MovimientosPage {
  tipo: Tipo = 'ingreso';
  description = '';
  category = '';
  amount: number | null = null;

  lista: Movimiento[] = []; 

  agregar() {
    if (!this.description || !this.category || this.amount === null) return;
    this.lista.unshift({
      description: this.description,
      category: this.category,
      amount: this.amount,
      type: this.tipo,
    });
    // limpiar CC
    this.description = '';
    this.category = '';
    this.amount = null;
    this.tipo = 'ingreso';
  }
}
