import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AdvertisingService } from 'src/app/services/advertising.service';
import { AuthService } from 'src/app/services/auth.service';  // Asegúrate de que el servicio de autenticación esté importado
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
})
export class AdvertisingComponent implements OnInit {
  advertisement: any = { title: '', imageUrl: '', companyId: '' };
  selectedImage: File | null = null;
  uploadProgress: number | null | undefined = null;
  currentCompanyId: string = '';
  advertisements: any[] = [];

  constructor(
    private storage: AngularFireStorage,
    private advertisingService: AdvertisingService,
    private authService: AuthService  
  ) {}

  ngOnInit() {
    // usuario actual y companyId si es una empresa
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log('Datos del usuario:', user);
        if (user.role === 'empresa') {
          this.currentCompanyId = user.uid;  // Aquí se asigna el ID de la empresa del usuario autenticado
          this.loadAdvertisements();  // Cargar anuncios de la empresa
        } else {
          console.error('El usuario actual no tiene permisos de empresa.');
        }
      } else {
        console.error('No se encontró un usuario autenticado.');
      }
    });
  }

  // selección de la imagen
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    } else {
      console.error('No se seleccionó ninguna imagen.');
    }
  }

  // Sube la imagen a Firebase Storage y guarda los datos de la publicidad
  uploadAd() {
    if (this.selectedImage && this.advertisement.title) {
      const filePath = `advertisements/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedImage);

      
      task.percentageChanges().subscribe(progress => {
        this.uploadProgress = progress;
      });

      // Finalizar la subida y obtener el enlace de la imagen
      task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url: string) => {
              this.advertisement.imageUrl = url;
              this.advertisement.companyId = this.currentCompanyId;  
              
              
              this.advertisingService.addAdvertisement(this.advertisement).then(() => {
                console.log('Publicidad subida correctamente');
                
                this.advertisement = { title: '', imageUrl: '', companyId: this.currentCompanyId };
                this.selectedImage = null;
                this.uploadProgress = null;
                this.loadAdvertisements(); // Recargar la lista de publicidades
              }).catch(error => {
                console.error('Error al subir la publicidad:', error);
              });
            });
          })
        ).subscribe();
    } else {
      console.error('Debe seleccionar una imagen y proporcionar un título para la publicidad.');
    }
  }

  // Cargar la lista de publicidades de la empresa actual
  loadAdvertisements() {
    if (this.currentCompanyId) {
      this.advertisingService.getAdvertisementsByCompany(this.currentCompanyId).subscribe((ads: any[]) => {
        this.advertisements = ads;
      }, error => {
        console.error('Error al cargar las publicidades:', error);
      });
    } else {
      console.error('No se puede cargar la publicidad sin un companyId.');
    }
  }

  // Eliminar una publicidad
  deleteAd(adId: string, imageUrl: string) {
    this.advertisingService.deleteAdvertisement(adId, imageUrl).then(() => {
      console.log('Publicidad eliminada correctamente');
      this.loadAdvertisements(); // Recargar la lista de publicidades
    }).catch(error => {
      console.error('Error al eliminar la publicidad:', error);
    });
  }
}
