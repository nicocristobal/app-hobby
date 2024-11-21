import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../services/activity.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html'
})
export class CompanyComponent implements OnInit {
  newActivity: any = { name: '', description: '', categoryId: '', date: '', time: '', companyId: '' };
  categories: any[] = [];
  activitiesByCategory: any = {};  
  currentCompanyId: string = '';   
  today: string = new Date().toISOString().split('T')[0]; 

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        console.log('Datos del usuario:', user);
        if (user.role === 'empresa') {
          this.currentCompanyId = user.uid;  
          this.newActivity.companyId = this.currentCompanyId;
        }
      }
    });
  

    // Obtener todas las categorías
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('Categorías cargadas:', this.categories);

      // Para cada categoría, cargar las actividades asociadas
      this.categories.forEach(category => {
        this.loadActivitiesByCategory(category.id);  // Cargar actividades por categoría
      });
    }, error => {
      console.error('Error al obtener categorías:', error);
    });
  }

  // Cargar las actividades de una categoría
  loadActivitiesByCategory(categoryId: string) {
    this.activityService.getActivitiesByCategoryForCompany(categoryId, this.currentCompanyId).subscribe(activities => {
      this.activitiesByCategory[categoryId] = activities;
      console.log(`Actividades cargadas para la categoría ${categoryId} y la empresa ${this.currentCompanyId}:`, activities);
    }, error => {
      console.error(`Error al cargar actividades para la categoría ${categoryId}:`, error);
    });
  }
  

  // Agregar una nueva actividad dentro de la categoría seleccionada
  addActivity() {
    if (this.newActivity.name && this.newActivity.description && this.newActivity.categoryId && this.newActivity.date && this.newActivity.time) {
      // Asignar el companyId antes de crear la actividad
      this.newActivity.companyId = this.currentCompanyId;
  
      this.activityService.addActivity(this.newActivity)
        .then(() => {
          console.log('Actividad creada exitosamente');
          this.newActivity = { name: '', description: '', categoryId: '', date: '', time: '', companyId: this.currentCompanyId };
  
          // Cargar las actividades de la categoría a la que se añadió la nueva actividad
          this.loadActivitiesByCategory(this.newActivity.categoryId);
        })
        .catch(error => {
          console.error('Error al crear la actividad:', error);
        });
    } else {
      console.error('Todos los campos son obligatorios.');
    }
  }
  

  // Obtener el nombre de la categoría según su ID
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría no encontrada';
  }

  // Obtener actividades de una categoría específica, ya filtradas por empresa
  getActivitiesByCategory(categoryId: string) {
    return this.activitiesByCategory[categoryId] || [];  // Devolver un array vacío si no hay actividades
  }

  
  // Método para eliminar una actividad
  deleteActivity(activityId: string, categoryId: string) {
    console.log('Eliminar actividad con activityId:', activityId, 'y categoryId:', categoryId);
  
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.activityService.deleteActivity(categoryId, activityId)
        .then(() => {
          console.log('Actividad eliminada exitosamente.');
          // Recargar actividades de la categoría
          this.loadActivitiesByCategory(categoryId);
        })
        .catch(error => {
          console.error('Error al eliminar la actividad:', error);
        });
    }
  }
  
  


  
}
