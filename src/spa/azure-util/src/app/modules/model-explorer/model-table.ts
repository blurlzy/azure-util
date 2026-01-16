import { Component, Input, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
// components
import { DeploymentTypeInformation } from './deployment-type-information';

@Component({
  selector: 'app-model-table',
  imports: [ DecimalPipe, MatIconModule, MatButtonModule, MatDialogModule ],
  template: `
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="align-middle">Model</th>
            <th scope="col" class="align-middle">Status </th>
            <th scope="col" class="align-middle">
              Deployment Type 
                <button class="btn btn-light btn-sm ms-1" (click)="openDeploymentTypeInformation()">
                  <i class="bi bi-info-square"></i>
                </button>
              </th>
          </tr>
        </thead>
        <tbody>
          @for(item of data; track item) {
              <tr>
                <td class="align-middle"> {{ item.name }} </td>
                <td class="align-middle"> {{ item.model.lifecycleStatus }}</td>
                <td class="align-top"> 
                  <ul>
                    @for(sku of item.model.skus; track sku) {
                      <li>
                        <button type="button" class="btn btn-link hover-icon-btn">
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

  openDeploymentTypeInformation() {     
    const dialogRef = this.dialog.open(DeploymentTypeInformation, {
      width: '780px',        // Set specific width
      // height: '400px',    // Optional: Set specific height
      // maxWidth: '90vw',   // Optional: Maximum width relative to viewport
      // minWidth: '300px',  // Optional: Minimum width
    });
  }
    
}

