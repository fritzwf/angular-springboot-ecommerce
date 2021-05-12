import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GetReponseOrderHistory } from '../common/order-history';

const BASE_URL = 'http://localhost:8080/api/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getOrderHistory(email: string): Observable<GetReponseOrderHistory> {
    const orderHistoryUrl = `${BASE_URL}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

    return this.httpClient.get<GetReponseOrderHistory>(orderHistoryUrl);
  }
}
