Canvasloth
==========

Canvasloth est un framework (encore en cours de développement) qui permet de créer facilement des mini-jeux ou tout autres type d'application en 2 ou 3 dimensions.

Pour le moment, voici le seul projet fait avec Canvasloth: **[KillDemAll](http://mr21.fr/KillDemAll/)**.

De nos jours, utiliser le context 2D de la balise `<canvas>` en
HTML5 est très simple. Il suffit de faire une boucle infinie d'y mettre un `ctx.clearRect()` au début, afficher des choses, update des objets en fonction du frametime, etc.  
Bref, finalement ça demande un peu d'organisation.
C'est pour cela que parallèlement au développement de **KillDemAll** j'ai choisi de faire les choses bien pour pouvoir réutiliser le même code sur d'autres projets par la suite.

Les fonctionnalités du framework se rangent dans plusieurs catégories:
* Le &lt;canvas&gt; en lui même.
* L'organisation du code utilisateur.
* Les événements.
* Les assets graphiques.
* Le temps.
* Le HUD (HTML).
* Un système de page (HTML).
