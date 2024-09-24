import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  categories: any[] = [];
  newCategoryName: string = '';
  newActivity: any = { name: '', description: '', categoryId: '', date: '', time: '' };
  selectedFile: File | null = null;
  today: string = new Date().toISOString().split('T')[0];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();  // Cargar las categorías al iniciar el componente
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      console.log('Categorías cargadas desde Firestore:', categories);  
      this.categories = categories.map(category => ({
        ...category,
        activities: [] 
      }));

      
      this.categories.forEach(category => {
        this.loadActivitiesForCategory(category);
      });
    }, error => {
      console.error('Error al cargar categorías:', error);  
    });
  }

  loadActivitiesForCategory(category: any) {
    this.categoryService.getActivitiesByCategory(category.id).subscribe(activities => {
      
      category.activities = [];

      
      activities.forEach(activity => {
        if (this.isActivityExpired(activity.date, activity.time)) {
          this.deleteActivity(category.id, activity.id);  // Eliminar la actividad caducada
        } else {
          category.activities.push(activity);
        }
      });
    });
  }

  //Eliminar actividad automaticamente
  isActivityExpired(date: string, time: string): boolean {
    const activityDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();
    return activityDateTime < currentDateTime;  // Verificar si la actividad ya pasó
  }

  // Manejar la selección de archivo de imagen
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // agregar una nueva categoría con imagen
  addCategory() {
    if (this.newCategoryName.trim() && this.selectedFile) {
      // Primero subir la imagen
      this.categoryService.uploadCategoryImage(this.selectedFile).then((imageUrl: string) => {
        // Luego, agregar la categoría a Firestore con el URL de la imagen
        this.categoryService.addCategory({ name: this.newCategoryName, imageUrl }).then(() => {
          this.newCategoryName = '';
          this.selectedFile = null;
          this.loadCategories();
        }).catch(error => console.error('Error al agregar categoría:', error));
      }).catch(error => console.error('Error al subir imagen:', error));
    } else {
      console.error('El nombre de la categoría o el archivo de imagen están vacíos.');
    }
  }

  deleteCategory(categoryId: string) {
    this.categoryService.deleteCategory(categoryId).then(() => {
      console.log('Categoría eliminada con éxito'); 
      this.loadCategories();
    }).catch(error => {
      console.error('Error al eliminar la categoría:', error);  
    });
  }

  addActivity() {
    if (this.newActivity.name && this.newActivity.description && this.newActivity.categoryId && this.newActivity.date && this.newActivity.time) {
      this.categoryService.addActivity(this.newActivity.categoryId, {
        name: this.newActivity.name,
        description: this.newActivity.description,
        date: this.newActivity.date,   
        time: this.newActivity.time    
      }).then(() => {
        console.log('Actividad agregada con éxito'); 
        this.newActivity = { name: '', description: '', categoryId: '', date: '', time: '' };
        this.loadCategories();
      }).catch(error => {
        console.error('Error al agregar la actividad:', error);  
      });
    }
  }

  deleteActivity(categoryId: string, activityId: string) {
    this.categoryService.deleteActivity(categoryId, activityId).then(() => {
      console.log('Actividad eliminada con éxito'); 
      this.loadCategories();
    }).catch(error => {
      console.error('Error al eliminar la actividad:', error); 
    });
  }
}
