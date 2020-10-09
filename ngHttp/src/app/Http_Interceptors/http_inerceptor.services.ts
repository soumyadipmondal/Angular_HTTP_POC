import { HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from "@angular/core";
import { createCustomElement } from '@angular/elements';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { AppService } from '../app.service';
import { SpinnerComponent } from '../dynamic-components/spinner/spinner.component';

@Injectable({
    providedIn: 'root'
})

export class HttpInterceptorServices implements HttpInterceptor{
    private request:HttpRequest<any>[]=[];
    spinner: SafeHtml;

    constructor(
      private injector: Injector,
      private domSanitizer: DomSanitizer,
      private appLoaderServ: AppService
    ){
        /* const spinnerEl$ = createCustomElement(SpinnerComponent, {injector});
        customElements.define('app-spinner', spinnerEl$)
        this.spinner = domSanitizer.bypassSecurityTrustHtml('<app-spinner message="Loading..."></app-spinner>') */
    }
    removeReq = (req: HttpRequest<any>) =>{
        const reqIndex = this.request.indexOf(req)
        if(reqIndex >=0){
            this.request.splice(reqIndex, 1);
        }

        this.appLoaderServ.isLoading.next(this.request.length>0)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler){
        this.request.push(req);
        const modifiedHeaders = req.clone({headers: req.headers.append('Learing', 'incerptors')})// changing headers
        this.appLoaderServ.isLoading.next(true);
        return next.handle(modifiedHeaders).pipe(
            tap(event =>{
                if(event.type === HttpEventType.Response){
                    this.removeReq(req);   
                }
            })
        )
    }
}