document.addEventListener("DOMContentLoaded", function () {
  const state = {
    id: "",
    currentPage: 1,
    teamName: "",
    teamLead: "",
    projectIdea: "",
    teamMembers: [],
    firstPrototypeDate: "",
    finalProductDate: "",
    decisionMethod: "",
    customRules: "",
    signedAgreement: false,
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
  const membersTable = document
    .getElementById("members-table")
    .querySelector("tbody");
  const deadlinesContainer = document.getElementById("deadlines-container");
  const editSectionButtons = document.querySelectorAll(".edit-section-button");
  const finalizeButton = document.getElementById("finalize-button");

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

    // Edit section buttons
    editSectionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetPage = parseInt(button.getAttribute("data-page"));
        navigateToPage(targetPage);
      });
    });

    // Finalize button
    finalizeButton.addEventListener("click", finalizePact);

    // backToPactButton.addEventListener("click", () => navigateToPage(5));
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
      signPage();
    }

    if (pageNumber === 7) {
      showAgreement();
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
    const teamLeadInput = document.getElementById("team-lead");

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

    if (!teamLeadInput.value.trim()) {
      alert("Please enter Team Lead Name");
      teamLeadInput.focus();
      return false;
    }

    // Save data to state
    state.teamName = teamNameInput.value.trim();
    state.projectIdea = projectIdeaInput.value.trim();
    state.teamLead = teamLeadInput.value.trim();

    // Save team members

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
    const deadline1 = deadlinesContainer.querySelector(".deadline-row-1");
    const prototypeDate = deadline1.querySelector(".prototype-deadline-date");
    const deadline2 = deadlinesContainer.querySelector(".deadline-row-2");
    const fpDate = deadline2.querySelector(".final-product-deadline-date");

    if (prototypeDate.value && fpDate.value) {
      state.firstPrototypeDate = prototypeDate.value;
      state.finalProductDate = fpDate.value;
    }

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

  // // Deadlines
  // function addDeadline() {
  //   const newRow = document.createElement("div");
  //   newRow.className = "deadline-row";

  //   newRow.innerHTML = `
  //           <input type="text" class="deadline-description" placeholder="Deadline description">
  //           <input type="date" class="deadline-date">
  //           <button class="remove-deadline-button">×</button>
  //       `;

  //   // Add event listener to the remove button
  //   const removeButton = newRow.querySelector(".remove-deadline-button");
  //   removeButton.addEventListener("click", function () {
  //     deadlinesContainer.removeChild(newRow);
  //   });

  //   deadlinesContainer.appendChild(newRow);
  // }

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

    const deadlineItem1 = document.createElement("p");
    const deadlineItem2 = document.createElement("p");
    const formattedDate1 = new Date(
      state.firstPrototypeDate,
    ).toLocaleDateString();
    const formattedDate2 = new Date(
      state.finalProductDate,
    ).toLocaleDateString();
    deadlineItem1.innerHTML =
      `<strong>First Prototype</strong>: ${formattedDate1}`;
    deadlineItem2.innerHTML =
      `<strong>Final Product</strong>: ${formattedDate2}`;
    deadlinesList.appendChild(deadlineItem1);
    deadlinesList.appendChild(deadlineItem2);

    // Decision method
    let methodText = "";
    switch (state.decisionMethod) {
      case "Majority Vote":
        methodText = "Majority Vote";
        break;
      case "Representative Decision":
        methodText = "Representative Decision";
        break;
    }

    document.getElementById("review-decision-method").textContent = methodText;
    document.getElementById("review-custom-rules").textContent =
      state.customRules || "None";
  }

  function signPage() {
    const signatureName = document.querySelector(".signature-name");
    signatureName.innerHTML = `
    <strong>${state.teamLead}</strong>`;
  }

  // Finalize pact
  async function finalizePact() {
    const signaturesContainer = document.getElementById("signatures-container");

    // Add event listeners to checkboxes
    const checkbox = signaturesContainer.querySelector(".signature-check");
    finalizeButton.disabled = checkbox.checked;

    console.log(checkbox.checked);

    if (checkbox.checked) {
      state.signedAgreement = true;
      const response = await fetch("/api/contract/create", {
        method: "POST",
        // Convert state to contract object.
        body: JSON.stringify(contractFromState(state)),
      });
      const responseBody = await response.json();
      state.id = responseBody.id;
      alert(
        "Team pact has been finalized! Team Representative signed the agreement.",
      );

      navigateToPage(7);
    }
  }

  function contractFromState() {
    const contract = {
      id: "",
      teamName: state.teamName,
      teamLead: state.teamLead,
      projectIdea: state.projectIdea,
      members: state.teamMembers,
      firstPrototypeDate: state.firstPrototypeDate,
      finalProductDate: state.finalProductDate,
      decisionMethod: state.decisionMethod,
      customRules: state.customRules,
      signedAgreement: true,
    };

    return contract;
  }

  async function showAgreement() {
    const response = await fetch(`/api/contract/get/${state.id}`, {
      method: "GET",
    });
    const responseBody = await response.json();
    const showTeamName = document.querySelector(".team-name");
    const showprojectidea = document.querySelector(".project-idea");
    const showTeamlead = document.querySelector(".team-lead");
    const showDecision = document.querySelector(".decision-method");
    const showrules = document.querySelector(".custom-rules");

    showTeamName.textContent = responseBody.teamName;
    showprojectidea.textContent = responseBody.projectIdea;
    showTeamlead.textContent = responseBody.teamLead;
    showDecision.textContent = responseBody.decisionMethod;
    showrules.textContent = responseBody.customRules;
  }

  // Initialize the app
  init();
});
