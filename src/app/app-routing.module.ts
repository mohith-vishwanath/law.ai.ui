import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchMainFrameComponent } from './components/search/search-main-frame/search-main-frame.component';
import { DocumentsMainFrameComponent } from './components/documents/documents-main-frame/documents-main-frame.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path : "",
    component : HomeScreenComponent
  },
  {
    path : "search",
    component : SearchMainFrameComponent,
    canActivate: [AuthGuard] 
  },
  {
    path : "chat",
    component : DocumentsMainFrameComponent,
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}