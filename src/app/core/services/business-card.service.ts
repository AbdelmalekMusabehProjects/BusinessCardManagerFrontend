import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessCard } from '../models/business-card.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {

  private baseUrl = `${environment.baseUrl}/business-cards`;

  constructor(private http: HttpClient) {}

  create(card: BusinessCard): Observable<any> {
    return this.http.post(`${this.baseUrl}`, card);
  }

  getAll(): Observable<BusinessCard[]> {
    return this.http.get<BusinessCard[]>(`${this.baseUrl}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  importCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/import/csv`, formData);
  }

  importXml(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/import/xml`, formData);
  }

  exportCsv() {
    return this.http.get(`${this.baseUrl}/export/csv`, { responseType: 'blob' });
  }

  exportXml() {
    return this.http.get(`${this.baseUrl}/export/xml`, { responseType: 'blob' });
  }
}
