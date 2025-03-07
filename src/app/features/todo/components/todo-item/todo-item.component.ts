import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Todo } from '../../../../core/models/todo.model';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, MatButtonModule, MatListModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Prevents unecessay renders of unchanged task items.
})
/**
 * Represents a component for displaying and interacting with a single todo item.
 */
export class TodoItemComponent {
  @Input() task!: Todo;
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<Todo>();
  @Output() edit = new EventEmitter<Todo>();

  isEditing = false;

  @ViewChild('editInput') editInput!: ElementRef<HTMLInputElement>;

  enableEditing() {
    this.isEditing = true;
    setTimeout(() => this.editInput?.nativeElement.focus(), 0); // Autofocus
  }

  saveEdit() {
    const newTitle = this.editInput?.nativeElement.value.trim();
    if (newTitle.trim() && newTitle !== this.task.title) {
      this.edit.emit({ ...this.task, title: newTitle });
    }
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  onToggle() {
    this.toggle.emit({ ...this.task, completed: !this.task.completed });
  }

  onDelete() {
    this.delete.emit(this.task);
  }
}