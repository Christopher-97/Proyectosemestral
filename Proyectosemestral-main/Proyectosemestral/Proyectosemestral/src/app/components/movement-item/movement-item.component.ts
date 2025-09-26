import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movement-item',
  templateUrl: './movement-item.component.html',
  styleUrls: ['./movement-item.component.scss'],
  standalone: false,
})
export class MovementItemComponent {
  @Input() description = '';
  @Input() category = '';
  @Input() amount: number | null = null;
  @Input() type: 'ingreso' | 'egreso' = 'ingreso';
}
