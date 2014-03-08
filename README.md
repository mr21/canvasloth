Canvasloth
==========

Canvasloth est un framework (encore en cours de développement) qui permet de créer facilement des mini-jeux ou tout autres type d'application en 2 ou 3 dimensions.

Pour le moment, voici le seul projet fait avec Canvasloth: **[KillDemAll](http://mr21.fr/KillDemAll/)**(2D).

De nos jours, utiliser le *context 2D* de la balise `<canvas>` en
HTML5 est très simple. Il suffit de faire une boucle infinie d'y mettre un `ctx.clearRect()` au début, afficher des choses, update des objets en fonction du frametime, etc.  
Bref, finalement ça demande un peu d'organisation.
C'est pour cela que parallèlement au développement de **KillDemAll** j'ai choisi de faire les choses bien pour pouvoir réutiliser le même code sur d'autres projets par la suite.

Les fonctionnalités du framework se rangent dans plusieurs catégories:
* [Le &lt;canvas&gt; en lui même](#canvas).
* [L'organisation du code utilisateur](#un-code-organis%C3%A9).
* [Les événements](#les-%C3%A9v%C3%A9nements).
* [Les assets graphiques](#assets-graphiques).
* [Le temps](#le-temps).
* [Le HUD (en HTML)](#head-up-display-hud).
* [Un système de pages (en HTML)](#un-syst%C3%A8me-de-pages).
* [Les outils mathématiques](#les-outils-math%C3%A9matiques).
* [La surcharge du context 3D](#la-surcharge-du-context-3d).
* [La gestion des caméras](#les-cam%C3%A9ras).

Par la suite, à l'université Laval, nous avons eu a faire un projet 3D en infographie avec *OpenGL* étant donné que nous sommes curieux de ce qui peut se faire de nouveau en **Web** nous avons voulu le faire en *WebGL*. Nous avons eu envie de découvrir l'envers du décors qui se cache derrière *three.js*.  

C'est pourquoi avec **Mélanie (Misty) Ducani** on a rajouté une nouvelle feature au framework (et pas la moindre) celle de rendre le *context 3D* autant user-friendly que celui en 2D.

Pour rappel, *WebGL* vient sans aucune fonction pour gérer la camera, il y a un nombre incroyable de calculs matriciels à faire...  
En 2D il existe les fonctions `.translate()`, `.scale()` et `.rotate()` pour manipuler les objets dans l'espace.  
On trouve également le couple `.save()` et `.restore()` pour sauvegarder ou remplacer la matrice actuelle.  
En sommes, il y a tout un tas de fonctions que nous avons rajoutés au *context 3D*.

Voici maintenant la liste des features par catégories:

&lt;canvas&gt;
--------------
L'élément DOM `<canvas>` n'est pas créé par l'utilisateur mais pas le framework, cela permet d'éviter d'avoir à gérer ses dimensions. En effet, en CSS **il est possible de spécifier les dimensions en pourcentage**. *Canvasloth* mettra à jour la résolution du `<canvas>` (avec `viewport` notamment) dès-lors que l'utilisateur va resize son navigateur. De plus il est possible d'utiliser les fonctions `.width()` et `.height()` pour **récupérer les dimensions**.

Un code organisé
----------------
Le framework propose à l'utilisateur d'organiser le code de son application d'une certaines manière via **une série de callbacks** portant des noms spécifiques (qui sont expliqués dans la section *événements*). Ainsi quand tout est prêt, *Canvasloth* appellera la ou les fonctions `ready` que l'utilisateur aura spécifiées. Ainsi **la boucle de jeu est invisible** pour l'utilisateur. Le framework appellera à chaque frame les fonctions d'`update` (en passant l'objet `Time` en paramètre) puis les fonctions de `render` (mais cette fois-ci en passant en paramètre le context graphique 2D ou 3D).

Les événements
--------------
**Chaque événement appellera une série de callback** que l'utilisateur aura spécifiés à l'avance.
Imaginons que l'utilisateur est un objet `game` il pourra alors initialiser une partie de *Canvasloth* ainsi:

    fn : {
        ready      : game.ready,
        update     : [game.personnageUpdate, game.globalUpdate],
        render     : game.render,
        mousemove  : game.mousemove,
        mousedown  : game.mousedown,
        mousewheel : game.mousewheel,
        keydown    : game.keydown,
        keyup      : game.keyup
    }

Avec ce code en exemple, on voit que le framework executera la fonction `obj.mousedown` à chaque fois qu'un bouton sera enfoncé. On voit aussi qu'à chaque `update` de la scène le framework appellera non pas une mais deux fonctions.  
L'utilisateur peut **rajouter ou supprimer d'autres événements en cours d'exécution**:  

    var event = canvasloth.events.add('mousemove', gameObject, function);
    canvasloth.events.del(event);

Assets graphiques
-----------------
*Canvasloth* fait principalement gagner du temps dans la gestion des assets graphiques comme notamment le chargement asynchrone d'une collection d'images.
C'est d'ailleurs une fois que toutes les images sont chargées que les fonctions `ready` seront appelées.  
Le framework permet de **faire des sprites et des animations 2D**.

Le Temps
--------
L'objet qui s'occupe du temps dans le framework est `canvasloth.time`. Cet objet est envoyé à l'utilisateur lors des `update` pour qu'il puisse faire un programme qui **ne dépend pas du framerate**.
Un peu comme ceci:

    update: function(time) {
        personnage.x += 50 * time.frametime;
    }

Head-up display (HUD)
---------------------
Plus haut est écrit que Canvasloth s'occupe de lui-même de créer l'élément `<canvas>`, pourquoi?  
Car finalement il ne fera pas que ça. Il laisse à l'utilisateur **la possibilité de créer son propre HUD** dans un `<div>` directement en HTML/CSS (c'est d'ailleurs dans cet élément que ce range par exemple l'affichage des FPS).  
Cette technique donne la possibilité au joueur de pouvoir cliquer sur les éléments du HUD sans pour autant que le HUD s'accapare l'événement pour lui mais le redirige naturellement vers le `<canvas>`.

Un système de pages
-------------------
Il n'est pas pratique d'écrire du texte avec une certaine mise en page, etc. avec uniquement un context de dessin. C'est pourquoi le framework propose un système de pages HTML/CSS qui peuvent venir s'afficher par dessus l'application.

Les outils mathématiques
------------------------
*Canvasloth* propose différents outils mathématiques comme les vecteurs à 2 ou 3 dimensions et les matrices (qui sont naturellement utilisés pour gérer toute la partie `frustum de vision`, `lookAt`, etc.

La surcharge du context 3D
--------------------------


Les caméras
-----------



