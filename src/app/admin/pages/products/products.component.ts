import { Component } from '@angular/core';
import { Product } from '../../../model/product';
import { AdminService } from '../../services/admin.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteProductComponent } from '../../components/modals/delete-product/delete-product.component';
import { EditProductComponent } from '../../components/modals/edit-product/edit-product.component';
import { AddProductComponent } from '../../components/modals/add-product/add-product.component';
import { LucideAngularModule, PackagePlus} from 'lucide-angular';


@Component({
  selector: 'app-products',
  imports: [
    DecimalPipe,
    FormsModule,
    EditProductComponent,
    DeleteProductComponent,
    AddProductComponent,
    LucideAngularModule
  ],
  templateUrl: './products.component.html',
  styles: ``
})
export class ListProductsComponent {
  Math = Math;

  readonly addProducts = PackagePlus;

  // Product Data
  products: Product[] = [];
  productsToDisplay: Product[] = [];

  // Loading States
  isLoading: boolean = true;
  isUpdatingProduct: boolean = false;
  isDeletingProduct: boolean = false;

  // Modals
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedProduct: Product = {} as Product;
  productToDelete: Product = {} as Product;

  // Search & Filter
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private adminService: AdminService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.adminService.getAllproducts().subscribe({
      next: (products) => {
        this.products = products;
        this.productsToDisplay = [...products];
        this.totalItems = products.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load products');
        this.isLoading = false;
      }
    });
  }

  searchProducts(): void {
    if (!this.searchTerm) {
      this.productsToDisplay = [...this.products];
      this.totalItems = this.products.length;
      this.currentPage = 1;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.productsToDisplay = this.products.filter(product =>
      product.productName.toLowerCase().includes(term) ||
      product.productDescription.toLowerCase().includes(term) ||
      product.productCategory.toLowerCase().includes(term)
    );
    this.totalItems = this.productsToDisplay.length;
    this.currentPage = 1;
  }

  // Pagination Methods
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Product Actions
  editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.showEditModal = true;
  }

  saveProduct(updatedProduct: Product): void {
    this.isUpdatingProduct = true;
    this.adminService.updateProduct(updatedProduct).subscribe({
      next: (response) => {
        this.toast.success('Product updated successfully');
        this.loadProducts();
        this.closeEditModal();
        this.isUpdatingProduct = false;
        console.log(response);
      },
      error: () => {
        this.toast.error('Failed to update product');
        this.isUpdatingProduct = false;
      }
    });
  }

  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;

    this.isDeletingProduct = true;
    this.adminService.deleteProduct(this.productToDelete.productId).subscribe({
      next: () => {
        this.toast.success('Product deleted successfully');
        this.loadProducts();
        this.closeDeleteModal();
        this.isDeletingProduct = false;
      },
      error: () => {
        this.toast.error('Failed to delete product');
        this.isDeletingProduct = false;
      }
    });
  }

  // Modal Controls
  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProduct = {} as Product;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = {} as Product;
  }


  // LOGIC FOR ADDING PRODUCTS
  showAddModal: boolean = false;
  isSavingProduct : boolean = false;

  openAddModal(): void {
    this.showAddModal = true;
  }

  saveNewProduct(newProduct: Product): void {
    this.isSavingProduct = true;
    this.adminService.addProduct(newProduct).subscribe({
      next: () => {
        this.toast.success('Product added successfully');
        this.loadProducts();
        this.showAddModal = false;
        this.isSavingProduct = false;
      },
      error: (error) => {
        this.toast.error('Failed to add product');
        this.toast.error('Recheck if the fields are properly filled !!');
        this.isSavingProduct = false;
      }
    });
  }
}
