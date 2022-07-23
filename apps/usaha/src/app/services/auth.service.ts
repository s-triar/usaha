import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUserDto, RegisterUserDto, UserDto, UserTokenDto } from '@usaha/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(payload:LoginUserDto):Observable<UserTokenDto|null>{
    return this.http.post<UserTokenDto|null>('/api/user-auth/login', payload);
  }
  register(candidate:RegisterUserDto):Observable<void>{
    return this.http.post<void>('/api/user-auth/register',candidate);
  }
  myProfile():Observable<UserDto>{
    return this.http.get<UserDto>('/api/user-auth/my-profile');
  }
  // TODO forget password
  // TODO renew password
}
