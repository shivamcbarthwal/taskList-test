export interface Todo {
    id: string; // Unique task ID
    title: string;
    description?: string; // Optional description
    completed: boolean;
    createdAt?: Date;
    expiresAt?: number;
  }