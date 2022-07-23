import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  checkUsernameExist(username:string):Observable<boolean>{
    return this.http.get<boolean>('/api/user/check-username-exist',{params: {username:username}});
  }
  checkEmailExist(email:string):Observable<boolean>{
    return this.http.get<boolean>('/api/user/check-email-exist',{params: {email:email}});
  }
}
