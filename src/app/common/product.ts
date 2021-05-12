export class Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export class Product {
    id: string;
    sku: string;
    name: string;
    description: string;
    unitPrice: number;
    imageUrl: string;
    active: boolean;
    unitsInStock: number;
    dateCreated: Date;
    lastUpdate: Date;
    page: Page;
}

export interface GetResponseProducts {
    _embedded: {
        products: Product[],
        page: {
          size: number,
          totalElements: number,
          totalPages: number,
          number: number,
        }
    };
}
