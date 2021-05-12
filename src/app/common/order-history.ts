export class OrderHistory {
    id: string;
    orderTrackingNumber: string;
    totalPrice: number;
    totalQuantity: number;
    dateCreated: Date;
}

export class GetReponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    }
}
