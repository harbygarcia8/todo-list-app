import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { TaskItemComponent } from './task-item.component';
import { Task } from '../../../../core/domain/task/task.entity';
import { TaskId } from '../../../../core/domain/task/task-id';
import { TaskTitle } from '../../../../core/domain/task/task-title.vo';

describe('TaskItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskItemComponent],
      providers: [provideIonicAngular()],
    });
  });

  it('se crea y refleja la tarea de entrada', () => {
    const fixture = TestBed.createComponent(TaskItemComponent);
    const task = Task.create({ id: TaskId.of('t1'), title: TaskTitle.of('Hola'), createdAt: 1 });

    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();

    expect(fixture.componentInstance.task()).toBe(task);
    expect(fixture.componentInstance.categoriesEnabled()).toBeTrue(); // valor por defecto
  });
});
