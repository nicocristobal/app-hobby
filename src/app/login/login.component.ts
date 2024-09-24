import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  // Variable para almacenar el mensaje de error

  constructor(private authService: AuthService) {}

  login() {
    this.errorMessage = ''; // Resetear el mensaje de error antes de intentar iniciar sesión
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .then(() => {
          console.log('Usuario logueado con éxito');
        })
        .catch(error => {
          console.error('Error en el inicio de sesión:', error);
          this.handleError(error);  
        });
    } else {
      this.errorMessage = 'Todos los campos son obligatorios.';
    }
  }

  // Método para manejar errores
  handleError(error: any): void {
    // Aquí puedes manejar diferentes códigos de error
    if (error.code === 'auth/user-not-found') {
      this.errorMessage = 'El usuario no existe.';
    } else if (error.code === 'auth/wrong-password') {
      this.errorMessage = 'Contraseña incorrecta. Por favor, inténtalo de nuevo.';
    } else if (error.code === 'auth/invalid-email') {
      this.errorMessage = 'El formato del correo electrónico no es válido.';
    } else {
      this.errorMessage = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
    }
  }
}
