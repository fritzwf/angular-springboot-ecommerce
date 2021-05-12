import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Purchase } from '../common/purchase';

const BASE_URL = 'http://localhost:8080/api/checkout/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private httpClient: HttpClient
  ) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(BASE_URL, purchase);
  }
}
