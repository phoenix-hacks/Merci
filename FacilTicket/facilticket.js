document.addEventListener('DOMContentLoaded', function() {
    // Check if the registration form exists
    const form = document.getElementById('registration_form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Store form data in variables
            var block = document.getElementById('block').value;
            var place = document.getElementById('place').value;
            var issue = document.getElementById('drop').value;
            var description = document.getElementById('description').value;

            // Create a ticket object
            var ticketData = {
                block: block,
                place: place,
                issue: issue,
                description: description,
                status: "Open" // Add a default status
            };

            // Store data in local storage
            localStorage.setItem('ticketData', JSON.stringify(ticketData));

            // Create a Blob from the ticket data for download
            var blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
            var url = URL.createObjectURL(blob);

            // Create a link element to download the file
            var a = document.createElement('a');
            a.href = url;
            a.download = 'ticket.json'; // Name of the file to be downloaded
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Clean up

            // Redirect to facilticket.html
            window.location.href = 'facilticket.html';
        });
    }

    // Function to create a ticket box
    function createTicketBox(ticket) {
        var ticketBox = document.createElement('div');
        ticketBox.className = 'ticket-box';
        ticketBox.innerHTML = `
            <div class="ticket-details">
                <h2>${ticket.issue}</h2>
                <p>Block: ${ticket.block}</p>
                <p>Place: ${ticket.place}</p>
                <p>Description: ${ticket.description}</p>
            </div>
            <div class="ticket-status">
                <h2>Status: ${ticket.status}</h2>
                <button class="close-btn">Close</button>
            </div>
        `;

        ticketBox.querySelector('.close-btn').addEventListener('click', function() {
            ticketBox.remove(); // Remove the ticket box from the DOM
            
            // Update ticket count
            var ticketCount = document.getElementById('resolved-count');
            ticketCount.textContent = parseInt(ticketCount.textContent) + 1;
        });

        document.getElementById('ticket-history').appendChild(ticketBox);
    }

    // Retrieve ticket data from local storage if on the facilticket.html page
    if (document.getElementById('ticket-history')) {
        var ticketData = JSON.parse(localStorage.getItem('ticketData'));
        if (ticketData) {
            createTicketBox(ticketData);
            // Update ticket count
            var ticketCount = document.getElementById('ticket-count');
            var openTicketCount = document.getElementById('open-ticket-count');
            ticketCount.textContent = parseInt(ticketCount.textContent) + 1;
            openTicketCount.textContent = parseInt(openTicketCount.textContent) + 1;

            // Clear the ticket data from local storage after using it
            // localStorage.removeItem('ticketData');
        }
    }

    document.getElementById('refresh-btn').addEventListener('click', function() {
    // Fetch ticket data from ticket.json
    fetch('ticket.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(ticketData => {
            // Create a ticket box for the fetched data
            createTicketBox(ticketData);
            // Update ticket count
            var ticketCount = document.getElementById('ticket-count');
            var openTicketCount = document.getElementById('open-ticket-count');
            ticketCount.textContent = parseInt(ticketCount.textContent) + 1;
            openTicketCount.textContent = parseInt(openTicketCount.textContent) + 1;

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to load ticket data.');
        });
});
});