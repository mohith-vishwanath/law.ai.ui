import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/service';
import { ActionButtons } from '../models/contractFile';

@Component({
  selector: 'app-contract-analysis',
  templateUrl: './contract-analysis.component.html',
  styleUrls: ['./contract-analysis.component.css']
})
export class ContractAnalysisComponent implements OnInit {

  constructor(private service: BackendService) { }

  public query: string = "";
  public caseSpecificTitle: string = "";


  private searchBarContainerElement: Element | null = null;
  private addFilesButtonElement: Element | null = null;
  private dynamicButtonsElement: Element | null = null;

  public dynamicButtons: ActionButtons[] = [];

  public showUploadFilesText: boolean = true;

  ngOnInit(): void { }
  ngAfterViewInit(): void {
    this.searchBarContainerElement = document.querySelector('.search-bar');
    this.addFilesButtonElement = document.querySelector('.add-files-button');
    this.dynamicButtonsElement = document.querySelector(".dynamic-button-container");
  }

  isUploading: boolean = false;
  showTextBox: boolean = false;

  // Handle drag over event
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const uploadContainer = document.querySelector('.upload-container');
    uploadContainer?.classList.add('hover');
  }

  // Handle drag leave event
  onDragLeave() {
    const uploadContainer = document.querySelector('.upload-container');
    uploadContainer?.classList.remove('hover');
  }

  // Handle file drop event
  onDrop(event: DragEvent) {
    event.preventDefault();
    const uploadContainer = document.querySelector('.upload-container');
    uploadContainer?.classList.remove('hover');
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileUpload(files[0]);
    }
  }

  // Handle file selected via file input (when clicking plus button)
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFileUpload(file);
  }

  // Handle clicking on the plus button to open file dialog
  onPlusClick() {
    const fileInput = document.querySelector('#fileInput') as HTMLElement;
    fileInput.click();
  }

  disableSearchButton() {
    return this.query == '' || this.query.trim().length == 0;
  }

  // File upload logic
  handleFileUpload(file: File) {

    console.log(`Uploading file : ${file.name}`)
    this.isUploading = true;
    this.showUploadFilesText = false;
    this.service.uploadDocument(file).subscribe(x => {
      this.isUploading = false;
      this.caseSpecificTitle = `Let's talk about ${x.tags[0]}`;
    });
  }

  removeAddButtonAndShowSearchBar() {
    this.addFilesButtonElement?.classList.add("hidden");
    this.searchBarContainerElement?.classList.remove("hidden")
    this.dynamicButtonsElement?.classList.remove("hidden")
  }

  public sendQuery() { }

  public dynamicActionsButtonClicked(id: number) {

  }

}
