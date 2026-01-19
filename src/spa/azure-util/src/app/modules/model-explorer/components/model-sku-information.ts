import { Component, inject, signal } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
// date pipe
import { DatePipe, DecimalPipe } from '@angular/common';
// angular material
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-model-sku-information',
  imports: [FormsModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, DatePipe, DecimalPipe],
  template: `
  <h5 mat-dialog-title>{{ data.modelName  }}</h5>
  <mat-dialog-content class="mat-typography">
    <div class="row">
        <div class="muted small">
           {{ data.sku.usageName }}
        </div>
      <!-- Calculator -->
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-body">
            <div class="fw-semibold mb-1">RPM Calculator</div>
            <div class="muted small mb-3">
              Estimate requests per minute from TPM and average tokens per request.
            </div>

            <div class="mb-3">
              <label class="form-label muted">TPM (tokens per minute)</label>
              <input type="number" min="0" step="1" class="form-control mono" placeholder="e.g. 60000" [formControl]="tpmFormControl">
            </div>

            <div class="mb-3">
              <label class="form-label muted">Avg tokens per request</label>
              <input type="number" min="1" step="1" class="form-control mono" placeholder="e.g. 1200" [formControl]="avgTokensFormControl">
              <div class="muted small mt-1">
                Tip: avg tokens ≈ input + output tokens per request.
              </div>
            </div>

            <div class="d-flex gap-2 mb-3">
              <button class="btn btn-outline-dark btn-sm" 
                (click)="calculateRPM()" [disabled]="tpmFormControl.invalid || avgTokensFormControl.invalid">Calculate</button>
              <!-- <button class="btn btn-outline-secondary btn-sm">Reset</button> -->
            </div>

            <div class="kpi">
              <div class="muted small">Estimated RPM</div>
              <div class="h4 mb-0 mono" id="rpmOut"> {{ rpm() | number }}</div>
              <div class="muted small mt-1 mono" id="rpmFormula">RPM = TPM / AvgTokens</div>
            </div>

            <div class="muted small mt-3">
              This is a simple estimate. Real throughput can be constrained by model RPM limits, concurrency, and response sizes.
            </div>
            <div class="muted small mt-3">
              <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/quota?view=foundry-classic&tabs=rest#understanding-rate-limits" target="_blank">
                Understanding rate limits
              </a> <i class="bi bi-box-arrow-up-right ms-2"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="col-12 col-lg-5">
      <div class="card h-100">
        <div class="card-body">
          <div class="mt-3">
            <table class="table">
              <thead>
                <tr class="muted">
                  <th>Max TPM</th>
                  <th class="text-end">Deprecation Date</th>
                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="mono">{{ data.sku.capacity.maximum | number }} </td>
                  <td class="mono text-end">{{ data.sku.deprecationDate | date: 'mediumDate'}}</td>

                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
  </div>

  </div>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button matButton [mat-dialog-close]="true" cdkFocusInitial>Close</button>
  </mat-dialog-actions>
  `,
  styles: ``,
})
export class ModelSkuInformation {
  readonly dialogRef = inject(MatDialogRef<ModelSkuInformation>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  // required form controls
  tpmFormControl = new FormControl(null, Validators.required);
  avgTokensFormControl = new FormControl(null, Validators.required);

  // calculate tpm
  rpm = signal<number | null>(null);

  ngOnInit() {
    // set tpm
    this.tpmFormControl.setValue(this.data.sku.capacity.maximum);
  }

  calculateRPM(): void {
    const tpm = this.tpmFormControl.value || 0;
    const avgTokens = this.avgTokensFormControl.value || 1;
    // round the value
    this.rpm.set(Math.round(tpm / avgTokens));
    //this.rpm.set(tpm / avgTokens);
  }
}
