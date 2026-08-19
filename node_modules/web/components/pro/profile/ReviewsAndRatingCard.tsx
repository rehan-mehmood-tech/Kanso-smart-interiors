import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  projectType: string;
}

export function ReviewsAndRatingCard({ reviews, averageRating, totalReviews }: { reviews: ReviewItem[], averageRating: number, totalReviews: number }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-8 pb-8 border-b border-outline-variant/30">
        <div>
          <h3 className="font-display-xl text-xl text-primary tracking-tight mb-2">Client Reviews</h3>
          <p className="font-body-md text-sm text-secondary">Verified homeowners who completed projects via Kanso.</p>
        </div>
        <div className="md:ml-auto flex items-center gap-4 bg-[#F4F2ED]/50 p-4 rounded-lg border border-outline-variant/30">
          <div className="text-4xl font-display-xl text-primary leading-none">{averageRating.toFixed(1)}</div>
          <div className="flex flex-col">
            <div className="flex text-primary mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-outline-variant'}`} />
              ))}
            </div>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">Based on {totalReviews} reviews</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAE8E3] border border-outline-variant/30 flex items-center justify-center shrink-0">
                  <span className="font-display-xl text-lg text-primary leading-none mt-1">{review.author.charAt(0)}</span>
                </div>
                <div>
                  <span className="font-body-md text-primary font-medium block">{review.author}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex text-primary">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-outline-variant'}`} />
                      ))}
                    </div>
                    <span className="font-label-sm text-[10px] text-secondary">{review.date}</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                <CheckCircle className="w-3 h-3" />
                <span className="font-label-sm text-[10px] uppercase tracking-widest">Verified Project</span>
              </div>
            </div>
            <p className="font-body-md text-sm text-secondary leading-relaxed mb-3">
              "{review.text}"
            </p>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary border border-outline-variant/30 px-2 py-1 rounded inline-block bg-[#F4F2ED]/50">
              {review.projectType}
            </span>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 border border-outline-variant/50 text-primary py-3 rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-[#F4F2ED] transition-colors shadow-sm">
        Load More Reviews
      </button>
    </div>
  );
}
