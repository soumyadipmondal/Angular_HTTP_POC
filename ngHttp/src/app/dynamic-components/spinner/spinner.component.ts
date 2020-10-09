import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() message: string
  loading:boolean;
  constructor(
    private appLoaderServ: AppService
  ) { }

  ngOnInit(): void {
    this.appLoaderServ.isLoading
        .subscribe((loadVal:boolean)=>{
            console.log(loadVal)
            this.loading = loadVal;
        })
  }

}
