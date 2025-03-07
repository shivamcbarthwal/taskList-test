import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, shareReplay, map } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

/**
 * Service for managing todo tasks.
 */
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:3000/tasks';

  private tasksSubject = new BehaviorSubject<Todo[]>([]);
  tasks$ = this.tasksSubject.asObservable().pipe(shareReplay(1));

  constructor(private http: HttpClient) {
    this.fetchTasksFromApi().subscribe(); // Load tasks from API on startup
  }

  /**
   * Fetches tasks from the API.
   * 
   * @returns An observable of type Todo[] representing the fetched tasks.
   */
  private fetchTasksFromApi(): Observable<Todo[]> {
    console.log('Fetching tasks from API...');
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.tasksSubject.next([...tasks]); // Emit fetched tasks
      }),
      shareReplay(1),
      catchError(this.handleError<Todo[]>('fetchTasksFromApi', []))
    );
  }

  // tasks for very large task lists
  generateMockTasks(): void {
    const mockTasks: Todo[] = Array.from({ length: 10000 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Task ${i + 1}`,
      completed: false
    }));
    this.tasksSubject.next(mockTasks);
  }

  /**
   * Adds a new task with the given title.
   * 
   * @param title - The title of the task.
   * @returns An Observable of type Todo representing the newly created task.
   */
  addTask(title: string): Observable<Todo> {
    const newTask: Todo = {
      id: Date.now().toString(),
      title,
      completed: false
    };

    return this.http.post<Todo>(this.apiUrl, newTask).pipe(
      tap((createdTask) => {
        const updatedTasks = [...this.tasksSubject.value, createdTask];
        this.tasksSubject.next(updatedTasks);
      }),
      shareReplay(1),
      catchError(this.handleError<Todo>('addTask'))
    );
  }

  /**
   * Updates a task (toggle completion).
   *
   * @param updatedTask - The updated task object.
   * @returns An observable of the updated task.
   */
  updateTask(updatedTask: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${updatedTask.id}`, updatedTask).pipe(
      tap(() => {
        const updatedTasks = this.tasksSubject.value.map((task) =>
          task.id === updatedTask.id ? { ...task, completed: updatedTask.completed, title: updatedTask.title } : task
        );
        this.tasksSubject.next(updatedTasks);
      }),
      shareReplay(1),
      catchError(this.handleError<Todo>('updateTask'))
    );
  }

  /**
   * Deletes a task with the specified ID.
   * 
   * @param id - The ID of the task to delete.
   * @returns An Observable that emits void when the task is successfully deleted.
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updatedTasks = this.tasksSubject.value.filter((task) => task.id !== id);
        this.tasksSubject.next(updatedTasks);
      }),
      catchError(this.handleError<void>('deleteTask'))
    );
  }

  /**
   * Searches for tasks that match the given query.
   *
   * @param query - The search query.
   * @returns An Observable of Todo array that contains tasks matching the query.
   */
  searchTasks(query: string): Observable<Todo[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase())))
    );
  }

  // Error Handler
  private handleError<T>(operation = 'operation', fallbackValue?: T) {
    return (error: any): Observable<T> => {
      console.error(`❌ ${operation} failed: ${error.message}`);
      return fallbackValue !== undefined ? of(fallbackValue) : throwError(() => new Error(error.message));
    };
  }
}



// below is the code for the cache service when using the cache service
// due to bug in the UI portion of the code, the cache service is not used and commented out

/** 
private readonly apiUrl = 'http://localhost:3000/tasks';
private readonly cacheKey = 'todos';

constructor(private http: HttpClient, private cacheService: CacheService) {}

// Fetch tasks (use cache if available)
getTasks(): Observable<Todo[]> {
  if (this.cacheService.hasCache(this.cacheKey)) {
    console.log('✅ Fetching from Cache');
    return this.cacheService.getAsObservable(this.cacheKey);
  }
  return this.http.get<Todo[]>(this.apiUrl).pipe(
    tap(tasks => this.cacheService.set(this.cacheKey, tasks)), // Cache tasks
    catchError(error => {
      console.error('❌ Error fetching tasks', error);
      return of([]);
    })
  );
}

// Add task and update cache
addTask(task: Todo): Observable<Todo> {
  return this.http.post<Todo>(this.apiUrl, task).pipe(
    tap(newTask => {
      const updatedTasks = [...this.cacheService.get(this.cacheKey), newTask];
      this.cacheService.set(this.cacheKey, updatedTasks);
    }),
    tap(() => this.getTasks().subscribe()) // Ensure UI refresh
  );
}

//  Update task and sync cache
updateTask(updatedTask: Todo): Observable<Todo> {
  return this.http.put<Todo>(`${this.apiUrl}/${updatedTask.id}`, updatedTask).pipe(
    tap(() => {
      const tasks = this.cacheService.get(this.cacheKey).map(task =>
        task.id === updatedTask.id ? {...task, completed: updatedTask.completed} : task
      );
      this.cacheService.set(this.cacheKey, [...tasks]);
    }),
    tap(() => this.getTasks().subscribe()) // Ensure UI refresh
  );
}

// Delete task and update cache
deleteTask(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => {
      const tasks = this.cacheService.get(this.cacheKey).filter(task => task.id !== id);
      this.cacheService.set(this.cacheKey, tasks);
    }),
    tap(() => this.getTasks().subscribe()) // Ensure UI refresh
  );
}

//  Search tasks (cached search)
searchTasks(query: string): Observable<Todo[]> {
  return of(
    this.cacheService.get(this.cacheKey).filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase())
    )
  );
}

// Clear cache if needed
clearCache() {
  this.cacheService.clear(this.cacheKey);
} */