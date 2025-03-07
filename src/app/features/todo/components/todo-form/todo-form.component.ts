import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent {
  @Output() addTask = new EventEmitter<string>();

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  constructor(private snackBar: MatSnackBar) {} // ✅ Inject Snackbar

  submit() {
    const title = this.taskForm.value.title?.trim();

    if (!title) {
      this.showError("Task title cannot be empty."); // ✅ Show Snackbar error
      return;
    }

    this.addTask.emit(title);
    this.taskForm.reset();
  }

  // ✅ Show Snackbar for errors
  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'], // ✅ Ensure CSS styling exists
    });
  }
}