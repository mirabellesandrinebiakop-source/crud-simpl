let utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
let indexEdition = null;
const form = document.getElementById("userForm");
const toggleDark = document.getElementById("toggleDark");
const nom = document.getElementById("nom");
const recherche = document.getElementById("recherche");
const email = document.getElementById("email");
const tbody = document.getElementById("tbody");
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const utilisateur = {
        nom: nom.value,
        email: email.value
    };

    // 👉 SI on est en mode modification
    if (indexEdition !== null) {
        utilisateurs[indexEdition] = utilisateur;
        indexEdition = null;
    } else {
        // 👉 sinon ajout normal
        utilisateurs.push(utilisateur);
    }

    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));
    afficherUtilisateurs();
    form.reset();
});
function afficherUtilisateurs() {
    tbody.innerHTML = "";

    utilisateurs.forEach(function (user, index) {

        const ligne = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.nom}</td>
                <td>${user.email}</td>
            <td>
               <button onclick="modifierUtilisateur(${index})">Modifier</button>
               <button onclick="supprimerUtilisateur(${index})">Supprimer</button>
            </td>
            </tr>
        `;

        tbody.innerHTML += ligne;
    });
}
function supprimerUtilisateur(index) {
    utilisateurs.splice(index, 1);
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));
    afficherUtilisateurs();
}
function modifierUtilisateur(index) {
    nom.value = utilisateurs[index].nom;
    email.value = utilisateurs[index].email;

    indexEdition = index;
}
recherche.addEventListener("input", function () {
    const valeur = recherche.value.toLowerCase();

    const filtres = utilisateurs.filter(function (user) {
        return (
            user.nom.toLowerCase().includes(valeur) ||
            user.email.toLowerCase().includes(valeur)
        );
    });

    afficherFiltres(filtres);
});
function afficherFiltres(liste) {
    tbody.innerHTML = "";

    liste.forEach(function (user, index) {

        const ligne = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.nom}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="modifierUtilisateur(${index})">Modifier</button>
                    <button onclick="supprimerUtilisateur(${index})">Supprimer</button>
                </td>
            </tr>
        `;

        tbody.innerHTML += ligne;
    });
}
toggleDark.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});
afficherUtilisateurs();