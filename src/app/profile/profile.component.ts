import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';  // Asegúrate de importar el servicio de usuario
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  currentUser: any;
  newDisplayName: string = '';
  favoriteActivities: any[] = [];
  isLoading: boolean = false;  

  constructor(private authService: AuthService, private firestore: AngularFirestore, private userService: UserService) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.newDisplayName = user.displayName;  
        this.loadFavoriteActivities(); 
      }
    });
  }

  updateProfile() {
    if (this.currentUser) {
      this.firestore.collection('users').doc(this.currentUser.uid).update({
        displayName: this.newDisplayName
      }).then(() => {
        console.log('Perfil actualizado con éxito');
      }).catch(error => {
        console.error('Error al actualizar el perfil:', error);
      });
    }
  }

  // Cargar las actividades favoritas del usuario
  loadFavoriteActivities() {
    this.userService.getFavoriteActivities().subscribe(activities => {
      this.favoriteActivities = activities;
    });
  }

  // Método mejorado para eliminar una actividad
  removeActivity(activity: any) {
    this.isLoading = true;  // Mostrar indicador de carga

    // Elimina la actividad del estado local inmediatamente
    this.favoriteActivities = this.favoriteActivities.filter(a => a !== activity);

    // Luego elimina la actividad de la base de datos
    this.userService.removeActivityFromFavorites(activity).then(() => {
      console.log('Actividad eliminada de favoritos.');
      this.isLoading = false;  
    }).catch(error => {
      console.error('Error al eliminar actividad de favoritos:', error);
      this.isLoading = false;  
    });
  }
}
