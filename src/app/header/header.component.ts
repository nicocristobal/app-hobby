// header.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  isAdmin: boolean = false;
  isCompany: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.uid) {
        this.currentUser = user;
        // Comprobar si el usuario es administrador
        this.userService.isAdmin(user.uid).subscribe(isAdmin => {
          this.isAdmin = isAdmin;
        });
        // Comprobar si el usuario es una empresa
        this.userService.isCompany(user.uid).subscribe(isCompany => {
          this.isCompany = isCompany;
        });
      } else {
        // Si no hay usuario autenticado, reiniciar los valores
        this.currentUser = null;
        this.isAdmin = false;
        this.isCompany = false;
      }
    });
  }
  

  logout(): void {
    this.authService.logout().then(() => {
      this.currentUser = null;  
      this.isAdmin = false;     
      this.isCompany = false;   
      location.reload();
    });
  }
}