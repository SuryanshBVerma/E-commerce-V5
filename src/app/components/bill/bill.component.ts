import { Component, Input } from '@angular/core';
import { Order } from '../../model/order.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-bill',
  imports: [
    NgClass,
    DatePipe,
    NgFor
  ],
  templateUrl: './bill.component.html'
})
export class BillComponent {
  @Input() order!: Order;
  @Input() customerDetails!: any;

  generatePDF() {
    const doc = new jsPDF();

    // Initialize autoTable by adding it to jsPDF instance
    (doc as any).autoTable = autoTable;

    // Add logo and header
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('SHOPIFY STORE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('123 Shopping Street, Retail City', 105, 30, { align: 'center' });
    doc.text('GSTIN: 22AAAAA0000A1Z5', 105, 36, { align: 'center' });

    // Add invoice title
    doc.setFontSize(16);
    doc.text('INVOICE', 105, 50, { align: 'center' });

    // Order details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${this.order.orderId}`, 15, 65);
    doc.text(`Date: ${new Date(this.order.createdAt).toLocaleDateString()}`, 15, 72);

    // Customer details (you can add these to your Order model if needed)
    console.log(this.customerDetails);
    
    doc.text(`Bill To:`, 15, 85);
    doc.text(`${this.customerDetails.name}`, 15, 92);
    doc.text(`${this.customerDetails.email}`, 15, 99);
    doc.text(`${this.customerDetails.address}`, 15, 106);

    // Items table
    autoTable(doc, {
      startY: 120,
      head: [['#', 'Item', 'Price', 'Qty', 'Amount']],
      body: this.order.items.map((item, index) => [
        index + 1,
        item.productName,
        `$${item.productPrice.toFixed(2)}`,
        item.quantity,
        `$${(item.productPrice * item.quantity).toFixed(2)}`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0]
      }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text(`Subtotal: $${this.order.totalAmount.toFixed(2)}`, 150, finalY);
    doc.text(`Tax: $0.00`, 150, finalY + 8);
    doc.text(`Shipping: $0.00`, 150, finalY + 16);
    doc.setFontSize(12);
    doc.text(`Total: $${this.order.totalAmount.toFixed(2)}`, 150, finalY + 28);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your purchase!', 105, 280, { align: 'center' });
    doc.text('Terms & Conditions apply', 105, 286, { align: 'center' });

    // Save the PDF
    doc.save(`invoice_${this.order.orderId}.pdf`);
  }
}

