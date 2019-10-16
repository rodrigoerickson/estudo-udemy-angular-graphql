import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule, 
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule} from '@angular/material'
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports:[
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatToolbarModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
