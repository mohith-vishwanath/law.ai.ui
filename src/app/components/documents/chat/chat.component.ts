import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Sessions } from 'src/app/models/contractFile';
import { marked } from 'marked';
import {v4} from "uuid"

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

  public CurrentSession: Sessions | undefined = undefined;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.dataService.CurrentSession$.subscribe(messages => {
      this.CurrentSession = messages;
      if(!messages || !messages.chats) {
        this.showUploadPage = true;
        this.showLoadingIcon = false;
        return;
      }
      for(let i = 0; i < messages.chats?.length; i++) {
        if(messages.chats[i].role == "assistant") messages.chats[i].content = marked(messages.chats[i].content).toString()
      }
      this.showUploadPage = false;
      this.showLoadingIcon = false;
    })
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
    this.dataService.UploadDocument(files[0]);
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
    this.dataService.AddMsgToCurrentSession(this.message);

    this.message = "";
  }

  public Questions(question : string) {
    this.dataService.AddMsgToCurrentSession(question);
  }

}