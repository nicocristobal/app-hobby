import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private firestore: AngularFirestore) {}

  //Obtener actividades filtradas por categoría.
   
  getActivitiesByCategory(categoryId: string, companyId: string): Observable<any[]> {
    return this.firestore
      .collection(`categories/${categoryId}/activities`, ref => 
        ref.where('companyId', '==', companyId)  // Filtrar por companyId
      )
      .valueChanges();
}


  addActivity(activity: any) {
    const categoryId = activity.categoryId;  // El ID de la categoría seleccionada

    // Guardar la actividad en la subcolección de la categoría
    return this.firestore
      .collection(`categories/${categoryId}/activities`)
      .add(activity);
  }

  // Agregar una actividad dentro de una categoría específica.
  
  addActivityToCategory(categoryId: string, activity: any) {
    // Agrega la actividad directamente a la subcolección de actividades dentro de una categoría específica
    return this.firestore.collection(`categories/${categoryId}/activities`).add(activity);
  }

  // Obtener actividades filtradas por empresa.
  getActivitiesByCompany(companyId: string): Observable<any[]> {
    // Filtra las actividades que tienen el 'companyId' igual al proporcionado
    return this.firestore.collection('activities', ref => ref.where('companyId', '==', companyId)).valueChanges({ idField: 'id' });
  }
  

 

  getActivitiesByCategoryForCompany(categoryId: string, companyId: string): Observable<any[]> {
    return this.firestore
      .collection(`categories/${categoryId}/activities`, ref => ref.where('companyId', '==', companyId))
      .valueChanges({ idField: 'id' });  
  }
  

  
  deleteActivity(categoryId: string, activityId: string) {
    return this.firestore
      .collection(`categories/${categoryId}/activities`)  
      .doc(activityId)  
      .delete();
  }
  
  
  

  
}
