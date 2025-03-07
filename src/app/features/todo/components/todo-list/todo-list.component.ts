import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TodoService } from '../../../../core/services/todo.service';
import { Todo } from '../../../../core/models/todo.model';
import { debounceTime, distinctUntilChanged, from, Observable, startWith, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { MatListModule } from '@angular/material/list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CacheService } from '../../../../core/services/cache.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, MatListModule, ScrollingModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Represents the TodoListComponent class.
 * This component is responsible for displaying and managing the todo list.
 */
export class TodoListComponent implements OnInit {
  searchControl = new FormControl('');
  tasks$!: Observable<Todo[]>;

  constructor(private todoService: TodoService, private cacheService: CacheService) {}

  ngOnInit(): void {
    this.tasks$ = this.todoService.tasks$;
    this.showFullorFilteredTaskList();
  }

  showFullorFilteredTaskList() : void {
    this.tasks$ = this.searchControl.valueChanges.pipe(
      startWith(''), // Load full list initially
      debounceTime(300), // Prevent excessive API calls
      distinctUntilChanged(), // Only call if value is different
      switchMap(query => {
        return this.todoService.searchTasks(query ?? '')}) // Call the service method
    );
    
    this.tasks$.subscribe(tasks => {
      console.log("Tasks received:", tasks);
    }); 
  }

  toggleTask(updatedTask: Todo) {
    this.todoService.updateTask(updatedTask).subscribe();
  }

  editTask(updatedTask: Todo) {
    this.todoService.updateTask(updatedTask).subscribe();
  }

  deleteTask(task: Todo) {
    this.todoService.deleteTask(task.id).subscribe();
  };

  generateLargeDataset() {
    this.todoService.generateMockTasks();
  }

}