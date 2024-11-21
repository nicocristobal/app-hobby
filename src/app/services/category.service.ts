 import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getCategories(): Observable<any[]> {
    return this.firestore.collection('categories').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Subir imagen de la categoría
  uploadCategoryImage(file: File): Promise<string> {
    const filePath = `categories/${Date.now()}_${file.name}`; 
    const fileRef = this.storage.ref(filePath); 
    return this.storage.upload(filePath, file).then(() => { 
      return fileRef.getDownloadURL().toPromise(); 
    });
  }

  addCategory(category: any): Promise<any> {
    return this.firestore.collection('categories').add(category).then(() => {
      console.log('Categoría agregada a Firestore');  
    }).catch(error => {
      console.error('Error al agregar la categoría a Firestore:', error);  
      throw error;  
    });
  }

  deleteCategory(categoryId: string): Promise<any> {
    return this.firestore.collection('categories').doc(categoryId).delete();
  }

  addActivity(categoryId: string, activity: any): Promise<any> {
    return this.firestore.collection('categories').doc(categoryId).collection('activities').add(activity);
  }

  deleteActivity(categoryId: string, activityId: string): Promise<any> {
    return this.firestore.collection('categories').doc(categoryId).collection('activities').doc(activityId).delete();
  }

  getActivitiesByCategory(categoryId: string): Observable<any[]> {
    return this.firestore.collection('categories').doc(categoryId).collection('activities').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  
  getCategoryName(categoryId: string): Observable<string> {
    return this.firestore.collection('categories').doc(categoryId).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data() as any;
        return data.name;  
      })
    );
  }
  
}
