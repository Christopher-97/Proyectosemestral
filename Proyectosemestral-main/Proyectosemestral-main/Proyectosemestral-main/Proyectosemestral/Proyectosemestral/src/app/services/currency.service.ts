import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface CurrencyRate {
  code: string;
  rate: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

  constructor(private http: HttpClient) { }

  getExchangeRates(): Observable<CurrencyRate[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const rates = response.rates;
        return Object.keys(rates).map(code => ({
          code: code,
          rate: rates[code],
          name: this.getCurrencyName(code)
        }));
      })
    );
  }

  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        const usdAmount = amount / response.rates[fromCurrency];
        return usdAmount * response.rates[toCurrency];
      })
    );
  }

  private getCurrencyName(code: string): string {
    const currencyNames: { [key: string]: string } = {
      'USD': 'Dólar estadounidense',
      'EUR': 'Euro',
      'GBP': 'Libra esterlina',
      'JPY': 'Yen japonés',
      'CAD': 'Dólar canadiense',
      'AUD': 'Dólar australiano',
      'CHF': 'Franco suizo',
      'CNY': 'Yuan chino',
      'MXN': 'Peso mexicano',
      'BRL': 'Real brasileño',
      'CLP': 'Peso chileno',
      'COP': 'Peso colombiano',
      'PEN': 'Sol peruano',
      'ARS': 'Peso argentino'
    };
    return currencyNames[code] || code;
  }
}
