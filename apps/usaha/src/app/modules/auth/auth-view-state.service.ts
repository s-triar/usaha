import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthViewStateService {
  title: BehaviorSubject<string> = new BehaviorSubject<string>('');
  
  constructor() { 
    this.title.next('');
  }
}
