import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  currentUserRole: string | null = null;  // Rol del usuario autenticado (admin)

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el rol del usuario actual
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserRole = user.role;  // Almacenar el rol del usuario actual
      }
    });

    // Obtener todos los usuarios
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  // Cambiar el rol de un usuario
  changeUserRole(uid: string, newRole: string) {
    this.userService.updateUserRole(uid, newRole)
      .then(() => {
        console.log(`Rol de usuario actualizado a ${newRole}`);
      })
      .catch(error => {
        console.error('Error al actualizar el rol del usuario:', error);
      });
  }
  
   // Eliminar un usuario
   deleteUser(uid: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(uid)
        .then(() => {
          console.log('Usuario eliminado con éxito');
          // Actualizar la lista de usuarios tras la eliminación
          this.users = this.users.filter(user => user.uid !== uid);
        })
        .catch(error => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  }
}
