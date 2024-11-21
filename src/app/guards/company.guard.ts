
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      map(user => {
        if (user && user.role === 'empresa') {  // Verifica si el usuario es administrador
          return true;
        } else {
          this.router.navigate(['/login']);  // Redirige a la página de inicio si no es administrador
          return false;
        }
      })
    );
  }
}
