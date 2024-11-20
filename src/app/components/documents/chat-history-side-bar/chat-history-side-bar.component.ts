import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  public isHistoryEmpty : boolean = false;
  public isCurrentChatNew : boolean = false;

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.dataService.SessionsHistory$.subscribe(res => {

      if(!res || res.length == 0) {
        this.CreateNewChatSession();
        return;
      };

      this.history = res;
      const currentConversationIndex = this.history.findIndex(x => x.isSelected);

      this.currentConversation = currentConversationIndex.toString() || "-1";
      if(this.currentConversation != "-1") {
        if(this.history[currentConversationIndex].chats?.length == 0 && this.history[currentConversationIndex].sessionId == "") this.isCurrentChatNew = true;
        else this.isCurrentChatNew = false;
        this.isHistoryEmpty = (this.history.length == 0);
        console.log(this.history)
      }
    })
  }

  public ConversationSelected(index : number) {
    if(index == -1) return;
    this.currentConversation = `${index}`;
    this.dataService.ChangeCurrentConversationTo(index);
  }

  public CreateNewChatSession() {
    if(this.isCurrentChatNew) return;
    console.log("Creating new chat");
    this.dataService.CreateNewChatSession();
    this.isCurrentChatNew = true;
  }


  //Session Actions
  public Rename(index : number, name : string) {

  }

  public Delete(index : number) {
    this.dataService.DeleteSession(this.history[index].sessionId).subscribe(response => {
      if(response) this.dataService.FetchSessionsHistory()
    })
  }

}