import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule } from '@angular/material'
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports:[
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
