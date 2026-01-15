import { Component, inject, signal, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals'

// data services
import { ModelExplorerDataService } from './model-explorer.data.service';
@Component({
  selector: 'app-model-explorer',
  imports: [CommonModule, FormsModule, FormField],
  template: `
  <!-- Controls -->
  <div class="card mb-3">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-md-5">
          <label class="form-label text-muted">Region</label>
          <select class="form-select" [formField]="selectionForm.location">
            @if(locations().length === 0 ){
              <option disabled value="">Loading...</option>
            }
            @else {
              <option disabled value="">Select a region</option>
            }
            @for(location of locations(); track location){
                <option [value]="location.name">{{ location.displayName }}</option>
            }
                   
          </select>

        </div>

        <div class="col-md-7">
          <label class="form-label text-muted">AI Model</label>
          <select id="modelSelect" class="form-select" disabled>
            <option>Select region first</option>
          </select>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: ``,
})
export class ModelExplorer {
  // services
  private readonly dataService = inject(ModelExplorerDataService);

  // locations
  locations = signal<any[]>([]);

  selectionModel = signal({
    location: ''
  });

  selectionForm = form(this.selectionModel)

  constructor() {
    effect(() => {
        const location = this.selectionModel().location;
        console.log('Signal changed:', location);
      });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  private loadLocations(): void {
    this.dataService.getLocations().subscribe((data) => {
      this.locations.set(data);
      console.log('Loaded locations: ', this.locations);
    });
  }

}
