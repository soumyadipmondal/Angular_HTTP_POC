import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { appModel } from './app.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlertComponent } from './dynamic-components/alert/alert.component';

@Injectable({
    providedIn:'root',
})
export class AppService{
    isLoading= new BehaviorSubject<boolean>(false);
    commentSubj = new Subject<appModel>();
    constructor(
        private _http: HttpClient,
        private componentFactoryResolver: ComponentFactoryResolver
    ){}
    postArray:appModel[]=[];
    onPostData = (data: appModel)=>{
        //this.postArray.push(data);
        //console.log(this.postArray)
        this.commentSubj.next(data);
        return this._http.post('https://ngproject-f241d.firebaseio.com/posts.json', data);
    }
    onFetchData = ()=>{
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key')
        return this._http.get('https://ngproject-f241d.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({'Custom-Header': 'Hello'}),
                params: searchParams
            }
        );
    }

    onDeleteItem=(index:string)=>{
        
        return this._http.delete(`https://ngproject-f241d.firebaseio.com/posts/${index}.json`);
        //this.commentSubj.next()
    }

    alertComponent = (viewContaierRef:ViewContainerRef, isAlert:string, alertMsg:string)=>{
        viewContaierRef.clear();
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const alertComponent = viewContaierRef.createComponent(alertComponentFactory);
        alertComponent.instance.isErr=isAlert;
        alertComponent.instance.statusMsg=alertMsg;
    }
}