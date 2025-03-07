import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TodoService } from './core/services/todo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-todoList-app';

  /*(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.addTask({
      id: '3',
      title: 'Test Task',
      completed: false,
      createdAt: new Date()
    }).subscribe();
  }*/
}
