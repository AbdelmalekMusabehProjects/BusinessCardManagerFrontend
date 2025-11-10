import { Component } from '@angular/core';
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
    MatCardModule
  ],
  templateUrl: './add-business-card.component.html',
  styleUrl: './add-business-card.component.css'
})
export class AddBusinessCardComponent {

  card: BusinessCard = new BusinessCard() ;

  preview = false;
  photoPreview: string | ArrayBuffer | null = null;
  importFile: File | null = null;

  constructor(private cardService: BusinessCardService,
              private cardWorkflowService:BusinessCardWorkflowService) {}

  submitForm() {

  this.cardService.create(this.card).subscribe((created: any) => {
    this.cardWorkflowService.addCard(created.result);
    alert('Business Card Created!');
    this.card = new BusinessCard();
    this.preview = false;
    this.photoPreview = null;
  });
}

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result;
      this.card.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any) {
    this.importFile = event.target.files[0];
  }

  importCSV() {
    if (this.importFile) {
      this.cardService.importCsv(this.importFile).subscribe(() => {
        alert('CSV Imported Successfully!');
      });
    }
  }

  importXML() {
    if (this.importFile) {
      this.cardService.importXml(this.importFile).subscribe(() => {
        alert('XML Imported Successfully!');
        this.fetchBusinessCards();

      });
    }
  }

   fetchBusinessCards() {

  this.cardService.getAll().subscribe({
    next: (cards: any) => {
      const result = cards.result;
      this.cardWorkflowService.setCards(result);

    },
    error: (err) => {
      console.error('Failed to load business cards', err);
    }
  });
}
}
