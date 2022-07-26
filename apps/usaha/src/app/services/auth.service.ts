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
    return this.http.post<UserTokenDto|null>('/api/auth-user/login', payload);
  }
  register(candidate:RegisterUserDto):Observable<void>{
    return this.http.post<void>('/api/auth-user/register',candidate);
  }
  myProfile():Observable<UserDto>{
    return this.http.get<UserDto>('/api/auth-user/my-profile');
  }
  // TODO forget password
  // TODO renew password
}
