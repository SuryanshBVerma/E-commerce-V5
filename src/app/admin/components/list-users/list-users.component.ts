import { Component } from '@angular/core';
import { LucideAngularModule, UserPen, Trash2, User as UserIcon, ChevronRight, ChevronLeft } from 'lucide-angular';
import { EditUserModalComponent } from "../modals/edit-user modal/modal/modal.component";
import { SideBarComponent } from "../side-bar/side-bar.component";
import { AdminService } from '../../services/admin.service';
import { User } from '../../../model/user.model';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { DeleteUserComponent } from '../modals/delete-user/delete-user.component';



@Component({
  selector: 'app-list-users',
  imports: [
    LucideAngularModule,
    EditUserModalComponent,
    DatePipe,
    FormsModule,
    DecimalPipe,
    CommonModule,
    DeleteUserComponent
  ],
  templateUrl: './list-users.component.html',
  styles: ``
})
export class ListUsersComponent {
  readonly userPen = UserPen;
  readonly trash2 = Trash2;
  readonly userIcon = UserIcon;
  readonly right = ChevronRight;
  readonly left = ChevronLeft;


  showDeleteModal = false;
  selectedUserForDeletion: User = {} as User;
  isDeletingUser = false;



  isLoading = true;
  openModal = false;
  users: User[] = []
  Math = Math;
  userToBeEdited: User = {} as User;
  savingUser = false;


  // Filtered users (displayed in table)
  filteredUsers: User[] = [];

  // Search term
  searchTerm = '';


  // PAGINATION

  // Displayed users (for pagination)
  displayedUsers: User[] = [];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;

  initializeData(users: any[]) {
    this.users = users;
    this.filteredUsers = [...users];
    this.totalItems = users.length;
    this.updatePagination();
    this.isLoading = false;
  }

  editUser(user: User | null) {
    this.openModal = !this.openModal;
    if (user) {
      this.userToBeEdited = user;
    }
  }

  constructor(
    private adminService: AdminService,
    private toast: HotToastService
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.users = response;
        this.initializeData(this.users);
      }
    })
  }

  saveUser(user: User) {
    
    this.savingUser = true;
    this.adminService.updateUserDetails(user).subscribe({
      next: (Response) => {
        this.openModal = !this.openModal;
        this.toast.success(Response.message ? Response.message : "User Upadeted Successfully!!!")
        this.savingUser = false;
        this.loadUsers();
      },
      error: (err) => {
        this.savingUser = false;
        console.log(err);
        this.toast.success(err.error ? err.error : "User Upadeted Successfully!!!")
      }
    })
  }

  // Search function
  searchUsers() {
    if (!this.searchTerm.trim()) {
      // If search term is empty, show all users
      this.filteredUsers = [...this.users];
      return;
    }

    console.log("input called");

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.location && user.location.toLowerCase().includes(term)))
  }

  // Pagination logic
  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    // Ensure current page is within valid range
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

    // Calculate start and end index
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);

    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  // Change page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5; // Adjust this to show more/fewer page numbers

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're at the start or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  get usersToDisplay() {
    return this.searchTerm ? this.filteredUsers : this.displayedUsers;
  }

  openDeleteModal(user: User): void {
    this.selectedUserForDeletion = user;
    this.showDeleteModal = true;
  }
  
  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }
  
  onDeleteConfirmed(user: User): void {
    this.isDeletingUser = true;
    console.log("DELETE", user);
    
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.toast.success('User deleted successfully');
        this.loadUsers();
        this.isDeletingUser = false;
        this.showDeleteModal = false;
      },
      error: () => {
        this.toast.error('Failed to delete user');
        this.isDeletingUser = false;
      }
    });
  }
}
