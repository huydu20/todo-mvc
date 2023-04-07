import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Todo } from '../models/todo.model';
import { Filter } from '../models/filtering.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private static readonly TodoStorageKey = 'todos';

  private todos: Todo[] = [];
  private filteredTodos: Todo[] = [];
  private displayTodosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private lengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private currentFilter: Filter = Filter.All;

  todos$: Observable<Todo[]> = this.displayTodosSubject.asObservable();
  length$: Observable<number> = this.lengthSubject.asObservable();

  constructor(private storageService: LocalStorageService) {}

  fetchFromLocalStorage() {
    this.todos = this.storageService.getValue<Todo[]>(TodoService.TodoStorageKey) || [];
    this.filteredTodos = [...this.todos];
    this.updateTodosData();
  }

  updateToLocalStorage() {
    this.storageService.setObject(TodoService.TodoStorageKey, this.todos);
    this.filterTodos(this.currentFilter, false);
    this.updateTodosData();
  }

  filterTodos(filter: Filter, isFiltering: boolean = true) {
    this.currentFilter = filter;

    switch (filter) {
      case Filter.Active:
        this.filteredTodos = this.todos.filter((todo) => !todo.isCompleted);
        break;
      case Filter.Completed:
        this.filteredTodos = this.todos.filter((todo) => todo.isCompleted);
        break;
      case Filter.All:
        this.filteredTodos = [...this.todos];
        break;
    }
    if (isFiltering) {
      this.updateTodosData();
    }
  }

  addTodo(content: string) {
    const date = new Date(Date.now()).getTime();
    const newTodo = new Todo(date, content);
    this.todos.unshift(newTodo);
    this.updateToLocalStorage();
  }

  changeTodoStatus(id: number, isCompleted: boolean) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const todo = this.todos[index];
    todo.isCompleted = isCompleted;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  editTodo(id: number, content: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    const todo = this.todos[index];
    todo.content = content;
    this.todos.splice(index, 1, todo);
    this.updateToLocalStorage();
  }

  deleteTodo(id: number) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    this.todos.splice(index, 1);
    this.updateToLocalStorage();
  }

  toggleAllStatus() {
    this.todos = this.todos.map((todo) => ({
      ...todo,
      isCompleted: !this.todos.every((todo) => todo.isCompleted),
    }));

    this.updateToLocalStorage();
  }

  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.isCompleted);
    this.updateToLocalStorage();
  }

  private updateTodosData() {
    this.displayTodosSubject.next(this.filteredTodos);
    this.lengthSubject.next(this.todos.length);
  }
}
