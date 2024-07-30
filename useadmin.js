// Se connecter à la base de données admin
use admin

// Vérifier si l'utilisateur existe
var user = db.getUser("boulangerie_user")
if (user) {
    print("L'utilisateur boulangerie_user existe.")
    // Supprimer l'utilisateur
    db.dropUser("boulangerie_user")
    print("L'utilisateur boulangerie_user a été supprimé.")
} else {
    print("L'utilisateur boulangerie_user n'existe pas.")
}

// Créer un nouvel utilisateur
db.createUser({
  user: "nouveau_boulangerie_user",
  pwd: "nouveau_mot_de_passe_securise",
  roles: [{ role: "readWrite", db: "boulangerie" }]
})
print("Nouvel utilisateur nouveau_boulangerie_user créé.")

// Vérifier la création du nouvel utilisateur
var newUser = db.getUser("nouveau_boulangerie_user")
if (newUser) {
    print("Le nouvel utilisateur a été créé avec succès.")
} else {
    print("Erreur : Le nouvel utilisateur n'a pas été créé.")
}