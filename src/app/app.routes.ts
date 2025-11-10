import { Routes } from '@angular/router';
import { AddBusinessCardComponent } from './pages/add-business-card/add-business-card.component';
import { BusinessCardsComponent } from './pages/business-cards/business-cards.component';
import { BusinessCardDashboardComponent } from './pages/business-card-dashboard/business-card-dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: BusinessCardDashboardComponent
    }
];
