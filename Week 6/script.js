// API Configuration
const API_URL = 'https://api.itvarsity.org/api/ContactBook/';
let API_KEY = localStorage.getItem('contactBookApiKey') || 'appacademy@itvarsity.org';

// Check if we have a valid API key, if not redirect to config page
if (!API_KEY && !window.location.pathname.endsWith('enter-api-key.html')) {
    window.location.href = 'enter-api-key.html';
}

// Rest of your existing script.js code remains the same...
// DOM Elements
const contactsSection = document.getElementById('contactsSection');
const addContactSection = document.getElementById('addContactSection');
const editContactSection = document.getElementById('editContactSection');
const contactsList = document.getElementById('contactsList');
const addContactForm = document.getElementById('addContactForm');
const editContactForm = document.getElementById('editContactForm');
const homeLink = document.getElementById('homeLink');
const addContactLink = document.getElementById('addContactLink');
const refreshBtn = document.getElementById('refreshBtn');
const cancelAddContact = document.getElementById('cancelAddContact');
const cancelEditContact = document.getElementById('cancelEditContact');
const deleteContactBtn = document.getElementById('deleteContact');

// Current state
let currentContactId = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchContacts);
homeLink.addEventListener('click', showContactsSection);
addContactLink.addEventListener('click', showAddContactSection);
refreshBtn.addEventListener('click', fetchContacts);
cancelAddContact.addEventListener('click', showContactsSection);
cancelEditContact.addEventListener('click', showContactsSection);
addContactForm.addEventListener('submit', handleAddContactSubmit);
editContactForm.addEventListener('submit', handleEditContactSubmit);
deleteContactBtn.addEventListener('click', handleDeleteContact);

// Functions
function showContactsSection() {
    contactsSection.classList.remove('hidden');
    addContactSection.classList.add('hidden');
    editContactSection.classList.add('hidden');
    fetchContacts();
}

function showAddContactSection() {
    contactsSection.classList.add('hidden');
    addContactSection.classList.remove('hidden');
    editContactSection.classList.add('hidden');
    addContactForm.reset();
}

function showEditContactSection() {
    contactsSection.classList.add('hidden');
    addContactSection.classList.add('hidden');
    editContactSection.classList.remove('hidden');
}

async function fetchContacts() {
    try {
        const response = await fetch(`${API_URL}GetContacts?apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        alert('Failed to load contacts. Please try again.');
    }
}

function displayContacts(contacts) {
    contactsList.innerHTML = '';
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<p>No contacts found. Add some contacts to get started!</p>';
        return;
    }
    
    contacts.forEach(contact => {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        
        const contactInfo = document.createElement('div');
        contactInfo.className = 'contact-info';
        contactInfo.innerHTML = `
            <h3>${contact.name} ${contact.surname}</h3>
            <p>Email: ${contact.email}</p>
            <p>Phone: ${contact.phone}</p>
            ${contact.address ? `<p>Address: ${contact.address}</p>` : ''}
        `;
        
        const contactActions = document.createElement('div');
        contactActions.className = 'contact-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => prepareEditContact(contact.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => confirmDeleteContact(contact.id));
        
        contactActions.appendChild(editBtn);
        contactActions.appendChild(deleteBtn);
        contactCard.appendChild(contactInfo);
        contactCard.appendChild(contactActions);
        contactsList.appendChild(contactCard);
    });
}

async function prepareEditContact(contactId) {
    currentContactId = contactId;
    
    try {
        const response = await fetch(`${API_URL}GetContact/${contactId}?apiKey=${API_KEY}`);
        if (!response.ok) {
            throw new Error('Failed to fetch contact details');
        }
        const contact = await response.json();
        
        document.getElementById('editId').value = contact.id;
        document.getElementById('editName').value = contact.name;
        document.getElementById('editSurname').value = contact.surname;
        document.getElementById('editEmail').value = contact.email;
        document.getElementById('editPhone').value = contact.phone;
        document.getElementById('editAddress').value = contact.address || '';
        
        showEditContactSection();
    } catch (error) {
        console.error('Error fetching contact:', error);
        alert('Failed to load contact details. Please try again.');
    }
}

async function handleAddContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(addContactForm);
    const contactData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address') || ''
    };
    
    try {
        const response = await fetch(`${API_URL}AddContact?apiKey=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add contact');
        }
        
        alert('Contact added successfully!');
        addContactForm.reset();
        showContactsSection();
        fetchContacts();
    } catch (error) {
        console.error('Error adding contact:', error);
        alert('Failed to add contact. Please try again.');
    }
}

async function handleEditContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(editContactForm);
    const contactData = {
        id: formData.get('id'),
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address') || ''
    };
    
    try {
        const response = await fetch(`${API_URL}UpdateContact/${contactData.id}?apiKey=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
        
        alert('Contact updated successfully!');
        showContactsSection();
        fetchContacts();
    } catch (error) {
        console.error('Error updating contact:', error);
        alert('Failed to update contact. Please try again.');
    }
}

function confirmDeleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
        handleDeleteContact(contactId);
    }
}

async function handleDeleteContact() {
    if (!currentContactId) return;
    
    try {
        const response = await fetch(`${API_URL}DeleteContact/${currentContactId}?apiKey=${API_KEY}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
        
        alert('Contact deleted successfully!');
        showContactsSection();
        fetchContacts();
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
    }
}