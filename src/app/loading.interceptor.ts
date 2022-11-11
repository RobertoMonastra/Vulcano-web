import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './shared/services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private countRequest = 0;
  private idMessage: string = '';
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.countRequest) {
        this.loadingService.requestStarted();
    }
    this.countRequest++;
    return next.handle(request)
      .pipe(
        finalize(() => {
          this.countRequest--;
          if (!this.countRequest) {
            this.loadingService.requestEnded()
          }
        })
      );
  }
}