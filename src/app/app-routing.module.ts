import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ContractAnalysisComponent } from './contract-analysis/contract-analysis.component';

const routes: Routes = [
  {
    path : "search",
    component : SearchComponent
  },
  {
    path : "analysis",
    component : ContractAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}