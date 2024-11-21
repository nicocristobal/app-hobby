import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

// Define la interfaz de Usuario
interface UserData {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  hobbies: string[];
  role: string;  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.currentUser$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          console.log('Usuario autenticado:', user);  // Verificar usuario autenticado
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        } else {
          console.log('No hay usuario autenticado');
          return of(null);
        }
      })
    );
  }

  // Método para registrar un nuevo usuario con rol
  register(email: string, password: string, displayName: string, role: string = 'user'): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential.user) {
          console.log('Usuario registrado:', userCredential.user);
          // Crear el perfil del usuario en Firestore
          return this.firestore.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: displayName,
            createdAt: new Date(),
            hobbies: [],  
            role: role  
          }).then(() => {
            console.log('Perfil de usuario creado en Firestore');
            return this.router.navigate(['/']).then(() => {}); 
          });
        } else {
          console.error('No se pudo crear el usuario');
          return Promise.reject('No se pudo crear el usuario.');
        }
      })
      .catch(error => {
        console.error('Error durante el registro de usuario:', error);
        throw error;
      });
  }

  // Método para iniciar sesión
  login(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        if (userCredential.user) {
          console.log('Usuario autenticado para iniciar sesión:', userCredential.user); 
          // Obtener el rol del usuario después de iniciar sesión
          const doc = await firstValueFrom(this.firestore.collection('users').doc(userCredential.user.uid).get());
          if (doc && doc.exists) {
            const userData = doc.data() as UserData;
            console.log('Datos del usuario:', userData); 
            if (userData.role === 'admin') {
              console.log('Redirigiendo a la página de administrador');
              return this.router.navigate(['/admin']).then(() => {});  // Redirige al panel de administración si es administrador
            } else if (userData.role === 'empresa') {
              console.log('Redirigiendo a la página de empresa');
              return this.router.navigate(['/company']).then(() => {});  // Redirige a una página especial si es empresa
            } else {
              console.log('Redirigiendo a la página de categorías');
              return this.router.navigate(['/categories']).then(() => {});  // Redirige a categorías si es usuario normal
            }
          } else {
            console.error('No se encontraron datos de usuario.');
            return Promise.reject('No se encontraron datos de usuario.');
          }
        } else {
          console.error('No se pudo autenticar el usuario.');
          return Promise.reject('No se pudo autenticar el usuario.');
        }
      })
      .catch(error => {
        console.error('Error durante el inicio de sesión:', error);
        throw error;
      });
  }

  // Método para cerrar sesión
  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      console.log('Usuario ha cerrado sesión');
      return this.router.navigate(['/categories']).then(() => {});
      
    });
  }

  // Obtener el estado de autenticación del usuario actual
  getUser(): Observable<any> {
    return this.afAuth.authState;
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }

}
