import { Component, ElementRef, ViewChild } from '@angular/core';
import { BusinessCard } from '../../core/models/business-card.model';
import { BusinessCardService } from '../../core/services/business-card.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { BusinessCardWorkflowService } from '../../core/services/business-card-workflow.service';
import { DatePipe } from '@angular/common';
import { SharedService } from '../../core/shared/shared.service';
@Component({
  selector: 'app-add-business-card',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    DatePipe,
  ],
  templateUrl: './add-business-card.component.html',
  styleUrl: './add-business-card.component.css'
})
export class AddBusinessCardComponent {

  card: BusinessCard = new BusinessCard() ;

  preview = false;
  photoPreview: string | ArrayBuffer | null = null;
  isDragging: boolean = false;
  selectedFile: File | null = null;
  isPhotoDragging = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private cardService: BusinessCardService,
              private cardWorkflowService:BusinessCardWorkflowService,
              private sharedService:SharedService) {}

  submitForm() {

  this.cardService.create(this.card).subscribe((created: any) => {
    if(created.success)
    this.cardWorkflowService.addCard(created.result);
    
    this.sharedService.showToastMessage(created.message);

    this.card = new BusinessCard();
    this.preview = false;
    this.photoPreview = null;
  });
}

  uploadPhoto(event: any) {
    const file = event.dataTransfer?.files?.[0] || event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.photoPreview = result;
      const pureBase64 = result.split(',')[1];
      this.card.photo = pureBase64;
    };
    reader.readAsDataURL(file);
  }


  onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
}


 importCSV() {
  if (!this.selectedFile) {
    this.sharedService.showToastMessage("Please select or drop a CSV file.");
    return;
  }

  this.cardService.importCsv(this.selectedFile).subscribe({
    next: (card) => {
        this.sharedService.showToastMessage(card.message);
        this.fetchBusinessCards();
    },
    error: (err) => console.error(err)
  });
}


importXML() {
  if (!this.selectedFile) {
    this.sharedService.showToastMessage("Please select or drop an XML file.");
    return;
  }

  this.cardService.importXml(this.selectedFile).subscribe({
    next: (card) => {
        this.sharedService.showToastMessage(card.message);     
        this.fetchBusinessCards();
    },
    error: (err) => console.error(err)
  });
}


  fetchBusinessCards() {

  this.cardService.getAll().subscribe({
    next: (cards: any) => {
      const result = cards.result;
      this.cardWorkflowService.setCards(result);

    },
    error: (err) => {
      this.sharedService.showToastMessage("Failed to load business cards");
      console.error(err);
    }
  });
}

  onDragOver(event: DragEvent) {
    debugger
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    debugger
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    debugger
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }


  removePhoto() {
    this.photoPreview = null;
    this.fileInput.nativeElement.value = '';
    this.card.photo = undefined;
  }


}
