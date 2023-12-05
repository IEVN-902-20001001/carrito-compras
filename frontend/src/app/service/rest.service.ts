import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  body: {}
};

const address = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  PostRequest(serverAddress: string, info: object): Observable<any> {
    console.log(serverAddress);
    return this.httpClient.post<any>(address + serverAddress, info, httpOptions);
  }

  GetRequest(serverAddress: string): Observable<any> {
    console.log(serverAddress);
    return this.httpClient.get<any>(address + serverAddress);
  }

  PutRequest(serverAddress: string, info: object): Observable<any> {
    console.log(serverAddress);
    return this.httpClient.put<any>(address + serverAddress, info, httpOptions);
  }

  DeleteRequest(serverAddress: string, info: object): Observable<any> {
    console.log(serverAddress);
    return this.httpClient.post<any>(address + serverAddress, info, httpOptions);
  }
}