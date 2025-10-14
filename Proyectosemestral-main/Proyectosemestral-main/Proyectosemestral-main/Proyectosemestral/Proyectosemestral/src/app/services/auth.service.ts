import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

export interface User {
  email: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  async init() {
    await this.storage.create();
    const user = await this.storage.get('currentUser');
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    // Simulación de login - en producción usarías una API real
    if (email === 'admin@finanzas.com' && password === '123456') {
      const user: User = {
        email: email,
        token: 'fake-jwt-token-' + Date.now()
      };

      await this.storage.set('currentUser', user);
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  async logout() {
    await this.storage.remove('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable(observer => {
      this.currentUser$.subscribe(user => {
        observer.next(!!user);
      });
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
