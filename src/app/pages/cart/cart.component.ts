import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { CartItem } from '../../model/cartItem';
import { LucideAngularModule, Plus, Minus } from 'lucide-angular';
import { Product } from '../../model/product';
import { catchError, of } from 'rxjs';
import { OrderTotalPipe } from '../../pipes/order-total.pipe';
import confetti from 'canvas-confetti';
import { PaymentService } from '../../services/payment.service';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { PaymentSuccessfulComponent } from "../payment-successful/payment-succesfull.component";
import { PaymentFailureComponent } from "../payment-failure/payment-failure.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    NavbarComponent,
    RouterLink,
    LucideAngularModule,
    OrderTotalPipe,
    PaymentSuccessfulComponent,
    PaymentFailureComponent,
    CommonModule
],
  templateUrl: './cart.component.html',
  styles: ``
})
export class CartComponent {

  private profileData : User = {} as User;
  paymentSuccessFul = false;
  paymentFailure = false;

  constructor(
    private productService: ProductsService,
    private toast: HotToastService,
    private router: Router,
    private paymentService: PaymentService,
    private userService: UserService,
    private activeRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.activeRoute.queryParams.subscribe((params) =>{
        console.log("Query Params:", params);
        if (params['payment'] === 'success') {
          const sessionId = params['session_id'];
          this.orderAllProducts()
          // Process successful payment
          this.paymentSuccessFul = true;
        }else if (params['payment'] === 'failure'){
          // console.log("Payment Failed");
          this.paymentFailure = true;
        }
      })

      this.getCart();
      this.getProfileDetails();
    }, 1500);
  }

  items: CartItem[] = [];
  readonly plus = Plus;
  readonly minus = Minus;
  taxRate = 0.1;
  isLoading = true;
  emptyCartImage = 'src/app/assets/images/Empty-Cart.png';


  increaseQuantity(item: CartItem) {
    // console.log("Increase");
    if (item.currentStock < item.quantity + 1) {
      this.toast.error("Only " + item.currentStock + " is available !")
      return;
    }
    this.productService.updateCartProductQunatity(item.id, 1).subscribe({
      next: (response) => {
        // console.log(response);
        item.quantity++;
      }
    })
  }

  decreaseQuantity(item: CartItem) {
    console.log("Decrease");
    this.productService.updateCartProductQunatity(item.id, 0).subscribe({
      next: (Response) => {
        console.log(Response);
        item.quantity--;
      }
    })
  }

  getProfileDetails() {
    this.userService.getProfieDetails().subscribe({
      next: (response) => {
        console.log(response);
        this.profileData = response;
      },
      error: (error) => {
        console.log("Error :", error);
      }
    })
  }


  initiatePayment() {

   console.log("Received Profile Data : ", this.profileData);
   console.log("Payment Init");

    this.paymentService.initiatePayment(
      this.items, 
      this.profileData.name, 
      this.profileData.email
    ).pipe(
        this.toast.observe({
          loading: 'Procesing Your Order...',
          error: (err) => 'Something went wrong!! Please try again later'
        }),
        catchError(error => of(error))
      ).subscribe({
        next : (resposne : string) => {
          window.location.href = resposne;
        }
      })
  }

  orderAllProducts(){
    this.productService.orderAllProducts().subscribe({
        next : (response) => {
          this.getCart();
        },
        error : (error) => {
          console.log("Error :", error);
        }
      })
  }

  removeItem(item: CartItem) {
    this.productService.removeProductsFromCartService(item).pipe(
      this.toast.observe({
        loading: 'Removing form cart...',
        success: 'Product Removed 🥺!',
        error: (err) => 'Something went wrong!! Please try again later'
      }),
      catchError(error => of(error))
    ).subscribe({
      next: (response) => {
        // console.log(response);
        this.getCart();
      }
    })
  }

  getCart() {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.toast.error("You are not logged In.")
      this.router.navigate(['/'])
      return;
    }
    this.productService.getProductsInCartService().subscribe({
      next: (response) => {
        this.items = response;
        console.log(response);
        this.isLoading = false;
      }
    });
  }

  hasInvalidItems(): boolean {
    return this.items.some(item =>
      item.currentStock === 0 || item.quantity > item.currentStock
    );
  }
}
