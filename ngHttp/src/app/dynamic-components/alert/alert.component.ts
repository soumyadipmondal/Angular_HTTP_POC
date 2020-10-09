import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() statusMsg:string;
  @Input() isErr:string
  constructor() { }

  ngOnInit(): void {
    console.log(this.statusMsg, this.isErr);
  }

}
