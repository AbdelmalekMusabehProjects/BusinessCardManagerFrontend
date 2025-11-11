import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { BusinessCardService } from '../../core/services/business-card.service';
import { BusinessCard } from '../../core/models/business-card.model';
import { DatePipe } from '@angular/common';
import { BusinessCardWorkflowService } from '../../core/services/business-card-workflow.service';
import { SharedService } from '../../core/shared/shared.service';

@Component({
  selector: 'app-business-cards',
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
        DatePipe
  ],
  templateUrl: './business-cards.component.html',
  styleUrl: './business-cards.component.css'
})

export class BusinessCardsComponent implements OnInit {
  businessCards: BusinessCard[] = [];
  loading: boolean = true;
constructor(private businessCardService: BusinessCardService,
            private cardWorkflowService:BusinessCardWorkflowService,
            private sharedService:SharedService) {}

  ngOnInit() {
  this.cardWorkflowService.cards$.subscribe(cards => {
    this.businessCards = cards;
  });

  if (this.cardWorkflowService.getCards().length === 0) {
    this.fetchBusinessCards();
  }
}

  
  fetchBusinessCards() {
  this.loading = true;

  this.businessCardService.getAll().subscribe({
    next: (cards: any) => {
      const result = cards.result;

      this.cardWorkflowService.setCards(result);

      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}


    deleteCard(id: number) {
    this.businessCardService.delete(id).subscribe({
      next: (card) => {
        this.sharedService.showToastMessage(card.message)
        this.businessCards = this.businessCards.filter(card => card.id !== id);
      },
      error: (err) => console.error(err)
    });
  }

  exportCSVCard(card: BusinessCard) {
  this.businessCardService.exportCsv(card.id!).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `business_card_${card.id}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      this.sharedService.showToastMessage('CSV File Exported Successfully!')

    },
    error: (err) => {
      console.error(err);
    }
  });
}

exportXMLCard(card: BusinessCard) {
  this.businessCardService.exportXml(card.id!).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `business_card_${card.id}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
      this.sharedService.showToastMessage('XML File Exported Successfully!')

    },
    error: (err) => {
      console.error(err);
    }
  });
}


}
