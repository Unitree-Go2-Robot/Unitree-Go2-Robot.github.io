function addVersionSelector() {
    var versions = [
        { name: "Rolling", url: "/rolling/" },
        { name: "Jazzy", url: "/jazzy/" },
        { name: "Humble", url: "/humble/" },
        { name: "Foxy", url: "/foxy/" }
    ];

    var selector = document.createElement("select");
    selector.id = "version-selector";
    selector.style.width = "100%";
    selector.style.marginTop = "10px";
    selector.style.borderRadius = "4px";
    selector.style.padding = "5px";

    versions.forEach(function(version) {
        var option = document.createElement("option");
        option.text = version.name;
        option.value = version.url;
        selector.add(option);
    });

    selector.onchange = function() {
        var selectedUrl = selector.value;
        if (selectedUrl) {
            window.location.href = selectedUrl;
        }
    };

    var sidebar = document.querySelector(".wy-side-scroll");
    if (sidebar) {
        var versionDiv = document.createElement("div");
        versionDiv.style.marginTop = "20px";
        versionDiv.appendChild(selector);
        sidebar.appendChild(versionDiv);
    }
}

window.onload = addVersionSelector;
