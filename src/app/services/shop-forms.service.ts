import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Month } from '../common/controls';
import { Country, GetResponseCountries, GetResponseStates, State } from '../common/country';

const CREDIT_CARD_YEARS = 10;
const COUNTRIES_URL = 'http://localhost:8080/api/countries';
const STATES_URL = 'http://localhost:8080/api/states';

@Injectable({
  providedIn: 'root'
})
export class ShopFormsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(COUNTRIES_URL).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {

    const searchStatesUrl = `${STATES_URL}/search/findByCountryCode?code=${theCountryCode}`;

    console.warn('SearchStatesURL: ' + searchStatesUrl);

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(isGetFullCalendar: boolean = true): Observable<Month[]> {

    const data: Month[] = [];

    const calcDate = isGetFullCalendar ? 1 : new Date().getMonth() + 1;

    for (let theMonth = calcDate; theMonth <= 12; theMonth++) {
      data.push(new Month( theMonth ));
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    const data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + CREDIT_CARD_YEARS;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);
  }
}
