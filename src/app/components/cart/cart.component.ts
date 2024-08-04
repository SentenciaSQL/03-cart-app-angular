import { Component, EventEmitter} from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  items: CartItem[] = [];
  total: number = 0;

  constructor(private router: Router, private sharingDataService: SharingDataService) {
    this.items = this.router.getCurrentNavigation()?.extras.state!['items'];
    this.total = this.router.getCurrentNavigation()?.extras.state!['total'];
  }


  onDeleteCart(id: number): void {
    this.sharingDataService.idProductEventEmitter.emit(id);
  }


}
