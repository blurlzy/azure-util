import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
// angular material
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
// data services
import { ModelExplorerDataService } from '../model-explorer.data.service';
// loader
import { Loader } from '../../../core/services/loader.service';
// components
import { ModelTable } from './model-table';

@Component({
  selector: 'app-model-explorer',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
          MatInputModule, MatSelectModule, MatFormFieldModule,  ModelTable],
  template: `
  <!-- Controls -->   
    <div class="row g-3 mt-3">
       <div class="col-md-10 pe-4">
          <div class="row">
            <div class="col-md-5">
              <mat-form-field  class="full-width">
                <mat-label>Azure Region</mat-label>
                <mat-select [formControl]="selectedLocation">
                  @for (location of locations(); track location) {
                    <mat-option [value]="location.name">{{location.displayName}} - {{location.metadata?.physicalLocation}}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <div class="col-md-4">
              <mat-form-field  class="full-width">
                <mat-label>Model Kind</mat-label>
                <mat-select [formControl]="selectedModelFormat">
                  @if(modelFormats().length === 0 && selectedLocation.value !== '') {
                    <mat-option disabled value="">No model kinds available in this region</mat-option>
                  }

                  @for (modelFormat of modelFormats(); track modelFormat) {
                    <mat-option [value]="modelFormat">{{modelFormat}}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <div class="col-md-3">
              <mat-form-field class="full-width">
                <mat-label>Status</mat-label>
                <mat-select [formControl]="selectedStatus" multiple>
                  @for(opt of statusOptions; track opt) {
                    <mat-option [value]="opt">{{opt}}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            
            <div> 
              <!-- Model Table -->
                <app-model-table [data]="availableModels()"></app-model-table> 
            </div>
            
          </div>

       </div> 

       <div class="col-md-2 right-nav pt-2 pt-lg-1">
          <h5 class="mb-3">🔗 Links</h5>
          <nav class="nav flex-column small">
            <a class="nav-link" href="https://learn.microsoft.com/en-us/azure/ai-foundry/openai/quotas-limits?view=foundry-classic&tabs=REST" target="_blank">Quotas and Limits</a>                                     
            <a class="nav-link" href="https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/models-sold-directly-by-azure?view=foundry-classic&tabs=global-standard-aoai%2Cglobal-standard&pivots=azure-openai" target="_blank">Foundry Models sold directly by Azure</a>
            <a class="nav-link" href="https://learn.microsoft.com/en-us/azure/ai-foundry/responsible-ai/openai/data-privacy?view=foundry-classic&tabs=azure-portal" target="_blank">Data, privacy, and security for Azure Direct Models in Microsoft Foundry</a>
            <a class="nav-link" href="https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/deployment-types?view=foundry-classic" target="_blank">Deployment types for Microsoft Foundry Models</a>
            <a class="nav-link" href="https://azure.microsoft.com/en-us/pricing/details/ai-foundry-models/aoai/" target="_blank">Azure AI Foundry Models pricing</a>
          </nav>
       </div> 

    </div>

  `,
  styles: `
    .right-nav {
       border-left: 1px solid #e5e5e5;
    }

    .right-nav .nav-link { color: #111; padding-left: 2; text-decoration: underline; }
    .right-nav .nav-link:hover { text-decoration: none; }
  `,
})
export class ModelExplorer {
  // services
  private readonly dataService = inject(ModelExplorerDataService);
  public readonly loader = inject(Loader);

  // azure regions / locations
  locations = signal<any[]>([]);
  // azure AI model formats / kinds
  modelFormats = signal<any[]>([]);
  // models in selected location and format
  models = signal<any[]>([]);
  // available models  only
  availableModels = signal<any[]>([]);
  // satus options
  statusOptions = ['GenerallyAvailable', 'Stable', 'Preview', 'Deprecated'];

  // form controls
  selectedLocation = new FormControl('');
  selectedModelFormat = new FormControl('');
  selectedStatus = new FormControl(['GenerallyAvailable', 'Stable', 'Preview']);

  // ctor
  constructor() {
    // location changes
    this.selectedLocation.valueChanges.subscribe((location) => {
      // reset the model formats
      this.modelFormats.set([]);
      this.selectedModelFormat.setValue('');

      // reload model formats for the selected location
      if(location) {
        this.loadModelFormats(location);
      }      
    });

    // model format changes
    this.selectedModelFormat.valueChanges.subscribe((modelFormat) => {
      // reste the models
      this.availableModels.set([]);
      this.models.set([]);  
      if(this.selectedLocation.value && modelFormat) {
          // reload models
          this.loadModels(this.selectedLocation.value, modelFormat);
        }
    });
 
    // status changes
    this.selectedStatus.valueChanges.subscribe((statuses) => {
      if(statuses && statuses.length === 0) {
        // display all models
        this.availableModels.set(this.models());
        return;
      }
      const selectedStatuses = statuses?? [];
      // filter models by status
      const allModels = this.models();
      const filteredModels = allModels.filter((model: any) => selectedStatuses.includes(model.model.lifecycleStatus));
      this.availableModels.set(filteredModels);
    });    
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  private loadLocations(): void {
    this.dataService.getLocations().subscribe((data) => {
      this.locations.set(data);
    });
  }

  private loadModelFormats(location: string): void {
    this.dataService.getModelFormats(location).subscribe((data) => {
      this.modelFormats.set(data);
    });
  }

  private loadModels(location: string, format: string): void {
    this.dataService.getModels(location, format).subscribe((data) => {
      // filter the models by status
      const selectedStatuses = this.selectedStatus.value?? [];
      const availableModels =  data.filter((model: any) => selectedStatuses.includes(model.model.lifecycleStatus));
      // all models
      this.models.set(data);
      // available models filtered by status
      this.availableModels.set(availableModels);
      //console.log(data);
    });
  }
}