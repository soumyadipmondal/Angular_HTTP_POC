import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appModel } from './app.model';
import { Subject } from 'rxjs';
import { AlertComponent } from './dynamic-components/alert/alert.component';

@Injectable({
    providedIn:'root',
})
export class AppService{
    commentSubj = new Subject<appModel[]>();
    constructor(
        private _http: HttpClient,
        private componentFactoryResolver: ComponentFactoryResolver
    ){}
    postArray:appModel[]=[];
    onPostData = (data: appModel)=>{
        this.postArray.push(data);
        this.commentSubj.next([...this.postArray]);
        return this._http.post('https://ngproject-f241d.firebaseio.com/posts.json', data);
    }
    onFetchData = ()=>{
        return this._http.get('https://ngproject-f241d.firebaseio.com/posts.json');
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