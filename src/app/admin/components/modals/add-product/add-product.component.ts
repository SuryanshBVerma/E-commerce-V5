import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { Product } from '../../../../model/product';
import { LoaderCircle, LucideAngularModule, Plus,PackagePlus } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  imports: [
    LucideAngularModule,
    FormsModule
  ],
  templateUrl: './add-product.component.html',
  styles: ``
})
export class AddProductComponent {

  @Input() isOpen: boolean = false;
  @Input() isSaving: boolean = false;
  @Output() save = new EventEmitter<Product>();
  @Output() modalClose = new EventEmitter<void>();

  readonly loader = LoaderCircle;
  readonly plusIcon = Plus;
  readonly addProducts = PackagePlus;

  newProduct: Product = {
    productId: 0,
    productName: '',
    productPrice: 0,
    productDescription: '',
    productCategory: '',
    productStock: 0,
    productTag: '',
    productImageUrl: ''
  } as Product;

  constructor(private toast: HotToastService) {}

  addProduct(): void {
    if (!this.validateProduct()) return;
    this.save.emit({...this.newProduct});
  }

  private validateProduct(): boolean {
    if (!this.newProduct.productName) {
      this.toast.error('Product name is required');
      return false;
    }
    if (this.newProduct.productPrice <= 0) {
      this.toast.error('Price must be greater than 0');
      return false;
    }
    return true;
  }

  closeModal(): void {
    this.modalClose.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.newProduct = {
      productId: 0,
      productName: '',
      productPrice: 0,
      productDescription: '',
      productCategory: '',
      productStock: 0,
      productTag: '',
      productImageUrl: ''
    } as Product;
  }

}
