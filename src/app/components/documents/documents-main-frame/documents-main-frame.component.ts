import { Component, OnInit } from '@angular/core';
import { Sessions } from 'src/app/models/contractFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-documents-main-frame',
  templateUrl: './documents-main-frame.component.html',
  styleUrls: ['./documents-main-frame.component.css']
})
export class DocumentsMainFrameComponent implements OnInit {

  constructor(private dataService : DataService) {}

  ngOnInit(): void {
    this.dataService.FetchSessionsHistory();
  }

}
