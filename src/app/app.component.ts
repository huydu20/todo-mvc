import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private todosService: TodoService) {}

  hasTodos$!: Observable<boolean>;

  ngOnInit(): void {
    this.todosService.fetchFromLocalStorage();
    this.hasTodos$ = this.todosService.length$.pipe(map((length) => length > 0));
  }
}
