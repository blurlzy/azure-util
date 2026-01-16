import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from './core/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-test-snackbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
      <button mat-raised-button color="primary" (click)="testSuccess()">Test Success</button>
      <button mat-raised-button color="accent" (click)="testError()">Test Error</button>
      <button mat-raised-button color="warn" (click)="testWarning()">Test Warning</button>
      <button mat-raised-button (click)="testInfo()">Test Info</button>
      <button mat-raised-button (click)="testLoading()">Test Loading</button>
      <button mat-raised-button (click)="inspectSnackbar()">Inspect Classes</button>
    </div>
  `
})
export class TestSnackbarComponent {
  private snackbar = inject(SnackbarService);

  testSuccess() {
    console.log('Testing success snackbar');
    this.snackbar.success('Success message!');
  }

  testError() {
    console.log('Testing error snackbar');
    this.snackbar.error('Error message!');
  }

  testWarning() {
    console.log('Testing warning snackbar');
    this.snackbar.warning('Warning message!');
  }

  testInfo() {
    console.log('Testing info snackbar');
    this.snackbar.info('Info message!');
  }

  testLoading() {
    console.log('Testing loading snackbar');
    const ref = this.snackbar.loading('Loading...');
    setTimeout(() => ref.dismiss(), 3000);
  }

  inspectSnackbar() {
    const ref = this.snackbar.success('Inspect this!');
    console.log('Snackbar ref:', ref);
    
    setTimeout(() => {
      const overlays = document.querySelectorAll('.cdk-overlay-pane');
      console.log('Found overlay panes:', overlays);
      overlays.forEach((overlay, index) => {
        console.log(`Overlay ${index} classes:`, overlay.className);
        const snackbarContainer = overlay.querySelector('.mat-mdc-snack-bar-container');
        if (snackbarContainer) {
          console.log(`Snackbar container ${index}:`, snackbarContainer);
          console.log(`Container classes:`, snackbarContainer.className);
        }
      });
    }, 100);
  }
}