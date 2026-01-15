import { Routes } from '@angular/router';

// layout components
import { MainLayout } from './layouts/main-layout';


export const routes: Routes = [
	{
		path: '',
		component: MainLayout,
		children: [
			{
				// blog module
				path: '', loadChildren: () => import('./modules/model-explorer/model-explorer.routes').then(m => m.ModelExplorerRoutes)
			}
		]
	},

	{ path: '**',   redirectTo: '404', pathMatch: 'full' } // redirect to 404 screen (not found) in the default (blog) module
];
