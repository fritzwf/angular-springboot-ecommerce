import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GetResponseProducts, Product } from '../common/product';
import { GetResponseProductCategory, ProductCategory } from '../common/product-category';

@Injectable()
export class ProductService {

  // private baseUrl = 'http://localhost:8080/api/products?size=100';
  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(
    private httpClient: HttpClient
  ) { }

  getProductList(theCategoryId?: number): Observable<Product[]> {

    // need to build URL based on category id
    let searchUrl = `${this.baseUrl}`;

    if (theCategoryId) {
      searchUrl += `/search/findByCategoryId?id=${theCategoryId}`;
      console.warn('SearchURL: ' + searchUrl);
      return this.getProducts(searchUrl);
    } else {
      return EMPTY;
    }
  }

  getProductListPaginate(theCategoryId: number, page: number = 0, pageSize: number = 5): Observable<GetResponseProducts> {

    // need to build URL based on category id
    let searchUrl = `${this.baseUrl}`;

    if (theCategoryId) {
      searchUrl += `/search/findByCategoryId?id=${theCategoryId}&page=${page}&size=${pageSize}`;
      console.warn('Page URL: ' + searchUrl);
      return this.httpClient.get<GetResponseProducts>(searchUrl);
    } else {
      return EMPTY;
    }
  }

  searchProducts(searchTerm: string): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${searchTerm}`;

    if (searchTerm) {
      return this.getProducts(searchUrl);
    } else {
      return EMPTY;
    }
  }

  searchProductsPaginate(searchTerm: string, page: number = 0, pageSize: number = 5): Observable<GetResponseProducts> {

    // need to build URL based on category id
    let searchUrl = `${this.baseUrl}`;

    if (searchTerm) {
      searchUrl += `/search/findByNameContaining?name=${searchTerm}&page=${page}&size=${pageSize}`;
      console.warn('Page URL: ' + searchUrl);
      return this.httpClient.get<GetResponseProducts>(searchUrl);
    } else {
      return EMPTY;
    }
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products));
  }

  getProduct(prodId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/${prodId}`);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory));
  }

}

