import { CartService } from 'src/app/services/cart.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice = 0.00;
  totalQty = 0;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.updateCartStatus();
  }
  updateCartStatus() {
    this.cartService.totalCartPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalCartQty.subscribe(
      data => this.totalQty = data
    );
  }

}
