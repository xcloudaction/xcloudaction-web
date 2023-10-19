"use strict";

// Floating Header Effect
window.addEventListener("scroll", function(event) {
  if (window.scrollY > 0 && (document.body.clientHeight > window.innerHeight)) {
    document.querySelector("header").classList.add("floating");
  } else {
    document.querySelector("header").classList.remove("floating");
  }
})

// Mobile Navigation Toggle
function toggleNavigation() {
  if (document.body.classList.contains("sidebar-enabled")) {
    document.body.classList.remove("sidebar-enabled");
  } else {
    document.body.classList.add("sidebar-enabled");
  }
}

// YouTube Video

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'LmtKeKRd5kk',
    playerVars: {
      'playsinline': 1,
      'modestbranding': 1
    },
  });
  
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get("showVideo")) {
    showVideo();
  }
}

function showVideo() {
  document.getElementById("video-container").style.display = null;
  player.playVideo();
  
  // Stop the navigation to the YouTube link
  event.preventDefault();
}

function dismissVideo() {
  player.stopVideo();
  document.getElementById("video-container").style.display = "none";
}

// Signup Form

document.addEventListener("DOMContentLoaded", function() {
  var forms = document.querySelectorAll(".waitlist-form");
  for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    form.addEventListener("submit", submitSignupForm);
  }
});

function submitSignupForm(event) {
  event.preventDefault();

  var form = event.target;

  if (form.hp.value.length) return;

  form.querySelector(".spinner").style.visibility = "visible";

  fetch("/api/v1/listSignup", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ 
      email: form.email.value,
      beta_access: true,
      source: "website"
    }),
  })
  .then(async response => {
    var body = await response.json();
    if (response.ok) {
      if (response.status === 200) {
        showReturningUserSuccess(form.email.value);
      } else {
        // 201 CREATED or any other 2xx code
        showNewUserConfirmation(form.email.value);
      }
    } else {
      showSignupError("Unable to Subscribe", body.message);
    }
  })
  .catch(error => {
    showSignupError("Connection Error", error.message);
  })
  .finally(() => {
    form.querySelector(".spinner").style.cssText = null;
  });
}

function showReturningUserSuccess(email) {
  var html = "<h1>Welcome back!</h1>";
  html += "<p><code>" + email + "</code></p>";
  html += "<p>You’re already subscribed to the Mimestream mailing list.</p>";
  
  let div = document.createElement("DIV");
  div.innerHTML = html
  swal({
    icon: "success",
    content: div,
    button: "OK"
  });
}

function showNewUserConfirmation(email) {
  var html = "<h1>We sent you a confirmation!</h1>";
  html += "<p><code>" + email + "</code></p>";
  html += "<p>Please check your email for confirmation message. After you confirm your address, you’ll be on our mailing list.</p>";

  let div = document.createElement("DIV");
  div.innerHTML = html
  swal({
    icon: "success",
    content: div,
    button: "OK"
  })
}

function showSignupError(title, message) {
  var html = "<h1>" + title + "</h1>";
  html += "<p>" + message + "</p>";
  html += "<br/><br/><small>Need help? Email <a href=\"mailto:support@mimestream.com\">support@mimestream.com</a></small>";

  let div = document.createElement("DIV");
  div.innerHTML = html
  swal({
    icon: "error",
    content: div
  });
}
