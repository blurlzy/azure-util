import { Component, Input, inject, computed, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// components
import { ModelSkuInformation } from './model-sku-information';

@Component({
  selector: 'app-model-table',
  imports: [DecimalPipe, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatPaginatorModule],
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
                    <span class="text-info"><strong>Preview</strong></span>
                  }@else if (item.model.lifecycleStatus === 'Deprecated') {
                    <span class="text-danger"><strong>Deprecated</strong></span>
                  } 
                  @else {
                    {{ item.model.lifecycleStatus }}
                  } 

                </td>
                <td class="align-middle"> 
                  <ul class="mb-0 list-unstyled">
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

  // pager
  // pageEvent: PageEvent | undefined;
  // pageSize = signal(6);
  // pageIndex = signal(0);
  // paginatedData = signal<any[]>([]);


  ngOnChanges() {
    // // filter paged data
    // const startIndex = this.pageIndex() * this.pageSize();
    // const endIndex = startIndex + this.pageSize();
    // this.paginatedData.set(this.data.slice(startIndex, endIndex));
  }

  // // pagination event
  // handlePageEvent(e: PageEvent) {
  //   this.pageEvent = e;
  //   this.pageSize.set(e.pageSize);
  //   this.pageIndex.set(e.pageIndex);

  //   // filter paged data
  //   const startIndex = this.pageIndex() * this.pageSize();
  //   const endIndex = startIndex + this.pageSize();
  //   this.paginatedData.set(this.data.slice(startIndex, endIndex));
  // }

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
}

