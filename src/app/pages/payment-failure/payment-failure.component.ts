import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-failure',
  imports: [
    NgIf,
  ],
  templateUrl: './payment-failure.component.html',
  styles: ``
})
export class PaymentFailureComponent {

  @Input() showModal : boolean = false;
  @Input() errorMessage?: string = "something went wrong";
  @Output() closed = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  closeModal() {
    this.showModal = false
    this.closed.emit();
  }

  retryPayment() {
    this.retry.emit();
  }

}
