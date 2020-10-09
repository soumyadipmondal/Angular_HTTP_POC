import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[alertContent]'
})

export class MyDirective {
    constructor(public _vcr: ViewContainerRef){}
}