import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../model/product';
import { AlertTriangle, LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-delete-product',
  imports: [
    LucideAngularModule,
    DecimalPipe
  ],
  templateUrl: './delete-product.component.html',
  styles: ``
})
export class DeleteProductComponent {

  @Input() product: Product = {} as Product;
  @Input() isOpen: boolean = false;
  @Input() isDeleting: boolean = false;
  @Output() deleteConfirmed = new EventEmitter<Product>();
  @Output() modalClose = new EventEmitter<void>();

  readonly loader = LoaderCircle;
  readonly warningIcon = AlertTriangle;

  confirmDelete(): void {
    this.deleteConfirmed.emit(this.product);
  }

  closeModal(): void {
    this.modalClose.emit();
  }

}
