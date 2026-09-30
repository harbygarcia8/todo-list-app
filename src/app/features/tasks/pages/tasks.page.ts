import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ActionSheetController,
  AlertController,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { CategoryId } from '../../../core/domain/category/category-id';
import { Task } from '../../../core/domain/task/task.entity';
import { CategoryManagerComponent } from '../../categories/category-manager.component';
import { TaskItemComponent } from '../components/task-item/task-item.component';
import { ALL_FILTER, CategoryFilter, TasksFacade, UNCATEGORIZED_FILTER } from '../tasks.facade';
import { ThemeService } from '../../../shared/theme.service';

/**
 * Pantalla principal (adaptador primario / container).
 * Orquesta el {@link TasksFacade} y delega la presentación en componentes.
 */
@Component({
  selector: 'app-tasks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ScrollingModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonChip,
    IonText,
    TaskItemComponent,
  ],
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage {
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);
  private readonly actionSheetCtrl = inject(ActionSheetController);
  private readonly toastCtrl = inject(ToastController);

  protected readonly facade = inject(TasksFacade);
  protected readonly theme = inject(ThemeService);

  protected readonly ALL = ALL_FILTER;
  protected readonly UNCATEGORIZED = UNCATEGORIZED_FILTER;
  protected readonly itemSize = 76;
  protected trackById = (_: number, task: Task): string => task.id;

  protected readonly newTitle = signal('');
  protected readonly newCategoryId = signal<CategoryId | null>(null);

  protected readonly activeFilterLabel = computed(() => {
    const filter = this.facade.filter();
    if (filter === ALL_FILTER) return 'Todas';
    if (filter === UNCATEGORIZED_FILTER) return 'Sin categoría';
    return this.facade.categoryById().get(filter)?.name ?? 'Todas';
  });

  protected categoryOf(task: Task) {
    return this.facade.categoryOf(task);
  }

  protected async addTask(): Promise<void> {
    const title = this.newTitle();
    const result = await this.facade.addTask(title, this.newCategoryId());
    if (result.ok) {
      this.newTitle.set('');
    } else {
      await this.toast(result.error.message);
    }
  }

  protected setFilter(filter: CategoryFilter): void {
    this.facade.setFilter(filter);
  }

  protected async editTask(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar tarea',
      inputs: [
        { name: 'title', type: 'text', value: task.title, placeholder: 'Título de la tarea' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data: { title: string }) => {
            const result = await this.facade.renameTask(task.id, data.title);
            if (!result.ok) {
              await this.toast(result.error.message);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  protected async chooseCategory(task: Task): Promise<void> {
    const categories = this.facade.categories();
    const alert = await this.alertCtrl.create({
      header: 'Asignar categoría',
      inputs: [
        { type: 'radio', label: 'Sin categoría', value: null, checked: task.categoryId === null },
        ...categories.map((c) => ({
          type: 'radio' as const,
          label: c.name as string,
          value: c.id,
          checked: task.categoryId === c.id,
        })),
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Asignar',
          handler: (categoryId: CategoryId | null) => {
            void this.facade.assignCategory(task.id, categoryId ?? null);
          },
        },
      ],
    });
    await alert.present();
  }

  // ── Acciones globales ───────────────────────────────────────────────────

  protected async openCategoryManager(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryManagerComponent });
    await modal.present();
  }

  protected async confirmClearCompleted(): Promise<void> {
    if (this.facade.stats().completed === 0) {
      return;
    }
    const sheet = await this.actionSheetCtrl.create({
      header: 'Tareas completadas',
      buttons: [
        {
          text: 'Eliminar completadas',
          role: 'destructive',
          handler: () => void this.clearCompleted(),
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  private async clearCompleted(): Promise<void> {
    const completed = this.facade.tasks().filter((task) => task.completed);
    for (const task of completed) {
      await this.facade.deleteTask(task.id);
    }
  }

  private async toast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 2200, color: 'danger' });
    await toast.present();
  }
}
