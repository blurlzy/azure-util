import { Component, Input, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// rxjs
import { debounceTime } from 'rxjs';
// components
import { ModelSkuInformation } from './model-sku-information';


@Component({
  selector: 'app-model-table',
  imports: [ReactiveFormsModule, DecimalPipe, MatIconModule, MatButtonModule, MatDialogModule, MatTooltipModule, MatPaginatorModule],
  template: `
      <table class="table mt-3">
        <thead>
          <tr>
            <th scope="col" class="align-middle">
              <div class="d-flex align-items-center gap-2">
                <span>Model</span>
                @if(showFilter()){
                    <button class="btn btn-link p-0" (click)="toggleFilter()"><i class="bi bi-funnel-fill"></i></button>
                    <input type="text" class="bottom-line-input" [formControl]="filterText" placeholder="Filter models..." />
                }@else {
                    <button class="btn btn-link p-0" (click)="toggleFilter()"><i class="bi bi-funnel"></i></button>
                }
         
              </div>
            </th>
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
          @for(item of filteredData(); track item) {
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
    /* Table transparent background */
    .table {
      background-color: transparent !important;
    }
    
    .table th,
    .table td {
      background-color: transparent !important;
    }

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

    /* Bottom line input style */
    .bottom-line-input {
      width:160px;
      border: none;
      border-bottom: 2px solid #000;
      border-radius: 0;
      background: transparent;
      padding: 4px 0;
      font-size: 0.875rem;
      transition: border-bottom-color 0.2s ease-in-out;
    }

    .bottom-line-input:focus {
      outline: none;
      border-bottom-color: #ed008c;
      box-shadow: none;
    }

    .bottom-line-input::placeholder {
      color: #6c757d;
      opacity: 0.7;
    }

  `,
})
export class ModelTable {
  @Input({ required: true }) data: any = [];
  readonly dialog = inject(MatDialog);

  // show filter
  showFilter = signal(false);
  // filtered data
  filteredData = signal<any[]>([]);
  // filter text
  filterText = new FormControl('');

  // pager
  // pageEvent: PageEvent | undefined;
  // pageSize = signal(6);
  // pageIndex = signal(0);
  // paginatedData = signal<any[]>([]);

  constructor() {

    // filter text changes
    //  ensure it only triggers after user stops typing for 300ms
    this.filterText.valueChanges
                  .pipe(debounceTime(200))
                  .subscribe((text) => {
                        if (text == null || text.trim() === '') {
                          //reset
                          this.filteredData.set(this.data);
                          return;
                        }

                        // filter
                          const filtered = this.data.filter((item: any) => item.model.name.toLowerCase().includes(text.toLowerCase()));
                          this.filteredData.set(filtered);
    });
  }


  ngOnChanges() {
    // initialize filtered data
    this.filteredData.set(this.data);
    // reset the filter text
    this.filterText.setValue('');
  }

  toggleFilter() {
    this.showFilter.set(!this.showFilter());

    // reset the filter when it is hidden
    if (!this.showFilter()) {
      this.filterText.setValue('');
      this.filteredData.set(this.data);
    }
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

