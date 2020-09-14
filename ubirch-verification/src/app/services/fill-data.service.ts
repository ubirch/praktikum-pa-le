import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FillDataService {


  constructor() { }

  getData(route): object {
    let data: object;
    route.subscribe(params => {
       data = params;       
    });
      return data;    
  }
}
    
