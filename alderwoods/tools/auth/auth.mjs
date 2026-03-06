//tools/auth/auth.mjs
import { fetchproducts, logoutmeout, updateCartUI, fetchuserdata, fetchAllUsers } from './userinfo.mjs';
import { renderCheckout, totalproduce, alldeletables } from './order.mjs';
export const BACKENDURL = 'https://alderwoodserver.onrender.com';


const forgotform = document.getElementById('forgotform');
const forgotemail = document.getElementById('forgotemail');
const forgotbtn = document.getElementById('forgotbtn');
const forgotcode = document.getElementById('forgotcode');
const forgotpass = document.getElementById('forgotpass');
const reset = document.querySelectorAll('.reset');
const resetemail = document.querySelectorAll('.resetemail');

const contactForm = document.getElementById('contactForm');
const conname = document.getElementById('name');
const conemail = document.getElementById('email');
const conmessage = document.getElementById('message');
const contactbtn = document.getElementById('subbtn');

const Newsletterform = document.getElementById('Newsletterform');
const subemail = document.getElementById('subemail');

const hide = document.querySelectorAll('.userinfo');
const shows = document.querySelectorAll('.userdata');
const showsadmin = document.querySelectorAll('.admindata');
const logout = document.getElementById("logout");


const errobox = document.getElementById('errobox');
const errotype = document.getElementById('errotype');
const errormessage = document.getElementById('erromessage');
const close = document.getElementById('close');
const googlebtn = document.querySelectorAll('.custom-google-btn');

  const modal = document.getElementById('fancy-auth-modal');
  const openBtn = document.getElementById('fancy-auth-open-btn');
  const closeBtn = document.getElementById('fancy-auth-close');
  const toggleLink = document.getElementById('fancy-auth-toggle-link');
  const title = document.getElementById('fancy-auth-title');
  const submitBtn = document.getElementById('fancy-auth-submit');
  const authform = document.getElementById('fancy-auth-form');
  const signupExtraFields = document.getElementById('fancy-auth-signup-extra');

  const fullnameInput = document.getElementById('fancy-auth-fullname');
  const genderInput = document.getElementById('fancy-auth-gender');
  const emailInput = document.getElementById('fancy-auth-email');
  const passwordInput = document.getElementById('fancy-auth-password');

  const popname = document.getElementById("popname");
  const secondpopname = document.getElementById("secondpopname");
  const togglePassword = document.getElementById("togglePassword");
   
export function popsignup(){
setTimeout(() => {
modal.style.display = 'flex';
}, 3000)

localStorage.setItem("hasclosedsignup", "false")
}

function closedesignup(){
modal.style.display = 'none';
localStorage.setItem("hasclosedsignup", "true")
}

function hideall() {
    shows.forEach(el => el.style.display = 'block');
    hide.forEach(el => el.style.display = 'none');
}

function showadminall() {
    showsadmin.forEach(el => el.style.display = 'block');
}


  let isLogin = true;

  function toggleAuthMode() {
    isLogin = !isLogin;
    title.textContent = isLogin ? 'Login' : 'Sign Up';
    submitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
    signupExtraFields.style.display = isLogin ? 'none' : 'block';
  

    document.querySelector('.fancy-auth-toggle').innerHTML =
      isLogin
        ? `Don't have an account? <a id="fancy-auth-toggle-link" style="color: blue;">Sign up</a>`
        : `Already have an account? <a id="fancy-auth-toggle-link" style="color: blue;">Login</a>`;

    // Reattach the toggle event
    document.getElementById('fancy-auth-toggle-link').addEventListener('click', toggleAuthMode);
  }

  // Modal controls
  document.getElementById('fancy-auth-open-btn')?.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  if(togglePassword) {
 
  togglePassword.addEventListener("click", function() {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("bi-eye");
    this.classList.toggle("bi-eye-slash");
  });
  }

  if(closeBtn) {
 
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    closedesignup();
  });

  }

  if(toggleLink) toggleLink.addEventListener('click', toggleAuthMode);

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });


async function checksession() {
  
   let withproperty = localStorage.getItem("withproperty");

  if (withproperty === "true") {
    console.log("Waiting 1 second before continuing session check...");
    await new Promise(resolve => setTimeout(resolve, 10000)); // wait 1 second
    localStorage.setItem("withproperty", "false");
  }

  try {
    const res = await fetch(`${BACKENDURL}/session`, {
      credentials: 'include',
      headers: { 'X-Request-Path': location.pathname },
    });

    const data = await res.json();
    const user = data.user;
    const currentPath = window.location.pathname;

    if (!user) {
        if (currentPath.includes("/tools/profile/ceo/") && currentPath.includes("/tools/profile/")) {
           window.location.href = "../../../index.html";
           return;
           }
      return null; 
    }


    // ✅ Redirect to owners.html if user has properties
    if (user.hasProperties && !currentPath.includes("/tools/profile/")) {
    // Example: prevent redirect if already on the checkout page
    if (currentPath.includes("/tools/profile/")) {
      window.location.href = "./owners.html";
      return;
    }

    if (!currentPath.includes("/tools/profile/")) {
      window.location.href = "./tools/profile/owners.html";
      return;
    }
      return; // Stop further execution
    }

    // Show dashboard logic for users without properties
    hideall();
    await fetchuserdata();
    await updateCartUI();
    await renderCheckout();

       if (popname) {
       popname.textContent = "hi 👋" + user.fullname || "No name";
        shows.forEach(el => el.style.display = 'none');
       setTimeout( () => {
        shows.forEach(el => el.style.display = 'block');
       popname.textContent = "Alderwood";
       }, 1500); 
     
      }

       if (popname) {
       secondpopname.textContent = "hi 👋" + user.fullname || "No name";
      }
    if (user.role === "admin") {
      await fetchAllUsers();
      showadminall();
      await alldeletables();
    } else {
        if (currentPath.includes("/tools/profile/ceo/")) {
      window.location.href = "../../../index.html";
      return;
    }
    }

    return user;

  } catch (err) {
    console.error("Error checking session:", err);
    return null;
  }
}


function closebox() {
errobox.style.display = "none";
errotype.textContent = " ";
errormessage.textContent = " ";
}
 if (close) { 
close.addEventListener('click', () => {
closebox();
});
}


function displayerror(errtype, message ) {
errobox.style.display = "block";
errotype.textContent = errtype;
errormessage.textContent = message;

 if (errtype.toLowerCase() === "success") {
    errotype.style.color = "green";
  } else if (errtype.toLowerCase() === "failed") {
    errotype.style.color = "red";
  } else {
    errotype.style.color = "black"; 
  }
}

window.addEventListener('DOMContentLoaded', async () => {
let hasclosedsignup = localStorage.getItem("hasclosedsignup");
if (hasclosedsignup === "false") {
  popsignup();
}


    const totalproducts = document.getElementById('totalproducts');
      if (totalproducts) {
          totalproduce();
       } 
   // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab"); // e.g., "settings"

    if(tab) {
        // Find the tab button and the corresponding tab content
        const tabButton = document.querySelector(`#dashboardTabs button[data-bs-target="#${tab}"]`);
        const tabContent = document.querySelector(`#${tab}`);

        if(tabButton && tabContent) {
            // Activate the selected tab using Bootstrap Tab API
            const bootstrapTab = new bootstrap.Tab(tabButton);
            bootstrapTab.show();
        }
    }

let visitorId = localStorage.getItem("visitorId");  
let verified = localStorage.getItem("verified");
const closedmodal = localStorage.getItem("closed");
const closemodal = document.querySelectorAll(".closemodal");

if(closedmodal !== "true" ){ 
if(verified === "true"){ 
  
   const advertModal = document.getElementById('solarAdvert');
   if(advertModal) {
   const modalel = new bootstrap.Modal(advertModal);
    modalel.show();
   }

    closemodal.forEach(closebtn => {
    closebtn.addEventListener("click", () => {
      localStorage.setItem("closed", "true")
      modalel.hide();
      fetch(`${BACKENDURL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: localStorage.getItem('visitorId') })
      }).catch(err => console.error('Failed to record modal close', err));

    })
    });  
}
}

if(verified !== "true" || closedmodal == null){ 
  //visitors records
   fetch(`${BACKENDURL}/Visitorsinfo`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(async (res) => {
    const text = await res.text();
    try {
      const data = JSON.parse(text); 
      if (data.success) {
          if (!visitorId) {
            visitorId = crypto.randomUUID(); // modern browsers
            localStorage.setItem("visitorId", visitorId);
          }
        localStorage.setItem("verified", "true");
        console.log('hey dude, welcome to the server, what ever was your intension, we are ready for you ');
      } else {
                  if (!visitorId) {
            visitorId = crypto.randomUUID(); // modern browsers
            localStorage.setItem("visitorId", visitorId);
          }
        localStorage.setItem("verified", "true");
        console.log('welcome my goodman, what the fuck are you looking for');
      }
    } catch (err) {
      console.error('there was an error please check, your internet connection');
    }
  })
  .catch((err) => {
     // Response
    console.error("there was an error please check, your internet connection", err);
  });
}

  await checksession();
  await fetchproducts();



  if (logout) {
  logout.addEventListener('click', (e) => {
    e.preventDefault();
    logoutmeout();
    checksession();
  });
}


const form = document.getElementById("productForm");
const message = document.getElementById("message");
const imageInput = document.getElementById("image");
const previewContainer = document.getElementById("imagePreview");
const propertyBtn = document.getElementById("propertyBtn");

// Keep selected files in memory
let selectedImages = [];

// 🔁 Load from localStorage (if any)
const stored = localStorage.getItem("pendingUploads");
if (stored) {
  try {
    selectedImages = JSON.parse(stored);
    renderPreviewsFromStorage();
  } catch {}
}

// 🖼️ File selection
if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    const newFiles = Array.from(event.target.files);
    if (!newFiles.length) return;

    // Convert File → Base64 + store both name & data for persistence
    newFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        selectedImages.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target.result, // Base64 for preview
          file, // Keep original File object
        });
        saveToStorage();
        renderPreviews();
      };
      reader.readAsDataURL(file);
    });

    // Clear input so the same file can be re-selected later
    imageInput.value = "";
  });
}

// 💾 Save current previews to localStorage
function saveToStorage() {
  const lightweight = selectedImages.map(({ name, size, type, data }) => ({
    name, size, type, data,
  }));
  localStorage.setItem("pendingUploads", JSON.stringify(lightweight));
}

// 🔄 Render previews (from in-memory list)
function renderPreviews() {
  previewContainer.innerHTML = "";
  selectedImages.forEach((imgObj, index) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("position-relative", "m-2");
    wrapper.style.width = "120px";
    wrapper.style.height = "120px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.overflow = "hidden";
    wrapper.style.border = "1px solid #ccc";

    const img = document.createElement("img");
    img.src = imgObj.data;
    img.alt = imgObj.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    const removeBtn = document.createElement("span");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add(
      "position-absolute", "top-0", "end-0", "bg-dark", "text-white"
    );
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "20px";
    removeBtn.style.height = "20px";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.cursor = "pointer";

    removeBtn.addEventListener("click", () => {
      selectedImages.splice(index, 1);
      saveToStorage();
      renderPreviews();
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });

  // Rebuild <input>.files so it contains all current File objects
  const dt = new DataTransfer();
  selectedImages.forEach((img) => {
    if (img.file) dt.items.add(img.file);
  });
  imageInput.files = dt.files;
}

// 🧾 Render previews from storage on page load
function renderPreviewsFromStorage() {
  previewContainer.innerHTML = "";
  selectedImages.forEach((imgObj) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("position-relative", "m-2");
    wrapper.style.width = "120px";
    wrapper.style.height = "120px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.overflow = "hidden";
    wrapper.style.border = "1px solid #ccc";

    const img = document.createElement("img");
    img.src = imgObj.data;
    img.alt = imgObj.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    const removeBtn = document.createElement("span");
    removeBtn.innerHTML = "&times;";
    removeBtn.classList.add(
      "position-absolute", "top-0", "end-0", "bg-dark", "text-white"
    );
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "20px";
    removeBtn.style.height = "20px";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.cursor = "pointer";

    removeBtn.addEventListener("click", () => {
      selectedImages = selectedImages.filter((f) => f.name !== imgObj.name);
      saveToStorage();
      renderPreviewsFromStorage();
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });
}

// 🧾 Form submission
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    propertyBtn.disabled = true;
    propertyBtn.textContent =  "uploading property please wait...." ;


    try {
      const user = await checksession();
      if (!user || user.role !== "admin") {
        propertyBtn.disabled = false;
        propertyBtn.textContent =  "Add Property" ;
        return displayerror("failed", "You are not authorized to add products.");
      }

      const formData = new FormData();
      formData.append("category", document.getElementById("category").value);
      formData.append("description", document.getElementById("description").value);
      formData.append("price", document.getElementById("price").value);
      formData.append("location", document.getElementById("location").value);

      // append real File objects only
      selectedImages.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });

      const res = await fetch(`${BACKENDURL}/uploadproducts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        propertyBtn.disabled = false;
        propertyBtn.textContent =  "Add Property" ;
        displayerror("success", "Property uploaded successfully!");
        form.reset();
        previewContainer.innerHTML = "";
        localStorage.removeItem("pendingUploads");
        selectedImages = [];
        fetchproducts();
        setTimeout(() => {
          window.location.href = "../../property.html";
        }, 3000);
      } else {
        propertyBtn.disabled = false;
        propertyBtn.textContent =  "Add Property" ;
        displayerror("failed", data.message || "Error uploading Property");
        selectedImages = [];
      }
    } catch (err) {
      propertyBtn.disabled = false;
      propertyBtn.textContent =  "Add Property" ;
      console.error(err);
      displayerror("failed", "Server error, try again later");
      selectedImages = [];
    }
  });
}


if (authform) {

    // Form submit handler
  authform.addEventListener('submit', async function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = isLogin ? "Logging you in..." : "Signing you up, please wait...";


    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      submitBtn.disabled = false;
      submitBtn.textContent = isLogin ? "Login" : "Sign Up";
      displayerror('failed','Email and password are required.');
      return;
    }

    if (!isLogin) {
      const fullname = fullnameInput.value.trim();
      const gender = genderInput.value;

      if (!fullname || !gender) {
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? "Login" : "Sign Up";
        displayerror('failed','Please fill in all signup fields.');
        return;
      }

        // ✅ Fullname validation: Two words, each starting with a capital letter
    const nameParts = fullname.split(' ');
    const nameIsValid = (nameParts.length === 2 || nameParts.length === 3) &&
    nameParts.every(part => /^[A-Z][a-z]+$/.test(part));

    if (!nameIsValid) {
      submitBtn.disabled = false;
      submitBtn.textContent = isLogin ? "Login" : "Sign Up";
      return displayerror("failed", "Full name must include first name and last name, each starting with a capital letter. middle name is optionaal, each starting with a capital letter (e.g., 'John Doe or Serah Smith Amah ').");
    }

      // Signup Request
        try {
    const response = await fetch(`${BACKENDURL}/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, gender, password }),
    });

        const data = await response.json();
        const message = data?.message || (data?.errors && Object.values(data.errors).join(', ')) || data?.error || 'Signup failed';
           
        if (!response.ok) {
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
          displayerror('failed', message);
        } else {
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
          modal.style.display = 'none';
          displayerror('success', data.message || 'Signup successful');
          console.log('Signup successful:', data);
        }
      } catch (err) {
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
        displayerror('failed','Network error during signup.');
      }
    } else {
      // Login Request
        try {
      const response = await fetch(`${BACKENDURL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

        const data = await response.json();

        if (!response.ok) {
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
          displayerror('failed', data.error || data.message || 'Login failed');
        localStorage.setItem('hasLoggedInBefore', 'false');
        } else {
           checksession();
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
          modal.style.display = 'none';
          displayerror('success', 'Login successful:', data);
          console.log('Login successful:', data);
          localStorage.setItem('hasLoggedInBefore', 'true');
        }
      } catch (err) {
        
           submitBtn.disabled = false;
           submitBtn.textContent = isLogin ? "Login" : "Sign Up";
        displayerror('failed','Network error during login.');
      }
    }
  });
}


if(googlebtn){ 
   googlebtn.forEach(gbtn => {
    gbtn.addEventListener("click", () => {
      try {
    const currentPath = window.location.pathname;
    window.location.href = `${BACKENDURL}/auth/google?from=${encodeURIComponent(currentPath)}`;
    localStorage.setItem('hasLoggedInBefore', 'true');
  } catch (error) {
    localStorage.setItem('hasLoggedInBefore', 'false');
    console.error('Error during Google sign-in:', error);
  }
    });
    });
}
const identityForm = document.getElementById("identityForm");

if (identityForm) {
  identityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const body = Object.fromEntries(formData.entries());

    const gfullname = body.fullname?.trim();
    const ggender = body.gender?.trim();

    // Basic validation
    if (!gfullname || !ggender) {
      displayerror("failed", "Please fill in all signup fields.");
      return;
    }

    // ✅ Full name validation: first + last (optional middle) with capital letters
    const nameParts = gfullname.split(" ");
    const nameIsValid =
      (nameParts.length === 2 || nameParts.length === 3) &&
      nameParts.every((part) => /^[A-Z][a-z]+$/.test(part));

    if (!nameIsValid) {
      displayerror(
        "failed",
        "Full name must include first and last name (middle optional), each starting with a capital letter. e.g., 'John Doe' or 'Serah Smith Amah'."
      );
      return;
    }

    try {
      const res = await fetch(`${BACKENDURL}/auth/complete-google-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        displayerror("success", "Profile completed successfully! Redirecting...");
        setTimeout(() => (window.location.href = "../../index.html"), 1500);
      } else {
        displayerror("failed", data.message || "Something went wrong. Please try again.");
         setTimeout(() => (window.location.href = "../../index.html"), 1500);
      }
    } catch (error) {
      console.error("❌ Signup completion error:", error);
      displayerror("failed", "Network error. Please check your connection.");
    }
  });
}


 let step = 1;
let email = "";  // <-- store email

if(forgotform){ 
  forgotform.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (step === 1) {
      email = forgotemail.value.trim();  // save email
      if (!email) return displayerror('failed', 'Please provide an email');

      forgotbtn.textContent = 'Processing...';
      forgotbtn.disabled = true;

      try {
        const res  = await fetch(`${BACKENDURL}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error sending link. please try again later');

        displayerror('success', 'Verification email sent. Check your spam folder if needed.');
     
        resetemail.forEach(el => el.style.display = 'none');
        reset.forEach(el => el.style.display = 'block');

        step = 2;
        forgotbtn.textContent = 'Reset Password';
      } catch (err) {
        displayerror('failed', err.message);
        forgotbtn.textContent = 'Reset';
        forgotbtn.disabled = false;
      } finally {
        forgotbtn.textContent = 'Send Code';
        forgotbtn.disabled = false;
      }

    } else {
      // Step 2: email is now available from Step 1
      const code = forgotcode.value.trim();
      const password = forgotpass.value.trim();
      if (!code || !password) return displayerror('failed', 'Please provide code and new password');

      forgotbtn.textContent = 'Processing...';
      forgotbtn.disabled = true;

      try {
        const res = await fetch(`${BACKENDURL}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code, newPassword: password })  // match backend
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error changing password');

        displayerror('success', 'Password changed successfully');
        closedesignup();
      } catch (err) {
        displayerror('failed', err.message);
        forgotbtn.disabled = false;
        forgotbtn.textContent = 'Reset Password';
      }
    }
  });
}




if(contactForm){
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  contactbtn.disabled = true;
  contactbtn.textContent = "sending message please wait....";
  
   if (!conname || !conemail || !conmessage) {
       contactbtn.disabled = false;
      contactbtn.textContent = "Send Message";
      displayerror("failed", "Please fill in all fields.");
      return;
    }

  const name = conname.value.trim();
   const email = conemail.value.trim();
   const message = conmessage.value.trim();
   

     try {
      const response = await fetch(`${BACKENDURL}/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        contactbtn.disabled = false;
      contactbtn.textContent = "Send Message";
        displayerror(
          "success", 
          "Your request has been submitted successfully. We'll reply via email or in-app notification."
        );
         setTimeout(() => {
           window.location.reload();
         }, 5000);
       
      } else {
        contactbtn.disabled = false;
      contactbtn.textContent = "Send Message";
       displayerror("failed", data?.error || "Something went wrong.");
      }
    } catch (error) {
      contactbtn.disabled = false;
      contactbtn.textContent = "Send Message";
     displayerror("failed", "Please check your internet connection.");
    } finally {
      contactbtn.disabled = false;
      contactbtn.textContent = "Send Message";
    }

  });
}



if (Newsletterform) {
  Newsletterform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subbtn = document.querySelector("#subbtn"); 

    subbtn.disabled = true;
    if (!subemail || !subemail.value.trim()) {
      displayerror("failed", "please input email");
      subbtn.disabled = false;
      return;  // <-- important: stop here if no email
    }

    const email = subemail.value.trim();

    try {
      const res = await fetch(`${BACKENDURL}/newsletter`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        displayerror("success", "Thank you for subscribing to our newsletter");
      } else {
        // handle non-ok responses (like 400)
        const errors = await res.json();
        displayerror("failed", errors.message || "Subscription failed");
      }
    } catch (err) {
      displayerror("failed", "There was an error subscribing to our newsletter, please check your internet");
    } finally {
      subbtn.disabled = false;
    }
  });
}



     // ✅ get the file input *after* avatar markup is rendered
  const fileInput = document.getElementById("avatar-upload");
  const cameraBtn = document.getElementById("avatar-camera-btn");
  const avatarImg = document.getElementById("avatar-img");

  if(cameraBtn){ 
  cameraBtn.addEventListener("click", () => fileInput.click());
 }

 if (fileInput) {
  fileInput.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;

    // preview
    const reader = new FileReader();
    reader.onload = () => { avatarImg.src = reader.result; };
    reader.readAsDataURL(file);

    // upload to backend
    const formData = new FormData();
    formData.append("profileimg", file);

    try {
      const res = await fetch(`${BACKENDURL}/amauser/update`, {
        method: "PUT",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        displayerror("success", "Profile updated successfully");
        fetchuserdata();
      } else {
        displayerror("failed", data.message || "Error updating profile");
      }
    } catch (err) {
      console.error("Update failed:", err);
      displayerror("failed", "Network error while updating profile");
    }
  });
}



// Update user info
const updateinfo = document.getElementById("settings-form");
if (updateinfo) {
  updateinfo.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ✅ Only append non-empty values
    const nameVal = document.getElementById("settings-name")?.value.trim();
    if (nameVal) formData.append("name", nameVal);

    const oldPasswordVal = document.getElementById("settings-old-password")?.value.trim();
const newPasswordVal = document.getElementById("settings-new-password")?.value.trim();

if (oldPasswordVal && newPasswordVal) {
  formData.append("oldPassword", oldPasswordVal);
  formData.append("newPassword", newPasswordVal);
}

    // 🚨 If nothing was added, stop request
    if (![...formData.keys()].length) {
      displayerror("failed", "Please update at least one field before saving.");
      return;
    }

    try {
      const response = await fetch(`${BACKENDURL}/amauser/update`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        displayerror("success", "Profile updated successfully");
        fetchuserdata(); // refresh UI
      } else {
        displayerror("failed", data.message || "Error updating profile");
      }
    } catch (err) {
      console.error("Update failed:", err);
      displayerror("failed", "Network error while updating profile");
    }
  });
}

// Delete account
const deletemyacount = document.getElementById("delete-account");

if(deletemyacount){ 
deletemyacount.addEventListener("click", async () => {
  if (!confirm("⚠️ Are you sure you want to delete your account? This cannot be undone!")) return;

  try {
    const response = await fetch(`${BACKENDURL}/amauser/delete`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      alert("Your account has been deleted. Logging out...");
      window.location.href = "/"; // redirect to homepage/login
    } else {
      displayerror("failed", data.message || "Error deleting account");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    displayerror("failed", "Network error while deleting account");
  }
}); 
}





});


export { checksession, displayerror };

