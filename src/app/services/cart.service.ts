import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { CartItem } from '../common/cart-item';
import { CART_STORAGE_NAME } from '../config/my-app-config';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalCartPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalCartQty: Subject<number> = new BehaviorSubject<number>(0);
  // Session storage only pertains to the lifetime of the tab.
  // cartStorage: Storage = sessionStorage;
  // Local storage lives in the browsers cache beyond a session.
  cartStorage: Storage = localStorage;

  constructor() {
    // read data from Storage
    const data = JSON.parse(this.cartStorage.getItem(CART_STORAGE_NAME));

    if (data) {
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  persistCartITems() {
    this.cartStorage.setItem(CART_STORAGE_NAME, JSON.stringify(this.cartItems));
  }

  addToCart(cartItem: CartItem) {

    const found = this.cartItems.find(el => el.id === cartItem.id);
    if (found) {
      found.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
  }

  decrementQty(cartItem: CartItem) {
      cartItem.quantity--;
      if (!cartItem.quantity) {
        this.removeFromCart(cartItem);
      } else {
        this.computeCartTotals();
      }
  }

  removeFromCart(cartItem: CartItem) {
    const found = this.cartItems.findIndex(el => el.id === cartItem.id);
    if (found >= 0) {
      this.cartItems.splice(found, 1);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {

    const totalCartPrice = this.cartItems.reduce((a, b) => a + (b.quantity  * b.unitPrice || 0), 0);
    const totalCartQty = this.cartItems.reduce((a, b) => a + (b.quantity || 0), 0);

    this.totalCartPrice.next(totalCartPrice);
    this.totalCartQty.next(totalCartQty);

    this.logCartData(totalCartPrice, totalCartQty);
    this.persistCartITems();
  }

  logCartData(totalCartPrice: number, totalCartQty: number) {
    for (const item of this.cartItems) {
      console.warn(
          'Id: ' + item.id +
          ' SubTotal Price: ' + item.quantity * item.unitPrice +
          ' items: ' + item.quantity +
          ' TotalPrice: ' + totalCartPrice +
          ' totalCartQty: ' + totalCartQty);
    }
  }

}
