import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet],
  template: `
<div class="container py-4">

  <!-- Header -->
  <header class="mb-4">
    <h1 class="h4 mb-1"> <img src="./assets/images/azure-logo.png" alt="Azure Logo" class="logo"> Azure AI Region → Model Explorer</h1>
    <div class="text-muted small">
      Select an Azure region and explore available AI models, deployment types, and quotas.
    </div>
  </header>

  <div class="row">
      <div class="col-12"> 
        <router-outlet></router-outlet> 
      </div>
  </div>  
  

  <footer class="mt-2 text-muted small text-center">
    <div>
      built with love <i class="bi bi-heart-fill text-danger"></i> | 
      <a href="https://github.com/blurlzy/azure-util" target="_blank" class="text-decoration-none text-dark">
        <i class="bi bi-github"></i> view on GitHub
      </a>
    </div>
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
