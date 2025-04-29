import { Component, NgModule } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Order } from '../../model/order.model';
import { ProductsService } from '../../services/products.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { FormsModule } from '@angular/forms';
import { BillComponent } from "../../components/bill/bill.component";
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-order-history-page',
  imports: [
    DatePipe,
    NgClass,
    NavbarComponent,
    RouterLink,
    FormsModule,
    BillComponent,
    DecimalPipe
  ],
  templateUrl: './orderHistoryPage.html',
  styles: ``
})
export class OrderHistoryPageComponent {
  isLoading = true;
  orders: Order[] = [];
  filteredOrders: any[] = [];
  searchQuery: string = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  // FOR BILLING PURPOSE
  openBillModal = false;
  orderBill: Order = {} as Order;
  customerDetails = {};

  constructor(
    private productService: ProductsService,
    private toast: HotToastService,
    private router : Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;

    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.toast.error("You are not logged In.")
      this.router.navigate(['/'])
      return;
    }


    this.productService.getOrders().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.orders = response;
        this.filteredOrders = [...this.orders]; // Initialize filtered orders
        this.sortOrders(); // Apply default sorting
        // console.log(this.orders);
      },
      error: (error) => {
        this.isLoading = false;
        this.toast.error(error.error?.error || 'Login failed. Please try again.');
      }
    })
  }

  // Add these methods
  sortOrders(direction?: 'asc' | 'desc') {
    if (direction) {
      this.sortDirection = direction;
    }

    this.filteredOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  searchOrders() {
    if (!this.searchQuery) {
      this.filteredOrders = [...this.orders];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        order.items.some(item =>
          item.productName.toLowerCase().includes(query)
        )
      );
    }
    this.sortOrders(); // Maintain current sort after search
  }

  toggleSortDirection() {
    this.isLoading = true;
    setTimeout(() => {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortOrders();
      this.isLoading = false;
    }, 400);

  }

  expandedOrders: Set<string> = new Set();

  toggleOrderExpansion(orderId: string) {
    if (this.expandedOrders.has(orderId)) {
      this.expandedOrders.delete(orderId);
    } else {
      this.expandedOrders.add(orderId);
    }
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrders.has(orderId);
  }

  viewOrderDetails(orderId: string) {
    this.productService.getOrderDetails(orderId).pipe(
      this.toast.observe({
        loading: 'Generating Invoice 📃',
        success: 'Invoice Generated',
        error: (err) => 'Failed to Generate !!, We are on it fixing the issue 👷'
      }),
      catchError(error => of(error))
    ).subscribe({
      next: (resposne) => {
        // console.log(resposne);
        this.openBillModal = true;
        this.orderBill = resposne;
        this.customerDetails = resposne.customerDetails;
      }
    })
  }

}
