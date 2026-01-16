import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
// http module
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withFetch, withInterceptors } from '@angular/common/http';
// error handler
import { GlobalErrorHandler } from './core/services/error-handler.service';
//interceptor
import { LoaderInterceptor } from './core/services/http-interceptor.service';
// routes
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    // show loader on http requests
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    // Global Error Handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
