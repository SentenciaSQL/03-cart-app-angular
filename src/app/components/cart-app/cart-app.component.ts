import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { CatalogComponent } from '../catalog/catalog.component';
import { CartItem } from '../../models/cartItem';
import { NavbarComponent } from "../navbar/navbar.component";
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html',
  styleUrl: './cart-app.component.css'
})
export class CartAppComponent implements OnInit {

  products: Product[] = [];
  items: CartItem[] = [];
  total: number = 0;

  constructor(private SharingDataService: SharingDataService, private router: Router) {
    
  }

  ngOnInit(): void {
    this.items = JSON.parse(sessionStorage.getItem('cart')|| '[]') ;
    this.calculateTotal();
    this.onDeleteCart();
    this.onAddCart();
  }  

  onAddCart() {
    this.SharingDataService.productEventEmitter.subscribe((product: Product) => {
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
      this.calculateTotal();
      this.setSession();
      this.router.navigate(['/cart'], {state: {items: this.items, total: this.total}});

      Swal.fire({
        title: "Shopping Cart",
        text: "Nuevo producto agregado al carrito",
        icon: "success",
      });
    });
  }

  onDeleteCart() : void {
    this.SharingDataService.idProductEventEmitter.subscribe((id: number) => {

      Swal.fire({
        title: "Estas seguro de eliminar este producto?",
        text: "No podras revertir esta accion!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
      }).then((result) => {
        if (result.isConfirmed) {

          this.items = this.items.filter(item => item.product.id !== id);
          if (this.items.length == 0) {
            sessionStorage.removeItem('cart');
            sessionStorage.clear();
          }
          this.calculateTotal();
          this.setSession();
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/cart'], {state: {items: this.items, total: this.total}});
          }); 

          Swal.fire({
            title: "Eliminado!",
            text: "Tu producto ha sido eliminado.",
            icon: "success"
          });
        }
      }); 
      
    });
    
  }

  calculateTotal() {
    this.total = this.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  setSession() : void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }


}
