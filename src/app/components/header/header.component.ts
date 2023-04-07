import { Component } from '@angular/core';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private todoService: TodoService) {}

  toggleAllStatus() {
    this.todoService.toggleAllStatus();
  }
}
