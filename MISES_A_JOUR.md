# Système de mises à jour — Le Carré Connect

Le mécanisme reprend le principe de **Tonton Mickael Chrono** :

- vérification au démarrage ;
- nouvelle vérification au retour au premier plan ;
- intervalle automatique de 6 heures ;
- une seule vérification réseau à la fois ;
- comparaison des versions `v2.1.0`, `2.1.0`, etc. ;
- lecture de la dernière Release GitHub ;
- recherche prioritaire d’un fichier `.apk` ;
- écran de mise à jour accessible depuis **Profil → Mise à jour** ;
- possibilité de reporter une version.

## Dépôt attendu

La configuration actuelle se trouve dans `src/updateConfig.js` :

```js
owner: "ApexXploit"
repository: "Association-Aurore-Front-Office"
```

Le système sera pleinement actif dès que ce dépôt existera avec une Release.

## Publier une nouvelle version

1. Modifier `versionName` et `versionCode` dans `android/app/build.gradle`.
2. Construire un APK Android signé.
3. Créer un tag GitHub correspondant, par exemple `v2.1.0`.
4. Créer une Release à partir de ce tag.
5. Joindre l’APK à la Release, avec un nom finissant par `.apk`.
6. Décrire les nouveautés dans le corps de la Release.

Au prochain démarrage ou retour dans l’application, la nouvelle version sera
détectée et proposée à l’utilisateur.

## Application Android native

Le téléchargement et l’installation concernent directement l’APK Android
autonome et signé de **Le Carré Connect**.
