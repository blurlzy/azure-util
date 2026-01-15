import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  template: `
<div class="container py-4">

  <!-- Header -->
  <header class="mb-4">
    <h1 class="h4 mb-1">AI Region → Model Explorer</h1>
    <div class="text-muted small">
      Select an Azure region and explore available AI models, deployment types, quotas, and pricing.
    </div>
  </header>

  <div class="row">
      <div class="col-12"> <router-outlet></router-outlet> </div>
  </div>  
  


<!-- 
  <footer class="mt-4 text-muted small">
    White-background minimal UI · Bootstrap 5.3 · API-driven
  </footer> -->

</div>
  `,
  styles: ``,
})
export class MainLayout {

}
