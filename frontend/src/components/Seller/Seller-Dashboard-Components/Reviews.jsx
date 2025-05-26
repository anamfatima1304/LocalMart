import React, { useState } from "react";
import './Reviews.css';

function Reviews() {

  const [reviews] = useState([
    {
      id: 1,
      name: "Ali Khan",
      rating: 4,
      comment: "Great food and ambiance!",
      date: "2024-05-01",
    },
    {
      id: 2,
      name: "Fatima Raza",
      rating: 5,
      comment: "Absolutely loved the biryani!",
      date: "2024-05-10",
    },
    {
      id: 3,
      name: "Usman Tariq",
      rating: 3,
      comment: "Good, but service was a bit slow.",
      date: "2024-05-12",
    },
    {
      id: 4,
      name: "Zara Jamil",
      rating: 4,
      comment: "Tasty food, would visit again!",
      date: "2024-05-13",
    },
  ]);

  const [filterRating, setFilterRating] = useState(null);

  const filteredReviews = filterRating
    ? reviews.filter((review) => review.rating === filterRating)
    : reviews;

  return (
    <div id="review">
      <h2>Customer Reviews</h2> {/* Heading moved outside card */}

      <div className="card review-section">
        <div className="rating-filter">
          <span>Filter by rating:</span>
          {[5, 4, 3, 2, 1].map((star) => (
            <span
              key={star}
              className={`star ${filterRating === star ? "active" : ""}`}
              onClick={() =>
                setFilterRating(filterRating === star ? null : star)
              }
            >
              {"★".repeat(star)}
              {"☆".repeat(5 - star)}
            </span>
          ))}
        </div>

        {filteredReviews.length === 0 ? (
          <p>No reviews match this rating.</p>
        ) : (
          filteredReviews.map((review) => (
            <div className="review" key={review.id}>
              <div className="review-header">
                <strong>{review.name}</strong>
                <span className="rating">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="comment">"{review.comment}"</p>
              <span className="date">{review.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;
