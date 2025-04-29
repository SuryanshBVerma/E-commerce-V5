import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ProductsService } from '../../services/products.service';
import { User } from '../../model/user.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthService } from '../../services/auth.service';
import { EditUserModalComponent } from "../../admin/components/modals/edit-user modal/modal/modal.component";
import { EditProfileComponent } from "../../components/modals/edit-profile/edit-profile.component";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
    NavbarComponent,
    DatePipe,
    FormsModule,
    EditUserModalComponent,
    EditProfileComponent
],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {

  isLoading = false;
  openEditProfileModal = false;

  userDetails: User = {} as User;
  settings = {
    emailNotifications: false,
    twoFactorAuth: false,
    profilePrivacy: true
  };

  constructor(
    private userService : UserService,
    private authService : AuthService,
    private router : Router,
    private toast : HotToastService
  ) {

  }

  ngOnInit() {
    this.isLoading = true;

    const token = localStorage.getItem('auth_token');

    if (!token) {
      this.toast.error("You are not logged In.")
      this.router.navigate(['/']) 
      return;
    }

    this.userService.getProfieDetails().subscribe({
      next: (Response) => {
        this.isLoading = false;
        this.userDetails = Response;
        // console.log(this.userDetails);
      }
    })
  }

  openModal(){
    this.openEditProfileModal = true;
  }

  closeModal(){
    this.openEditProfileModal = false;
  }

  saveProfileChanges(data: any){
    this.closeModal();
    // CALL THE UPDATE PROFILE ROUTE
    console.log("Details received", data);
    this.userService.updateUserProfile(data).subscribe({
      next : (response) => {
        this.toast.success("Changes made Successfully", response);
        this.reloadCurrentRoute();
      },
      error : (err) => {
        this.toast.error("Something went wrong !!");
      }
    })

  }

  logout(){
    this.toast.loading("Logging out!")
    setTimeout(() => {
      this.toast.close();
      this.authService.logout();
    }, 2000);
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}