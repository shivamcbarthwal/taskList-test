import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoService } from '../../../core/services/todo.service';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { TodoFormComponent } from '../components/todo-form/todo-form.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, TodoListComponent, TodoFormComponent],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  constructor(private todoService: TodoService) {}

  addTask(title: string) {
    const newTask = { id: Date.now().toString(), title, completed: false };
    this.todoService.addTask(newTask.title).subscribe();
  }
}
