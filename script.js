
// ==========================================
// STUDENT SKILL EXCHANGE PLATFORM
// SKILLSWAP - JAVASCRIPT
// ==========================================


// 1. GET HTML ELEMENTS

const searchInput = document.getElementById("searchInput");
const searchButton = document.querySelector(".search-icon");
const skillContainer = document.getElementById("skillContainer");
const noResults = document.getElementById("noResults");

const skillForm = document.getElementById("skillForm");
const requestContainer = document.getElementById("requestContainer");
const noRequests = document.getElementById("noRequests");


// 2. SAFE TEXT FUNCTION

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];

    });

}


// 3. SEARCH SKILLS

function searchSkills() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".skill-card");

    let found = 0;

    cards.forEach(function(card) {

        const skill = card.innerText.toLowerCase();

        if (skill.includes(searchValue)) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });

    noResults.hidden = found !== 0;

}


// Search while typing

searchInput.addEventListener("input", searchSkills);


// Search icon click

searchButton.addEventListener("click", searchSkills);


// Enter key search

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        searchSkills();
    }

});


// 4. LOAD SAVED SKILLS

let savedSkills = JSON.parse(
    localStorage.getItem("savedSkills") || "[]"
);


function displaySkill(skill) {

    const newCard = document.createElement("div");

    newCard.className = "skill-card";

    newCard.innerHTML = `
        <div class="skill-icon">
            <span class="emoji-icon">🌟</span>
        </div>

        <h3>${escapeHTML(skill.skillName)}</h3>

        <p>By ${escapeHTML(skill.studentName)}</p>

        <p>Can Teach: ${escapeHTML(skill.skillName)}</p>

        <p>Wants to Learn: ${escapeHTML(skill.learnSkill)}</p>

        <button
            class="request-btn"
            onclick="sendRequest(this)">
            Send Request
        </button>
    `;

    skillContainer.appendChild(newCard);

}


// Show previously added skills

savedSkills.forEach(function(skill) {

    displaySkill(skill);

});


// 5. ADD NEW SKILL

skillForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const studentName = document
        .getElementById("studentName").value.trim();

    const skillName = document
        .getElementById("skillName").value.trim();

    const learnSkill = document
        .getElementById("learnSkill").value.trim();


    if (!studentName || !skillName || !learnSkill) {

        alert("Please fill all the fields!");
        return;

    }


    const newSkill = {
        id: Date.now(),
        studentName: studentName,
        skillName: skillName,
        learnSkill: learnSkill
    };


    savedSkills.push(newSkill);


    localStorage.setItem(
        "savedSkills",
        JSON.stringify(savedSkills)
    );


    displaySkill(newSkill);


    document.getElementById("formMessage").innerText =
        "Your skill has been added successfully!";


    skillForm.reset();

});


// 6. REQUEST SYSTEM

let savedRequests = JSON.parse(
    localStorage.getItem("savedRequests") || "[]"
);


// Save requests

function saveRequests() {

    localStorage.setItem(
        "savedRequests",
        JSON.stringify(savedRequests)
    );

}


// Display requests

function displayRequest(request) {

    const card = document.createElement("div");

    card.className = "request-card";

    card.dataset.requestId = request.id;


    let buttonsHTML = "";

    if (request.type === "received" &&
        request.status === "Pending") {

        buttonsHTML = `
            <div class="request-buttons">

                <button
                    class="accept-btn"
                    onclick="acceptRequest('${request.id}')">
                    Accept
                </button>

                <button
                    class="reject-btn"
                    onclick="rejectRequest('${request.id}')">
                    Reject
                </button>

            </div>
        `;

    }


    const title = request.type === "sent"
        ? "Request sent to " + request.receiver
        : "Request from " + request.sender;


    card.innerHTML = `
        <h3>${escapeHTML(title)}</h3>

        <p>Skill: ${escapeHTML(request.skill)}</p>

        <p>Can Teach: ${escapeHTML(request.canTeach || "Not specified")}</p>

        <p class="request-status">
            Status: ${escapeHTML(request.status)}
        </p>

        ${buttonsHTML}
    `;


    requestContainer.appendChild(card);

}


// Refresh requests section

function renderRequests() {

    requestContainer.innerHTML = "";

    savedRequests.forEach(function(request) {

        displayRequest(request);

    });

    noRequests.style.display =
        savedRequests.length === 0 ? "block" : "none";

}


// 7. SEND REQUEST

function sendRequest(button) {

    const card = button.closest(".skill-card");

    const receiver = card.querySelector("p")
        .innerText.replace("By ", "");

    const skill = card.querySelector("h3").innerText;


    // Prevent duplicate requests to the same student

    const alreadySent = savedRequests.some(function(request) {

        return request.type === "sent" &&
               request.receiver === receiver &&
               request.skill === skill;

    });


    if (alreadySent) {

        alert("You have already sent a request to this student!");
        return;

    }


    const request = {

        id: Date.now().toString(),

        type: "sent",

        receiver: receiver,

        skill: skill,

        status: "Pending"

    };


    savedRequests.push(request);

    saveRequests();

    renderRequests();


    button.innerText = "Request Sent";

    button.disabled = true;

    button.style.background = "#198754";


    alert("Your skill exchange request has been sent!");

}


// 8. ACCEPT REQUEST

function acceptRequest(requestId) {

    const request = savedRequests.find(function(item) {

        return item.id === requestId;

    });


    if (!request) return;


    request.status = "Accepted";

    saveRequests();

    renderRequests();


    alert("Skill exchange request accepted!");

}


// 9. REJECT REQUEST

function rejectRequest(requestId) {

    const request = savedRequests.find(function(item) {

        return item.id === requestId;

    });


    if (!request) return;


    request.status = "Rejected";

    saveRequests();

    renderRequests();


    alert("Skill exchange request rejected!");

}


// 10. SAMPLE RECEIVED REQUEST

// Add one demo request only when no requests exist

if (savedRequests.length === 0) {

    savedRequests.push({

        id: "demo-request-1",

        type: "received",

        sender: "Arjun Kumar",

        skill: "HTML & CSS",

        canTeach: "Java Programming",

        status: "Pending"

    });

    saveRequests();

}


// 11. SHOW ALL SAVED REQUESTS

renderRequests();


// ==========================================
// END OF SKILLSWAP JAVASCRIPT
// ==========================================
