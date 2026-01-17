import { Routes } from '@angular/router';

// screens
import { ModelExplorer } from './components/model-explorer';

// routes for blog module
export const ModelExplorerRoutes: Routes = [
  { path: '', component: ModelExplorer },

  // system routes
  // { path: '404', component: NotFoundComponent }
];