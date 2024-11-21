import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';  
import { map } from 'rxjs/operators';  

@Injectable({
  providedIn: 'root'
})
export class AdvertisingService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Agregar una nueva publicidad
  addAdvertisement(advertisement: any): Promise<any> {
    return this.firestore.collection('advertisements').add(advertisement);
  }

  // Obtener las publicidades de una empresa específica
  getAdvertisementsByCompany(companyId: string): Observable<any[]> {
    return this.firestore.collection('advertisements', ref => ref.where('companyId', '==', companyId))
      .valueChanges({ idField: 'id' }) as Observable<any[]>;
  }

  // Eliminar publicidad y su imagen de Storage
  deleteAdvertisement(adId: string, imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Eliminar imagen del almacenamiento
      this.storage.refFromURL(imageUrl).delete().subscribe(() => {
        // Eliminar documento en Firestore
        this.firestore.collection('advertisements').doc(adId).delete().then(() => {
          resolve();
        }).catch(reject);
      }, reject);
    });
  }

  // Obtener todas las publicidades
  getAdvertisements(): Observable<any[]> {
    return this.firestore.collection('advertisements').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };  // Devuelve el ID y los datos del anuncio
        });
      })
    );
  }
}
