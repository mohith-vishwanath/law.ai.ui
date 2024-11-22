import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Sessions } from 'src/app/models/contractFile';
import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public showUploadPage: boolean = true;
  public showLoadingIcon: boolean = false;
  public hasMessages : boolean = false;

  public message : string = "";

  public CurrentSession : Sessions | undefined = undefined;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    this.dataService.CurrentSession$.subscribe(session => {
      console.log(session);
      this.showLoadingIcon = false;
      if(session?.chats == undefined) {
        this.hasMessages = false;
        this.CurrentSession = undefined;
      } else if(session.chats) {
        this.hasMessages = session.chats.length > 0;
        this.CurrentSession = session;
        for(let i = 0; i< (this.CurrentSession.chats?.length || 0); i++) {
          if(this.CurrentSession && this.CurrentSession.chats) {
            this.CurrentSession.chats[i].content = marked(this.CurrentSession?.chats[i]?.content).toString();
          }
        }
      }
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

  public QuickPromptButtons(question : string) {
    this.message = question;
    this.SendUserMessage(this.message);
  }

  public SendUserMessage(question : string = "") {

    if(this.message.trim() == "" && question == "") return; //Make sure the message isn't empty

    const userMessage = this.message ?? question;

    //Update the message in the current conversation
    this.dataService.AddMsgToCurrentSession(userMessage);

    this.message = "";
  }

  public Questions(question : string) {
    this.dataService.AddMsgToCurrentSession(question);
  }

}