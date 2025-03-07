import { Routes } from '@angular/router';
import { TodoComponent } from './features/todo/todo/todo.component';

export const routes: Routes = [
  { path: '', component: TodoComponent }, // Default route (Home Page)
  { path: '**', redirectTo: '' } // Redirect unknown routes to home
];