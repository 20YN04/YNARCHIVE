import { AfterViewInit, Component } from '@angular/core';
import { HeroComponent } from '../../hero/hero';
import { LayoutComponent } from '../../components/layout/layout';
import { ProjectGridComponent } from '../../components/project-grid/project-grid';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, LayoutComponent, ProjectGridComponent],
  template: `
    <app-hero></app-hero>
    <app-layout>
      <app-project-grid></app-project-grid>
    </app-layout>
  `
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // noop — hero component handles its own animations
  }
}
