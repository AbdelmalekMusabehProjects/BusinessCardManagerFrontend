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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { BusinessCardWorkflowService } from '../../core/services/business-card-workflow.service';

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
            private cardWorkflowService:BusinessCardWorkflowService) {}

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
      console.error('Failed to load business cards', err);
      this.loading = false;
    }
  });
}


    deleteCard(id: number) {
    this.businessCardService.delete(id).subscribe({
      next: () => {
        this.businessCards = this.businessCards.filter(card => card.id !== id);
      },
      error: (err) => console.error('Delete failed', err)
    });
  }

  exportCard(card: BusinessCard) {
  const element = document.getElementById(`card-${card.id}`);

  html2canvas(element!, { scale: 3 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = canvas.height / canvas.width;
    const imgHeight = pageWidth * ratio;

    pdf.addImage(imgData, 'PNG', 0, 10, pageWidth, imgHeight);
    pdf.save(`${card.name}_business_card.pdf`);
  });
}
}
