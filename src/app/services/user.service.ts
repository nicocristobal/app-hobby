import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';  

@Injectable({
  providedIn: 'root'
})
export class UserService {
  afAuth: any;
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Método para añadir una actividad a favoritos
  addActivityToFavorites(activity: any): Promise<void> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.uid) {
          const userRef = this.firestore.collection('users').doc(user.uid);
          return userRef.update({
            favoriteActivities: firebase.firestore.FieldValue.arrayUnion(activity)  // Usar firebase.firestore.FieldValue
          });
        } else {
          return Promise.reject('Usuario no autenticado');
        }
      })
    ).toPromise() as Promise<void>;
  }

  // Método para eliminar una actividad de favoritos
  removeActivityFromFavorites(activity: any): Promise<void> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.uid) {
          const userRef = this.firestore.collection('users').doc(user.uid);
          return userRef.update({
            favoriteActivities: firebase.firestore.FieldValue.arrayRemove(activity)  // Usar firebase.firestore.FieldValue para eliminar
          });
        } else {
          return Promise.reject('Usuario no autenticado');
        }
      })
    ).toPromise() as Promise<void>;
  }

  // Obtener actividades favoritas del usuario
  getFavoriteActivities(): Observable<any[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.uid) {
          return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
            map((userData: any) => userData.favoriteActivities || [])
          );
        } else {
          return [];
        }
      })
    );
  }

  // Obtener todos los usuarios desde la colección 'users'
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('users').valueChanges();
  }

  // Actualizar el rol de un usuario
  updateUserRole(uid: string, newRole: string): Promise<void> {
    return this.firestore.collection('users').doc(uid).update({ role: newRole });
  }


  // Eliminar un usuario de la base de datos y de la autenticación
  async deleteUser(uid: string) {
    try {
      // Eliminar el usuario de Firestore
      await this.firestore.collection('users').doc(uid).delete();
      console.log('Usuario eliminado de Firestore');

      // Eliminar el usuario de Firebase Authentication
      const user = await this.afAuth.currentUser;
      if (user && user.uid === uid) {
        await user.delete();
        console.log('Usuario eliminado de Firebase Authentication');
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }

  // Verificar si el usuario es administrador
  isAdmin(uid: string): Observable<boolean> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((userData: any) => {
        console.log('Datos del usuario:', userData);  // Verifica la respuesta del documento
        return userData?.role === 'admin';
      })
    );
  }

  // Verificar si el usuario es empresa
  isCompany(uid: string): Observable<boolean> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((userData: any) => {
        console.log('Datos del usuario:', userData);  // Verifica la respuesta del documento
        return userData?.role === 'empresa';
      })
    );
  }

}
