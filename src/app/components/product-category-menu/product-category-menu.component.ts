import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {

    this.productService.getProductCategories().subscribe(
      data => {
        console.warn('Catagories: ' + JSON.stringify(data, null, 2));
        this.productCategories = data;
      }
    );
  }

}
