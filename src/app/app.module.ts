import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from './gemini-service.service';
import {  HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { API_URL } from './app.tokens';
import { LoaderComponent } from './loader/loader.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
/* Import the MatSlideToggleModule */
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/* Import BrowserAnimationsModule if not already imported */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToggleComponent } from './toggle/toggle.component';
@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    ClipboardModule,
    FontAwesomeModule,
    MatSlideToggleModule,   
    BrowserAnimationsModule,  
    // HttpClient
    // GoogleGenerativeAI
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    GeminiService,
    { provide: API_URL, useValue: 'AIzaSyAKDx17fXB_DBeq4HQjae4F4AZ8vvX' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
