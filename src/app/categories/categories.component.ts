import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];


  constructor(private router: Router, private categoryService: CategoryService) {}

  ngOnInit(): void {
    
    this.categoryService.getCategories().subscribe(data => {
      console.log('Categorías cargadas:', data);  
      this.categories = data;
    });
  }

  goToCategory(categoryId: string) {
    this.router.navigate(['/category', categoryId]);
  }
}
