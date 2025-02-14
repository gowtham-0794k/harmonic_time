import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
    }),
  };

  constructor(private _httpClient: HttpClient) {}

  // get api data

  getObservable(_url: string | any): Observable<any> {
    const url = _url;
    return this._httpClient.get(url, this.httpOptions);
  }

  getObservableToken(_url: string | any): Observable<any> {
    const httpOptionsToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem('token') || ''
        )}`,
      }),
    };
    const url = _url;
    return this._httpClient.get(url, httpOptionsToken);
  }

  getObservableJw(_url: string): Observable<any> {
    const url = _url;
    return this._httpClient.get(url);
  }

  // post api data

  postObservable(_url: string, data: any): Observable<any> {
    const url = _url;
    return this._httpClient.post(url, data, this.httpOptions);
  }

  putObservable(_url: string, data: any): Observable<any> {
    const url = _url;
    return this._httpClient.put(url, data, this.httpOptions);
  }

  getData() {
    return of([1, 2, 3]);
  }
}
