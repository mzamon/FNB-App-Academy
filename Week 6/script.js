// API Configuration
const API_URL = 'https://api.itvarsity.org/api/ContactBook/';
let API_KEY = localStorage.getItem('contactBookApiKey') || 'appacademy@itvarsity.org';

// DOM Elements
const dom = {
    contactsSection: document.getElementById('contactsSection'),
    addContactSection: document.getElementById('addContactSection'),
    editContactSection: document.getElementById('editContactSection'),
    contactsList: document.getElementById('contactsList'),
    addContactForm: document.getElementById('addContactForm'),
    editContactForm: document.getElementById('editContactForm'),
    homeLink: document.getElementById('homeLink'),
    addContactLink: document.getElementById('addContactLink'),
    refreshBtn: document.getElementById('refreshBtn'),
    cancelAddContact: document.getElementById('cancelAddContact'),
    cancelEditContact: document.getElementById('cancelEditContact'),
    deleteContactBtn: document.getElementById('deleteContact'),
    apiKeyForm: document.getElementById('apiKeyForm'),
    apiKeyModal: document.getElementById('apiKeyModal'),
    apiKeyInput: document.getElementById('apiKey')
};

// Current state
let currentContactId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    checkApiKey();
    setupEventListeners();
}

function checkApiKey() {
    if (!API_KEY) {
        showApiKeyModal();
    } else {
        hideApiKeyModal();
        fetchContacts();
    }
}

function setupEventListeners() {
    // Navigation
    dom.homeLink.addEventListener('click', showContactsSection);
    dom.addContactLink.addEventListener('click', showAddContactSection);
    dom.refreshBtn.addEventListener('click', fetchContacts);
    
    // Form actions
    dom.cancelAddContact.addEventListener('click', showContactsSection);
    dom.cancelEditContact.addEventListener('click', showContactsSection);
    dom.addContactForm.addEventListener('submit', handleAddContactSubmit);
    dom.editContactForm.addEventListener('submit', handleEditContactSubmit);
    dom.deleteContactBtn.addEventListener('click', handleDeleteContact);
    
    // API Key form
    if (dom.apiKeyForm) {
        dom.apiKeyForm.addEventListener('submit', handleApiKeySubmit);
    }
}

// API Key functions
function showApiKeyModal() {
    if (dom.apiKeyModal) {
        dom.apiKeyModal.style.display = 'flex';
        dom.apiKeyInput.focus();
    }
}

function hideApiKeyModal() {
    if (dom.apiKeyModal) {
        dom.apiKeyModal.style.display = 'none';
    }
}

function handleApiKeySubmit(e) {
    e.preventDefault();
    const apiKey = dom.apiKeyInput.value.trim();
    
    if (validateApiKey(apiKey)) {
        saveApiKey(apiKey);
    } else {
        alert('Please enter a valid API Key (your email)');
    }
}

function validateApiKey(apiKey) {
    return apiKey && apiKey.includes('@');
}

function saveApiKey(apiKey) {
    localStorage.setItem('contactBookApiKey', apiKey);
    API_KEY = apiKey;
    alert('API Key saved successfully!');
    hideApiKeyModal();
    fetchContacts();
}

// Navigation functions
function showContactsSection() {
    dom.contactsSection.classList.remove('hidden');
    dom.addContactSection.classList.add('hidden');
    dom.editContactSection.classList.add('hidden');
    fetchContacts();
}

function showAddContactSection() {
    dom.contactsSection.classList.add('hidden');
    dom.addContactSection.classList.remove('hidden');
    dom.editContactSection.classList.add('hidden');
    dom.addContactForm.reset();
}

function showEditContactSection() {
    dom.contactsSection.classList.add('hidden');
    dom.addContactSection.classList.add('hidden');
    dom.editContactSection.classList.remove('hidden');
}

// Contact CRUD Operations
async function fetchContacts() {
    if (!API_KEY) {
        showApiKeyModal();
        return;
    }

    try {
        showLoader(dom.contactsList);
        
        const response = await fetch(`${API_URL}GetContacts?apiKey=${API_KEY}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        await handleResponse(response, 'Failed to fetch contacts');
        const contacts = await response.json();
        
        displayContacts(contacts);
    } catch (error) {
        handleError(error, 'Error loading contacts');
    } finally {
        hideLoader();
    }
}

async function prepareEditContact(contactId) {
    currentContactId = contactId;
    
    try {
        showLoader(dom.editContactSection);
        
        const response = await fetch(`${API_URL}GetContact/${contactId}?apiKey=${API_KEY}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        await handleResponse(response, 'Failed to fetch contact details');
        const contact = await response.json();
        
        populateEditForm(contact);
        showEditContactSection();
    } catch (error) {
        handleError(error, 'Error loading contact details');
    } finally {
        hideLoader();
    }
}

function populateEditForm(contact) {
    document.getElementById('editId').value = contact.id;
    document.getElementById('editName').value = contact.name;
    document.getElementById('editSurname').value = contact.surname;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editPhone').value = contact.phone;
    document.getElementById('editAddress').value = contact.address || '';
}

async function handleAddContactSubmit(e) {
    e.preventDefault();
    
    const contactData = getFormData(dom.addContactForm);
    
    try {
        showLoader(dom.addContactSection);
        
        const response = await fetch(`${API_URL}AddContact?apiKey=${API_KEY}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(contactData)
        });
        
        await handleResponse(response, 'Failed to add contact');
        
        alert('Contact added successfully!');
        dom.addContactForm.reset();
        showContactsSection();
    } catch (error) {
        handleError(error, 'Error adding contact');
    } finally {
        hideLoader();
    }
}

async function handleEditContactSubmit(e) {
    e.preventDefault();
    
    const contactData = getFormData(dom.editContactForm);
    
    try {
        showLoader(dom.editContactSection);
        
        const response = await fetch(`${API_URL}UpdateContact/${contactData.id}?apiKey=${API_KEY}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(contactData)
        });
        
        await handleResponse(response, 'Failed to update contact');
        
        alert('Contact updated successfully!');
        showContactsSection();
    } catch (error) {
        handleError(error, 'Error updating contact');
    } finally {
        hideLoader();
    }
}

async function handleDeleteContact() {
    if (!currentContactId || !confirm('Are you sure you want to delete this contact?')) {
        return;
    }
    
    try {
        showLoader(dom.editContactSection);
        
        const response = await fetch(`${API_URL}DeleteContact/${currentContactId}?apiKey=${API_KEY}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        await handleResponse(response, 'Failed to delete contact');
        
        alert('Contact deleted successfully!');
        showContactsSection();
    } catch (error) {
        handleError(error, 'Error deleting contact');
    } finally {
        hideLoader();
    }
}

// Helper functions
function getHeaders() {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
}

async function handleResponse(response, errorMessage) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${errorMessage}: ${errorText}`);
    }
    return response;
}

function handleError(error, context) {
    console.error(`${context}:`, error);
    alert(`${context}. Please try again.`);
}

function getFormData(form) {
    const formData = new FormData(form);
    return {
        id: formData.get('id'),
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address') || ''
    };
}

function showLoader(element) {
    if (element) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        element.appendChild(loader);
    }
}

function hideLoader() {
    const loaders = document.querySelectorAll('.loader');
    loaders.forEach(loader => loader.remove());
}

// Display functions
function displayContacts(contacts) {
    dom.contactsList.innerHTML = '';
    
    if (!contacts || contacts.length === 0) {
        dom.contactsList.innerHTML = '<p class="no-contacts">No contacts found. Add some contacts to get started!</p>';
        return;
    }
    
    contacts.forEach(contact => {
        const contactCard = createContactCard(contact);
        dom.contactsList.appendChild(contactCard);
    });
}

function createContactCard(contact) {
    const contactCard = document.createElement('div');
    contactCard.className = 'contact-card';
    
    contactCard.innerHTML = `
        <div class="contact-info">
            <h3>${contact.name} ${contact.surname}</h3>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone}</p>
            ${contact.address ? `<p><strong>Address:</strong> ${contact.address}</p>` : ''}
        </div>
        <div class="contact-actions">
            <button class="edit-btn" onclick="prepareEditContact('${contact.id}')">Edit</button>
            <button class="delete-btn" onclick="confirmDeleteContact('${contact.id}')">Delete</button>
        </div>
    `;
    
    return contactCard;
}

// Global functions needed for inline event handlers
window.prepareEditContact = prepareEditContact;
window.confirmDeleteContact = function(contactId) {
    currentContactId = contactId;
    if (confirm('Are you sure you want to delete this contact?')) {
        handleDeleteContact();
    }
};