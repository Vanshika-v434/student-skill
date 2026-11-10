
// ==========================================
// STUDENT SKILL EXCHANGE PLATFORM - SKILLSWAP
// ==========================================


// 1. SEARCH SKILLS

const searchInput = document.getElementById("searchInput");
const skillContainer = document.getElementById("skillContainer");
const noResults = document.getElementById("noResults");

searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase().trim();

    const cards = document.querySelectorAll(".skill-card");

    let found = 0;

    cards.forEach(function (card) {

        const skill = card.innerText.toLowerCase();

        if (skill.includes(searchValue)) {
            card.style.display = "block";
            found++;
        } else {
            card.style.display = "none";
        }

    });

    noResults.hidden = found !== 0;

});


// 2. SAFE HTML TEXT

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (char) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];

    });

}


// 3. LOAD SAVED SKILLS

let savedSkills = JSON.parse(
    localStorage.getItem("savedSkills") || "[]"
);

function displaySkill(skill) {

    const newCard = document.createElement("div");

    newCard.className = "skill-card";

    newCard.innerHTML = `
        <div class="skill-icon">🌟</div>

        <h3>${escapeHTML(skill.skillName)}</h3>

        <p>By ${escapeHTML(skill.studentName)}</p>

        <p>Can Teach: ${escapeHTML(skill.skillName)}</p>

        <p>Wants to Learn: ${escapeHTML(skill.learnSkill)}</p>

        <button class="request-btn" onclick="sendRequest(this)">
            Send Request
        </button>
    `;

    skillContainer.appendChild(newCard);

}


// Display saved skills when website opens

savedSkills.forEach(function (skill) {
    displaySkill(skill);
});


// 4. ADD NEW SKILL

const skillForm = document.getElementById("skillForm");

skillForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const studentName =
        document.getElementById("studentName").value.trim();

    const skillName =
        document.getElementById("skillName").value.trim();

    const learnSkill =
        document.getElementById("learnSkill").value.trim();

    if (!studentName || !skillName || !learnSkill) {
        alert("Please fill all the fields!");
        return;
    }

    const newSkill = {
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


// 5. SEND SKILL EXCHANGE REQUEST

let savedRequests = JSON.parse(
    localStorage.getItem("savedRequests") || "[]"
);

const requestContainer =
    document.getElementById("requestContainer");


function displaySentRequest(request) {

    const requestCard = document.createElement("div");

    requestCard.className = "request-card";

    requestCard.innerHTML = `
        <h3>Request sent to ${escapeHTML(request.receiver)}</h3>

        <p>Skill: ${escapeHTML(request.skill)}</p>

        <p class="request-status">
            Status: ${escapeHTML(request.status)}
        </p>
    `;

    requestContainer.appendChild(requestCard);

}


function sendRequest(button) {

    const card = button.closest(".skill-card");

    const receiver = card.querySelector("p").innerText
        .replace("By ", "");

    const skill = card.querySelector("h3").innerText;

    const request = {
        receiver: receiver,
        skill: skill,
        status: "Pending"
    };

    savedRequests.push(request);

    localStorage.setItem(
        "savedRequests",
        JSON.stringify(savedRequests)
    );

    displaySentRequest(request);

    button.innerText = "Request Sent";

    button.disabled = true;

    button.style.background = "#198754";

    alert("Your skill exchange request has been sent!");

}


// Display saved sent requests

savedRequests.forEach(function (request) {
    displaySentRequest(request);
});


// 6. ACCEPT RECEIVED REQUEST

function acceptRequest(button) {

    const card = button.closest(".request-card");

    const status = card.querySelector(".request-status");

    status.innerText = "Status: Accepted";

    status.style.color = "#198754";

    const buttons = card.querySelector(".request-buttons");

    if (buttons) {
        buttons.remove();
    }

    alert("Skill exchange request accepted!");

}


// 7. REJECT RECEIVED REQUEST

function rejectRequest(button) {

    const card = button.closest(".request-card");

    const status = card.querySelector(".request-status");

    status.innerText = "Status: Rejected";

    status.style.color = "#dc3545";

    const buttons = card.querySelector(".request-buttons");

    if (buttons) {
        buttons.remove();
    }

    alert("Skill exchange request rejected!");

}
