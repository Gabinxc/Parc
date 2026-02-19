import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReviewService } from '../Service/review.service';
import { ReviewInterface, ReviewAverageInterface } from '../Interface/review.interface';
import { AttractionInterface } from '../Interface/attraction.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule
  ],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent {
  reviewForm: FormGroup;
  reviews$: Observable<ReviewInterface[]>;
  average$: Observable<ReviewAverageInterface>;
  isAnonymous: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attraction: AttractionInterface },
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
    this.reviewForm = this.fb.group({
      nom: [{ value: '', disabled: true }],
      prenom: [{ value: '', disabled: true }],
      note: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      commentaire: ['', [Validators.required, Validators.minLength(3)]],
      anonymous: [true]
    });

    this.reviews$ = this.reviewService.getReviews(data.attraction.attraction_id!);
    this.average$ = this.reviewService.getAverageRating(data.attraction.attraction_id!);
  }

  toggleAnonymous() {
    this.isAnonymous = this.reviewForm.get('anonymous')?.value;
    if (this.isAnonymous) {
      this.reviewForm.get('nom')?.disable();
      this.reviewForm.get('prenom')?.disable();
      this.reviewForm.get('nom')?.setValue('');
      this.reviewForm.get('prenom')?.setValue('');
    } else {
      this.reviewForm.get('nom')?.enable();
      this.reviewForm.get('prenom')?.enable();
    }
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const formValue = this.reviewForm.getRawValue();
      const review = {
        nom: formValue.anonymous ? 'Anonyme' : formValue.nom || 'Anonyme',
        prenom: formValue.anonymous ? 'Anonyme' : formValue.prenom || 'Anonyme',
        note: formValue.note,
        commentaire: formValue.commentaire
      };

      this.reviewService.addReview(this.data.attraction.attraction_id!, review).subscribe(() => {
        this.reviews$ = this.reviewService.getReviews(this.data.attraction.attraction_id!);
        this.average$ = this.reviewService.getAverageRating(this.data.attraction.attraction_id!);
        this.reviewForm.patchValue({ commentaire: '', note: 3 });
      });
    }
  }

  getStars(note: number): number[] {
    return Array(Math.round(note)).fill(0);
  }

  getEmptyStars(note: number): number[] {
    return Array(5 - Math.round(note)).fill(0);
  }

  close() {
    this.dialogRef.close();
  }
}
