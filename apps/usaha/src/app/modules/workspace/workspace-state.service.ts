import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceStateService {
  title$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor() { }
}
