from flask import make_response, jsonify, request, abort
from flask_jwt_extended import jwt_required
from datetime import datetime
from app.models.payment import Payment
from sqlalchemy import exists

from app.routes.main import main, permission_required
from app.models import storage
from app.models.payment_method import PaymentMethod

@main.route('/make_payment/<booking_id>')
def make_payment(booking_id):
    try:
        booking = storage.get('Booking', booking_id)
        if booking is None:
            return make_response({'message': 'Booking not found'}), 404
        payment = Payment(
            booking_id=booking_id,
            amount=booking.service.price,
            payment_method_id=storage.get_session().query(PaymentMethod).filter_by(default=True).first().id
        )
        booking.paid = True
        booking.status = 'closed'
        payment.save()
        if storage.get(Payment, payment.id) is None:
            return make_response({'message': 'Error making payment'}), 409
        return make_response({'message': 'Payment successful'}), 200
    except Exception as e:
        return make_response({'error': str(e)}, 500)

@main.route('/payments/<user_id>/add_method', methods=['POST'])
def add_payment_method(user_id):
    user = storage.get('User', user_id)
    if user is None:
        return make_response({'message': 'User not found'}), 404
    data = request.get_json()
    if data is None or type(data) is not dict:
        abort(400)
    try:
        account_num = data.get('cardNumber')
        account_name = data.get('cardHolder')
        if  not (account_num and account_name):
            abort(400)
        pay_method = PaymentMethod(
            method_type='Credit Card',
            account_number = account_num,
            account_holder_name = account_name,
            user_id=user_id
        )
        if user.payment_methods is None or not storage.get_session().query(exists().where(PaymentMethod.default == True)).scalar():
            pay_method.default = True
        pay_method.save()
        if storage.get(PaymentMethod, pay_method.id) is None:
            return make_response({'Unable to add Payment method'}), 409
        return make_response({'message': 'Payment method added successfully'}), 200
    except Exception as e:
        return make_response({'error': str(e)}, 500)

@main.route('/payments/<user_id>/delete_method/<method_id>', methods=['DELETE'])
def remove_method(user_id, method_id):
    user = storage.get('User', user_id)
    method = storage.get('PaymentMethod', method_id)
    if method is None:
        return make_response({'message': 'Method not found'}), 404
    if user is None:
        return make_response({'message': 'User not found'}), 404
    method.delete()
    storage.save()
    return make_response({'message': 'Method deleted successfully'}), 200