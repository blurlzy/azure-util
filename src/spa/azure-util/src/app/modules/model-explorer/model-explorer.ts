import { Component, inject, signal, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals'
// angular material
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
// data services
import { ModelExplorerDataService } from './model-explorer.data.service';
@Component({
  selector: 'app-model-explorer',
  imports: [CommonModule, FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatProgressBarModule],
  template: `
  <!-- Controls -->
   <mat-progress-bar mode="indeterminate" class="mb-2"></mat-progress-bar>
   
  <div class="card mb-3">
    
    <div class="card-body mt-2">
      
      <div class="row g-3">
        <div class="col-md-5">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Region</mat-label>
            <mat-select>
              @for (location of locations(); track location) {
                <mat-option [value]="location.name">{{location.displayName}}</mat-option>
              }
            </mat-select>
          </mat-form-field>
<!-- 
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
                   
          </select> -->

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
