import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { CategoryId } from '../../core/domain/category/category-id';
import { TasksFacade } from '../tasks/tasks.facade';

/** Paleta sugerida para asignar colores a las categorías. */
const PALETTE = [
  '#eb445a',
  '#f0963f',
  '#ffc409',
  '#2dd36f',
  '#0cd1e8',
  '#3880ff',
  '#6a64ff',
  '#92949c',
];

/** Modal para gestionar categorías: crear, editar y eliminar. */
@Component({
  selector: 'app-category-manager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonFooter,
  ],
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss'],
})
export class CategoryManagerComponent {
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);
  protected readonly facade = inject(TasksFacade);

  protected readonly palette = PALETTE;
  protected readonly name = signal('');
  protected readonly color = signal<string>(PALETTE[0]);
  protected readonly editingId = signal<CategoryId | null>(null);

  protected pickColor(color: string): void {
    this.color.set(color);
  }

  protected startEdit(id: CategoryId, name: string, color: string): void {
    this.editingId.set(id);
    this.name.set(name);
    this.color.set(color);
  }

  protected cancelEdit(): void {
    this.reset();
  }

  protected async submit(): Promise<void> {
    const name = this.name().trim();
    if (!name) {
      return;
    }
    const editingId = this.editingId();
    if (editingId) {
      await this.facade.editCategory(editingId, { name, color: this.color() });
    } else {
      await this.facade.createCategory(name, this.color());
    }
    this.reset();
  }

  protected async confirmRemove(id: CategoryId, name: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${name}"? Las tareas asociadas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.facade.deleteCategory(id);
            if (this.editingId() === id) {
              this.reset();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  protected dismiss(): void {
    void this.modalCtrl.dismiss();
  }

  private reset(): void {
    this.editingId.set(null);
    this.name.set('');
    this.color.set(PALETTE[0]);
  }
}
