import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BusinessCard } from '../models/business-card.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardWorkflowService {
  private cardsSubject = new BehaviorSubject<BusinessCard[]>([]);
  cards$ = this.cardsSubject.asObservable();

  setCards(cards: BusinessCard[]) {
    this.cardsSubject.next(cards);
  }

  addCard(card: BusinessCard) {
    const current = this.cardsSubject.value;
    this.cardsSubject.next([...current, card]);
  }

  deleteCard(id: number) {
    const current = this.cardsSubject.value.filter(c => c.id !== id);
    this.cardsSubject.next(current);
  }

  getCards() {
    return this.cardsSubject.value;
  }
}
