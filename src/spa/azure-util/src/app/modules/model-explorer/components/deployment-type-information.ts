import { Component } from '@angular/core';

// angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deployment-type-information',
  imports: [MatDialogModule, MatButtonModule],
  template: `
  <h2 mat-dialog-title>Quotas and Limits</h2>
  <mat-dialog-content class="mat-typography">
    <p>
      Quotas and limits aren't enforced at the tenant level. Instead, the highest level of quota restrictions is scoped at the Azure subscription level.
    </p>
    <p>
      Tokens per minute (TPM) and requests per minute (RPM) limits are defined per region, per subscription, and per model or deployment type.
    </p>  
    <p>
      If your Azure subscription is linked to certain <a href="https://azure.microsoft.com/support/legal/offer-details/" target="_blank">offer types</a>, your maximum quota values are lower than the values indicated in the previous tables.
    </p>

    <ul>
      <li> GPT-5-pro quota is only available to MCA-E and default quota subscriptions. All other offer types have zero quota for this model by default.</li>
      <li>GPT-5 reasoning model quota is 20K TPM and 200 RPM for all offer types that do not have access to MCA-E or default quota. GPT-5-chat is 50K and 50 RPM.</li>
      <li>Some offer types are restricted to only Global Standard deployments in the East US2 and Sweden Central regions.</li>
    </ul>  
   
    <div class="alert alert-info" role="alert">
      <p><i class="bi bi-info-circle"></i> Note</p>
      Quota limits are subject to change.
    </div>
    
    <p> 🔗 
      <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/openai/quotas-limits?view=foundry-classic&tabs=REST#scope-of-quota" target="_blank">
        More information 
      </a> 
    </p>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button matButton [mat-dialog-close]="true" cdkFocusInitial>Close</button>
  </mat-dialog-actions>
  `,
  styles: ``,
})
export class DeploymentTypeInformation {

}
