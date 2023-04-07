import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Filter, FilterButton } from 'src/app/models/filtering.model';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  filterButtons: FilterButton[] = [
    { type: Filter.All, label: 'All', isActive: true },
    { type: Filter.Active, label: 'Active', isActive: false },
    { type: Filter.Completed, label: 'Completed', isActive: false },
  ];

  constructor(private todoService: TodoService) {}

  hasComplete$!: Observable<boolean>;
  destroy$: Subject<any> = new Subject<any>();
  length = 0;

  ngOnInit(): void {
    this.hasComplete$ = this.todoService.todos$.pipe(
      map((todos) => todos.some((todo) => todo.isCompleted)),
      takeUntil(this.destroy$)
    );
    this.todoService.length$.pipe(takeUntil(this.destroy$)).subscribe((length) => {
      this.length = length;
    });
  }

  filter(type: Filter) {
    this.filterButtons.forEach((btn) => {
      btn.isActive = btn.type === type;
    });
    this.todoService.filterTodos(type);
  }

  clearCompleted() {
    this.todoService.clearCompleted();
  }

  ngOnDestroy(): void {
    this.destroy$.next('No Todo!');
    this.destroy$.complete();
  }
}
