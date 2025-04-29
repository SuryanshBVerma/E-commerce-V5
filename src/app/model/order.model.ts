import { OrderItem } from "./orderItem.modal";

export interface Order {
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'PLACED';
    items: OrderItem[];
    totalAmount: number;
}