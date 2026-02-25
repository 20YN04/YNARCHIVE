import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ContactComponent } from './components/contact/contact';
import { WorkComponent } from './pages/work/work';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'work', component: WorkComponent },
	{ path: 'contact', component: ContactComponent },
];
