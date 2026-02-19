import { Component } from '@angular/core';
import { AttractionService } from '../Service/attraction.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AttractionInterface } from '../Interface/attraction.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {

  constructor(public attractionService: AttractionService, private dialog: MatDialog)
  {}
  
  public attractions: Observable<AttractionInterface[]> = this.attractionService.getAllVisibleAttraction();

  openReviewDialog(attraction: AttractionInterface): void {
    this.dialog.open(ReviewDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { attraction }
    });
  }
}
