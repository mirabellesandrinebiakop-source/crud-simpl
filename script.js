let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

let idEdition = null;
let pageActuelle = 1;

let ordreNom = true;
let ordreEmail = true;
let ordreDate = true;

const parPage = 5;

const form = document.getElementById("userForm");
const toggleDark = document.getElementById("toggleDark");
const nom = document.getElementById("nom");
const email = document.getElementById("email");
const recherche = document.getElementById("recherche");
const tbody = document.getElementById("tbody");
const totalUsers = document.getElementById("totalUsers");
const totalResults = document.getElementById("totalResults");
const toast = document.getElementById("toast");
const btnAnnuler = document.getElementById("btnAnnuler");

function afficherToast(message, type = "success") {
    toast.textContent = message;
    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.className = "toast";
    }, 3000);
}

function save() {
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));
}

function getData() {
    const valeur = recherche.value.toLowerCase().trim();

    return utilisateurs.filter(u =>
        u.nom.toLowerCase().includes(valeur) ||
        u.email.toLowerCase().includes(valeur)
    );
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    pageActuelle = 1;

    const emailValue = email.value.trim();
    const nomValue = nom.value.trim();

    if (nomValue.length < 2) {
        afficherToast("❌ Le nom doit contenir au moins 2 caractères.", "error");
        nom.focus();
        return;
    }

    if (!isNaN(nomValue)) {
        afficherToast("❌ Le nom ne peut pas être uniquement des chiffres.", "error");
        nom.focus();
        return;
    }

    const existe = utilisateurs.some(u =>
        u.email.toLowerCase() === emailValue.toLowerCase() &&
        u.id !== idEdition
    );

    if (existe) {
        afficherToast("❌ Cet email existe déjà !", "error");
        return;
    }

    const utilisateur = {
        id: idEdition ? idEdition : Date.now(),
        nom: nomValue,
        email: emailValue,
        dateCreation: new Date().toISOString()
    };

    if (idEdition !== null) {
        const index = utilisateurs.findIndex(u => u.id === idEdition);
        utilisateurs[index] = utilisateur;
        idEdition = null;
    } else {
        utilisateurs.push(utilisateur);
    }

    save();
    afficherUtilisateurs();

    afficherToast("✅ Utilisateur enregistré avec succès");

    form.reset();
    nom.focus();
});

function afficherUtilisateurs() {
    tbody.innerHTML = "";

    const dataFiltrée = getData();

    const debut = (pageActuelle - 1) * parPage;
    const pageUsers = dataFiltrée.slice(debut, debut + parPage);

    totalUsers.textContent = utilisateurs.length;
    totalResults.textContent = dataFiltrée.length;

    pageUsers.forEach((user, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${debut + index + 1}</td>
                <td>${user.nom}</td>
                <td>${user.email}</td>
                <td>${new Date(user.dateCreation).toLocaleString()}</td>
                <td>
                    <button onclick="modifierUtilisateur(${user.id})">Modifier</button>
                    <button onclick="supprimerUtilisateur(${user.id})">Supprimer</button>
                </td>
            </tr>
        `;
    });

    afficherPagination(dataFiltrée.length);
}

function supprimerUtilisateur(id) {
    if (!confirm("⚠️ Supprimer cet utilisateur ?")) return;

    utilisateurs = utilisateurs.filter(u => u.id !== id);
    save();

    const totalPages = Math.ceil(getData().length / parPage) || 1;

    if (pageActuelle > totalPages) {
        pageActuelle = totalPages;
    }

    afficherUtilisateurs();
    afficherToast("🗑️ Utilisateur supprimé", "error");
}

function modifierUtilisateur(id) {
    const user = utilisateurs.find(u => u.id === id);

    nom.value = user.nom;
    email.value = user.email;

    idEdition = id;
    btnAnnuler.style.display = "inline-block";

    nom.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

recherche.addEventListener("input", function () {
    pageActuelle = 1;
    afficherUtilisateurs();
});

function afficherPagination(total) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(total / parPage);

    if (totalPages <= 1) return;

    pagination.innerHTML = `
        <button onclick="changerPage(-1)">⬅</button>
        <span> Page ${pageActuelle} / ${totalPages} </span>
        <button onclick="changerPage(1)">➡</button>
    `;
}

function changerPage(direction) {
    const totalPages = Math.ceil(getData().length / parPage);

    pageActuelle += direction;

    if (pageActuelle < 1) pageActuelle = 1;
    if (pageActuelle > totalPages) pageActuelle = totalPages;

    afficherUtilisateurs();
}

function trierNom() {
    utilisateurs.sort((a, b) =>
        ordreNom ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)
    );

    ordreNom = !ordreNom;
    pageActuelle = 1;
    afficherUtilisateurs();
}

function trierEmail() {
    utilisateurs.sort((a, b) =>
        ordreEmail ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
    );

    ordreEmail = !ordreEmail;
    pageActuelle = 1;
    afficherUtilisateurs();
}

function trierDate() {
    utilisateurs.sort((a, b) =>
        ordreDate
            ? new Date(a.dateCreation) - new Date(b.dateCreation)
            : new Date(b.dateCreation) - new Date(a.dateCreation)
    );

    ordreDate = !ordreDate;
    pageActuelle = 1;
    afficherUtilisateurs();
}

toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

btnAnnuler.addEventListener("click", function () {
    form.reset();
    idEdition = null;
    btnAnnuler.style.display = "none";
    nom.focus();
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-start")
        .addEventListener("click", function () {
            document.getElementById("landing-page").style.display = "none";
            document.getElementById("app").style.display = "block";
        });
});

afficherUtilisateurs();