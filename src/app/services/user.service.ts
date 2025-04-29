import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { delay, Observable } from 'rxjs';

interface UserProfile {
  id?: number;
  name: string;
  username: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  description?: string;
  location?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private token = localStorage.getItem('auth_token');

  getProfieDetails() {
    const apiUrl = `http://localhost:9000/api/user/me`;
    const headers = {
      'Authorization': `Bearer ${this.token}`
    };
    
    return this.http.get<User>(apiUrl, { headers }).pipe(
      delay(700)
    );
  }
  
  updateUserProfile(userData: any): Observable<any> {

    const apiUrl = `http://localhost:9000/api/user/update`;
    // Get auth token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // Prepare headers with authorization
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Construct the payload with only changed fields if needed
    const payload = {
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      address: userData.address,
      description: userData.description,
      location: userData.location,
      profileImage: userData.profileImage,
    };

    console.log("making request POST");
    console.log(payload);
    

    return this.http.post(`${apiUrl}`, payload, { headers });
  }

}
