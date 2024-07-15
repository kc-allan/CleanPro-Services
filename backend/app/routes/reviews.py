from flask import request, jsonify, make_response
from datetime import datetime
from app.routes.main import main
from app.models import storage
from app.models.review import Review

# Create a review
@main.route('/<client_id>/review/<booking_id>', methods=['POST'])
def create_review(client_id, booking_id):
    try:
        client = storage.get('Client', client_id)
        booking = storage.get('Booking', booking_id)

        if not (client and booking):
            return make_response({'message': 'Parameters not found'}, 404)

        data = request.get_json()
        rating = data.get('rating')
        text = data.get('comment')

        review = Review(
            booking_id=booking_id,
            rating=rating,
            comment=text
        )
        review.save()
        if storage.get('Review', review.id) is None:
            return make_response({'message': 'Error creating review'}, 409)
        return make_response(jsonify(review.to_json()), 201)
    except Exception as e:
        return make_response({'message': str(e)}, 500)

# Get all reviews for a worker
@main.route('/workers/<worker_id>/reviews', methods=['GET'])
def get_worker_reviews(worker_id):
    try:
        worker = storage.get('Worker', worker_id)
        if not worker:
            return make_response({'message': 'Worker not found'}, 404)

        bookings = worker.bookings
        (bookings)
        reviews = []
        for booking in bookings:
            review = {}
            review['client_name'] = f'{booking.client.firstname} {booking.client.lastname}'
            review['rating'] = booking.review.rating
            review['comment'] = booking.review.comment
            reviews.append(review)
        return make_response(jsonify(reviews), 200)
    except Exception as e:
        return make_response({'message': str(e)}, 500)

# Update a review
@main.route('/reviews/<review_id>', methods=['PUT'])
def update_review(review_id):
    try:
        data = request.json
        review = storage.get('Review', review_id)
        if not review:
            return make_response({'message': 'Review not found'}, 404)

        rating = data.get('rating')
        comment = data.get('comment')

        if rating:
            review.rating = rating
        if comment:
            review.comment = comment

        return make_response(jsonify(review.to_json()), 200)
    except Exception as e:
        return make_response({'message': str(e)}, 500)

# Delete a review
@main.route('/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    try:
        review = storage.get('Review', review_id)
        if not review:
            return make_response({'message': 'Review not found'}, 404)

        review.delete()
        return make_response({'message': 'Review deleted successfully'}, 200)
    except Exception as e:
        return make_response({'message': str(e)}, 500)
