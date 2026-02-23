import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeroComponent } from './hero/hero';
import { ProjectGridComponent } from './project-grid';
import { LayoutComponent } from './layout/layout';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, LayoutComponent, ProjectGridComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PORTFOLIO');
}
