# Drift Zone

Jeu d'arcade de drift en 3D, caméra haute qui suit la voiture et prend de la hauteur avec la vitesse : une arène remplie d'obstacles, une voiture, 120 secondes. Plus tu glisses longtemps et vite, plus tu marques. Le but est de battre ton meilleur score.

## Règles

- **Durée** : 120 s par partie.
- **Points** : tant que tu dérapes, tu gagnes `angle de glisse x vitesse x multiplicateur`. Ces points restent « en jeu » et ne sont validés qu'à la fin de la chaîne de drift.
- **Combo** : le multiplicateur monte pendant que tu tiens la glisse (jusqu'à x10). Hors glisse, tu as 1 s avant que la chaîne soit validée.
- **Frôler un obstacle** sans le toucher (moins de 22 px, assez vite) donne un bonus et un coup de pouce au combo.
- **Chocs** : un impact assez fort annule la chaîne en cours (pas pour les cônes). Cônes et caisses se déplacent à l'impact ; piliers, murs et blocs sont fixes.
- **Meilleur score** enregistré dans le navigateur (`localStorage`).

## Touches (AZERTY)

| Touche | Action |
|---|---|
| Z S Q D / flèches | Accélérer, freiner, tourner |
| Espace | Frein à main (déclenche la glisse) |
| R | Recommencer |
| P / Échap | Pause |
| M | Son |
| G | Debug |

Manette supportée.

## Lancer

Servir le dossier `web/` puis ouvrir `loisirs/drift-zone/index.html` (modules ES : le double-clic ne marche pas) :

```
npx http-server . -p 5180 -c-1
```

## Arborescence

```
src/config     voiture, obstacles, score, vues
src/systems    Car (physique), Collision, Input, Obstacles, Score
src/render     Stage (arène), CarMesh, CameraRig, fumée, traces de pneus
src/game.js    boucle de partie (chrono, fin, meilleur score)
src/hud.js  src/audio.js  src/map.js  src/main.js
```

## Fiche technique

Résumé de ce que fait le code, tenu à jour à chaque modification : le lire suffit pour vérifier une information sans relire tout le jeu.

- **Code** : modules dans `src/` ; caméra `src/render/CameraRig.js`, voiture `src/render/CarMesh.js`, réglages caméra et couleurs `src/config/viewConfig.js`, boucle `src/game.js`, entrées `src/systems/Input.js`.
- **Unités** : pixels du plan de jeu, environ 10 px = 1 m (voiture `carConfig.length` = 46 px).
- **Voiture** : `assets/models/ferrari-458.glb` (CC-BY), `fitGLB(g, 46, π/2)` : avant du modèle (+Z) tourné vers +x local (sens de `car.angle`). Carrosserie `Material.001` en rouge `VIEW.colors.red`. Roues non animées.
- **Caméras (C)** : 0 Dessus (hauteur 420 à 780 px selon la vitesse, recul = hauteur × `back`) ; 1 Poursuite (150 px derrière, 62 px de haut, angle qui rattrape celui de la voiture avec du retard) ; 2 Capot (6 px devant le centre, 13 px de haut). En vue capot le plan proche passe de 10 à 1 px (sinon le capot est coupé), il revient à 10 dans les autres vues (sinon les traces au sol scintillent).
- **Sauvegarde** : son coupé = `driftzone.mute`.

## Crédits des modèles 3D

Voir `assets/models/CREDITS.md`.
