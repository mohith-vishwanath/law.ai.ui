import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchMainFrameComponent } from './components/search/search-main-frame/search-main-frame.component';
import { DocumentsMainFrameComponent } from './components/documents/documents-main-frame/documents-main-frame.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';

const routes: Routes = [
  {
    path : "search",
    component : SearchMainFrameComponent
  },
  {
    path : "chat",
    component : DocumentsMainFrameComponent
  },
  // {
  //   path : "",
  //   component : HomeScreenComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}