import { Month } from 'src/app/common/controls';
import { Country, State } from 'src/app/common/country';
import { CustomValidators } from 'src/app/common/custom-validators';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { EMAIL_STORAGE_NAME } from 'src/app/config/my-app-config';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormsService } from 'src/app/services/shop-forms.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice = 0;
  totalQty = 0;
  creditCardYears: number[] = [];
  creditCardMonths: Month[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  savedEmail: string = JSON.parse(sessionStorage.getItem(EMAIL_STORAGE_NAME));

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private formBuilder: FormBuilder,
    private formsService: ShopFormsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.savedEmail = this.savedEmail ? this.savedEmail : '';
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl(this.savedEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
      })
    });

    // populate credit months and years

    this.formsService.getCreditCardMonths().subscribe(
      data => {
        console.warn('Retrieved credit card months: ' + JSON.stringify(data, null, 2));
        this.creditCardMonths = data;
      }
    );

    this.formsService.getCreditCardYears().subscribe(
      data => {
        console.warn('Retrieved credit card months: ' + JSON.stringify(data, null, 2));
        this.creditCardYears = data;
      }
    );

    this.formsService.getCountries().subscribe(
      data => {
        this.countries = data;
        console.warn('Countries: ' + JSON.stringify(data, null, 2));
      }
    );

    this.reviewCartDetails();

  }

  reviewCartDetails() {
    this.cartService.totalCartPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalCartQty.subscribe(
      data => this.totalQty = data
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.formsService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  onSubmit() {
    console.log('formGroup: ' + JSON.stringify(this.checkoutFormGroup.value, null, 2));

    // Lights up all required fields with errors.
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    } else {

      // setup order
      const order = new Order();
      order.totalPrice =  this.totalPrice;
      order.totalQuantity = this.totalQty;

      // create orderItems from cartItems
      // get cart items (old way)
      // const orderItems: OrderItem[] = [];
      // for (let item of this.cartService.cartItems) {
      //   orderItems.push(new OrderItem(item));
      // }
      // get cart items using map
      const orderItems: OrderItem[] = this.cartService.cartItems.map(itm => new OrderItem(itm));

      // set up purchase
      const purchase = new Purchase();

      // populate purchase - customer

      purchase.customer = this.checkoutFormGroup.controls.customer.value;

      // populate purchase - shipping address
      purchase.shippingAddress = this.checkoutFormGroup.controls.shippingAddress.value;
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;

      // populate purchase - billing address
      purchase.billingAddress = this.checkoutFormGroup.controls.billingAddress.value;
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;

      // populate purchase - order and orderItems
      purchase.order = order;
      purchase.orderItems = orderItems;

      // call REST API via checkout service
      this.checkoutService.placeOrder(purchase).subscribe({
          next: response => {
            alert(`Your order has been recieved.\nOrder tracking number: ${response.orderTrackingNumber}`);
            this.resetCart();
          },
          error: err => {
            alert(`There was an error: ${err.message}`);
          }
        });
      }
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalCartPrice.next(0);
    this.cartService.totalCartQty.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl('/products');
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(
        this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = +creditCardFormGroup.value.expirationYear;

    this.formsService.getCreditCardMonths(currentYear !== selectedYear).subscribe(
      data => {
        console.warn('Retrieved credit card months: ' + JSON.stringify(data, null, 2));
        this.creditCardMonths = data;
      }
    );

  }
}
