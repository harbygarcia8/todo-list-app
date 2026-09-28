import { Injectable } from '@angular/core';
import { Clock } from '../../application/ports/clock.port';

/** Adaptador de {@link Clock} usando el reloj del sistema. */
@Injectable({ providedIn: 'root' })
export class SystemClock implements Clock {
  now(): number {
    return Date.now();
  }
}
