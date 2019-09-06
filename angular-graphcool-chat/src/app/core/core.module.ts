import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule, MatListModule} from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloConfigModule } from './../apollo-config.module';

@NgModule({
  exports:[
    BrowserModule,
    ApolloConfigModule,
    BrowserAnimationsModule,
    MatListModule,
    MatToolbarModule
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ){
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
  }
}
