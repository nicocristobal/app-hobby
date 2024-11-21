import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-manager',
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.css']
})
export class ImageManagerComponent implements OnInit {
  images: any[] = [];
  selectedFile: File | null = null;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadImages() {
    this.imageService.getImages().subscribe(images => {
      this.images = images;
    });
  }

  uploadImage() {
    if (this.selectedFile) {
      this.imageService.uploadImage(this.selectedFile).then((url) => {
        console.log('Imagen subida con éxito:', url);
        this.selectedFile = null;
        this.loadImages();
      }).catch(error => {
        console.error('Error al subir la imagen:', error);
      });
    }
  }

  deleteImage(imageId: string, imageUrl: string) {
    this.imageService.deleteImage(imageId, imageUrl).then(() => {
      console.log('Imagen eliminada con éxito');
      this.loadImages();
    }).catch(error => {
      console.error('Error al eliminar la imagen:', error);
    });
  }
}
