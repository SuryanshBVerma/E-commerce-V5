import { Component } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LucideAngularModule, Edit, Truck, Check, X, RefreshCw } from 'lucide-angular';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-orders',
  imports: [
    FormsModule,
    LucideAngularModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './manage-orders.component.html',
  styles: ``
})
export class ManageOrdersComponent {

  orders: any[] = [];
  isLoading = false;
  searchTerm = '';
  statusOptions = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Icons
  readonly editIcon = Edit;
  readonly shippedIcon = Truck;
  readonly deliveredIcon = Check;
  readonly cancelledIcon = X;
  readonly refreshIcon = RefreshCw;

  constructor(
    private adminServie: AdminService,
    private toast: HotToastService
  ) { }

  onStatusChange(orderId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    this.updateOrderStatus(orderId, newStatus);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.adminServie.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load orders');
        this.isLoading = false;
      }
    });
  }

  searchOrders(): void {
    if (!this.searchTerm) {
      this.loadOrders();
      return;
    }
  
    const searchTermLower = this.searchTerm.toLowerCase();
  
    this.orders = this.orders.filter((order: any) => 
      order.orderId.toString().includes(this.searchTerm) ||
      order.status.toLowerCase().includes(searchTermLower) ||
      order.items.some((item: any) => 
        item.productName.toLowerCase().includes(searchTermLower)
      )
    );
  }

  updateOrderStatus(orderId: number, newStatus: string): void {
    console.log("UPADTE STATUS", newStatus);

    this.adminServie.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.toast.success(`Order status updated to ${newStatus}`);
        this.loadOrders();
      },
      error: () => {
        this.toast.error('Failed to update order status');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PLACED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

}
