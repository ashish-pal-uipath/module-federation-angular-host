import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from 'federation.utils';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { REMOTE_ENTRIES } from './entries';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./components/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./components/contacts/contacts.module').then(
        (m) => m.ContactsModule
      ),
  },
  {
    path: 'nointernet',
    loadChildren: () =>
      loadRemoteModule(REMOTE_ENTRIES.noInternet)
        .then((m) => m.NoInternetModule)
        .catch((ex) => {
          console.log('remote module loading error', ex);
        }),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }, // wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
