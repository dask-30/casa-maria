Casa Maria – Frontend

This is the frontend code for the Casa Maria website. It allows visitors to view information about the accommodation, check room availability, and submit reservations.

Project Structure

/root
- index.html           - Main page
- form_page.html       - Reservation form page
- photo_page.html      - Photo gallery page
- base.css             - Common styles
- base.js              - Main JavaScript file
- poze/                - Images and icons
    - formularIcon.png
    - pozeIcon.png
    - other images


Frontend Features

1. Wake server
  - On the user’s first visit, the frontend attempts to wake the server using the /api/auth/wake endpoint.
  - Automatic retries are performed if the server is asleep.
  - sessionStorage ensures the server is only woken once per session.

2. Loading and Form
  - The reservation form is hidden until the server is ready.
  - A loading message is displayed in the center of the page if the server is asleep.
  - Once the server is ready, the available reservation dates are loaded, and the form is displayed.

3. Calendar Availability
  - Uses Flatpickr for the check-in and check-out fields.
  - Unavailable dates are fetched from the backend and disabled automatically in the calendar.

4. Reservation Form
  - Collects name, phone number, check-in, check-out, and message.
  - On submit:
    4.a Retrieves an authentication token from /api/auth/site-login.
    4.b Sends the reservation to the backend with the token.
    4.c Reservations are marked as "PENDING" with deposit set to false.
  - The calendar reloads automatically after submitting a reservation.

Photo Gallery (Lightbox)
  - Gallery images can be opened in a full-screen lightbox.
  - The lightbox can be closed using the provided function.

Technologies Used

HTML5, CSS3

JavaScript (ES6+)

Flatpickr for calendar

Google Fonts: Inter and Noto Serif

Usage Instructions:
  - Open index.html in a browser.
  - Navigate via the menu:
  - Reservation form -> form_page.html
  - Photo gallery -> photo_page.html
  - On the reservation page:
      - A loading message is displayed if the server is asleep.
      - Once the server is ready, the reservation form appears.
      - Complete the form and click Submit.
      - Reservation confirmation is shown via alert, and the calendar updates automatically.

Notes:
  The frontend is independent of the Spring Boot backend, but core features (loading dates, submitting reservations) depend on the server.
  The design is responsive for desktop and mobile.
  The form will not appear if the server is not ready or required elements are missing.
