import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../model/cartItem';

@Pipe({
  name: 'orderTotal'
})
export class OrderTotalPipe implements PipeTransform {

  transform(items: CartItem[], taxRate: number = 0, shipping: number = 10): any {
    if (!items) return null;

    shipping = (items.length > 0) ? shipping : 0;
    const subtotal = parseFloat((items.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0)).toFixed(2));

    const tax = parseFloat((subtotal * taxRate).toFixed(2));
    const total = parseFloat((subtotal + tax + shipping).toFixed(2));


    return {
      subtotal,
      tax,
      shipping,
      total
    };
  }

}
