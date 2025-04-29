import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { LucideAngularModule, Star, CirclePlus, LoaderCircle, Ellipsis } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { Product } from '../../model/product';
import { catchError, of } from 'rxjs';




// interface Product {
//   productId: number;
//   productName: string;
//   productPrice: number;
//   productDescription: string;
//   productCategory: string;
//   productStock: number;
//   imageUrl?: string;
// }

@Component({
  selector: 'app-product-list',
  imports: [
    NgFor,
    NgIf,
    LucideAngularModule,
    NavbarComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductComponent {

  constructor(
    private toast: HotToastService,
    private productsService: ProductsService,
    private router: Router,
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.getProducts();
    }, 1000);
  }

  readonly star = Star;
  readonly circlePlus = CirclePlus;
  readonly loaderCircle = Ellipsis;
  products: Product[] = [];
  isLoading = true;


  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.products = response;
        // console.log(response);
      },
      error: (error) => {
        this.isLoading = false;
        this.toast.error(error.error?.error || 'Login failed. Please try again.');
      }
    });
  }


  addToCart(product: Product) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.toast.error("You are not Logged In!")
      setTimeout(() => {
        this.toast.loading('Redirecting to login page...');

        setTimeout(() => {
          this.toast.close();
          this.router.navigate(['/']);
        }, 2000);
      }, 500);
      return;
    }


    this.productsService.addToCartService(product).pipe(
      this.toast.observe({
        loading: 'Adding to cart...',
        success: 'Added to 🛒 successfully!',
        error: (err) => 'Failed to add to cart'
      }),
      catchError(error => of(error))
    ).subscribe()
  }


}