import { OrderHistory } from 'src/app/common/order-history';
import { EMAIL_STORAGE_NAME } from 'src/app/config/my-app-config';
import { OrderHistoryService } from 'src/app/services/order-history.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(
    private orderHistoryService: OrderHistoryService
  ) { }

  ngOnInit() {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem(EMAIL_STORAGE_NAME));

    this.orderHistoryService.getOrderHistory(email).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

}
