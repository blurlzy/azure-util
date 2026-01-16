import { Component, inject, signal, Signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals'
// angular material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// data services
import { ModelExplorerDataService } from './model-explorer.data.service';
// loader
import { Loader } from '../../core/services/loader.service';
// components
import { ModelTable } from './model-table';

@Component({
  selector: 'app-model-explorer',
  imports: [CommonModule, FormsModule, FormField, MatInputModule, MatSelectModule, MatFormFieldModule, MatProgressBarModule, ModelTable],
  template: `
  <!-- Controls -->   
  <div class="mb-3">  
    @if(loader.isLoading | async)
      {
          <mat-progress-bar mode="indeterminate" class="mb-2"></mat-progress-bar>  
      }
    
    <div class="row g-3">
        <div class="col-md-6">
          <mat-form-field  class="full-width" >
            <mat-label>Region</mat-label>
            <mat-select [formField]="selectionForm.location">
              @for (location of locations(); track location) {
                <mat-option [value]="location.name">{{location.displayName}}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="col-md-6">
          <mat-form-field  class="full-width">
            <mat-label>Model Kind</mat-label>
            <mat-select [formField]="selectionForm.modelFormat">
              @if(modelFormats().length === 0 && selectionModel().location !== '') {
                <mat-option disabled value="">No model kinds available in this region</mat-option>
              }

              @for (modelFormat of modelFormats(); track modelFormat) {
                <mat-option [value]="modelFormat">{{modelFormat}}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
    </div>

    <app-model-table [data]="models()"></app-model-table> 
  </div>
  `,
  styles: ``,
})
export class ModelExplorer {
  // services
  private readonly dataService = inject(ModelExplorerDataService);
  public readonly loader = inject(Loader);

  // locations
  locations = signal<any[]>([]);
  modelFormats = signal<any[]>([]);
  models = signal<any[]>([]);

  selectionModel = signal({
    location: '',
    modelFormat: ''
  });

  selectionForm = form(this.selectionModel)
  // prev location
  private previousLocation = '';
  private previousModelFormat = '';

  // ctor
  constructor() {
    // Separate effect for location changes
    effect(() => {
      const location = this.selectionModel().location;
      const modelFormat = this.selectionModel().modelFormat;
      //console.log('Location effect - current value:', location, 'prev value:', this.previousLocation);

      // load model formats for the selected location
      if (location !== this.previousLocation) {
        this.loadModelFormats(location);
        this.previousLocation = location;
        return;
      }

      // load models for the selected location and model format
      if(modelFormat !== '' && modelFormat !== this.previousModelFormat) {
        this.loadModels(location, modelFormat);
        this.previousModelFormat = modelFormat;
      }
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  private loadLocations(): void {
    this.dataService.getLocations().subscribe((data) => {
      this.locations.set(data);
      this.models.set([]);
    });
  }

  private loadModelFormats(location: string): void {
    this.dataService.getModelFormats(location).subscribe((data) => {
      this.modelFormats.set(data);
      // reset selected model format
       this.selectionModel.update(current => ({ ...current, modelFormat: '' }));
       this.previousModelFormat = '';
       this.models.set([]);
    });
  }

  private loadModels(location: string, format: string): void {
    this.dataService.getModels(location, format).subscribe((data) => {
      // filter the models by status
      const availableModels = data.filter((model: any) => model.model.lifecycleStatus !== 'Deprecated');
      this.models.set(availableModels);
      console.log(availableModels);
    });
  }
}