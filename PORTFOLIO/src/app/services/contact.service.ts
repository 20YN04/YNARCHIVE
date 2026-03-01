import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  ok: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  submit(payload: ContactPayload): Observable<ContactResponse> {
    const { serviceId, templateId, publicKey } = environment.emailjs;
    if (!publicKey) {
      return from(
        Promise.reject(new Error('EmailJS Public Key is not set. Add it in src/environments/environment.ts'))
      ).pipe(
        catchError((err) => {
          throw err;
        })
      );
    }
    const templateParams = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
    };
    return from(
      emailjs.send(serviceId, templateId, templateParams, { publicKey })
    ).pipe(
      map(() => ({ ok: true } as ContactResponse)),
      catchError((err) => {
        const msg = err?.text ?? err?.message ?? 'Failed to send message. Please try again.';
        throw { error: { error: msg } };
      })
    );
  }
}
