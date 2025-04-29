import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../model/product';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { AdminService } from '../../../services/admin.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  imports: [
    LucideAngularModule,
    FormsModule
  ],
  templateUrl: './edit-product.component.html',
  styles: ``
})
export class EditProductComponent {

  @Input() product: Product = {} as Product;
  @Input() isOpen: boolean = false;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Product>();
  @Output() modalClose = new EventEmitter<void>();

  readonly loader = LoaderCircle;
  editedProduct: Product = {} as Product;

  constructor(
    private adminService: AdminService,
    private toast: HotToastService
  ) {}

  ngOnChanges(): void {
    if (this.product) {
      this.editedProduct = { ...this.product };
    }
  }

  saveProduct(): void {
    this.save.emit(this.editedProduct);
  }

  closeModal(): void {
    this.modalClose.emit();
  }

}
