"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

const sampleReviews: Review[] = [
  { id: "r1", name: "Amara O.", rating: 5, comment: "Love the quality! The fabric feels premium and the fit is exactly as described.", date: "2026-05-12" },
  { id: "r2", name: "Chioma N.", rating: 4, comment: "Beautiful design, but delivery took a little longer than expected. Still worth it.", date: "2026-04-28" },
  { id: "r3", name: "Tolu A.", rating: 5, comment: "Got so many compliments wearing this. Will definitely order again.", date: "2026-06-02" },
];

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const key = `kaysapparel-reviews-${productId}`;
    const saved = localStorage.getItem(key);
    const userReviews: Review[] = saved ? JSON.parse(saved) : [];
    setReviews([...sampleReviews, ...userReviews]);
  }, [productId]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please fill in your name and review");
      return;
    }
    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    const key = `kaysapparel-reviews-${productId}`;
    const saved = localStorage.getItem(key);
    const userReviews: Review[] = saved ? JSON.parse(saved) : [];
    const updated = [...userReviews, newReview];
    localStorage.setItem(key, JSON.stringify(updated));
    setReviews([...sampleReviews, ...updated]);
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
    toast.success("Review submitted!");
  };

  return (
    <div className="mt-12 md:mt-16 pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-light text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-[#C4A882] text-[#C4A882]"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-gray-700">
              {averageRating} out of 5
            </p>
            <p className="text-sm text-gray-400">({reviews.length} reviews)</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-[#6B4C3B] text-[#6B4C3B] rounded-none hover:bg-[#6B4C3B] hover:text-white"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-5 border border-gray-100 rounded-xl bg-stone-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-[#6B4C3B]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="h-8 w-8 flex items-center justify-center"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating ? "fill-[#C4A882] text-[#C4A882]" : "text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#6B4C3B]"
            />
          </div>
          <Button type="submit" className="bg-[#6B4C3B] hover:bg-[#6B4C3B]/90 text-white rounded-none">
            Submit Review
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((review) => (
          <div key={review.id} className="p-5 border border-gray-100 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-sm text-gray-900">{review.name}</p>
              <p className="text-xs text-gray-400">{review.date}</p>
            </div>
            <div className="flex items-center mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating ? "fill-[#C4A882] text-[#C4A882]" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
