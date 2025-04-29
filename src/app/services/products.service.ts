import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';
import { delay, map, Observable, switchMap, throwError } from 'rxjs';
import { CartItem } from '../model/cartItem';
import { Order } from '../model/order.model';
import { User } from '../model/user.model';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private userService : UserService) { }

  private token = localStorage.getItem('auth_token');

  getProducts() {
    const apiUrl = "http://localhost:9000/api/user/products"; // GETTING LIST OF PRODUCTS
    return this.http.get<Product[]>(apiUrl);
  }

  addToCartService(product: Product) {
    const apiUrl = `http://localhost:9000/api/user/cart/${product.productId}`;

    if (!this.token) {
      return throwError(() => new Error('Auth token not found. Please log in.'));
    }
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<Product[]>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  getProductsInCartService() {

    const apiUrl = `http://localhost:9000/api/user/products/cart`;

    if (!this.token) {
      return throwError(() => new Error('Auth token not found. Please log in.'));
    }
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<CartItem[]>(apiUrl, { headers });
  }

  removeProductsFromCartService(item: CartItem) {
    const apiUrl = `http://localhost:9000/api/user/cart/remove/${item.id}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  orderAllProducts() {
    const apiUrl = `http://localhost:9000/api/user/order/all`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(apiUrl, { headers });
  }

  getOrders() {
    const apiUrl = `http://localhost:9000/api/user/orders`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<Order[]>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  getOrderDetails(orderId: string): Observable<any> {
    const apiUrl = `http://localhost:9000/api/user/bill/order/${orderId}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers }).pipe(
      switchMap(order => {
        return this.userService.getProfieDetails().pipe(
          map(profile => ({
            ...order,  // Make sure 'order' is an object
            customerDetails: profile
          }))
        );
      }),
      delay(700)
    );
  }

  updateCartProductQunatity(productId : number, type : number){
    const apiUrl = `http://localhost:9000/api/user/cart/quantity/${productId}/${type}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers });
  }

}
