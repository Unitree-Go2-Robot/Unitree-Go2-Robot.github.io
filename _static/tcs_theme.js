// Función para colapsar secciones de contenido
var i;
var contents = document.getElementsByClassName("content-collapse section");

for (i = 0; i < contents.length; i++) {

  // Asegurarse de que la clase "content-collapse section" está en un <div>
  if (contents[i].tagName.toLowerCase() == 'div') {
    var element = contents[i].children[0];
    var element_type = element.tagName.toLowerCase();
    var span_id;
    var spanElement;

    // Si el siguiente elemento es un <span>, obtener el id y saltar al encabezado
    if (element_type == 'span') {
      span_id = element.id;
      element.id = "";
      element = contents[i].children[1];
      element_type = element.tagName.toLowerCase();
    }

    var btn = document.createElement("BUTTON");
    // Si es un encabezado, capturar el nivel y pasarlo al botón
    if (element_type.length == 2 && element_type[0] == 'h') {
      var newClass = 'clps' + element_type[1];
      // Colapsa la sección por defecto solo si el JS está activo
      contents[i].style.maxHeight = 0;
      // Construir el botón y definir el comportamiento
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

      // Añadir el botón a la página y eliminar el encabezado
      contents[i].parentNode.insertBefore(btn, contents[i]);
      contents[i].removeChild(element);
    } else {
      // Restablecer el id del span si no está seguido de un elemento Hx
      spanElement.id = span_id;
    }
  }
}

// Crear el desplegable de versiones en la barra lateral
function addVersionDropdown(versions) {
    // Crear el contenedor para el desplegable
    var versionContainer = document.createElement("div");
    versionContainer.className = "version-dropdown";
    versionContainer.style.margin = "10px";
    versionContainer.style.padding = "5px";

    // Crear el botón de desplegable
    var versionButton = document.createElement("BUTTON");
    versionButton.className = "collapsible";
    versionButton.innerHTML = "Versiones";
    versionButton.style.width = "100%";
    versionButton.style.textAlign = "left";

    // Crear la lista de versiones
    var versionList = document.createElement("div");
    versionList.className = "content";
    versionList.style.maxHeight = "0";
    versionList.style.overflow = "hidden";
    versionList.style.transition = "max-height 0.2s ease-out";

    // Añadir cada versión a la lista
    versions.forEach(function(version) {
        var versionLink = document.createElement("a");
        versionLink.href = version.url;
        versionLink.innerHTML = version.name;
        versionLink.style.display = "block";
        versionLink.style.padding = "5px 0";
        versionLink.style.textDecoration = "none";
        versionLink.style.color = "black";
        versionList.appendChild(versionLink);
    });

    // Añadir la funcionalidad de colapsado al botón
    versionButton.addEventListener("click", function() {
        this.classList.toggle("active");
        if (versionList.style.maxHeight != "0px") {
            versionList.style.maxHeight = "0";
        } else {
            versionList.style.maxHeight = versionList.scrollHeight + "px";
        }
    });

    // Añadir el botón y la lista al contenedor
    versionContainer.appendChild(versionButton);
    versionContainer.appendChild(versionList);

    // Insertar el contenedor en la barra lateral
    var sidebar = document.querySelector(".wy-side-scroll");
    if (sidebar) {
        sidebar.appendChild(versionContainer);
    }
}

// Llamar a la función con las versiones deseadas
addVersionDropdown([
    { name: "Rolling", url: "https://docs.ros.org/en/rolling/" },
    { name: "Humble", url: "https://docs.ros.org/en/humble/" },
    { name: "Foxy", url: "https://docs.ros.org/en/foxy/" },
]);

function switchVersion(version) {
  var baseUrl = window.location.origin + window.location.pathname;
  var newUrl = baseUrl.replace(/\/(humble|rolling|galactic|foxy)\//, '/' + version + '/');
  window.location.href = newUrl;
}

window.addEventListener('DOMContentLoaded', function () {
  var currentVersion = window.location.pathname.split('/')[1];
  var versionSelect = document.getElementById('version-select');
  if (versionSelect) {
      for (var i = 0; i < versionSelect.options.length; i++) {
          if (versionSelect.options[i].value === currentVersion) {
              versionSelect.selectedIndex = i;
              break;
          }
      }
  }
});

