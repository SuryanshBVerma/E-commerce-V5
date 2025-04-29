import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, tap } from 'rxjs';
import { Product } from '../../model/product';
import { User } from '../../model/user.model';
import { Admin } from '../../model/admin.modal';
import { Order } from '../../model/order.model';
import { Router } from '@angular/router';


interface loginResponse {
  "adminId": number,
  "email": string,
  "token": string,
  "username": string,
}




@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private router: Router) { }

  private token = localStorage.getItem('auth_token');

  getAllUsers() {
    const apiUrl = "http://localhost:9000/api/admin/users"

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<User[]>(apiUrl, { headers }).pipe(
      delay(700)
    );

  }


  updateUserDetails(user: User) {
    const apiUrl = `http://localhost:9000/api/admin/update/user/${user.id}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    const body = {
      "name": user.name,
      "email": user.email,
      "mobileNumber": user.mobileNumber,
      "location": user.location,
      "address": user.address
    }

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      delay(700)
    );
  }


  deleteUser(userId: number) {
    const apiUrl = `http://localhost:9000/api/admin/delete/user/${userId}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }


  getAllproducts() {
    const apiUrl = `http://localhost:9000/api/admin/products`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<Product[]>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }


  updateProduct(product: Product) {
    const apiUrl = `http://localhost:9000/api/admin/update/product/${product.productId}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    const body = {
      "productName": product.productName,
      "productPrice": product.productPrice,
      "productDescription": product.productDescription,
      "productCategory": product.productCategory,
      "productStock": product.productStock,
      "productTag": product.productTag,
      "productImageUrl": product.productImageUrl,
      "productRating": product.productRating
    }

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      delay(700)
    );
  }


  deleteProduct(productId: number) {
    const apiUrl = `http://localhost:9000/api/admin/delete/product/${productId}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  addProduct(product: Product) {
    const apiUrl = `http://localhost:9000/api/admin/add/product`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    const body = {
      "productName": product.productName,
      "productPrice": product.productPrice,
      "productDescription": product.productDescription,
      "productCategory": product.productCategory,
      "productStock": product.productStock,
      "productTag": product.productTag,
      "productImageUrl": product.productImageUrl,
      "productRating": product.productRating
    }

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      delay(700)
    );
  }

  login(username: string, password: string) {
    const apiUrl = `http://localhost:9000/api/admin/login`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    const body = {
      "username": username,
      "password": password
    }

    return this.http.post<any>(apiUrl, body, { headers }).pipe(
      delay(700),
      tap(response => {
        // Store user data and token
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.username));
        // console.log("Response", response);
      })
    );
  }

  getAllAdmins(){
    const apiUrl = `http://localhost:9000/api/admin/admins`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<Admin[]>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  getAllOrders(){
    const apiUrl = `http://localhost:9000/api/admin/orders`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<Order[]>(apiUrl, { headers }).pipe(
      delay(700)
    );

  }


  updateOrderStatus(orderId: number, newStatus: string){

    const apiUrl = `http://localhost:9000/api/admin/update/order/${orderId}/${newStatus}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }

  deleteAdmin(adminId : number){

    const apiUrl = `http://localhost:9000/api/admin/delete/${adminId}`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };

    return this.http.get<any>(apiUrl, { headers }).pipe(
      delay(700)
    );

  }

  createAdmin(admin : any){
    const apiUrl = `http://localhost:9000/api/admin/register`;

    const headers = {
      'Authorization': `Bearer ${this.token}`
    };
    
    return this.http.post<any>(apiUrl, admin, { headers }).pipe(
      delay(700)
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(["/admin/login"]);
  }


}
