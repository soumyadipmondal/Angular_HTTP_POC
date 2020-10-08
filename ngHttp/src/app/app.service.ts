import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appModel } from './app.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn:'root',
})
export class AppService{
    commentSubj = new Subject<appModel[]>();
    constructor(private _http: HttpClient){}
    postArray:appModel[]=[];
    onPostData = (data: appModel)=>{
        /* this.postArray.push(data);
        this.commentSubj.next([...this.postArray]); */
        return this._http.post('https://ngproject-f241d.firebaseio.com/posts.json', data);
    }
    onFetchData = ()=>{
        return this._http.get('https://ngproject-f241d.firebaseio.com/posts.json');
    }

    onDeleteItem=(index:string)=>{
        return this._http.delete(`https://ngproject-f241d.firebaseio.com/posts/${index}.json`)
    }
}