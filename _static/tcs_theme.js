var i;
var contents = document.getElementsByClassName("content-collapse section");

for (i = 0; i < contents.length; i++) {
  if (contents[i].tagName.toLowerCase() == 'div') {
    var element = contents[i].children[0];
    var element_type = element.tagName.toLowerCase();
    var span_id;
    var spanElement;

    if (element_type == 'span') {
      span_id = element.id;
      element.id = "";
      element = contents[i].children[1];
      element_type = element.tagName.toLowerCase();
    }

    var btn = document.createElement("BUTTON");
    if (element_type.length == 2 && element_type[0] == 'h') {
      var newClass = 'clps' + element_type[1];
      contents[i].style.maxHeight = 0;

      btn.className += " " + newClass;
      btn.innerHTML = element.innerHTML;
      btn.className += " collapsible";
      btn.id = span_id;
      btn.setAttribute('aria-expanded', 'false');

      // Restablecer el estado de expansión/collapsado
      var savedState = localStorage.getItem(span_id);
      if (savedState) {
        btn.setAttribute('aria-expanded', savedState);
        if (savedState === 'true') {
          contents[i].style.maxHeight = contents[i].scrollHeight + "px";
        }
      }

      btn.addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        var isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Cambiar el valor de aria-expanded
        this.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
          content.style.maxHeight = 0;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }

        // Guardar el estado en localStorage
        localStorage.setItem(this.id, !isExpanded);
      });

      contents[i].parentNode.insertBefore(btn, contents[i]);
      contents[i].removeChild(element);
    }
  }
}

function addVersionDropdown(versions) {
  var versionContainer = document.createElement("div");
  versionContainer.className = "version-dropdown";
  versionContainer.style.margin = "10px";
  versionContainer.style.padding = "5px";

  var versionButton = document.createElement("BUTTON");
  versionButton.className = "collapsible";

  var versionText = document.createElement("span");
  versionText.className = "version-text";
  versionText.innerHTML = "ROS 2 Versions";

  var currentVersionText = document.createElement("span");
  currentVersionText.className = "current-version";

  var currentVersion = localStorage.getItem("ros2_version") || "Humble";
  currentVersionText.innerHTML = " (current: " + currentVersion + ")";

  versionButton.appendChild(versionText);
  versionButton.appendChild(currentVersionText);

  versionButton.style.width = "100%";
  versionButton.style.textAlign = "left";

  var versionList = document.createElement("div");
  versionList.className = "content";
  versionList.style.maxHeight = "0";
  versionList.style.overflow = "hidden";
  versionList.style.transition = "max-height 0.2s ease-out";

  versions.forEach(function(version) {
    var versionLink = document.createElement("a");
    versionLink.href = version.url;
    versionLink.innerHTML = version.name;
    versionLink.style.display = "block";
    versionLink.style.padding = "5px 0";
    versionLink.style.textDecoration = "none";
    versionLink.style.color = "black";

    versionLink.addEventListener("click", function(e) {
      e.preventDefault();
      localStorage.setItem("ros2_version", version.name);
      currentVersionText.innerHTML = " (current: " + version.name + ")";
      versionList.style.maxHeight = "0";
      updateSidebarLinks(version.name);

      setTimeout(function() {
        window.location.href = version.url;
      }, 200);
    });

    versionList.appendChild(versionLink);
  });

  versionButton.addEventListener("click", function() {
    this.classList.toggle("active");
    if (versionList.style.maxHeight != "0px") {
      versionList.style.maxHeight = "0";
    } else {
      versionList.style.maxHeight = versionList.scrollHeight + "px";
    }
  });

  versionContainer.appendChild(versionButton);
  versionContainer.appendChild(versionList);

  var sidebar = document.querySelector(".wy-side-scroll");
  if (sidebar) {
    sidebar.appendChild(versionContainer);
  }
}

function updateSidebarLinks(version) {
  var sidebarLinks = document.querySelectorAll(".wy-side-scroll a");

  sidebarLinks.forEach(function(link) {
    var url = new URL(link.href);
    var pathParts = url.pathname.split('/');

    if (version === "Humble") {
      if (url.pathname !== '/index.html' && !url.pathname.includes("humble")) {
        url.pathname = '/index.html';
      }
    } else if (version !== "Humble" && !url.pathname.includes(version.toLowerCase())) {
      pathParts[1] = version.toLowerCase();
      url.pathname = pathParts.join('/');
    }

    link.href = url.toString();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var currentVersion = localStorage.getItem("ros2_version") || "Humble";
  updateSidebarLinks(currentVersion);
});

addVersionDropdown([
  { name: "Humble", url: "https://unitree-go2-robot.github.io/index.html" },
  { name: "Foxy", url: "https://unitree-go2-robot.github.io/foxy/index.html" }
]);
