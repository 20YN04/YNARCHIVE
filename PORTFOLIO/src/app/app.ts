import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeroComponent } from './hero/hero';
import { ProjectGridComponent } from './project-grid';
import { LayoutComponent } from './layout/layout';
import { PreloaderComponent } from './preloader';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, LayoutComponent, PreloaderComponent, ProjectGridComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PORTFOLIO');
  readonly showPreloader = signal(!sessionStorage.getItem('preloaderSeen'));

  onPreloaderDone(): void {
    sessionStorage.setItem('preloaderSeen', 'true');
    this.showPreloader.set(false);
  }
}
