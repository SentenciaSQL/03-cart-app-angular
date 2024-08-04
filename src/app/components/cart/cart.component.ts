import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnChanges{

  @Input() items: CartItem[] = [];
  total: number = 0;
  @Output() idProductEventEmitter = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    let itemChanges = changes['items'];
    this.calculateTotal();
    this.setSession();
    
  }

  onDeleteCart(id: number): void {
    this.idProductEventEmitter.emit(id);
  }

  calculateTotal() {
    this.total = this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  setSession() : void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
