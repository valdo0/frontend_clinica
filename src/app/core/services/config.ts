import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config = environment;

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get apiTimeout(): number {
    return this.config.apiTimeout;
  }

  get isProduction(): boolean {
    return this.config.production;
  }
}
