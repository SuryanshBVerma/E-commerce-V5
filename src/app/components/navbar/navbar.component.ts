import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Box } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  readonly box = Box;
  isLoggedIn = false;

  ngOnInit(){
    const token = localStorage.getItem("auth_token")

    if(!token){
      this.isLoggedIn = false;
    }else{
      this.isLoggedIn = true;
    }
  }

}
