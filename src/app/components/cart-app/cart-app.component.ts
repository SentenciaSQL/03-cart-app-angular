import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CatalogComponent } from '../catalog/catalog.component';
import { CartItem } from '../../models/cartItem';
import { NavbarComponent } from "../navbar/navbar.component";
import { CartModalComponent } from '../cart-modal/cart-modal.component';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [CatalogComponent, CartModalComponent, NavbarComponent],
  templateUrl: './cart-app.component.html',
  styleUrl: './cart-app.component.css'
})
export class CartAppComponent implements OnInit {

  productos: Product[] = [];
  items: CartItem[] = [];
  // total: number = 0;
  showCart: boolean = false;

  constructor(private service: ProductService) {
    
  }

  ngOnInit(): void {
    this.productos = this.service.findAll();
    this.items = JSON.parse(sessionStorage.getItem('cart')|| '[]') ;
    // this.calculateTotal();
  }  

  onAddCart(product: Product) {
    //this.items.push({product: product, quantity: 1});
    const hastItem = this.items.find(item => item.product.id === product.id);
    if (hastItem) {
      this.items = this.items.map(item => {
        if (item.product.id === product.id) {
          item.quantity++;
        }
        return item
      });
    } else {
      this.items = [...this.items, {product: {...product}, quantity: 1}];
    }
    // this.calculateTotal();
    // this.setSession();
  }

  onDeleteCart(id: number) : void {
    this.items = this.items.filter(item => item.product.id !== id);
    if (this.items.length == 0) {
      sessionStorage.removeItem('cart');
      sessionStorage.clear();
    }
    // this.calculateTotal();
    // this.setSession();
  }

  // calculateTotal() {
  //   this.total = this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  // }

  // setSession() : void {
  //   sessionStorage.setItem('cart', JSON.stringify(this.items));
  // }

  openCloseCart() : void {
    this.showCart = !this.showCart;
  }

}
