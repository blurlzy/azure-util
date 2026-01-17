import { Component, Input, inject } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
// components
import { DeploymentTypeInformation } from './deployment-type-information';
import { ModelSkuInformation } from './model-sku-information';

@Component({
  selector: 'app-model-table',
  imports: [DecimalPipe, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule],
  template: `
      <table class="table mt-3">
        <thead>
          <tr>
            <th scope="col" class="align-middle">Model</th>
            <th scope="col" class="align-middle">Version</th>
            <th scope="col" class="align-middle">Status </th>
            <th scope="col" class="align-middle">
              Deployment Type 
              <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/concepts/deployment-types?view=foundry-classic" class="text-dark" target="_blank">
                <i class="bi bi-box-arrow-up-right ms-1"></i>
              </a>   
              </th>
          </tr>
        </thead>
        <tbody>
          @for(item of data; track item) {
              <tr>
                <td class="align-middle"> 
                  {{ item.model.name }}  
                </td>
                <td class="align-middle"> 
                  {{ item.model.version }}  
                </td>
                <td class="align-middle">
                  @if(item.model.lifecycleStatus === 'Preview') {
                    <span class="text-danger"><strong>Preview</strong></span>
                  } @else {
                    {{ item.model.lifecycleStatus }}
                  } 

                </td>
                <td class="align-middle"> 
                  <ul >
                    @for(sku of item.model.skus; track sku) {
                      <li>
                        <button type="button" class="btn btn-link hover-icon-btn" (click)="openModelSkuInformation(item.model.name, sku)">
                          {{ sku.name }} - Max TPM: {{ sku?.capacity?.maximum | number }}
                          <i class="bi bi-arrow-right hover-icon"></i>
                        </button>
                      </li>                      
                    }
                  </ul>

                </td>
              </tr>
          }

        </tbody>
      </table>
  `,
  styles: `
    .btn-link {
      color:black;
      text-decoration: none !important;
      position: relative;
    }
    
    .btn-link:hover {
      text-decoration: underline !important;
    }

    /* Hide icon by default */
    .hover-icon {
      opacity: 0;
      margin-left: 0.5rem;
      transition: opacity 0.2s ease-in-out;
    }

    /* Show icon on button hover */
    .hover-icon-btn:hover .hover-icon {
      opacity: 1;
    }

  `,
})
export class ModelTable {
  @Input({ required: true }) data: any = [];
  readonly dialog = inject(MatDialog);

  // open deployment type information dialog
  openDeploymentTypeInformation() {
    const dialogRef = this.dialog.open(DeploymentTypeInformation, {
      width: '780px',        // Set specific width
      maxWidth: '85vw',
    });
  }

  // open sku information dialog
  openModelSkuInformation(modelName: string, sku: any) {
    const dialogRef = this.dialog.open(ModelSkuInformation, {
      width: '860px',
      maxWidth: '90vw',        // Ensure it doesn't exceed viewport
      //maxHeight: '90vh',       // Prevent vertical overflow
      data: { modelName, sku },
      // autoFocus: false,        // Prevent auto-focus issues
      //restoreFocus: false,     // Prevent focus restoration issues
    });
  }


  // getModelCapabilitiesTooltip(item: any): string {
  //   const capabilities = [];
  //   if (item.model?.capabilities) {
  //     if (item.model.capabilities.imageGenerations != '') {
  //       capabilities.push('✅ Image Generation');
  //     }

  //     if (item.model.capabilities.inference != '') {
  //       capabilities.push('✅ Inference');
  //     }
  //     const caps = item.model.capabilities;
  //   }
  //   return capabilities.join(' ')
  // }

}

