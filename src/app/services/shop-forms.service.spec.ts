import { TestBed } from '@angular/core/testing';

import { ShopFormsService } from './shop-forms.service';

describe('ShopFormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopFormsService = TestBed.get(ShopFormsService);
    expect(service).toBeTruthy();
  });
});
