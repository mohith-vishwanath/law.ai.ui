import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BackendService } from './services/service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon"
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSidenavModule } from "@angular/material/sidenav";
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { MainFrameComponent } from './components/main-frame/main-frame.component';
import { SearchResultsComponent } from './components/search/search-results/search-results.component';
import { SearchMainFrameComponent } from './components/search/search-main-frame/search-main-frame.component';
import { DocumentsMainFrameComponent } from './components/documents/documents-main-frame/documents-main-frame.component';
import { ChatHistorySideBarComponent } from './components/documents/chat-history-side-bar/chat-history-side-bar.component';
import { ChatComponent } from './components/documents/chat/chat.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';

@NgModule({
  declarations: [AppComponent, TopBarComponent, MainFrameComponent, SearchResultsComponent, SearchMainFrameComponent, DocumentsMainFrameComponent, ChatHistorySideBarComponent, ChatComponent, HomeScreenComponent],
  imports: [BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatListModule,
    MatExpansionModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent],
})
export class AppModule { }
