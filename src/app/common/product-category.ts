export class ProductCategory {
    id: number;
    categoryName: string;
}

export interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    };
}
