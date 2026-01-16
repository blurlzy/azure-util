import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ModelExplorerDataService {
      private locationUrl = environment.apiEndpoint + 'api/Locations';
      private modelUrl = environment.apiEndpoint + 'api/models';

      constructor(private http: HttpClient) {

      }

      getLocations(): Observable<any[]> {
            return this.http.get<any[]>(this.locationUrl);
      }

      getModelFormats(location: string): Observable<any[]> {
            const url = `${this.modelUrl}/formats?location=${location}`;
            return this.http.get<any[]>(url);
      }

      getModels(location: string, format:string): Observable<any[]> {
            const url = `${this.modelUrl}?location=${location}&modelFormat=${format}`;
            return this.http.get<any[]>(url);
      }
}

