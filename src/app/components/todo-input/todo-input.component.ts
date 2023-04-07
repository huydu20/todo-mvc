import { Component } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss'],
})
export class TodoInputComponent {
  todoContent: string = '';

  constructor(private todosService: TodoService) {}

  onSubmit() {
    if (this.todoContent.trim() === '') {
      this.todoContent = '';
      return false;
    }
    this.todosService.addTodo(this.todoContent);
    this.todoContent = '';
    return true;
  }
}
