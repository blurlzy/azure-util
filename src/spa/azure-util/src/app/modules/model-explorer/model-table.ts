import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-model-table',
  imports: [ DecimalPipe, MatIconModule, MatButtonModule ],
  template: `
      <table class="table">
        <thead>
          <tr>
            <th scope="col" class="align-middle">Model</th>
            <th scope="col" class="align-middle">Status </th>
            <th scope="col" class="align-middle">
              Deployment Type 
                <button class="btn btn-light btn-sm ms-1">
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
                      <li>{{ sku.name }} - Max TPM: {{ sku?.capacity?.maximum | number }}</li>
                    }
                  </ul>

                </td>
              </tr>
          }

        </tbody>
      </table>
  `,
  styles: ``,
})
export class ModelTable {
  @Input({ required: true }) data: any = [];
}
