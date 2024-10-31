import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DocumentHistory } from 'src/app/models/contractFile';
import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public showUploadPage: boolean = true;
  public showLoadingIcon: boolean = false;
  // public hasDocuments : boolean = false;

  public message : string = "";

  public CurrentConversation: DocumentHistory | undefined = undefined;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.GetCurrentConversation().subscribe(conversation => {
      if(conversation?.fileId == undefined)  return;
      this.CurrentConversation = conversation;

      for(let i = 0; i < conversation.chats.length; i++) {
        if(conversation.chats[i].role == "assistant") conversation.chats[i].content = marked(conversation.chats[i].content).toString()
      }

      this.showUploadPage = false;
    });
  }

  ngAfterViewInit(): void {

    window.addEventListener("dragover", e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener("drop", e => {
      e && e.preventDefault();
    }, false);
  }


  //File Upload handling

  public handleFileDrop(event: DragEvent) {
    console.log("File Dropped")
    let files = event.dataTransfer?.files;
    if (files == undefined) return;
    this.showLoadingIcon = true;
    this.dataService.UploadDocument(files[0]).subscribe(res => {
      if(!res) return;
      this.showLoadingIcon = false;
    })
  }

  public onDragOver(event: DragEvent) {
    document.getElementById('drop-area')?.classList.add('drag-over');
  }

  public onDragLeave(event: DragEvent) {
    document.getElementById('drop-area')?.classList.remove('drag-over');
  }

  //File Upload handling

  public SendUserMessage() {

    if(this.message.trim() == "") return; //Make sure the message isn't empty

    //Update the message in the current conversation
    this.dataService.AddMsgToCurrentConversation(this.message);

    this.message = "";
  }

}