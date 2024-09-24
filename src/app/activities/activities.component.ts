import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  categoryId: string | null = '';
  categoryName: string = '';
  activities: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.loadCategoryName(this.categoryId);
      this.categoryService.getActivitiesByCategory(this.categoryId).subscribe(data => {
        this.activities = data.map(activity => ({
          ...activity,
          liked: false  
        }));
      });
    }
  }

  loadCategoryName(categoryId: string): void {
    this.categoryService.getCategoryName(categoryId).subscribe(name => {
      this.categoryName = name;
    });
  }

  likeActivity(activity: any): void {
    activity.liked = !activity.liked; 
    
    if (activity.liked) {
      this.userService.addActivityToFavorites(activity).then(() => {
        console.log('Actividad añadida a favoritos.');
      }).catch(error => {
        console.error('Error al agregar actividad a favoritos:', error);
      });
    } else {
      console.log('Actividad removida de favoritos.');
    }
  }
}
