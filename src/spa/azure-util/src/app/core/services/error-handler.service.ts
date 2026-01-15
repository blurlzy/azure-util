// import { Injectable, ErrorHandler, NgZone } from '@angular/core';
// import { SnackbarService } from './snackbar.service';

// @Injectable({
// 	providedIn: 'root'
// })
// export class GlobalErrorHandler implements ErrorHandler {
// 	// ctor
// 	constructor(private snackbarService: SnackbarService, private zone: NgZone) {

// 	}

// 	// 
// 	handleError(error: any) {
// 		this.zone.run(() => {
// 			//  todo: add logging service
// 			if(error?.status === 404) { 
// 				return;
// 			}
			
// 			this.snackbarService.error('Error occurred !');
// 		 });
		 
// 		console.warn('Caught by global error handler: ', error);
// 	}
// }