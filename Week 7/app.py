from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Sample data
contacts = [
    {"id": 1, "name": "John Doe", "email": "john@example.com", "phone": "1234567890"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "phone": "0987654321"}
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contacts')
def get_contacts():
    return jsonify(contacts)

@app.route('/contacts', methods=['POST'])
def add_contact():
    new_contact = request.json
    contacts.append(new_contact)
    return jsonify({"message": "Contact added successfully!"}), 201

@app.route('/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    global contacts
    contacts = [contact for contact in contacts if contact['id'] != contact_id]
    return jsonify({"message": "Contact deleted successfully!"})

if __name__ == '__main__':
    app.run(debug=True)