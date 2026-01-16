import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  template: `
<div class="container py-4">

  <!-- Test Snackbar Component for debugging -->
  <!-- <div class="alert alert-info mb-3">
    <strong>Debug Panel:</strong> Test snackbar styling
    <app-test-snackbar></app-test-snackbar>
  </div> -->

  <!-- Header -->
  <header class="mb-4">
    <h1 class="h4 mb-1"> <img src="./assets/images/azure-logo.png" alt="Azure Logo" class="logo"> Azure AI Region → Model Explorer</h1>
    <div class="text-muted small">
      Select an Azure region and explore available AI models, deployment types, quotas, and pricing.
    </div>
  </header>

  <div class="row">
      <div class="col-12"> <router-outlet></router-outlet> </div>
  </div>  
  



  <footer class="mt-4 text-muted small text-center">
    Built with love <i class="bi bi-heart-fill text-danger"></i>
  </footer>

</div>
  `,
  styles: `
    .logo {
       width: 35px;
       height: 35px;
    }
  `,
})
export class MainLayout {

}
