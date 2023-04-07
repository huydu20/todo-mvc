import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Todo } from 'src/app/models/todo.model';

const fadeStrikeThroughAnimation = trigger('fadeStrikeThrough', [
  state(
    'active',
    style({
      fontSize: '18px',
      color: 'black',
    })
  ),
  state(
    'completed',
    style({
      fontSize: '17px',
      color: 'lightgrey',
      textDecoration: 'line-through',
    })
  ),
  transition('active <=> completed', [animate(250)]),
]);

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  animations: [fadeStrikeThroughAnimation],
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() changeStatus: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() editTdo: EventEmitter<Todo> = new EventEmitter<Todo>();
  @Output() removeTodo: EventEmitter<Todo> = new EventEmitter<Todo>();
  isHovered = false;
  isEditing = false;

  ngOnInit(): void {}

  changeTodoStatus() {
    this.changeStatus.emit({ ...this.todo, isCompleted: !this.todo.isCompleted });
  }

  submitEdit(event: KeyboardEvent) {
    const { keyCode } = event;
    if (keyCode === 13) {
      console.log('submitted');
      this.editTdo.emit(this.todo);
      this.isEditing = false;
    }
  }

  handleDelete() {
    this.removeTodo.emit(this.todo);
  }
}
