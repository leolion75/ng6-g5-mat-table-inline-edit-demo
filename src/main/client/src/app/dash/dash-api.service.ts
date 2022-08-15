import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Actor} from "./dash.component";

@Injectable({
  providedIn: 'root'
})
export class DashApiService {

  // call the actor API
  constructor(
    private http: HttpClient
  ) { }

  getData():Observable<any> {
    return this.http.get('/actor');
  }

  getActorData():Observable<any> {
    return this.http.get('/actor')
  }

  save(body: any):Observable<any> {

    const httpHeaders = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    });
    const options = { headers: httpHeaders };

    return this.http.put('/actor/' + body.id, body, options)
  }
}
