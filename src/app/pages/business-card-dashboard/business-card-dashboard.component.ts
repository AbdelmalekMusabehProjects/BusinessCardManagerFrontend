import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AddBusinessCardComponent } from '../add-business-card/add-business-card.component';
import { BusinessCardsComponent } from '../business-cards/business-cards.component';

@Component({
  selector: 'app-business-card-dashboard',
  standalone: true,
  imports: [
    MatTabsModule,
    AddBusinessCardComponent,
    BusinessCardsComponent
  ],
  templateUrl: './business-card-dashboard.component.html',
  styleUrl: './business-card-dashboard.component.css'
})
export class BusinessCardDashboardComponent {

}
