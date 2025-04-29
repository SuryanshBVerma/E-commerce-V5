import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {LogOut, LucideAngularModule  } from 'lucide-angular';
import { AdminService } from '../../services/admin.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'admin-side-bar',
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './side-bar.component.html',
  styles: ``
})
export class SideBarComponent {

  readonly logout = LogOut;

  constructor(private adminService: AdminService, private toast : HotToastService){}

  logOut(){
    this.toast.loading("Logging Out")
    setTimeout(() => {
      this.adminService.logout();
      this.toast.close()
    }, 1500);
  }

}
