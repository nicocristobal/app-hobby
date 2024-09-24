import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, from, Observable } from 'rxjs';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({ role: 'admin' }))  // Simula un usuario administrador
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // Función de utilidad para convertir cualquier tipo a un Observable
  function toObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
    if (value instanceof Observable) {
      return value;
    } else if (value instanceof Promise) {
      return from(value);
    } else {
      return of(value);
    }
  }

  it('should allow activation if the user is an admin', (done) => {
    toObservable(guard.canActivate()).subscribe((canActivate) => {  // función de utilidad para convertir el resultado a Observable
      expect(canActivate).toBeTrue();  // Espera que se permita la activación
      done();
    });
  });

  it('should not allow activation if the user is not an admin', (done) => {
    // Simula un usuario que no es administrador
    authServiceMock.getCurrentUser.and.returnValue(of({ role: 'user' }));
    
    toObservable(guard.canActivate()).subscribe((canActivate) => {  // función de utilidad para convertir el resultado a Observable
      expect(canActivate).toBeFalse();  // Espera que no se permita la activación
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);  // Espera que redirija al inicio de sesión
      done();
    });
  });
});
