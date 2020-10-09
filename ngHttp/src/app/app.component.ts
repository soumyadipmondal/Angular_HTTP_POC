import { Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { createCustomElement } from '@angular/elements';

import { appModel } from './app.model';
import { AppService } from './app.service';
import { SpinnerComponent } from './dynamic-components/spinner/spinner.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MyDirective } from './mydirective.directive';
import { AlertComponent } from './dynamic-components/alert/alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  spinner:SafeHtml;
  isLoading:boolean = false;
  statusMsg: string = '';
  comments: appModel[]=[];
  title = 'ngHttp';
  methodSubs = new Subscription();
  sendVal: Observable<any>
  isErr:boolean = false;
  errTxt:string = '';
  onDelete= new Subject();
  
  //Dynamic Component
  @ViewChild(MyDirective) appDir : MyDirective;

  constructor(private _serv: AppService, 
    private router:Router, 
    private actRoute: ActivatedRoute,
    private injector: Injector,
    private domSanitizer: DomSanitizer,
    private componentFactoryResolver: ComponentFactoryResolver){

      const spinnerEl$ = createCustomElement(SpinnerComponent, {injector});
      customElements.define('app-spinner', spinnerEl$);
      this.spinner = domSanitizer.bypassSecurityTrustHtml('<app-spinner message="Wait..."></app-spinner>')
  }

  ngOnInit(){
    this._serv.commentSubj.subscribe(
      (latestData:appModel[]) =>{
        latestData.map((item:appModel)=>{
          this.comments.push(item);
        })
      }
    )
    this.onFetch();
  }
  onSubmit(postData: NgForm){
    let commentInstance: appModel = postData.value;
    this.isLoading = true; 
    this.methodSubs = this._serv.onPostData(commentInstance)
        .subscribe(
          resposeData=>{
          if(resposeData){
            this.isLoading = false;
            this.statusMsg = "You commment has been successfully Submitted."
            this._serv.alertComponent(this.appDir._vcr, 's', this.statusMsg);
          }
        },
        error =>{
          this.isErr = true;
          this.errTxt = error.error.error;
        }
    ); 
  }

  onFetch(){
    this.isLoading = true; 
    this.sendVal = this._serv.onFetchData();
    this.processData(this.sendVal)
  }

  deleteItem(index:string){
    this.isLoading = true; 
    this.methodSubs=this._serv.onDeleteItem(index)
                        .subscribe(res=>{
                          console.log(res);
                          this.isLoading = false; 
                          this.comments = this.comments.filter(item =>{
                            return item.id !== index
                          });
                          this.statusMsg = "Youe Item has been deleted"
                          this._serv.alertComponent(this.appDir._vcr, 'e', this.statusMsg);
                        });
      }



  processData=(data: Observable<any> )=>{
    this.methodSubs = data
    .pipe(
      map(data =>{ 
        let temp:appModel[]=[];
        for(let key in data){
          if(data.hasOwnProperty(key)){
            temp.push({...data[key], id:key});
          }
        }
        this.isLoading = false; 
        return temp;
      })
    )
  .subscribe((fetch_Data: appModel[])=>{
    this.comments = fetch_Data;
    console.log(this.comments)
  },
  error=>{
    console.log(error)
  })

  }

  ngOnDestroy(){
    this.methodSubs.unsubscribe();
  }
}
