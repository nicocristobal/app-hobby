import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';  // Para el carrusel de imágenes
import { AdvertisingService } from '../services/advertising.service';  // Para el carrusel de anuncios

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: any[] = [];
  advertisements: any[] = [];  // Array para los anuncios de empresas

  constructor(
    private imageService: ImageService,
    private advertisingService: AdvertisingService  
  ) {}

  ngOnInit(): void {
    this.loadImages();  // Cargar las imágenes del carrusel
    this.loadAdvertisements();  // Cargar los anuncios de publicidad de empresas
  }

  // Cargar las imágenes para el carrusel
  loadImages() {
    this.imageService.getImages().subscribe((images) => {
      console.log('Imágenes cargadas:', images);
      this.images = images;
    });
  }

  // Cargar los anuncios de las empresas
  loadAdvertisements() {
    this.advertisingService.getAdvertisements().subscribe((ads) => {
      console.log('Anuncios cargados:', ads);
      this.advertisements = ads;
    });
  }
}
