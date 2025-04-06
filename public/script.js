document.addEventListener("DOMContentLoaded", function () {
  // State management
  const state = {
    currentPage: 1,
    teamName: "",
    projectIdea: "",
    teamMembers: [],
    deadlines: [],
    fallbackPlan: "",
    decisionMethod: "",
    customRules: "",
    signatures: [],
    votes: {
      yes: 0,
      no: 0,
      neutral: 0,
    },
    userVoted: false,
  };

  // DOM elements
  const pages = document.querySelectorAll(".page");
  const progressSteps = document.querySelectorAll(".progress-step");
  const startButton = document.getElementById("start-button");
  const prevButtons = document.querySelectorAll(".prev-button");
  const nextButtons = document.querySelectorAll(".next-button");
  const addMemberButton = document.getElementById("add-member-button");
  const teamMembersContainer = document.getElementById(
    "team-members-container",
  );
  const membersTable = document.getElementById("members-table").querySelector(
    "tbody",
  );
  const addDeadlineButton = document.getElementById("add-deadline-button");
  const deadlinesContainer = document.getElementById("deadlines-container");
  const fallbackDropdown = document.getElementById("fallback-dropdown");
  const editSectionButtons = document.querySelectorAll(".edit-section-button");
  const finalizeButton = document.getElementById("finalize-button");
  const voteOptions = document.querySelectorAll(".vote-option");
  const backToPactButton = document.getElementById("back-to-pact");
  const newVoteButton = document.getElementById("new-vote");

  // Initialize the application
  function init() {
    setupEventListeners();
    updateProgressBar();
  }

  // Set up event listeners
  function setupEventListeners() {
    // Navigation buttons
    startButton.addEventListener("click", () => navigateToPage(2));

    prevButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => navigateToPage(state.currentPage - 1),
      );
    });

    nextButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (validateCurrentPage()) {
          navigateToPage(state.currentPage + 1);
        }
      });
    });

    // Team members
    addMemberButton.addEventListener("click", addTeamMember);

    // Deadlines
    addDeadlineButton.addEventListener("click", addDeadline);

    // Fallback dropdown
    fallbackDropdown.addEventListener("change", handleFallbackSelection);

    // Edit section buttons
    editSectionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetPage = parseInt(button.getAttribute("data-page"));
        navigateToPage(targetPage);
      });
    });

    // Finalize button
    finalizeButton.addEventListener("click", finalizePact);

    // Voting
    voteOptions.forEach((option) => {
      option.addEventListener("click", handleVote);
    });

    backToPactButton.addEventListener("click", () => navigateToPage(5));
    newVoteButton.addEventListener("click", createNewVote);
  }

  // Navigation
  function navigateToPage(pageNumber) {
    // Hide all pages
    pages.forEach((page) => page.classList.add("hidden"));

    // Show the target page
    document.getElementById(`page-${pageNumber}`).classList.remove("hidden");

    // Update state
    state.currentPage = pageNumber;

    // Update progress bar
    updateProgressBar();

    // If navigating to review page, update review content
    if (pageNumber === 5) {
      updateReviewPage();
    }

    // If navigating to signature page, generate signature fields
    if (pageNumber === 6) {
      generateSignatureFields();
    }
  }

  function updateProgressBar() {
    // Update progress steps
    progressSteps.forEach((step) => {
      const stepNumber = parseInt(step.getAttribute("data-step"));

      if (stepNumber === state.currentPage) {
        step.classList.add("active");
        step.classList.remove("completed");
      } else if (stepNumber < state.currentPage) {
        step.classList.remove("active");
        step.classList.add("completed");
      } else {
        step.classList.remove("active");
        step.classList.remove("completed");
      }
    });
  }

  // Validation
  function validateCurrentPage() {
    switch (state.currentPage) {
      case 2: // Contract Creation
        return validateContractCreation();
      case 3: // Deadlines
        return validateDeadlines();
      case 4: // Decision Rules
        return validateDecisionRules();
      default:
        return true;
    }
  }

  function validateContractCreation() {
    const teamNameInput = document.getElementById("team-name");
    const projectIdeaInput = document.getElementById("project-idea");

    if (!teamNameInput.value.trim()) {
      alert("Please enter a team name");
      teamNameInput.focus();
      return false;
    }

    if (!projectIdeaInput.value.trim()) {
      alert("Please enter a project idea");
      projectIdeaInput.focus();
      return false;
    }

    // Save data to state
    state.teamName = teamNameInput.value.trim();
    state.projectIdea = projectIdeaInput.value.trim();

    // Save team members
    state.teamMembers = [];
    const memberRows = teamMembersContainer.querySelectorAll(
      ".team-member-row",
    );

    let isValid = true;

    memberRows.forEach((row) => {
      const nameInput = row.querySelector(".member-name");
      const roleInput = row.querySelector(".member-role");
      const emailInput = row.querySelector(".member-email");

      if (!nameInput.value.trim()) {
        alert("Please enter a name for all team members");
        nameInput.focus();
        isValid = false;
        return;
      }

      state.teamMembers.push({
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        email: emailInput.value.trim(),
      });
    });

    return isValid;
  }

  function validateDeadlines() {
    // Save deadlines
    state.deadlines = [];
    const deadlineRows = deadlinesContainer.querySelectorAll(".deadline-row");

    deadlineRows.forEach((row) => {
      const descriptionInput = row.querySelector(".deadline-description");
      const dateInput = row.querySelector(".deadline-date");

      if (descriptionInput.value.trim() && dateInput.value) {
        state.deadlines.push({
          description: descriptionInput.value.trim(),
          date: dateInput.value,
        });
      }
    });

    // Save fallback plan
    state.fallbackPlan = document.getElementById("fallback-text").value.trim();

    return true;
  }

  function validateDecisionRules() {
    // Save decision method
    const selectedMethod = document.querySelector(
      'input[name="decision-method"]:checked',
    );

    if (!selectedMethod) {
      alert("Please select a decision-making method");
      return false;
    }

    state.decisionMethod = selectedMethod.value;

    // Save custom rules
    state.customRules = document.getElementById("custom-rules").value.trim();

    return true;
  }

  // Team Members
  function addTeamMember() {
    const newRow = document.createElement("div");
    newRow.className = "team-member-row";

    newRow.innerHTML = `
            <input type="text" class="member-name" placeholder="Name">
            <input type="text" class="member-role" placeholder="Role">
            <input type="email" class="member-email" placeholder="Email">
            <button class="remove-member-button">×</button>
        `;

    // Enable all remove buttons when we have more than one member
    const removeButtons = teamMembersContainer.querySelectorAll(
      ".remove-member-button",
    );
    removeButtons.forEach((button) => {
      button.disabled = false;
    });

    // Add event listener to the new remove button
    const removeButton = newRow.querySelector(".remove-member-button");
    removeButton.addEventListener("click", function () {
      teamMembersContainer.removeChild(newRow);
      updateMembersTable();

      // If only one member is left, disable its remove button
      const remainingRows = teamMembersContainer.querySelectorAll(
        ".team-member-row",
      );
      if (remainingRows.length === 1) {
        remainingRows[0].querySelector(".remove-member-button").disabled = true;
      }
    });

    // Add input event listeners to update the table
    const inputs = newRow.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", updateMembersTable);
    });

    teamMembersContainer.appendChild(newRow);
    updateMembersTable();
  }

  function updateMembersTable() {
    // Clear the table
    membersTable.innerHTML = "";

    // Get all member rows
    const memberRows = teamMembersContainer.querySelectorAll(
      ".team-member-row",
    );

    // Add each member to the table
    memberRows.forEach((row) => {
      const name = row.querySelector(".member-name").value.trim();
      const role = row.querySelector(".member-role").value.trim();
      const email = row.querySelector(".member-email").value.trim();

      if (name || role || email) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${name || "-"}</td>
                    <td>${role || "-"}</td>
                    <td>${email || "-"}</td>
                `;
        membersTable.appendChild(tr);
      }
    });
  }

  // Deadlines
  function addDeadline() {
    const newRow = document.createElement("div");
    newRow.className = "deadline-row";

    newRow.innerHTML = `
            <input type="text" class="deadline-description" placeholder="Deadline description">
            <input type="date" class="deadline-date">
            <button class="remove-deadline-button">×</button>
        `;

    // Add event listener to the remove button
    const removeButton = newRow.querySelector(".remove-deadline-button");
    removeButton.addEventListener("click", function () {
      deadlinesContainer.removeChild(newRow);
    });

    deadlinesContainer.appendChild(newRow);
  }

  // Fallback dropdown
  function handleFallbackSelection() {
    const fallbackText = document.getElementById("fallback-text");

    if (fallbackDropdown.value) {
      let selectedText = "";

      switch (fallbackDropdown.value) {
        case "mock":
          selectedText = "If the API fails, we will use mock data.";
          break;
        case "simplified":
          selectedText =
            "If time runs out, we will create a simplified version of the project.";
          break;
        case "focus":
          selectedText =
            "If the scope becomes too large, we will focus on core features only.";
          break;
        case "pair":
          selectedText =
            "If someone gets stuck, we will use pair programming to solve the issue.";
          break;
      }

      fallbackText.value = fallbackText.value
        ? `${fallbackText.value}\n${selectedText}`
        : selectedText;
    }
  }

  // Review page
  function updateReviewPage() {
    // Team information
    document.getElementById("review-team-name").textContent = state.teamName;
    document.getElementById("review-project-idea").textContent =
      state.projectIdea;

    // Team members
    const membersList = document.getElementById("review-members-list");
    membersList.innerHTML = "";

    state.teamMembers.forEach((member) => {
      const memberItem = document.createElement("p");
      memberItem.innerHTML =
        `<strong>${member.name}</strong> - ${member.role} (${member.email})`;
      membersList.appendChild(memberItem);
    });

    // Deadlines
    const deadlinesList = document.getElementById("review-deadlines");
    deadlinesList.innerHTML = "";

    if (state.deadlines.length === 0) {
      deadlinesList.innerHTML = "<p>No deadlines set</p>";
    } else {
      state.deadlines.forEach((deadline) => {
        const deadlineItem = document.createElement("p");
        const formattedDate = new Date(deadline.date).toLocaleDateString();
        deadlineItem.innerHTML =
          `<strong>${deadline.description}</strong>: ${formattedDate}`;
        deadlinesList.appendChild(deadlineItem);
      });
    }

    // Fallback plan
    document.getElementById("review-fallback").textContent =
      state.fallbackPlan || "No fallback plan specified";

    // Decision method
    let methodText = "";
    switch (state.decisionMethod) {
      case "majority":
        methodText = "Majority vote";
        break;
      case "lead":
        methodText = "Team lead decides";
        break;
      case "consensus":
        methodText = "Consensus required";
        break;
    }

    document.getElementById("review-decision-method").textContent = methodText;
    document.getElementById("review-custom-rules").textContent =
      state.customRules || "None";
  }

  // Signature page
  function generateSignatureFields() {
    const signaturesContainer = document.getElementById("signatures-container");
    signaturesContainer.innerHTML = "";

    state.teamMembers.forEach((member, index) => {
      const signatureRow = document.createElement("div");
      signatureRow.className = "signature-row";

      signatureRow.innerHTML = `
                <div class="signature-name">
                    <strong>${member.name}</strong> (${member.role})
                </div>
                <div class="signature-checkbox">
                    <input type="checkbox" id="signature-${index}" class="signature-check">
                    <label for="signature-${index}">I agree to the terms of this pact.</label>
                </div>
            `;

      signaturesContainer.appendChild(signatureRow);
    });

    // Update signature counts
    document.getElementById("total-members").textContent =
      state.teamMembers.length;

    // Add event listeners to checkboxes
    const checkboxes = signaturesContainer.querySelectorAll(".signature-check");
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateSignatureCount);
    });
  }

  function updateSignatureCount() {
    const checkboxes = document.querySelectorAll(".signature-check");
    const signedCount = Array.from(checkboxes).filter((checkbox) =>
      checkbox.checked
    ).length;

    document.getElementById("signed-count").textContent = signedCount;

    // Enable finalize button if all members have signed
    finalizeButton.disabled = signedCount !== state.teamMembers.length;
  }

  // Finalize pact
  function finalizePact() {
    alert(
      "Team pact has been finalized! All members have signed the agreement.",
    );
    navigateToPage(7); // Go to voting page as an example
  }

  // Voting
  function handleVote(event) {
    if (state.userVoted) {
      alert("You have already voted!");
      return;
    }

    const voteType = event.currentTarget.getAttribute("data-vote");

    // Update state
    state.votes[voteType]++;
    state.userVoted = true;

    // Disable voting buttons
    voteOptions.forEach((option) => {
      option.disabled = true;
      option.classList.add("voted");
    });

    // Show waiting message
    document.getElementById("voting-message").textContent =
      "Thank you! Waiting for other members to vote...";

    // For demo purposes, show results after a delay
    setTimeout(showVotingResults, 2000);
  }

  function showVotingResults() {
    // Update chart bars
    const totalVotes = state.votes.yes + state.votes.no + state.votes.neutral;

    const yesBar = document.querySelector(".yes-bar");
    const noBar = document.querySelector(".no-bar");
    const neutralBar = document.querySelector(".neutral-bar");

    yesBar.style.width = `${(state.votes.yes / totalVotes) * 100}%`;
    noBar.style.width = `${(state.votes.no / totalVotes) * 100}%`;
    neutralBar.style.width = `${(state.votes.neutral / totalVotes) * 100}%`;

    yesBar.querySelector(".vote-count").textContent = state.votes.yes;
    noBar.querySelector(".vote-count").textContent = state.votes.no;
    neutralBar.querySelector(".vote-count").textContent = state.votes.neutral;

    // Show results
    document.getElementById("voting-results").classList.remove("hidden");
    document.getElementById("voting-message").textContent =
      "Voting complete! Here are the results:";
  }

  function createNewVote() {
    // Reset voting state
    state.votes = { yes: 0, no: 0, neutral: 0 };
    state.userVoted = false;

    // Enable voting buttons
    voteOptions.forEach((option) => {
      option.disabled = false;
      option.classList.remove("voted");
    });

    // Hide results
    document.getElementById("voting-results").classList.add("hidden");

    // Update question (in a real app, this would be dynamic)
    const questions = [
      "Should we switch from Firebase to Supabase?",
      "Should we extend the project deadline by one week?",
      "Should we add a dark mode feature to our app?",
      "Should we prioritize mobile responsiveness over new features?",
    ];

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    document.getElementById("vote-question").textContent = randomQuestion;

    // Reset message
    document.getElementById("voting-message").textContent =
      "Please cast your vote:";
  }

  // Initialize the app
  init();
});
