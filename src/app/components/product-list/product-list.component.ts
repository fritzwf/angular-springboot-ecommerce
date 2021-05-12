import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const ID = 'id';
const KEYWORD = 'keyword';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId = 1;
  previousKeyword: string;
  searchMode: boolean;

  pageNumber = 1;
  pageSize = 5;
  totalElements = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    if (this.route.snapshot.paramMap.has(KEYWORD)) {
      this.handleSearchPoducts();
    } else {
      this.handleListPoducts();
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  handleListPoducts() {

    // check if "id" parameter is available
    if (this.route.snapshot.paramMap.has(ID)) {
      const newCategoryId = +this.route.snapshot.paramMap.get(ID);
      this.pageNumber = newCategoryId !== this.currentCategoryId ? 1 : this.pageNumber;
      this.currentCategoryId = newCategoryId;
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    console.warn('currentId: ' + this.currentCategoryId + ' pageNumber: ' + this.pageNumber);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.currentCategoryId,
                this.pageNumber - 1, this.pageSize).subscribe(this.processResult());

  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  handleSearchPoducts() {

    const searchTerm = this.route.snapshot.paramMap.get(KEYWORD);

    // check if "keyword" parameter is available
    if (searchTerm) {
      this.pageNumber = this.previousKeyword !== searchTerm ? 1 : this.pageNumber;
      this.previousKeyword = searchTerm;
      // now get the products for the given search term
      this.productService.searchProductsPaginate(
                             searchTerm,
                             this.pageNumber - 1,
                             this.pageSize).subscribe(this.processResult());
    }
  }

  addToCart(product: Product) {
    console.warn('Product being purchased: ' + JSON.stringify(product, null, 2));

    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
