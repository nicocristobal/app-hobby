import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CompanyGuard } from './company.guard';
import { AuthService } from '../services/auth.service';
import { of, isObservable, from, Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('CompanyGuard', () => {
  let guard: CompanyGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear mocks de los servicios
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        CompanyGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    // Instanciar el guard utilizando TestBed
    guard = TestBed.inject(CompanyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user has the "empresa" role', (done) => {
    // Simular que el usuario tiene el rol "empresa"
    const mockUser = { role: 'empresa' };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));

    // Convertir cualquier valor a un Observable y suscribirse
    toObservable(guard.canActivate()).subscribe(result => {
      expect(result).toBeTrue();
      done(); // Marcar el test como completado
    });
  });

  it('should redirect to login if user does not have the "empresa" role', (done) => {
    // Simular que el usuario no tiene el rol "empresa"
    const mockUser = { role: 'usuario' };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));

    toObservable(guard.canActivate()).subscribe(result => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done(); // Marcar el test como completado
    });
  });

  it('should redirect to login if no user is found', (done) => {
    // Simular que no hay usuario autenticado
    authServiceSpy.getCurrentUser.and.returnValue(of(null));

    toObservable(guard.canActivate()).subscribe(result => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done(); 
    });
  });

  
  function toObservable(result: boolean | Observable<boolean> | Promise<boolean>): Observable<boolean> {
    if (isObservable(result)) {
      return result; 
    } else if (result instanceof Promise) {
      return from(result); 
    } else {
      return of(result); 
    }
  }
});
