import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { List } from './pages/list/list';
import { Genre } from './pages/genre/genre';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'list', component: List },
  { path: 'genre', component: Genre },
  { path: '**', redirectTo: '/home' }
];