import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  ok: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  submit(payload: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${environment.apiUrl}/contact`, payload);
  }
}
