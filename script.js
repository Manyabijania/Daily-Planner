document.addEventListener("DOMContentLoaded", function () {
    // Get the DOM elements for each section
    const homeScreen = document.getElementById("home-screen");
    const calendarSection = document.querySelector(".calendar");
    const dailyScheduleSection = document.querySelector(".daily-schedule");
    const notesSection = document.querySelector(".notes");

    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const calendarBody = document.getElementById("calendar-body");
    const noteDisplay = document.getElementById("note-display");

    const scheduleTextarea = document.querySelector(".schedule-textarea");
    const notesTextarea = document.querySelectorAll(".schedule-textarea")[1];

    const backButtons = document.querySelectorAll("button[id^='back-to-home']");

    // Function to handle section navigation
    function showSection(sectionToShow) {
        // Hide all sections
        homeScreen.style.display = "none";
        calendarSection.style.display = "none";
        dailyScheduleSection.style.display = "none";
        notesSection.style.display = "none";

        // Show the selected section
        sectionToShow.style.display = "block";

        // Clear the note display when navigating back to the home screen
        if (sectionToShow === homeScreen) {
            noteDisplay.innerHTML = ""; // Clear the note display
        }
    }

    // Show Home Screen by default
    showSection(homeScreen);

    // Populate months and years dropdown
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    months.forEach((month, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    // Set default month and year
    const currentMonth = new Date().getMonth();
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;

    // Function to generate calendar
    function generateCalendar(month, year) {
        calendarBody.innerHTML = ""; // Clear previous calendar

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let row = document.createElement("tr");
        for (let i = 0; i < firstDay; i++) {
            let cell = document.createElement("td");
            row.appendChild(cell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let cell = document.createElement("td");
            cell.textContent = day;

            // Check if the day already has a saved note based on month and year
            const savedNote = localStorage.getItem(`note-${year}-${month}-${day}`);
            if (savedNote) {
                // Show a small note indicator (for example, an icon or a different style)
                let noteIndicator = document.createElement("span");
                noteIndicator.textContent = "📝";  // You can change this to any symbol/icon you prefer
                noteIndicator.classList.add("note-indicator");
                cell.appendChild(noteIndicator);
            }

            // Add event listener for each day cell
            cell.addEventListener("click", function () {
                let existingNote = localStorage.getItem(`note-${year}-${month}-${day}`);
                            
                if (existingNote) {
                    // Display the note for the selected day
                    displayNoteForDay(day,month,year, existingNote);
            
                    // Show buttons for "View," "Edit," "Delete" actions
                    showNoteActions(day, existingNote, month, year);
                } else {
                    // If no note exists, prompt user to add a new note
                    let note = prompt(`Enter your note for day ${day}-${month+1}-${year} `);
                    if (note) {
                        // Save the note for the specific day, month, and year
                        localStorage.setItem(`note-${year}-${month}-${day}`, note);
            
                        // Display the note for that day
                        displayNoteForDay(day,month,year ,note);
            
                        // Immediately refresh the calendar to show the note symbol
                        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value)); 
                    }
                }
            });
            row.appendChild(cell);
            if ((firstDay + day) % 7 === 0) {
                calendarBody.appendChild(row);
                row = document.createElement("tr");
            }
        }
        calendarBody.appendChild(row);
    }

    // Function to display note for a specific day
    function displayNoteForDay(day,month,year, note) {
        noteDisplay.innerHTML = `<strong>Note for Day ${day}-${month+1}-${year}:</strong> ${note}`;
    }

    // Function to show note actions (View, Edit, Delete buttons)
    function showNoteActions(day, note, month, year) {
        noteDisplay.innerHTML += `
            <br>
            <button id="view-note">View</button>
            <button id="edit-note">Edit</button>
            <button id="delete-note">Delete</button>
        `;

        // Add event listeners for buttons
        document.getElementById("view-note").addEventListener("click", function () {
            displayNoteForDay(day,month,year, note);
        });

        document.getElementById("edit-note").addEventListener("click", function () {
            let newNote = prompt("Enter your new note:");
            if (newNote) {
                localStorage.setItem(`note-${year}-${month}-${day}`, newNote);
                displayNoteForDay(day,month,year, newNote);
                generateCalendar(month, year); // Refresh the calendar to update the note
            }
        });

        document.getElementById("delete-note").addEventListener("click", function () {
            localStorage.removeItem(`note-${year}-${month}-${day}`);
            noteDisplay.innerHTML = `<strong>Note for Day ${day}:</strong> Note deleted.`;
            generateCalendar(month, year); // Refresh the calendar to remove the note indicator
        });
    }

    // Event listener to go to Calendar Section
    document.getElementById("go-to-calendar").addEventListener("click", function () {
        showSection(calendarSection);
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    // Event listener to go to Daily Schedule Section
    document.getElementById("go-to-daily-schedule").addEventListener("click", function () {
        showSection(dailyScheduleSection);
    });

    // Event listener to go to Notes Section
    document.getElementById("go-to-notes").addEventListener("click", function () {
        showSection(notesSection);
    });

    // Event listener for Back buttons
    backButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            showSection(homeScreen);
        });
    });

    // Saving the Daily Schedule
    
    const saveScheduleButton = document.getElementById("save-schedule-button"); // Get the button by ID
    const clearScheduleButton = document.getElementById("clear-schedule-button");
    if (saveScheduleButton) { // Check if the button exists
        saveScheduleButton.addEventListener("click", function() { // Attach ONE event listener
            const tasks = scheduleTextarea.value; // Get the text from the textarea
            if (tasks) { // Check if tasks are entered
                localStorage.setItem("daily-schedule", tasks); // Save to localStorage
                alert("Your daily schedule has been saved!"); // Show the alert
            } 
        });
    } else {
        console.error("Save schedule button not found!"); // For debugging
    }
    if (clearScheduleButton) { // Event listener for clear button
        clearScheduleButton.addEventListener("click", function () {
            scheduleTextarea.value = ""; // Clear the textarea
            localStorage.removeItem("daily-schedule"); // Remove from localStorage (optional)
            alert("Daily schedule cleared!");
        });
    } else {
        console.error("Clear schedule button not found!");
    }

    
    //Saving the Notes
    const saveNotesButton = notesSection.querySelector("#save-notes-button"); // Give your button a specific ID
    const clearNotesButton = document.getElementById("clear-notes-button");

    if (saveNotesButton) { // Check if the button exists before adding the listener
        saveNotesButton.addEventListener("click", function () {
            const note = notesTextarea.value;
            if (note) {
                localStorage.setItem("note", note);
                alert("Your note has been saved!");
            }
        });
    } else {
        console.error("Save notes button not found!"); // Helpful for debugging
    }
    if (clearNotesButton) { // Event listener for clear button
        clearNotesButton.addEventListener("click", function () {
            notesTextarea.value = ""; // Clear the textarea
            localStorage.removeItem("note"); // Remove from localStorage (optional)
            alert("Note cleared!");
        });
    } else {
        console.error("Clear notes button not found!");
    }

    // Load saved data on page load
    if (localStorage.getItem("daily-schedule")) {
        scheduleTextarea.value = localStorage.getItem("daily-schedule");
    }

    if (localStorage.getItem("note")) {
        notesTextarea.value = localStorage.getItem("note");
    }

    // Update the calendar whenever the month or year changes
    monthSelect.addEventListener("change", function() {
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    yearSelect.addEventListener("change", function() {
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    // Initialize the calendar
    generateCalendar(currentMonth, currentYear);
});
