import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Edit, Trash2, UserPlus } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { Admin } from '../../../model/admin.modal';
import { AddAdminComponent } from '../../components/modals/add-admin/add-admin.component';

@Component({
  selector: 'app-manage-admins',
  imports: [
    LucideAngularModule,
    DatePipe,
    FormsModule,
    AddAdminComponent
  ],
  templateUrl: './manage-admins.component.html',
  styles: ``
})
export class ManageAdminsComponent {

  admins: any[] = [];
  isLoading = false;
  searchTerm = '';

  // Icons
  readonly editIcon = Edit;
  readonly deleteIcon = Trash2;
  readonly addAdminIcon = UserPlus;

  constructor(
    private adminService: AdminService,
    private toast: HotToastService
  ) { }

  showAddAdminModal = false;

  openAddAdminModal() {
    this.showAddAdminModal = true;
  }

  onAdminAdded(newAdmin: any) {
    // Refresh your admin list or add the new admin directly
    this.loadAdmins();
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toast.error('Failed to load admins');
        this.isLoading = false;
      }
    });
  }

  searchAdmins(): void {
    if (!this.searchTerm) {
      this.loadAdmins();
      return;
    }
    this.admins = this.admins.filter(admin =>
      admin.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteAdmin(adminId: number): void {

    console.log("DELETE", adminId);
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(adminId).subscribe({
        next: () => {
          this.toast.success('Admin deleted successfully');
          this.loadAdmins();
        },
        error: () => {
          this.toast.error('Failed to delete admin');
        }
      });
    }
  }


}
