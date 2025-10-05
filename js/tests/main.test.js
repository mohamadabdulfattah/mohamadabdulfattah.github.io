const fs = require('fs');
const path = require('path');

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.console = {
  log: jest.fn(),
  error: jest.fn()
};

// Mock alert function
global.alert = jest.fn();

// Load the main.js file
const mainJsPath = path.join(__dirname, '../main.js');
const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

// Mock the DOMContentLoaded event and execute the script
const script = document.createElement('script');
script.textContent = mainJsContent;
document.body.appendChild(script);

describe('main.js Tests', () => {
  let contactForm;
  let loginForm;
  let nameInput, emailInput, messageInput;
  let usernameInput, passwordInput;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create contact form elements
    contactForm = document.createElement('form');
    contactForm.id = 'contactForm';
    
    nameInput = document.createElement('input');
    nameInput.id = 'name';
    nameInput.type = 'text';
    
    emailInput = document.createElement('input');
    emailInput.id = 'email';
    emailInput.type = 'email';
    
    messageInput = document.createElement('textarea');
    messageInput.id = 'message';
    
    contactForm.appendChild(document.createElement('label')).textContent = 'Name:';
    contactForm.appendChild(nameInput);
    contactForm.appendChild(document.createElement('label')).textContent = 'Email:';
    contactForm.appendChild(emailInput);
    contactForm.appendChild(document.createElement('label')).textContent = 'Message:';
    contactForm.appendChild(messageInput);
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Send Message';
    contactForm.appendChild(submitButton);
    
    document.body.appendChild(contactForm);

    // Create login form elements
    loginForm = document.createElement('form');
    loginForm.id = 'loginForm';
    
    usernameInput = document.createElement('input');
    usernameInput.id = 'username';
    usernameInput.type = 'text';
    
    passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.type = 'password';
    
    loginForm.appendChild(document.createElement('label')).textContent = 'Username:';
    loginForm.appendChild(usernameInput);
    loginForm.appendChild(document.createElement('label')).textContent = 'Password:';
    loginForm.appendChild(passwordInput);
    
    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.textContent = 'Login';
    loginForm.appendChild(loginButton);
    
    document.body.appendChild(loginForm);

    // Trigger DOMContentLoaded event to initialize event listeners
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });

  describe('Contact Form', () => {
    test('should submit contact form with valid data', () => {
      // Set valid form data
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      messageInput.value = 'Hello, this is a test message';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      contactForm.dispatchEvent(submitEvent);

      // Check that default behavior was prevented
      expect(submitEvent.defaultPrevented).toBe(true);

      // Check that console.log was called with the correct data
      expect(console.log).toHaveBeenCalledWith('Sending message:', {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello, this is a test message'
      });

      // Check that alert was shown
      expect(alert).toHaveBeenCalledWith('Your message has been sent successfully!');

      // Check that form was reset
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    test('should show alert when contact form has missing fields', () => {
      // Set incomplete form data
      nameInput.value = 'John Doe';
      emailInput.value = ''; // Missing email
      messageInput.value = 'Hello';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      contactForm.dispatchEvent(submitEvent);

      // Check that alert was shown for missing fields
      expect(alert).toHaveBeenCalledWith('Please fill in all fields.');

      // Check that console.log was not called
      expect(console.log).not.toHaveBeenCalled();

      // Check that form was not reset
      expect(nameInput.value).toBe('John Doe');
      expect(messageInput.value).toBe('Hello');
    });

    test('should handle contact form with all fields empty', () => {
      // Set all fields empty
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      contactForm.dispatchEvent(submitEvent);

      // Check that alert was shown for missing fields
      expect(alert).toHaveBeenCalledWith('Please fill in all fields.');

      // Check that console.log was not called
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('Login Form', () => {
    test('should submit login form with valid data', () => {
      // Set valid login data
      usernameInput.value = 'admin';
      passwordInput.value = 'password123';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      loginForm.dispatchEvent(submitEvent);

      // Check that default behavior was prevented
      expect(submitEvent.defaultPrevented).toBe(true);

      // Check that console.log was called with the correct data
      expect(console.log).toHaveBeenCalledWith('Sending message:', {
        username: 'admin',
        password: 'password123'
      });

      // Note: Login form doesn't show alert or reset by default based on the commented code
    });

    test('should show alert when login form has missing fields', () => {
      // Set incomplete login data
      usernameInput.value = 'admin';
      passwordInput.value = ''; // Missing password

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      loginForm.dispatchEvent(submitEvent);

      // Check that alert was shown for missing fields
      expect(alert).toHaveBeenCalledWith('Please fill in all fields.');

      // Check that console.log was not called
      expect(console.log).not.toHaveBeenCalled();
    });

    test('should handle login form with all fields empty', () => {
      // Set all fields empty
      usernameInput.value = '';
      passwordInput.value = '';

      // Trigger form submission
      const submitEvent = new window.Event('submit');
      loginForm.dispatchEvent(submitEvent);

      // Check that alert was shown for missing fields
      expect(alert).toHaveBeenCalledWith('Please fill in all fields.');

      // Check that console.log was not called
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('Console Logging', () => {
    test('should log when main.js is loaded', () => {
      // The console.log should have been called when the script was loaded
      expect(console.log).toHaveBeenCalledWith('main.js loaded');
    });
  });
});
