# Le Carré Connect — Front-office

<p align="center">
  <img src="assets/icon-front.png" alt="Logo Le Carré Connect" width="180" />
</p>

Application Android de l'Association Aurore destinée aux bénéficiaires.

## Télécharger l'APK

[Télécharger la dernière version Android](https://github.com/ApexXploit/Association-Aurore-Front-Office/releases/latest/download/Le-Carre-Connect-v2.2.0.apk)

L'APK s'installe directement sur Android.

## Fonctions principales

- accueil multilingue et création de compte ;
- assistant vocal et traduction ;
- démarches administratives guidées ;
- urgences et transports de proximité ;
- activités, carte, messagerie et profil ;
- vérification des mises à jour via les Releases GitHub.

## Développement

```bash
npm install
npm start
npm run android
```

Le projet utilise React Native Android natif et s'ouvre directement dans Android Studio via le dossier `android`.

## Validation Android

```bash
npm run build:android
```

Consultez `MISES_A_JOUR.md` pour publier une nouvelle version Android.
