import { Injectable, inject } from '@angular/core';
// angular material
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

export interface SnackbarConfig {
  message: string;
  action?: string;
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
  panelClass?: string | string[];
  data?: any;
}

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
	providedIn: 'root'
})
export class SnackbarService {
	private readonly snackBar = inject(MatSnackBar);
	
	// Default configuration
	private readonly defaultDuration = 5000; // 5 seconds
	private readonly defaultConfig: Partial<MatSnackBarConfig> = {
		duration: this.defaultDuration,
		horizontalPosition: 'center',
		verticalPosition: 'bottom',
	};

	/**
	 * Show a success message
	 */
	public success(message: string, action = '✕', duration?: number): MatSnackBarRef<TextOnlySnackBar> {
		return this.show({
			message,
			action,
			duration,
			panelClass: ['snackbar-success']
		});
	}

	/**
	 * Show an error message
	 */
	public error(message: string, action = '✕', duration?: number): MatSnackBarRef<TextOnlySnackBar> {
		return this.show({
			message,
			action,
			duration: duration || 8000, // Errors stay longer
			panelClass: ['snackbar-error']
		});
	}

	/**
	 * Show a warning message
	 */
	public warning(message: string, action = '✕', duration?: number): MatSnackBarRef<TextOnlySnackBar> {
		return this.show({
			message,
			action,
			duration,
			panelClass: ['snackbar-warning']
		});
	}

	/**
	 * Show an info message
	 */
	public info(message: string, action = '✕', duration?: number): MatSnackBarRef<TextOnlySnackBar> {
		return this.show({
			message,
			action,
			duration,
			panelClass: ['snackbar-info']
		});
	}

	/**
	 * Show a custom snackbar with full configuration
	 */
	public show(config: SnackbarConfig): MatSnackBarRef<TextOnlySnackBar> {
		const snackBarConfig: MatSnackBarConfig = {
			...this.defaultConfig,
			duration: config.duration ?? this.defaultDuration,
			horizontalPosition: config.horizontalPosition ?? this.defaultConfig.horizontalPosition,
			verticalPosition: config.verticalPosition ?? this.defaultConfig.verticalPosition,
			panelClass: config.panelClass,
			data: config.data
		};

		return this.snackBar.open(config.message, config.action, snackBarConfig);
	}

	/**
	 * Show a persistent message that doesn't auto-dismiss
	 */
	// public persistent(message: string, action = 'Dismiss', type: SnackbarType = 'info'): MatSnackBarRef<TextOnlySnackBar> {
	// 	return this.show({
	// 		message,
	// 		action,
	// 		duration: 0, // No auto-dismiss
	// 		panelClass: [`snackbar-${type}`, 'snackbar-persistent']
	// 	});
	// }

	/**
	 * Show loading message
	 */
	public loading(message = 'Loading...', action?: string): MatSnackBarRef<TextOnlySnackBar> {
		return this.show({
			message,
			action,
			duration: 0, // No auto-dismiss for loading
			panelClass: ['snackbar-loading']
		});
	}

	/**
	 * Show message with custom action handler
	 */
	public withAction(
		message: string, 
		action: string, 
		type: SnackbarType = 'info',
		actionHandler?: () => void
	): MatSnackBarRef<TextOnlySnackBar> {
		const snackBarRef = this.show({
			message,
			action,
			panelClass: [`snackbar-${type}`]
		});

		if (actionHandler) {
			snackBarRef.onAction().subscribe(() => {
				actionHandler();
			});
		}

		return snackBarRef;
	}

	/**
	 * Dismiss all open snackbars
	 */
	public dismiss(): void {
		this.snackBar.dismiss();
	}

	/**
	 * Dismiss after a specific delay
	 */
	public dismissAfter(delay: number): void {
		setTimeout(() => this.dismiss(), delay);
	}
}