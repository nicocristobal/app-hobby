import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  getImages(): Observable<any[]> {
    return this.firestore.collection('carousel-images').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  

  uploadImage(file: File): Promise<string> {
    const filePath = `carousel/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe({
            next: (url) => {
              this.firestore.collection('carousel-images').add({ url })
                .then(() => resolve(url))
                .catch(error => reject(error));
            },
            error: (error) => reject(error)
          });
        })
      ).subscribe();
    });
  }

  deleteImage(imageId: string, imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.refFromURL(imageUrl).delete().subscribe(
        () => {
          this.firestore.collection('carousel-images').doc(imageId).delete().then(() => {
            resolve();
          }).catch(reject); 
        },
        reject 
      );
    });
  }

}
