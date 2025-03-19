var i;
var contents = document.getElementsByClassName("content-collapse section");

for (i = 0; i < contents.length; i++) {
  //Make sure the "content-collapse section" class is occurring in <div>
  if (contents[i].tagName.toLowerCase() == 'div') {
    var element = contents[i].children[0];
    var element_type = element.tagName.toLowerCase();
    var span_id;
    var spanElement;

    //if the next element is a span grab the id and skip to the header
    if (element_type == 'span') {
      span_id = element.id;
      element.id = "";
      element = contents[i].children[1];
      element_type = element.tagName.toLowerCase();
    }

    var btn = document.createElement("BUTTON");
    //If it is a header capture which level and pass on to button
    if (element_type.length == 2 && element_type[0] == 'h') {
      var newClass = 'clps' + element_type[1];
      //collapses the section by default only if javascript is working
      contents[i].style.maxHeight = 0;
      //Build the button and define behavior
      btn.className += " " + newClass;
      btn.innerHTML = element.innerHTML;
      btn.className += " collapsible";
      btn.id = span_id;
      btn.addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight != "0px") {
          content.style.maxHeight = 0;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });

      //Add the button to the page and remove the header
      contents[i].parentNode.insertBefore(btn, contents[i]);
      contents[i].removeChild(element);
    } else {
      //reset span id if it isn't followed by Hx element
      spanElement.id = span_id;
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

  // Obtener la versión actual desde el almacenamiento local o usar "Humble" como predeterminada
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
    versionLink.style.color = "white";

    versionLink.addEventListener("click", function() {
      // Guardar la versión actual en el almacenamiento local
      localStorage.setItem("ros2_version", version.name);
      currentVersionText.innerHTML = " (current: " + version.name + ")";
      versionList.style.maxHeight = "0";
      updateSidebarLinks(version.name);  // Actualizar enlaces al cambiar de versión
      window.location.href = version.url;
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
  var savedVersion = localStorage.getItem("ros2_version") || "Humble";

  if (savedVersion === version) {
    return; 
  }
  var sidebarLinks = document.querySelectorAll(".wy-side-scroll a");
  console.log("Versión actual: " + version); 
  console.log("Número de enlaces encontrados: " + sidebarLinks.length);

  sidebarLinks.forEach(function(link) {
    console.log("Enlace original: " + link.href); 

    var url = new URL(link.href);
    var pathParts = url.pathname.split('/');

    if (version === "Humble") {
      if (!url.pathname.endsWith('index.html')) {
        url.pathname = '/index.html'; 
      }
    }
    else if (version !== "Humble" && !url.pathname.includes(version.toLowerCase())) {
      pathParts[1] = version.toLowerCase(); 
      url.pathname = pathParts.join('/');
    }

    link.href = url.toString();
    console.log("Enlace actualizado: " + link.href);  //
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