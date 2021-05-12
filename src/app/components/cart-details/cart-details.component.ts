import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQty = 0;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalCartPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalCartQty.subscribe(
      data => this.totalQty = data
    );

    this.cartService.computeCartTotals();
  }

  incQty(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }

  decQty(cartItem: CartItem) {
    this.cartService.decrementQty(cartItem);
  }

  remove(cartItem: CartItem) {
    this.cartService.removeFromCart(cartItem);
  }
}
