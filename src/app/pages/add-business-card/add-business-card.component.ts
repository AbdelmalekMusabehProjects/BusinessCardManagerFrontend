import { Component } from '@angular/core';
import { BusinessCard } from '../../core/models/business-card.model';
import { BusinessCardService } from '../../core/services/business-card.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-business-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-business-card.component.html',
  styleUrl: './add-business-card.component.css'
})

export class AddBusinessCardComponent {

  card: BusinessCard = {
    name: '',
    gender: '',
    dateOfBirth: undefined,
    email: '',
    phone: '',
    photo: '',
    address: ''
  };

  preview = false;
  photoPreview: string | ArrayBuffer | null = null;
  importFile: File | null = null;

  constructor(private cardService: BusinessCardService) {}

  submitForm() {
    this.cardService.create(this.card).subscribe(() => {
      alert('Business Card Created!');
      this.preview = false;
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
      });
    }
  }
}
