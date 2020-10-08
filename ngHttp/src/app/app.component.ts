import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { appModel } from './app.model';
import { AppService } from './app.service';
import {map} from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  comments: appModel[]=[];
  title = 'ngHttp';
  methodSubs = new Subscription();

  isErr:boolean = false;
  errTxt:string = ''
  constructor(private _serv: AppService, private router:Router, private actRoute: ActivatedRoute){}

  ngOnInit(){
    /* this._serv.commentSubj.subscribe(
      (latestData:appModel[]) =>{
        //console.log(latestData)
        latestData.map((item:appModel)=>{
          this.comments.push(item);
        })
      }
    ) */
    this.onFetch();
  }

  onSubmit(postData: NgForm){
    let commentInstance: appModel = postData.value;
    this.methodSubs = this._serv.onPostData(commentInstance)
        .subscribe({
          next(resposeData){
          console.log(resposeData);
        },
        error(error){
          this.isErr = true;
          this.errTxt = error.error.error;
        },
        complete(){
          postData.reset();
          location.reload();
        }
    });

    //postData.reset();
    //this.router.navigate(['/'], {relativeTo: this.actRoute})
    
  }

  onFetch(){
    this._serv.onFetchData()
        .pipe(map(data =>{
          let temp:appModel[]=[];
          for(let key in data){
            if(data.hasOwnProperty(key)){
              temp.push({...data[key], id:key});
            }
          }
          return temp;
        }))
        .subscribe((fetch_Data: appModel[])=>{
          this.comments = fetch_Data;
        },
        error=>{
          console.log(error)
        })
  }

  deleteItem(index:string){
    console.log(this.comments)
    this.methodSubs = this._serv.onDeleteItem(index)
                          .subscribe({
                            next( responseData ){
                            console.log(responseData)
                          },
                          complete(){
                            location.reload();
                          }
                        });
                          //this.router.navigate([''], {relativeTo: this.actRoute})
                          
  }

  ngOnDestroy(){
    this.methodSubs.unsubscribe();
  }
}
