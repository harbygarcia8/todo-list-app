import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  IonBadge,
  IonCheckbox,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
} from '@ionic/angular/standalone';
import { Category } from '../../../../core/domain/category/category.entity';
import { Task } from '../../../../core/domain/task/task.entity';

/**
 * Ítem de tarea (componente presentacional, sin estado ni dependencias del
 * núcleo). Recibe la tarea y su categoría como `input()` y notifica las
 * interacciones con `output()`. Con `OnPush` solo se re-renderiza al cambiar
 * sus entradas.
 */
@Component({
  selector: 'app-task-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemSliding,
    IonItem,
    IonCheckbox,
    IonLabel,
    IonBadge,
    IonItemOptions,
    IonItemOption,
    IonIcon,
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly category = input<Category | undefined>(undefined);
  readonly categoriesEnabled = input<boolean>(true);

  readonly toggled = output<void>();
  readonly removed = output<void>();
  readonly editRequested = output<void>();
  readonly categoryRequested = output<void>();
}
