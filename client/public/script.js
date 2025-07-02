const complaintBox = document.getElementById("complaint");
const resultDiv = document.getElementById("result");
const micButton = document.getElementById("mic");
const locationDisplay = document.getElementById("location");
const imageInput = document.getElementById("image");

let userLatitude = null;
let userLongitude = null;
let selectedImage = null;

// 🌐 Translate to English
async function translateToEnglish(text) {
  const res = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "auto",
      target: "en",
      format: "text"
    })
  });
  const data = await res.json();
  return data.translatedText;
}

// 🧠 Send complaint to FastAPI
async function sendComplaint() {
  const originalText = complaintBox.value.trim();
  if (!originalText) {
    resultDiv.innerText = "Please enter a complaint.";
    return;
  }

  let translatedText = originalText;
  try {
    translatedText = await translateToEnglish(originalText);
  } catch (err) {
    console.warn("Translation failed, sending original text.");
  }

  const formData = new FormData();
  formData.append("text", translatedText);
  if (userLatitude) formData.append("latitude", userLatitude);
  if (userLongitude) formData.append("longitude", userLongitude);
  if (selectedImage) formData.append("image", selectedImage);

  try {
    const response = await fetch(" https://civic-complaint-ai.onrender.com", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    resultDiv.innerText = `🗂️ Category: ${data.category}`;
  } catch (err) {
    console.error("API error:", err);
    resultDiv.innerText = "🚨 Error submitting complaint.";
  }
}

// 🎤 Voice recognition
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";

  micButton.addEventListener("click", () => {
    recognition.start();
    micButton.innerHTML = "<i class='fas fa-microphone'></i> Listening...";

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      complaintBox.value = spoken;
      micButton.innerHTML = "<i class='fas fa-microphone'></i> Speak Complaint";
    };

    recognition.onerror = () => {
      micButton.innerHTML = "<i class='fas fa-microphone'></i> Speak Complaint";
    };
  });
} else {
  micButton.disabled = true;
  micButton.innerText = "🎤 Not Supported";
}

// 📍 Get Geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;
      locationDisplay.innerText = `📍 Lat: ${userLatitude.toFixed(5)}, Lon: ${userLongitude.toFixed(5)}`;
    }, () => {
      locationDisplay.innerText = "⚠️ Unable to get location.";
    });
  } else {
    locationDisplay.innerText = "Geolocation not supported.";
  }
}

// 📸 Image selection
imageInput.addEventListener("change", () => {
  selectedImage = imageInput.files[0];
});
