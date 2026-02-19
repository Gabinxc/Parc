import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { ReviewInterface, ReviewAverageInterface } from '../Interface/review.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  constructor(private dataService: DataService) {}

  public getReviews(attractionId: number): Observable<ReviewInterface[]> {
    const url = `https://api/attraction/${attractionId}/reviews`;
    return this.dataService.getData(url) as Observable<ReviewInterface[]>;
  }

  public addReview(attractionId: number, review: Partial<ReviewInterface>): Observable<any> {
    const url = `https://api/attraction/${attractionId}/reviews`;
    return this.dataService.postData(url, review);
  }

  public getAverageRating(attractionId: number): Observable<ReviewAverageInterface> {
    const url = `https://api/attraction/${attractionId}/reviews/average`;
    return this.dataService.getData(url) as Observable<ReviewAverageInterface>;
  }
}
