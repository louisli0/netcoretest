import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor() { }
  notification: Subject<string> = new Subject();
  
}
