import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const PROD_ID = 'prodId';
const CAT_ID = 'catId';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  categoryId: number;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.categoryId = +this.route.snapshot.paramMap.get(CAT_ID);
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    // check if "id" parameter is available
    if (this.route.snapshot.paramMap.has(PROD_ID)) {
      // now get the products for the given category id
      this.productService.getProduct(+this.route.snapshot.paramMap.get(PROD_ID)).subscribe(
        data => {
          this.product = data;
          console.warn('Product: ' + JSON.stringify(data, null, 2));
        }
      );
    }
  }

  addToCart() {
    console.warn(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}
