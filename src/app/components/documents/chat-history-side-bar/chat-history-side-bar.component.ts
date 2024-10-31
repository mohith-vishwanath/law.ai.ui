import { Component, Input, OnInit } from '@angular/core';
import { DocumentHistory } from 'src/app/models/contractFile';
import { DataService } from 'src/app/services/data.service';
import { BackendService } from 'src/app/services/service';

@Component({
  selector: 'app-chat-history-side-bar',
  templateUrl: './chat-history-side-bar.component.html',
  styleUrls: ['./chat-history-side-bar.component.css']
})
export class ChatHistorySideBarComponent implements OnInit {

  public history : DocumentHistory[] = [];
  public currentConversation : string = "-1";

  public hasDocuments : boolean = false;

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    console.log("Subscribing to GetUserDocumentHistory")
    this.dataService.GetUserDocumentHistory().subscribe(res => {
      this.history = res || [];
      this.hasDocuments = (this.history.length > 0)
    })
  }

  public ConversationSelected(index : number) {
    if(this.currentConversation == `${index}`) return;
    //Select the component with id = index
    document.getElementById(`${index}`)?.classList.add("selected")
    document.getElementById(this.currentConversation)?.classList.remove("selected")
    this.currentConversation = `${index}`;
    this.dataService.ChangeCurrentConversation(this.history[index]);
  }

}
