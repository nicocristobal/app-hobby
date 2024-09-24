import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  displayName: string = '';
  email: string = '';
  password: string = '';
  isEmpresa: boolean = false;  

  constructor(private authService: AuthService) {}

  register() {
    if (this.displayName && this.email && this.password) {
      
      const role = this.isEmpresa ? 'empresa' : 'user'; 

      this.authService.register(this.email, this.password, this.displayName, role)
        .then(() => {
          console.log('Usuario registrado con éxito');
        })
        .catch(error => {
          console.error('Error en el registro:', error);
        });
    } else {
      console.error('Todos los campos son obligatorios.');
    }
  }
}
