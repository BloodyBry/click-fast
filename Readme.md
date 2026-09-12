# Click Fast!

Click Fast! est un jeu web de réflexes développé en HTML, CSS et JavaScript Vanilla.

Le joueur configure une partie, clique sur une cible mobile avant la fin du chronomètre, puis consulte son score et ses statistiques. L'interface utilise un univers visuel inspiré des jeux de plateforme colorés.

## État actuel du projet

La version actuelle permet de :

- naviguer entre les cinq vues sans recharger la page ;
- configurer le pseudo, le mode, la durée et la difficulté ;
- valider les valeurs du formulaire ;
- jouer en mode Classique ou Précision ;
- déplacer une cible aléatoirement dans la zone de jeu ;
- compter les réussites et les ratés ;
- calculer la précision ;
- gérer un chronomètre avec une échéance réelle ;
- bloquer les clics après la fin du temps ;
- afficher le bilan de la partie ;
- rejouer avec les mêmes réglages ;
- utiliser une image de Mario comme cible et plusieurs effets sonores.

## Règles du jeu

1. Le joueur saisit un pseudo entre 2 et 20 caractères.
2. Il choisit un mode, une durée et une difficulté.
3. Après le lancement, il doit cliquer sur la cible avant la fin du chronomètre.
4. Chaque clic réussi ajoute un point.
5. Après un clic réussi, la cible change de position.
6. Lorsque le temps atteint zéro, la partie se termine immédiatement.
7. Les clics reçus après l'échéance ne sont pas acceptés.

### Mode Classique

- Un clic sur la cible ajoute un point.
- Les clics hors cible sont ignorés.
- Les ratés et la précision sont affichés comme « Non mesuré ».

### Mode Précision

- Un clic sur la cible ajoute un point.
- Un clic hors cible ajoute un raté.
- La précision est calculée avec la formule suivante :

```text
précision = réussites / (réussites + ratés) × 100
```

Exemple : 3 réussites et 1 raté donnent une précision de 75,0 %.

Si aucun clic n'est effectué, la précision est égale à 0 %.

## Configurations disponibles

### Modes

| Valeur technique | Nom affiché | Comportement des clics hors cible |
| --- | --- | --- |
| `classic` | Classique | Ignorés |
| `precision` | Précision | Comptés comme des ratés |

### Durées

- 10 secondes ;
- 20 secondes ;
- 30 secondes.

### Difficultés

| Valeur technique | Nom affiché | Taille de la cible |
| --- | --- | --- |
| `easy` | Facile | 80 px |
| `medium` | Moyen | 60 px |
| `hard` | Difficile | 40 px |

Plus la difficulté est élevée, plus la cible est petite.

## Lancement du projet

Le projet fonctionne directement dans le navigateur et ne nécessite aucune installation de dépendance.

### Avec Laragon

1. Placer le dossier du projet dans :

```text
C:\laragon\www\click-fast
```

2. Démarrer Laragon.
3. Vérifier que le serveur Apache est actif.
4. Ouvrir l'adresse suivante dans le navigateur :

```text
http://localhost/click-fast/
```

### Avec Live Server dans VS Code

1. Ouvrir le dossier du projet dans VS Code.
2. Installer l'extension Live Server si elle n'est pas déjà disponible.
3. Effectuer un clic droit sur `index.html`.
4. Choisir **Open with Live Server**.

## Organisation du code

```text
click-fast/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── media.js
├── assets/
│   ├── images/
│   │   └── mario-target.png
│   └── audio/
│       ├── background-music.mp3
│       ├── lets-go.mp3
│       ├── coin.mp3
│       └── game-over.mp3
└── maquettes/
    └── fichiers des cinq vues
```

### `index.html`

Contient la structure des cinq vues :

- Accueil ;
- Configuration ;
- Partie ;
- Résultats ;
- Historique.

Une seule vue possède la classe `view--active` à la fois.

### `css/style.css`

Contient :

- les couleurs et le thème visuel ;
- la mise en page des cinq vues ;
- les boutons et les cartes ;
- la zone de jeu ;
- les trois tailles de cible ;
- l'adaptation aux différentes tailles d'écran.

### `js/app.js`

Contient la logique principale :

- navigation entre les vues ;
- lecture et validation du formulaire ;
- état de la partie ;
- position et taille de la cible ;
- score, ratés et précision ;
- chronomètre ;
- fin de partie ;
- résultats et rejouabilité ;
- adaptation après redimensionnement.

### `js/media.js`

Contient uniquement la gestion des médias :

- lancement de la musique après la première interaction du joueur ;
- arrêt de la musique au démarrage d'une partie ;
- son « Let's go » au lancement ;
- son de pièce après un clic réussi ;
- son « Game Over » à la fin.

Le code est isolé dans une fonction afin d'éviter les conflits de variables avec `app.js`.

## Données utilisées par le jeu

### Données actuellement conservées en mémoire

La configuration validée est placée dans la variable `currentSettings` pendant l'utilisation de la page.

Exemple :

```json
{
  "pseudo": "Adnane",
  "mode": "precision",
  "duration": 10,
  "difficulty": "medium",
  "soundEnabled": true
}
```

Les autres données temporaires sont notamment :

```text
score
misses
gameIsRunning
gameHasEnded
gameDeadline
```

## Ressources utilisées

### Technologies

- HTML5 ;
- CSS3 ;
- JavaScript Vanilla ;
- API DOM du navigateur ;
- API Audio du navigateur ;
- Git et GitHub ;
- Jira pour la planification.

### Ressources graphiques et sonores

- `mario-target.png` : image utilisée comme cible ;
- `background-music.mp3` : musique de fond ;
- `lets-go.mp3` : son joué au lancement ;
- `coin.mp3` : son joué après un clic réussi ;
- `game-over.mp3` : son joué à la fin.

Ces ressources sont inspirées de l'univers Super Mario et appartiennent à leurs ayants droit. Elles sont utilisées uniquement dans le cadre de ce prototype pédagogique. Elles doivent être remplacées par des ressources originales ou correctement licenciées avant toute diffusion publique ou commerciale.

## Tests manuels principaux

- un pseudo d'un caractère affiche une erreur ;
- un pseudo contenant uniquement des espaces affiche une erreur ;
- `  Adnane  ` est nettoyé en `Adnane` ;
- un clic réussi ajoute exactement un point ;
- un clic réussi ne crée pas aussi un raté ;
- les clics hors cible sont ignorés en Classique ;
- les clics hors cible sont comptés en Précision ;
- 3 réussites et 1 raté donnent 75,0 % ;
- aucun clic donne 0 % ;
- la cible reste dans l'arène pour les trois difficultés ;
- le temps affiché ne devient jamais négatif ;
- les clics tardifs ne modifient pas le score ;
- Rejouer remet les compteurs à zéro ;
- plusieurs parties successives ne créent pas plusieurs chronomètres ;
- la cible reste dans l'arène après redimensionnement.

## Limites connues

- les navigateurs peuvent bloquer la musique automatique avant la première interaction ;
- les ressources Mario sont réservées au cadre pédagogique et doivent être remplacées pour une diffusion commerciale.

## Dépôt

Le code source est disponible sur GitHub :

https://github.com/BloodyBry/click-fast

## Auteur

Projet réalisé par Adnane, aka bloodybry
