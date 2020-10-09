import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './dynamic-components/spinner/spinner.component';
import { AlertComponent } from './dynamic-components/alert/alert.component';
import { MyDirective } from './mydirective.directive';

@NgModule({
  declarations: [
    AppComponent,
    MyDirective,
    SpinnerComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  entryComponents:[SpinnerComponent, AlertComponent]
})
export class AppModule { }
