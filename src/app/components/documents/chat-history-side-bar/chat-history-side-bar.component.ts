import { Component, Input, OnInit } from '@angular/core';
import { Files, Sessions } from 'src/app/models/contractFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chat-history-side-bar',
  templateUrl: './chat-history-side-bar.component.html',
  styleUrls: ['./chat-history-side-bar.component.css']
})
export class ChatHistorySideBarComponent implements OnInit {

  public history : Sessions[] = [];
  public currentConversation : string = "-1";

  public hasDocuments : boolean = false;

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.CreateNewChatSession();
    this.dataService.GetUserSessions().subscribe(res => {
      this.history = res || [];
      const index = this.history.findIndex(x => x.isSelected);
      this.hasDocuments = (this.history.length > 0)
    })
  }

  public ConversationSelected(index : number) {
    console.log(`Current conversation : ${this.currentConversation} | Index : ${index}`)
    if(index == -1) return;
    this.currentConversation = `${index}`;
    this.dataService.ChangeCurrentConversationTo(index);
  }

  public CreateNewChatSession() {
    this.dataService.CreateNewChatSession();
  }

}