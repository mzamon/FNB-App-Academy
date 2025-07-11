from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contacts-page')
def contact_page():
    return render_template('contact.html')

@app.route('/contacts', methods=['GET', 'POST'])
def manage_contacts():
    if request.method == 'POST':
        data = request.get_json()
        new_contact = Contact(name=data['name'], email=data['email'], phone=data['phone'])
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({"message": "Contact added"}), 201

    contacts = Contact.query.all()
    return jsonify([{ "id": c.id, "name": c.name, "email": c.email, "phone": c.phone } for c in contacts])

@app.route('/contacts/<int:contact_id>', methods=['GET', 'PUT', 'DELETE'])
def contact_detail(contact_id):
    contact = Contact.query.get_or_404(contact_id)

    if request.method == 'GET':
        return jsonify({"id": contact.id, "name": contact.name, "email": contact.email, "phone": contact.phone})

    elif request.method == 'PUT':
        data = request.get_json()
        contact.name = data['name']
        contact.email = data['email']
        contact.phone = data['phone']
        db.session.commit()
        return jsonify({"message": "Contact updated"})

    elif request.method == 'DELETE':
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contact deleted"})

if __name__ == '__main__':
    app.run(debug=True)
# This code is a simple Flask application that manages contacts.
# It uses SQLAlchemy for database interactions and Flask-CORS for handling CORS.