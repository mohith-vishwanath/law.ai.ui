import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchMainFrameComponent } from './components/search/search-main-frame/search-main-frame.component';
import { DocumentsMainFrameComponent } from './components/documents/documents-main-frame/documents-main-frame.component';

const routes: Routes = [
  {
    path : "search",
    component : SearchMainFrameComponent
  },
  {
    path : "documents",
    component : DocumentsMainFrameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}  