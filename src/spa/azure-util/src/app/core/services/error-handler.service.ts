import { Injectable, ErrorHandler, NgZone, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';

export interface ErrorInfo {
  message: string;
  type: 'network' | 'client' | 'server' | 'unknown';
  statusCode?: number;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

@Injectable({
	providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
	private readonly snackbarService = inject(SnackbarService);
	private readonly zone = inject(NgZone);
	
	// Error messages cache to prevent spam
	private recentErrors = new Set<string>();
	private readonly errorCooldown = 5000; // 5 seconds

	/**
	 * Main error handler implementation
	 */
	handleError(error: any): void {
		this.zone.run(() => {
			const errorInfo = this.categorizeError(error);
			
			// // Log error for debugging
			// this.logError(errorInfo, error);
			
			// Show user-friendly notification
			this.showErrorNotification(errorInfo);
		});
	}

	/**
	 * Categorize and extract meaningful information from errors
	 */
	private categorizeError(error: any): ErrorInfo {
		const timestamp = new Date();
		
		// HTTP Error Response
		if (error instanceof HttpErrorResponse) {
			return {
				message: this.getHttpErrorMessage(error),
				type: error.status >= 500 ? 'server' : 'network',
				statusCode: error.status,
				timestamp,
				url: error.url || undefined
			};
		}
		
		// Client-side errors
		if (error instanceof Error) {
			return {
				message: this.getClientErrorMessage(error),
				type: 'client',
				timestamp,
				userAgent: navigator.userAgent
			};
		}
		
		// Unknown error format
		return {
			message: 'An unexpected error occurred',
			type: 'unknown',
			timestamp
		};
	}

	/**
	 * Generate user-friendly HTTP error messages
	 */
	private getHttpErrorMessage(error: HttpErrorResponse): string {
		switch (error.status) {
			case 0:
				return 'Network connection failed. Please check your internet connection.';
			case 400:
				return 'Invalid request. Please check your input and try again.';
			case 401:
				return 'You are not authorized. Please sign in again.';
			case 403:
				return 'Access denied. You don\'t have permission to perform this action.';
			case 404:
				return 'The requested resource was not found.';
			case 408:
				return 'Request timeout. Please try again.';
			case 409:
				return 'Conflict detected. The resource may have been modified by someone else.';
			case 422:
				return 'Validation failed. Please check your input.';
			case 429:
				return 'Too many requests. Please wait a moment and try again.';
			case 500:
				return 'Server error occurred. Our team has been notified.';
			case 502:
			case 503:
				return 'Service temporarily unavailable. Please try again later.';
			case 504:
				return 'Request timeout. The server took too long to respond.';
			default:
				if (error.status >= 400 && error.status < 500) {
					return `Client error (${error.status}): ${error.error?.message || 'Please check your request.'}`;
				} else if (error.status >= 500) {
					return `Server error (${error.status}): Please try again later.`;
				}
				return `HTTP error (${error.status}): ${error.error?.message || 'An error occurred.'}`;
		}
	}

	/**
	 * Generate user-friendly client error messages
	 */
	private getClientErrorMessage(error: Error): string {
		if (error.name === 'ChunkLoadError') {
			return 'Application update available. Please refresh the page.';
		}
		
		if (error.name === 'TypeError' && error.message.includes('fetch')) {
			return 'Network error. Please check your connection and try again.';
		}
		
		if (error.name === 'SecurityError') {
			return 'Security restriction encountered. Please try a different approach.';
		}
		
		if (error.name === 'QuotaExceededError') {
			return 'Storage limit exceeded. Please clear some data and try again.';
		}
		
		// Generic client error
		return 'An unexpected error occurred in the application.';
	}

	/**
	 * Show appropriate error notification to user
	 */
	private showErrorNotification(errorInfo: ErrorInfo): void {
		// Skip certain errors that shouldn't be shown to users
		if (this.shouldSkipNotification(errorInfo)) {
			return;
		}
		
		// Prevent spam by checking recent errors
		const errorKey = `${errorInfo.type}-${errorInfo.statusCode}-${errorInfo.message}`;
		if (this.recentErrors.has(errorKey)) {
			return;
		}
		
		// Add to recent errors and remove after cooldown
		this.recentErrors.add(errorKey);
		setTimeout(() => {
			this.recentErrors.delete(errorKey);
		}, this.errorCooldown);
		console.log(errorInfo.type);
		// Show notification based on error type
		switch (errorInfo.type) {
			case 'network':
				this.snackbarService.error(errorInfo.message, '✕', 8000);
				break;
				
			case 'server':
				this.snackbarService.error(errorInfo.message, '✕', 10000);
				break;
				
			case 'client':
				if (errorInfo.message.includes('refresh')) {
					this.snackbarService.withAction(
						errorInfo.message,
						'Refresh',
						'warning',
						() => window.location.reload()
					);
				} else {
					this.snackbarService.warning(errorInfo.message, '✕', 6000);
				}
				break;
				
			default:
				this.snackbarService.error(errorInfo.message, '✕', 5000);
		}
	}

	/**
	 * Determine if error notification should be skipped
	 */
	private shouldSkipNotification(errorInfo: ErrorInfo): boolean {
		// Skip 404 errors (as in original code)
		if (errorInfo.statusCode === 404) {
			return true;
		}
		
		// Skip cancelled requests
		if (errorInfo.statusCode === 0 && errorInfo.message.includes('cancelled')) {
			return true;
		}
		
		// Skip certain client errors that are not user-actionable
		if (errorInfo.type === 'client' && errorInfo.message.includes('Script error')) {
			return true;
		}
		
		return false;
	}

	/**
	 * Handle authentication errors
	 */
	private handleAuthError(): void {
		// TODO: Implement your authentication logic here
		console.log('Handling auth error - redirect to login or refresh token');
		// Example: this.router.navigate(['/login']);
		// Example: this.authService.refreshToken();
	}

	/**
	 * Log error details for debugging and monitoring
	 */
	private logError(errorInfo: ErrorInfo, originalError: any): void {
		const logEntry = {
			...errorInfo,
			originalError: originalError,
			stackTrace: originalError?.stack,
			userAgent: navigator.userAgent,
			currentUrl: window.location.href
		};
		
		// Console log for development
		console.group('🚨 Global Error Handler');
		console.error('Error Info:', errorInfo);
		console.error('Original Error:', originalError);
		console.error('Full Log Entry:', logEntry);
		console.groupEnd();
		
		// TODO: Send to external logging service in production
		// Example: this.loggingService.logError(logEntry);
	}

	/**
	 * Public method to manually report errors
	 */
	public reportError(error: any, context?: string): void {
		console.warn(`Manual error report${context ? ` (${context})` : ''}:`, error);
		this.handleError(error);
	}

	/**
	 * Public method to show custom error messages
	 */
	public showError(message: string, type: 'error' | 'warning' = 'error'): void {
		if (type === 'error') {
			this.snackbarService.error(message);
		} else {
			this.snackbarService.warning(message);
		}
	}
}