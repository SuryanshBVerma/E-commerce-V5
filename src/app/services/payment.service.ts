import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  private token = localStorage.getItem('auth_token');

  initiatePayment(data : any, name : string, email : string) {
    // const apiUrl = "http://localhost:8003/api/payment/checkout/hosted";
    const apiUrl = "http://localhost:9000/api/payment/checkout/hosted";

    if (!this.token) {
      return throwError(() => new Error('Auth token not found. Please log in.'));
    }
    // const headers = {
    //   'Authorization': `Bearer ${this.token}`
    // };

    const headers=  { 'Content-Type': 'application/json' }

    const body = {
      items: data,
      customerName: name,
      customerEmail: email,
    }

    return this.http.post(apiUrl, body, {
      headers: headers,
      responseType: 'text' 
    }).pipe(
      delay(700)
    );
  }
}
