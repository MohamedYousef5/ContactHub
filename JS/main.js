let form = document.querySelector("#contactForm");
let modal = document.querySelector("#contactModal");

let fullNameInput = document.querySelector("#fullName");
let phoneInput = document.querySelector("#phone");
let emailInput = document.querySelector("#email");
let addressInput = document.querySelector("#address");
let groupSelect = document.querySelector("#group");
let notesInput = document.querySelector("#notes");
let favoriteCheck = document.querySelector("#favorite");
let emergencyCheck = document.querySelector("#emergency");
let btnSave = document.querySelector("#saveContact");
let searchInput = document.querySelector("#searchInput");

// Wronge Message
let fullNameError = fullNameInput.nextElementSibling;
let phoneError = phoneInput.nextElementSibling;
let emailError = emailInput.nextElementSibling;

// regex
let nameRegex = /^[\u0600-\u06FFa-zA-Z\s]{3,50}$/;
let phoneRegex = /^(?:(?:\+20|0020)1|01)[0125]\d{8}$/;
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Form Valida
function showError(input, errorDiv, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  errorDiv.textContent = message;
}
function showSuccess(input) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
}
function clearState(input) {
  input.classList.remove("is-invalid");
  input.classList.remove("is-valid");
}

// Check Function
function checkFullName() {
  let value = fullNameInput.value.trim();
  if (!nameRegex.test(value)) {
    showError(
      fullNameInput,
      fullNameError,
      "Name should contain only letters and spaces (2-50 characters)",
    );
    return false;
  }
  showSuccess(fullNameInput);
  return true;
}
function checkPhone() {
  let value = phoneInput.value.trim();
  if (!phoneRegex.test(value)) {
    showError(
      phoneInput,
      phoneError,
      "Please enter a valid Egyptian phone number",
    );
    return false;
  }
  showSuccess(phoneInput);
  return true;
}
function checkEmail() {
  let value = emailInput.value.trim();
  if (!emailRegex.test(value)) {
    showError(emailInput, emailError, "Please enter a valid email address");
    return false;
  }
  showSuccess(emailInput);
  return true;
}

// Check Type
fullNameInput.addEventListener("blur", checkFullName);
phoneInput.addEventListener("blur", checkPhone);
emailInput.addEventListener("blur", checkEmail);

fullNameInput.addEventListener("input", checkFullName);
phoneInput.addEventListener("input", checkPhone);
emailInput.addEventListener("input", checkEmail);

// Data Save
form.addEventListener("submit", function (e) {
  e.preventDefault();
  let nameOk = checkFullName();
  let phoneOk = checkPhone();
  let emailOk = checkEmail();
  if (!nameOk || !phoneOk || !emailOk) {
    return;
  }
  let contact = {
    fullName: fullNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    group: groupSelect.value,
    notes: notesInput.value.trim(),
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked,
  };
  bootstrap.Modal.getInstance(modal).hide();
  Swal.fire({
  title: "كدا كلو تمام",
  text: "Contact has been added succesfully.",
  icon: "success"
});
});

// Clear Form
modal.addEventListener("hidden.bs.modal", function () {
  form.reset();
  clearState(fullNameInput);
  clearState(phoneInput);
  clearState(emailInput);
  clearState(addressInput);
  clearState(notesInput);
});

// CRUDS
let contactData = [];
if (localStorage.getItem("contacts") != null) {
  contactData = JSON.parse(localStorage.getItem("contacts"));
  handleDisplay();
  
}
// Add Contact
function handleAddContact() {
  let addContact = {
    fullName: fullNameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    group: groupSelect.value,
    notes: notesInput.value.trim(),
    favorite: favoriteCheck.checked,
    emergency: emergencyCheck.checked,
  };
  contactData.push(addContact);
  localStorage.setItem("contacts", JSON.stringify(contactData));
  handleDisplay();
}
// Display Contact
function handleDisplay() {
  let temp = "";
  for (let i = 0; i < contactData.length; i++) {
    let addressHide = '';
    if(contactData[i].address && contactData[i].address !== ''){
      addressHide = `<div class="d-flex align-items-center gap-3">
                        <div class="bg-danger p-1 rounded-3"><i class="fa-solid fa-location-dot text-danger-emphasis"></i></div>
                        <span>${contactData[i].address}</span>
                      </div>`;
    }
    let groupHide = '';
    if(contactData[i].group && contactData[i].group !== '' && contactData[i].group !== 'Select a group'){
      groupHide = `<span class="mb-3 p-2 bg-info-subtle rounded-3">
                      <span class="text-primary">${contactData[i].group}</span>
                      </span>`;
    }
    temp += `<div class="col-12 col-md-6">
              <div class="border rounded-4 shadow my-3">
                <div class="bg-white p-3 rounded-top-4">
                <div class="mb-3">
                  <h3 class="fs-5 fw-bold">${contactData[i].fullName}</h3>
                  <div class="d-flex align-items-center gap-3">
                    <span class="bg-info-subtle rounded-3 p-1"><i class="fa-solid fa-phone text-primary"></i></span>
                    <p class="text-secondary m-0">${contactData[i].phone}</p>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="d-flex align-items-center gap-3 mb-2">
                    <div class="bg-warning p-1 rounded-3"><i class="fa-solid fa-envelope text-warning-emphasis"></i></div>
                    <span>${contactData[i].email}</span>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <span>${addressHide}</span>
                  </div>
                </div>
                <span>
                  ${groupHide}
                </span>
              </div>
              <div class="bg-light rounded-bottom-4 p-3 d-flex align-items-center justify-content-between">
                <div>
                  <a href="tel:${contactData[i].phone}" class="bg-warning p-1 rounded-3"><i class="fa-solid fa-phone text-warning-emphasis"></i></a>
                  <a href="mailto:${contactData[i].email}" class="bg-danger p-1 rounded-3 ms-3"><i class="fa-solid fa-envelope text-danger-emphasis"></i></a>
                </div>
                <div>
                  <button onclick="toggleFavorite(${i})">
                    <i class="fa-${contactData[i].favorite ? "solid" : "regular"} fa-star ${contactData[i].favorite ? "text-warning" : ""}"></i>
                  </button>
                  <button onclick="toggleEmergency(${i})">
                    <i class="fa-${contactData[i].emergency ? "solid" : "regular"} fa-heart ${contactData[i].emergency ? "text-danger" : ""}"></i>
                  </button>
                  <button onclick="handleEditContact(${i})" data-bs-toggle="modal" data-bs-target="#contactModal"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="handleDeleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
              </div>
            </div>`;
  }
  document.querySelector(".myData").innerHTML = temp;
  displayFavorites();
  displayEmergency();
  updateStats()
}
// Delete Contact
function handleDeleteContact(x) {
  Swal.fire({
  title: "Delete Contact?",
  text: `Are you sure you want to delete ${contactData[x].fullName}? This action cannot be undone.`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  cancelButtonText: "جدع",
  confirmButtonText: "افتكر اني قولتلك بلاش"
}).then((result) => {
  if (result.isConfirmed){
    contactData.splice(x, 1);
    localStorage.setItem("contacts", JSON.stringify(contactData));
    handleDisplay();
  };
});
}
// Search Contact
function handleSearch() {
  let searchValue = searchInput.value.toLowerCase();
  let temp = "";
  for (let i = 0; i < contactData.length; i++) {
    if (
      contactData[i].fullName.toLowerCase().includes(searchValue) ||
      contactData[i].phone.toLowerCase().includes(searchValue) ||
      contactData[i].email.toLowerCase().includes(searchValue) ||
      contactData[i].address.toLowerCase().includes(searchValue) ||
      contactData[i].group.toLowerCase().includes(searchValue)
    ) {
      temp += `<div class="col-12 col-md-6">
              <div class="border rounded-4 shadow my-3">
                <div class="bg-white p-3 rounded-top-4">
                <div class="mb-3">
                  <h3 class="fs-5 fw-bold">${contactData[i].fullName}</h3>
                  <div class="d-flex align-items-center gap-3">
                    <span class="bg-info-subtle rounded-3 p-1"><i class="fa-solid fa-phone text-primary"></i></span>
                    <p class="text-secondary m-0">${contactData[i].phone}</p>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="d-flex align-items-center gap-3 mb-2">
                    <div class="bg-warning p-1 rounded-3"><i class="fa-solid fa-envelope text-warning-emphasis"></i></div>
                    <span>${contactData[i].email}</span>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="bg-danger p-1 rounded-3"><i class="fa-solid fa-location-dot text-danger-emphasis"></i></div>
                    <span>${contactData[i].address}</span>
                  </div>
                </div>
                <span class="mb-3 p-2 bg-info-subtle rounded-3">
                  <span class="text-primary">${contactData[i].group}</span>
                </span>
              </div>
              <div class="bg-light rounded-bottom-4 p-3 d-flex align-items-center justify-content-between">
                <div>
                  <a href="tel:01008368475" class="bg-warning p-1 rounded-3"><i class="fa-solid fa-phone text-warning-emphasis"></i></a>
                  <a href="#" class="bg-danger p-1 rounded-3 ms-3"><i class="fa-solid fa-envelope text-danger-emphasis"></i></a>
                </div>
                <div>
                  <button><i class="fa-regular fa-star"></i></button>
                  <button><i class="fa-regular fa-heart"></i></button>
                  <button onclick="handleEditContact(${i})" data-bs-toggle="modal" data-bs-target="#contactModal"><i class="fa-solid fa-pen"></i></button>
                  <button onclick="handleDeleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>
              </div>
            </div>`;
    }
  }
  document.querySelector(".myData").innerHTML = temp;
}
searchInput.addEventListener("input", handleSearch);

// Edit & Update
let currentIndex;
function handleEditContact(index) {
  currentIndex = index;
  fullNameInput.value = contactData[index].fullName;
  phoneInput.value = contactData[index].phone;
  emailInput.value = contactData[index].email;
  addressInput.value = contactData[index].address;
  groupSelect.value = contactData[index].group;
}
function handleUpdateContact() {
  contactData[currentIndex].fullName = fullNameInput.value;
  contactData[currentIndex].phone = phoneInput.value;
  contactData[currentIndex].email = emailInput.value;
  contactData[currentIndex].address = addressInput.value;
  contactData[currentIndex].group = groupSelect.value;
  localStorage.setItem("contacts", JSON.stringify(contactData));

  handleDisplay();
}
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (currentIndex !== undefined && currentIndex !== null) {
    handleUpdateContact();
  } else {
    handleAddContact();
  }

  currentIndex = undefined;
});
// Favorite & Emergency
function toggleFavorite(index){
  contactData[index].favorite = !contactData[index].favorite;
  localStorage.setItem("contacts", JSON.stringify(contactData));
  handleDisplay();
}
function toggleEmergency(index){
  contactData[index].emergency = !contactData[index].emergency;
  localStorage.setItem("contacts", JSON.stringify(contactData));
  handleDisplay();
}
function displayFavorites(){
  let temp = '';
  for(let i = 0; i < contactData.length; i++){
    if(contactData[i].favorite === true){
      temp += `<div class="d-flex justify-content-between align-items-center border rounded-3 p-2 mb-2">
                <div>
                  <h6 class="fw-bold">${contactData[i].fullName}</h6>
                  <p class="text-secondary m-0">${contactData[i].phone}</p>
                </div>
                <a href="tel:${contactData[i].phone}" class="bg-info-subtle p-1 rounded-2">
                  <i class="fa-solid fa-phone text-primary"></i>
                </a>
              </div>`;
    }
  }
  document.querySelector(".favoritesBody").innerHTML = temp;
}
function displayEmergency(){
  let temp = '';
  for(let i = 0; i < contactData.length; i++){
    if(contactData[i].emergency === true){
      temp += `<div class="d-flex justify-content-between align-items-center border rounded-3 p-2 mb-2">
                <div>
                  <h6 class="fw-bold">${contactData[i].fullName}</h6>
                  <p class="text-secondary m-0">${contactData[i].phone}</p>
                </div>
                <a href="tel:${contactData[i].phone}" class="bg-info-subtle p-1 rounded-2">
                  <i class="fa-solid fa-phone text-primary"></i>
                </a>
              </div>`;
    }
  }
  document.querySelector(".emergencyBody").innerHTML = temp;
}
// Update State
function updateStats(){
  let totalCount = contactData.length;
  let favoriteCount = 0;
  let emergencyCount = 0;
  for(let i = 0; i < contactData.length; i++){
    if(contactData[i].favorite === true){
      favoriteCount++;
    }
    if(contactData[i].emergency === true){
      emergencyCount++;
    }
  }
  document.querySelector("#total").textContent = totalCount;
  document.querySelector("#favorite").textContent = favoriteCount;
  document.querySelector("#emergency").textContent = emergencyCount;
}