/**
 * Experiment 4: Form Validation using JavaScript for AI-based Smart Irrigation Advisory Web Portal
 * Deliverable: valid.js (linked with registration.html)
 * 
 * Validates:
 * - Task 2: Required text fields, trimming whitespace, alphabetic check for Farmer Name.
 * - Task 3: 10-digit Indian mobile number regex, email regex.
 * - Task 4: Dropdown selection validation, Registration Date entered & not in the future, error highlighting.
 * - Additional: Plot ID format regex, Soil Moisture numeric range (0-100%), Farm photo upload validation,
 *   Real-time feedback on input/blur, Reset clearing, and Success summary presentation.
 */

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");
    const successCard = document.getElementById("successCard");

    if (!form) return;

    // Set max date attribute on registration date input to today
    const regDateInput = document.getElementById("regDate");
    if (regDateInput) {
        const todayStr = new Date().toISOString().split("T")[0];
        regDateInput.setAttribute("max", todayStr);
    }

    // Attach real-time validation on blur and input for all fields
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(function (input) {
        input.addEventListener("blur", function () {
            validateField(input.id);
        });

        input.addEventListener("input", function () {
            // If the field is currently in error state, revalidate to clear error immediately
            if (input.classList.contains("input-error")) {
                validateField(input.id);
            }
        });

        if (input.tagName.toLowerCase() === "select") {
            input.addEventListener("change", function () {
                validateField(input.id);
            });
        }
    });

    // Form submit listener
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default submission
        handleFormSubmission();
    });

    // Reset button listener
    form.addEventListener("reset", function () {
        setTimeout(resetValidationState, 10);
    });
});

/**
 * Display an error message and apply red highlight to the field.
 */
function setError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);

    if (input) {
        input.classList.add("input-error");
        input.classList.remove("input-valid");
    }

    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add("visible");
    }
}

/**
 * Clear the error state and apply valid highlight to the field.
 */
function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorSpan = document.getElementById(errorId);

    if (input) {
        input.classList.remove("input-error");
        input.classList.add("input-valid");
    }

    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("visible");
    }
}

/**
 * Validates a single field by ID.
 * Returns true if valid, false otherwise.
 */
function validateField(fieldId) {
    let isValid = true;

    switch (fieldId) {
        // --- Task 2: Farmer Name ---
        case "farmerName": {
            const el = document.getElementById("farmerName");
            const val = el ? el.value.trim() : "";
            const namePattern = /^[A-Za-z\s]+$/;

            if (val === "") {
                setError("farmerName", "farmerNameError", "Farmer Name is required and cannot be empty.");
                isValid = false;
            } else if (!namePattern.test(val)) {
                setError("farmerName", "farmerNameError", "Farmer Name must contain alphabetic characters and spaces only.");
                isValid = false;
            } else if (val.length < 3) {
                setError("farmerName", "farmerNameError", "Farmer Name must be at least 3 characters long.");
                isValid = false;
            } else {
                clearError("farmerName", "farmerNameError");
            }
            break;
        }

        // --- Task 3: Mobile Number ---
        case "mobile": {
            const el = document.getElementById("mobile");
            const val = el ? el.value.trim() : "";
            // 10-digit Indian mobile number: starts with 6, 7, 8, or 9 followed by 9 digits
            const mobilePattern = /^[6-9]\d{9}$/;

            if (val === "") {
                setError("mobile", "mobileError", "Mobile Number is required.");
                isValid = false;
            } else if (!/^\d+$/.test(val)) {
                setError("mobile", "mobileError", "Mobile Number must contain digits only.");
                isValid = false;
            } else if (val.length !== 10) {
                setError("mobile", "mobileError", "Mobile Number must contain exactly 10 digits.");
                isValid = false;
            } else if (!mobilePattern.test(val)) {
                setError("mobile", "mobileError", "Please enter a valid Indian mobile number (must start with 6, 7, 8, or 9).");
                isValid = false;
            } else {
                clearError("mobile", "mobileError");
            }
            break;
        }

        // --- Task 3: Email Address ---
        case "email": {
            const el = document.getElementById("email");
            const val = el ? el.value.trim() : "";
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (val === "") {
                setError("email", "emailError", "Email Address is required.");
                isValid = false;
            } else if (!emailPattern.test(val)) {
                setError("email", "emailError", "Please enter a valid email address (e.g. farmer@example.com).");
                isValid = false;
            } else {
                clearError("email", "emailError");
            }
            break;
        }

        // --- Task 2: Village / Taluka ---
        case "village": {
            const el = document.getElementById("village");
            const val = el ? el.value.trim() : "";

            if (val === "") {
                setError("village", "villageError", "Village / Taluka is required.");
                isValid = false;
            } else if (val.length < 2) {
                setError("village", "villageError", "Please enter a valid village/location name.");
                isValid = false;
            } else {
                clearError("village", "villageError");
            }
            break;
        }

        // --- Task 2 & Aim: Plot ID ---
        case "plotId": {
            const el = document.getElementById("plotId");
            const val = el ? el.value.trim() : "";
            // Supports KJS-PLOT-XXX or AGR-XXXX format
            const plotPattern = /^(KJS-PLOT-\d{3,4}|AGR-\d{4})$/i;

            if (val === "") {
                setError("plotId", "plotIdError", "Plot ID is required.");
                isValid = false;
            } else if (!plotPattern.test(val)) {
                setError("plotId", "plotIdError", "Invalid Plot ID format! Use format: KJS-PLOT-101 or AGR-1234.");
                isValid = false;
            } else {
                clearError("plotId", "plotIdError");
            }
            break;
        }

        // --- Task 4: Crop Stage Selection ---
        case "cropStage": {
            const el = document.getElementById("cropStage");
            const val = el ? el.value : "";

            if (!val || val === "") {
                setError("cropStage", "cropStageError", "Please select a sugarcane crop stage from the list.");
                isValid = false;
            } else {
                clearError("cropStage", "cropStageError");
            }
            break;
        }

        // --- Task 4: Soil Type Selection ---
        case "soilType": {
            const el = document.getElementById("soilType");
            const val = el ? el.value : "";

            if (!val || val === "") {
                setError("soilType", "soilTypeError", "Please select a soil type from the list.");
                isValid = false;
            } else {
                clearError("soilType", "soilTypeError");
            }
            break;
        }

        // --- Task 4: Irrigation Method Selection ---
        case "irrigationMethod": {
            const el = document.getElementById("irrigationMethod");
            const val = el ? el.value : "";

            if (!val || val === "") {
                setError("irrigationMethod", "irrigationMethodError", "Please select an irrigation method from the list.");
                isValid = false;
            } else {
                clearError("irrigationMethod", "irrigationMethodError");
            }
            break;
        }

        // --- Aim & Numeric Validation: Soil Moisture (%) ---
        case "soilMoisture": {
            const el = document.getElementById("soilMoisture");
            const val = el ? el.value.trim() : "";

            if (val === "") {
                setError("soilMoisture", "soilMoistureError", "Soil Moisture (%) is required.");
                isValid = false;
            } else {
                const num = parseFloat(val);
                if (isNaN(num)) {
                    setError("soilMoisture", "soilMoistureError", "Soil Moisture must be a valid number.");
                    isValid = false;
                } else if (num < 0 || num > 100) {
                    setError("soilMoisture", "soilMoistureError", "Soil Moisture must be between 0% and 100%.");
                    isValid = false;
                } else {
                    clearError("soilMoisture", "soilMoistureError");
                }
            }
            break;
        }

        // --- Task 4: Registration Date Validation ---
        case "regDate": {
            const el = document.getElementById("regDate");
            const val = el ? el.value.trim() : "";

            if (val === "") {
                setError("regDate", "regDateError", "Registration Date is required.");
                isValid = false;
            } else {
                const selectedDate = new Date(val);
                const today = new Date();
                today.setHours(23, 59, 59, 999); // End of today

                if (isNaN(selectedDate.getTime())) {
                    setError("regDate", "regDateError", "Please select a valid date.");
                    isValid = false;
                } else if (selectedDate > today) {
                    setError("regDate", "regDateError", "Registration Date cannot be in the future. Please select today or an earlier date.");
                    isValid = false;
                } else {
                    clearError("regDate", "regDateError");
                }
            }
            break;
        }

        // --- Task 1: Farm Photo Upload ---
        case "farmPhoto": {
            const el = document.getElementById("farmPhoto");
            const files = el ? el.files : null;

            if (!files || files.length === 0) {
                setError("farmPhoto", "farmPhotoError", "Please select and upload a farm/plot photo.");
                isValid = false;
            } else {
                const file = files[0];
                const allowedExtensions = /\.(jpe?g|png|webp|gif)$/i;
                if (!allowedExtensions.test(file.name)) {
                    setError("farmPhoto", "farmPhotoError", "Only image files (JPG, PNG, WEBP, GIF) are allowed.");
                    isValid = false;
                } else {
                    clearError("farmPhoto", "farmPhotoError");
                }
            }
            break;
        }
    }

    return isValid;
}

/**
 * Validates all fields in the registration form.
 * Exposes global validateForm() for onclick or submit triggers.
 */
function validateForm() {
    return handleFormSubmission();
}

/**
 * Main form submission handler.
 */
function handleFormSubmission() {
    const fieldIds = [
        "farmerName",
        "mobile",
        "email",
        "village",
        "plotId",
        "cropStage",
        "soilType",
        "irrigationMethod",
        "soilMoisture",
        "regDate",
        "farmPhoto"
    ];

    let allValid = true;
    let firstInvalidInput = null;

    fieldIds.forEach(function (id) {
        const fieldValid = validateField(id);
        if (!fieldValid) {
            allValid = false;
            if (!firstInvalidInput) {
                firstInvalidInput = document.getElementById(id);
            }
        }
    });

    const successCard = document.getElementById("successCard");

    if (!allValid) {
        if (successCard) {
            successCard.style.display = "none";
        }
        if (firstInvalidInput) {
            firstInvalidInput.focus();
            firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return false;
    }

    // Form is completely valid!
    displaySuccessMessage();
    return true;
}

/**
 * Builds and displays the success summary banner.
 */
function displaySuccessMessage() {
    const successCard = document.getElementById("successCard");
    if (!successCard) return;

    const name = document.getElementById("farmerName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const village = document.getElementById("village").value.trim();
    const plotId = document.getElementById("plotId").value.trim().toUpperCase();
    const cropStage = document.getElementById("cropStage").value;
    const soilType = document.getElementById("soilType").value;
    const irrigationMethod = document.getElementById("irrigationMethod").value;
    const soilMoisture = document.getElementById("soilMoisture").value.trim();
    const regDate = document.getElementById("regDate").value;
    const photoInput = document.getElementById("farmPhoto");
    const photoName = photoInput && photoInput.files && photoInput.files[0] ? photoInput.files[0].name : "plot_photo.jpg";

    successCard.innerHTML = `
        <h3>✓ Registration Successful!</h3>
        <p>
            The sugarcane farm plot has been verified and registered into the 
            <strong>AI-based Smart Irrigation Advisory System</strong>. Automated sensor monitoring 
            and weather-adjusted irrigation alerts are now active.
        </p>
        <div class="success-details">
            <div><strong>Farmer Name:</strong> ${escapeHtml(name)}</div>
            <div><strong>Mobile Number:</strong> ${escapeHtml(mobile)}</div>
            <div><strong>Email Address:</strong> ${escapeHtml(email)}</div>
            <div><strong>Village / Taluka:</strong> ${escapeHtml(village)}</div>
            <div><strong>Registered Plot ID:</strong> ${escapeHtml(plotId)}</div>
            <div><strong>Crop Growth Stage:</strong> ${escapeHtml(cropStage)}</div>
            <div><strong>Soil Type:</strong> ${escapeHtml(soilType)}</div>
            <div><strong>Irrigation Method:</strong> ${escapeHtml(irrigationMethod)}</div>
            <div><strong>Initial Soil Moisture:</strong> ${escapeHtml(soilMoisture)}%</div>
            <div><strong>Registration Date:</strong> ${escapeHtml(regDate)}</div>
            <div><strong>Farm Photo:</strong> ${escapeHtml(photoName)}</div>
            <div><strong>Status:</strong> <span style="color:#1b5e20; font-weight:bold;">Active &amp; Monitored</span></div>
        </div>
    `;

    successCard.style.display = "block";
    successCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Clears all validation errors, resets input styles, and hides success banner.
 */
function resetValidationState() {
    const errorSpans = document.querySelectorAll(".error-msg");
    errorSpans.forEach(function (span) {
        span.textContent = "";
        span.classList.remove("visible");
    });

    const inputs = document.querySelectorAll(".registration-form input, .registration-form select");
    inputs.forEach(function (input) {
        input.classList.remove("input-error");
        input.classList.remove("input-valid");
    });

    const successCard = document.getElementById("successCard");
    if (successCard) {
        successCard.style.display = "none";
        successCard.innerHTML = "";
    }
}

/**
 * Simple HTML escape helper for safe DOM insertion.
 */
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
