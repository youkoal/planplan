var pokedexData;
var overlay;

function scale_pkm(e) {
    e.style.scale = 2;
}
function unscale_pkm(e) {
    e.style.scale = 1;
}





function LireJson(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}





let checked = new Set(JSON.parse(localStorage.getItem("checkedPokemon") || "[]"));

function save() {
    localStorage.setItem("checkedPokemon", JSON.stringify([...checked]));
}

function renderTable(zone) {
    const tbody = document.querySelector(`#table_${zone} tbody`);
    const data = [...pokedexData[zone]];
    data.sort((a, b) => a.reg - b.reg);

    const rows = [];
    for (const p of data) {
        const isChecked = checked.has(p.id);
        const row = document.createElement("tr");
        if (isChecked) row.classList.add("checked");

        var td_checkbox = document.createElement("td");
        td_checkbox.innerHTML = `<input type="checkbox" data-id="${p.id}" ${isChecked ? "checked" : ""}>`;
        row.appendChild(td_checkbox);
        var td_nregion = document.createElement("td");
        td_nregion.innerHTML = p.reg;
        row.appendChild(td_nregion);
        var td_nnat = document.createElement("td");
        td_nnat.innerHTML = p.nat;
        row.appendChild(td_nnat);
        var td_image = document.createElement("td");
        td_image.innerHTML = `<img src="${p.img}" alt="${p.fr}">`;
        td_image.setAttribute("onmouseenter", "scale_pkm(this)");
        td_image.setAttribute("onmouseleave", "unscale_pkm(this)");
        row.appendChild(td_image);
        var td_nom = document.createElement("td");
        td_nom.innerHTML = `${p.fr}<br><small>${p.en}</small>`;
        row.appendChild(td_nom);
        var td_localisation = document.createElement("td");
        td_localisation.innerHTML = p.loc;
        row.appendChild(td_localisation);

        rows.push({ el: row, checked: isChecked });
    }

    // Séparer cochés et non cochés
    rows.sort((a, b) => a.checked - b.checked);
    tbody.innerHTML = "";
    for (const r of rows) tbody.appendChild(r.el);

    updateCounter(zone);
}

function updateCounter(zone) {
    const total = pokedexData[zone].length;
    const caught = pokedexData[zone].filter(p => checked.has(p.id)).length;
    document.getElementById("counter_" + zone).textContent =
        `${zone} – ${caught}/${total} – Reste à capturer : ${total - caught}`;
}

function openTab(zone) {
    for (const z of Object.keys(pokedexData)) {
        document.getElementById(z).style.display = z === zone ? "block" : "none";
    }
    renderTable(zone);
    currentZone = zone;
}

function checkAll() {
    for (const p of pokedexData[currentZone]) checked.add(p.id);
    save();
    renderTable(currentZone);
}

function uncheckAll() {
    for (const p of pokedexData[currentZone]) checked.delete(p.id);
    save();
    renderTable(currentZone);
}

function searchTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll(`#table_${currentZone} tbody tr`);
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

document.addEventListener("change", e => {
    if (e.target.matches("input[type=checkbox][data-id]")) {
        const id = e.target.dataset.id;
        if (e.target.checked) checked.add(id);
        else checked.delete(id);
        save();
        renderTable(currentZone);
    }
});

let currentZone = "Paldea";

//usage:
LireJson("js/data.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
    pokedexData = data;
    openTab("Paldea");
});