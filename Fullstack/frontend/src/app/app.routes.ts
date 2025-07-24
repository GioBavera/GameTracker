import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth';
import { AuthenticatedGuard } from './guard/authenticated';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    canActivate: [AuthGuard]
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list').then(m => m.List),
    canActivate: [AuthGuard]
  },
  {
    path: 'genre',
    loadComponent: () => import('./pages/genre/genre').then(m => m.Genre),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login'),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./authentication/register/register'),
    canActivate: [AuthenticatedGuard]
  },
  { path: '**', redirectTo: 'home' }
];
