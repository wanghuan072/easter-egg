// 游戏分类列表 (Russian)
export const classifications = [
  {
    "name": "Action Adventure",
    "display_name": "Action Adventure"
  },
  {
    "name": "FPS/TPS",
    "display_name": "FPS/TPS"
  },
  {
    "name": "RPG",
    "display_name": "RPG"
  }
]

// 游戏数据 (Russian)
export const gamesData = [
  {
    "id": 1,
    "title": "Guide Easter Egg de The Reckoning : Du début à la fin, étape par étape !",
    "addressBar": "reckoning-easter-egg-guide",
    "publishDate": "2025-09-11T16:00:00.000Z",
    "description": "Un guide complet et accessible pour débutants afin de terminer l'Easter Egg principal sur la carte \"The Reckoning\" dans Call of Duty. Ce guide détaille chaque objectif avec des instructions simples étape par étape, couvrant tout, de l'activation du Pack-A-Punch et l'assemblage de Franken Klaus à l'obtention de l'arme Wunder Gorgofex et la défaite du boss final.",
    "imageUrl": "/images/games/hq720.jpg",
    "imageAlt": "The reckoning-1",
    "seo": {
      "title": "Easter Egg de The Reckoning : Guide complet étape par étape",
      "description": "Un guide complet et accessible pour débutants afin de terminer l'Easter Egg principal sur la carte \"The Reckoning\" dans Call of Duty. Ce guide détaille chaque objectif étape par étape, de l'activation du Pack-A-Punch et l'assemblage de Franken Klaus à l'obtention du Wunder Gorgofex et la défaite du boss final.",
      "keywords": "The Reckoning, Call of Duty, CoD Zombies, Guide Easter Egg, Walkthrough"
    },
    "classify": ["FPS/TPS"],
    "tag": ["GAMES", "FPS"],
    "iframeUrl": "https://www.youtube.com/embed/DjaCGge3Mzk",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <p>Bonjour à tous ! Voici ma première tentative d'un guide Easter Egg pour Call of Duty—cette fois, pour la carte "The Reckoning". Je viens de terminer le jeu, donc les étapes sont encore fraîches dans ma mémoire. J'ai également consulté les vidéos de ROFLwaffles et MrDalekJD comme référence, mais ce guide sera plus accessible pour le joueur moyen. Si vous voyez des erreurs, merci de me le signaler et je mettrai à jour le guide dès que possible !</p>
  <p>J'espère que ce guide vous aidera. Bonne chance et c'est parti ! ✨</p>
  <h2>🔹 Étape 1 : Démarrer la machine Pack-A-Punch</h2>
  <ul>
      <li>1a : Au début du jeu, poussez le seau à droite et placez-le directement sous le sprinkler pour collecter de l'eau (vous en aurez besoin plus tard).</li>
      <li>1b : Suivez le marqueur de carte vers le PaP. En chemin, ramassez la seringue près de la centrifugeuse dans la zone de recherche Mutant (à côté du réservoir d'eau de Mangler).</li>
      <li>1c : Continuez et cherchez la jambe de robot dans l'assemblage T2 Android (cachée dans le tas de ferraille à côté du portail ou derrière le miroir). Commando Klaus, qui apparaît lors d'un round spécial, laissera également tomber un bras de robot (limité à un par round).</li>
  </ul>
  <h2>🔹 Étape 2 : Collecter le sang, la seringue de mutation Fowler et l'échantillon ADN</h2>
  <ul>
      <li>2a : Sautez dans la colonne de lumière pour vous transformer en boule. Faites tomber un zombie et utilisez la seringue pour prélever du sang.</li>
      <li>2b : Retournez à la zone de recherche Mutant, tuez le "Zombie Généticien" pour obtenir la carte-clé et ouvrez le réfrigérateur (en face du tableau périodique) pour obtenir l'échantillon ADN.</li>
      <li>2c : Ramenez la seringue ensanglantée à son emplacement initial. Tuez le Mangler Fowler suivant pour récupérer la seringue.</li>
  </ul>
  <h2>🔹 Étape 3 : Obtenir l'arme Wunder Gorgofex !</h2>
  <ul>
      <li>3a : Dans le laboratoire de mutation, trouvez deux écrans avec des mots clignotants. Prenez la première lettre de chaque mot pour former le nom de l'élément. Consultez le tableau périodique pour obtenir le numéro atomique (ajoutez des zéros si moins de trois chiffres). Utilisez ce code pour ouvrir la porte du laboratoire à l'étage.</li>
      <li>3b : Dans le nouveau labo, tuez 3 zombies et 3 parasites près de la centrifugeuse. Activez le kyste jaune et jetez-le dans le trou du sol du labo (qui mène à la salle de calcul quantique).</li>
      <li>3c : Placez-vous sous les trois champignons violets avec le kyste sur votre tête pour vider votre barre de santé (évitez les piscines de poison et les zombies).</li>
      <li>3d : Allez au Conteneur de l'Entité Obscure (la salle des Forsaken) et activez rapidement les quatre terminaux "Initiate Power Surge" pour invoquer Uber Klaus.</li>
      <li>3e : Brisez les épaules d'Uber Klaus pour le diriger vers le panneau statique devant les Forsaken et déclencher un mini-boss. Après l'avoir vaincu, récupérez l'orbe violet pour obtenir le Gorgofex !</li>
  </ul>
  <h2>🔹 Étape 4 : Assembler Franken Klaus</h2>
  <ul>
      <li>4a : Utilisez les bras et jambes robotiques que vous avez collectés pour réparer le robot Klaus dans l'atelier T2.</li>
      <li>4b : Utilisez la seringue Fowler pour vous transformer en Mangler. Scannez la carte-clé en haut des escaliers de l'Entité Obscure pour débloquer la salle du téléporteur.</li>
      <li>4c : Attendez le tour 16 (ou le prochain tour pour Uber Klaus) et trompez-le pour qu'il tire une boule électrique sur le robot réparé.</li>
  </ul>
  <h2>🔹 Étape 5 : Résoudre les puzzles informatiques</h2>
  <ul>
      <li>5a : Suivez le mouvement de Franken Klaus à chaque tour. Le deuxième emplacement nécessite de compléter un essai SAM.</li>
      <li>5b : Le troisième emplacement se trouve dans la salle du téléporteur et nécessite un mot de passe à 4 chiffres. Les documents contenant le mot de passe sont dispersés sur les étagères, bureaux et ordinateurs de la suite exécutive T1 (possiblement dans la salle des Forsaken ou du téléporteur).</li>
      <li>5c : Chaque document a un numéro en haut et une date (MM/JJ/AAAA) en bas. Le mot de passe est le numéro trié par date de la plus ancienne à la plus récente.</li>
      <li>5d : Entrez le mot de passe sur l'ordinateur dans la salle de téléportation. Si "Access Granted" apparaît, vous avez réussi.</li>
  </ul>
  <h2>🔹 Étape 6 : Mode Chasse aux Fantômes Activé !</h2>
  <ul>
      <li>6a : Allez à la salle de calcul quantique et achetez le Melee Machiatto (boost de vitesse corps à corps). Brisez le panneau vert pour obtenir le Cerveau Violet, puis retournez rapidement à la salle du téléporteur (utilisez l'ascenseur pour gagner du temps !).</li>
      <li>6b : Retournez à la salle PaP pour activer l'accélérateur de particules et utilisez le Gorgofex pour tuer les parasites fantômes bleus.</li>
      <li>6c : Retournez à la console de contrôle pour interagir avec le Gorgofex afin de le recharger. Retournez à la salle du téléporteur avec le Gorgofex rechargé.</li>
      <li>6d : Lancez une attaque chargée sur le cristal du cadre du portail de téléportation pour dégager l'obstacle.</li>
      <li>6e : Retournez au laboratoire de mutation et visez avec le Gorgofex la fenêtre fongique à l'entrée de la caverne souterraine. Une tête fongique tombera. Sautez et récupérez-la.</li>
  </ul>
  <h2>🔹 Étape 7 : Dresseur Pokémon (Erreur)</h2>
  <ul>
      <li>7a : Retournez au spawn et placez la tête de champignon dans le seau que vous avez collecté précédemment. Rincez-la et récupérez-la (cela vous ralentira).</li>
      <li>7b : Portez-la tout en tuant des zombies pour la recharger, puis retournez-la sur le cadre du portail.</li>
      <li>7c : Une fois rechargée, retournez au spawn et prenez le "Dispositif de scellage sous vide" (grenade tactique) de la salle rouge.</li>
      <li>7d : Utilisez-le pour capturer les objets violets flottants sur la carte (ne vous approchez pas trop !), puis répétez avec le dispositif de recyclage pour en capturer quatre autres.</li>
      <li>7e : Ramenez-le au piédestal devant la salle du portail pour déclencher l'événement de confinement—activez quatre interrupteurs dans un temps limité (vert devient rouge avec un effet sonore).</li>
  </ul>
  <h2>🔹 Étape 8 : Combat contre le Boss Final !</h2>
  <h3>Recommandations de Préparation :</h3>
  <ul>
      <li>Armes doubles PaP Niveau 3 (essayez de ne pas dépasser 40 munitions)</li>
      <li>AMR Mod 4 ou SVD recommandé pour les attaques à distance</li>
      <li>Bubble Gum : Reign Drops, Idle Eyes, Perkaholic, Phoenix Up (online), Shields Up</li>
      <li>Compétences : Choisir "Tribologist" (boost de glissade) pour PHD</li>
      <li>Récompense Killstreak : Chopper Gunner / Death Machine, stockez des Monkey Bombs ou leurres</li>
  </ul>
  <h3>Processus :</h3>
  <ul>
      <li>8a : Commencez le combat final. Choisissez d'aider Richtofen (plus facile) ou Maxis.</li>
      <li>8b : Trouvez trois LTG Soul Boxes dans le couloir. Après recharge, retournez à l'ascenseur.</li>
      <li>8c : Tirez sur le cristal bloqué dans le tuyau. Lorsque l'ascenseur s'arrête à nouveau, vous atteindrez le toit.</li>
      <li>8d : Combattez SAM—tirez-lui dans l'œil ! Après l'attaque laser, le haut et le bas de sa tête s'ouvrent et explosent. Chaque perte de 25 % de santé déclenche un essai SAM, donnant un bonus en cas de réussite et un malus en cas d'échec.</li>
      <li>8e : Restez calme, trouvez un abri pour vous soigner, évitez les attaques de zone et infligez des dégâts patiemment !</li>
  </ul>
  <p>Félicitations ! Si vous êtes arrivé jusque-là, vous êtes à un pas de finir le jeu ! Ce guide a été rédigé avec soin. S'il vous est utile, faites-le moi savoir et je serai ravi d'améliorer le guide !</p>
  <p>Bon massacre de zombies !</p>
      `
  },
  {
    "id": 2,
    "title": "Guide Solo Der Eisendrache Easter Egg 2025 - Walkthrough Complet & Astuces Pro",
    "addressBar": "der-eisendrache-easter-egg",
    "publishDate": "2025-09-11T16:00:00.000Z",
    "description": "Guide complet étape par étape de l'Easter Egg Der Eisendrache optimisé pour les joueurs solo. Apprenez à obtenir l'Arc de Foudre, à vaincre le Boss Keeper et à débloquer l'achievement avec des stratégies professionnelles et des astuces cachées. Mise à jour pour le gameplay 2025.",
    "imageUrl": "/images/games/der eisendrache easter egg.png",
    "imageAlt": "der eisendrache 1",
    "seo": {
      "title": "Guide Solo Der Eisendrache Easter Egg 2025",
      "description": "Guide complet étape par étape de l'Easter Egg Der Eisendrache optimisé pour les joueurs solo. Débloquez l'achievement avec des stratégies pro et astuces cachées.",
      "keywords": "der eisendrache easter egg solo, amélioration arc de foudre, combat boss Keeper, gravity spikes der eisendrache"
    },
    "classify": ["FPS/TPS", "RPG"],
    "tag": ["GAMES", "BO3", "der eisendrache"],
    "iframeUrl": "https://www.youtube.com/embed/IS_7c9P8ibU",
    "isHome": true,
    "isLatest": false,
    "detailsHtml": `
      <h2>Obtenir l'arc et les flèches à l'avance</h2>
  <p>Vous devez obtenir un arc spécifique avant de commencer l'Easter Egg.</p>
  <p>Pour obtenir un arc simple, nourrissez les trois têtes de dragon sur la carte.</p>
  <p>Puis, améliorez-le pour obtenir l'Arc de Foudre, la version solo la plus puissante, comme suggéré dans la vidéo. Un arc avec des fonctionnalités supplémentaires est une autre option.</p>
  <p>➕ <strong>Conseil :</strong> Soyez patient, la procédure d'amélioration nécessite de tirer sur des runes et de défendre certains points.</p>
  
  <h2>🔮 Étape 1 : Localiser le Wisp ou le Feu Bleu de l'Esprit</h2>
  <p>Tirez sur la cloche au sommet du téléporteur avec l'arc simple jusqu'à entendre le son unique "ding".</p>
  <p>Passez immédiatement à votre arc amélioré, puis cherchez les flammes spirituelles bleues sur la carte. Elles apparaîtront aléatoirement à l'un des endroits suivants :</p>
  <ul>
      <li>Machine dans un coin de l'église</li>
      <li>Horloge au-dessus de la cheminée de l'église</li>
      <li>Chambre de Samantha avec le globe</li>
      <li>Boîte au-dessus du Double Tap dans la pièce</li>
      <li>Pneu arrière d'une voiture</li>
      <li>Table à côté de Quick Revive</li>
      <li>Dans la salle Stamina-Up, un téléphone</li>
      <li>Horloge dans le couloir entre le clocher et l'église</li>
  </ul>
  <p>Lorsque vous en trouvez une, tirez dessus avec votre arc amélioré. Elle se déplacera vers la prochaine destination, la flamme spirituelle.</p>
  <p>Faites cela quatre fois. Une fois terminé, vous entendrez un son de confirmation.</p>
  <p>Au retour au téléporteur, il deviendra violet et vous pourrez entrer.</p>
  
  <h2>⚡️ Étape 2 : Voyage dans le temps et collecte de pièces</h2>
  <p>Dès que vous entrez dans le téléporteur, prenez :</p>
  <ul>
      <li>la boîte de droite</li>
  </ul>
  <p>Attendez que le médecin entre le code du coffre (retenez-le !).</p>
  <p>Au retour, un Panzer apparaîtra (attention !).</p>
  
  <h2>🧩 Étape 3 : Puzzle du Rayon de la Mort</h2>
  <p>Avant d'activer le piège du Rayon de la Mort, insérez le fusible et mettez le panneau en mode Protection.</p>
  <p>Entrez le code donné par le médecin dans la machine ; un son se fera entendre.</p>
  <p>Retournez en mode Destruction après avoir ouvert le coffre, récupéré les composants et les avoir chargés dans la tour du Rayon de la Mort.</p>
  
  <h2>👻 Étape 4 : Simon Dit et Appel de Tempy</h2>
  <p>Notez la séquence clignotante lors du puzzle "Simon Dit" près du Rayon de la Mort. Au Rocket Base, un autre problème doit être résolu simultanément.</p>
  <p>Pour rappeler Tempy sur Terre, retournez au Rayon de la Mort et appuyez sur le bouton vert lorsque la tour s'allume en blanc.</p>
  <p>Pour libérer l'esprit après l'atterrissage, prenez la clé et placez-la dans la pierre tombale. Gardez-la en mémoire.</p>
  
  <h2>🔁 Étape 5 : Obtenir la Tablette + Répéter le Feu Spirituel</h2>
  <p>Au début d'un nouveau round (limite de temps ; vous perdez à la fin du round), vous devez répéter l'étape du Feu Spirituel.</p>
  <p>Entrez à nouveau dans le téléporteur après l'avoir fait quatre fois. Pour obtenir la Tablette cette fois, interagissez avec le livre dans le coin (un second Panzer apparaîtra).</p>
  
  <h2>💀 Étape 6 : Collecte des Âmes & Dernier Rituel</h2>
  <p>Tuez des zombies à l'intérieur du cercle blanc jusqu'à ce que l'âme parte à son emplacement d'origine (quatre fois).</p>
  <p>Vous devrez poser une Tablette pour continuer la collecte une fois que le rythme du feu est presque doublé.</p>
  <p>L'âme deviendra finalement rouge et s'élèvera dans la pyramide sous l'église.</p>
  
  <h3>Préparation pour le Boss</h3>
  <h4>Équipement suggéré :</h4>
  <ul>
      <li>Gravity spikes indispensables !</li>
      <li>Tous les avantages + Nouveau Bouclier (notamment protection explosion Jug)</li>
      <li>Arme maximale (pour les Panzers, Dragon's Glare ou armes explosives recommandées)</li>
      <li>Danger proche (pour éviter les saisies Panzer)</li>
  </ul>
  
  <h2>🏛️ Étape 7 : Lancer le combat du Boss et la Pyramide</h2>
  <p>Pour ouvrir la porte, placez le conteneur bleu dans le coin de la pyramide.</p>
  <p>Pour entrer dans le combat du boss, activez le panneau bleu avec le Gravity Spike.</p>
  
  <h3>Conseils pour le Boss :</h3>
  <ul>
      <li>Continuez !</li>
      <li>Utilisez le Gravity Spike pour casser le sol et débloquer le coffre du Keeper quand une lumière bleue apparaît au centre. Profitez-en pour infliger des dégâts avec une arme explosive ou l'arc.</li>
      <li>Méfiez-vous de l'ultime du Keeper : si les spikes sont disparus, cachez-vous derrière un pilier pour éviter un one-shot.</li>
      <li>Chaque vague de deux Panzers et trois vagues de Keepers dispose de munitions maximales.</li>
  </ul>
  
  <h3>Dernière Étape : Insérer la Clé de l'Ombre</h3>
  <p>Une fois transporté à la pyramide, insérez la Clé de l'Ombre et observez-la s'allumer avant de la retirer.</p>
  <p>Placez la clé dans la machine où vous avez joué à "Simon Dit" la première fois.</p>
  <p>Félicitations ! L'Easter Egg est terminé !</p>
  
  <h3>Remarque Finale :</h3>
  <p>L'Easter Egg de Der Eisendrache est l'un des plus spectaculaires de l'histoire de Call of Duty Zombies. Le faire en solo est gratifiant et exigeant. Je mettrai à jour avec les dernières informations, alors n'hésitez pas à partager vos problèmes ou questions dans les commentaires !</p>
  <p>✨ Hommage à ceux qui bravent les ténèbres seuls. Votre persévérance éclairera ce chemin magique rempli de dragons.</p>
  <p>À bientôt pour le prochain guide !</p>
      `
  },
  {
    "id": 3,
    "title": "Théories sur la récompense Super Easter Egg de Black Ops 6 Zombies | COD BO6",
    "addressBar": "bo6-super-easter-egg-rewards",
    "publishDate": "2025-09-03T16:00:00.000Z",
    "description": "Que reçoivent les joueurs pour avoir complété toutes les quêtes principales dans Call of Duty : Black Ops 6 Zombies ? Cet article explore les cinq meilleures théories de la communauté sur la récompense du super Easter Egg, incluant des armes Wunder illimitées, un défi boss et plus encore.",
    "imageUrl": "/images/games/game-03.webp",
    "imageAlt": "bo6 super easter egg rewards",
    "seo": {
      "title": "Théories sur la récompense Super Easter Egg de Black Ops 6 Zombies | COD BO6",
      "description": "Quelle est la récompense ultime pour avoir complété toutes les quêtes principales dans Call of Duty : Black Ops 6 Zombies ? Découvrez les cinq théories les plus populaires de la communauté pour le super Easter Egg, allant des armes Wunder illimitées à un défi boss, et un aperçu de ce qui pourrait vous attendre.",
      "keywords": "Call of Duty, Black Ops 6, COD, Zombies, BO6, Easter Egg, Guide de Jeu, Récompenses, Théories"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Call of Duty", "Black Ops 6", "COD", "Zombies", "BO6", "Easter Egg"],
    "iframeUrl": "https://www.youtube.com/embed/85f2cyiXhT8",
    "isHome": false,
    "isLatest": false,
    "detailsHtml": `
      <h2>Quelle pourrait être la récompense Super Easter Egg dans Black Ops 6 Zombies ?</h2>
  <p>L'attente pour <em>Call of Duty : Black Ops 6</em> monte, en particulier pour les fans du mode Zombies. Chaque carte possède sa propre quête principale, mais l'objectif ultime est de compléter le "super Easter Egg" en terminant les cinq quêtes principales. Mais quelle est exactement la récompense pour cet exploit monumental ? Bien que les détails officiels restent secrets, la communauté est en effervescence avec des théories passionnantes. Basé sur une vidéo YouTube récente (voir le lien ci-dessous), voici cinq des idées les plus convaincantes pour la récompense ultime.</p>
  
  <h3>1. Toutes les armes Wunder dans la Mystery Box</h3>
  <p>Imaginez pouvoir obtenir toutes les armes Wunder de toutes les cartes dans la Mystery Box. Ce n'est pas juste une simple récompense ; c'est un changement de jeu. Chaque carte possède une arme Wunder unique qui influence beaucoup la stratégie de jeu. Mais si elles étaient toutes disponibles dans la Mystery Box de chaque carte, les joueurs devraient repenser entièrement leur approche. La rejouabilité augmenterait considérablement, chaque partie pouvant être totalement différente selon l'arme puissante obtenue.</p>
  
  <h3>2. Mode GobbleGum Illimité</h3>
  <p>Les GobbleGums sont essentiels dans Zombies, offrant des avantages puissants mais à usage limité. Et si le super Easter Egg débloquait un mode où vous pouviez les utiliser sans limite ? Ce serait un chaos total, permettant aux joueurs de profiter pleinement de la puissance et de la folie de ces capacités. Bien sûr, pour rester équilibré, ce mode ne compterait probablement pas pour l'XP, les camouflages ou autres statistiques. C'est une récompense purement pour le plaisir et le chaos.</p>
  
  <h3>3. Le Gauntlet Ultime de Boss</h3>
  <p>Pour les joueurs les plus hardcore, un gauntlet de boss serait la récompense parfaite. Ce mode vous confronterait à tous les boss des cinq cartes de Black Ops 6 Zombies, un après l'autre. Le défi pourrait être renforcé avec des restrictions uniques, comme n'utiliser que certains types d'armes ou finir les combats dans un temps limité. Ce serait le test ultime de compétence et un véritable badge d'honneur pour ceux qui le complètent.</p>
  
  <h3>4. Déblocage des camouflages Pack-a-Punch</h3>
  <p>Qui n'aime pas une belle apparence d'arme ? Dans Zombies, améliorer votre arme avec Pack-a-Punch augmente sa puissance et lui donne un nouveau look. Cette idée suggère que compléter le super Easter Egg débloquerait la possibilité d'utiliser n'importe quel camouflage Pack-a-Punch de n'importe quelle carte sur n'importe quelle arme, même en multijoueur ou Warzone. C'est une récompense cosmétique simple mais très convoitée pour les joueurs dévoués.</p>
  
  <h3>5. Commencer avec l'Armure Dorée</h3>
  <p>La dernière idée, et peut-être la plus pratique, est de commencer chaque partie avec un ensemble d'Armure Dorée. Pour tout vétéran de Zombies, les premiers rounds sont souvent les plus dangereux car vous n'avez pas de défense adéquate. Avoir l'Armure Dorée dès le départ offrirait un énorme avantage, permettant de se concentrer sur l'acquisition d'armes et de perks sans risque constant d'être abattu. C'est une récompense fonctionnelle qui reconnaît votre réussite sans casser le gameplay principal.</p>
  
  <h3>Conclusion</h3>
  <p>Chacune de ces idées apporte quelque chose d'unique, des aspects cosmétiques aux mécaniques modifiant le jeu. En attendant une annonce officielle, les spéculations ne font qu'ajouter à l'excitation. Quelle récompense espérez-vous voir à la fin ? Partagez votre avis dans les commentaires !</p>
      `
  },

  {
    "id": 4,
    "title": "Cette maison effrayante était un Easter Egg depuis le début...",
    "addressBar": "gta5-creepy-house-easter-egg",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Pendant des années, les joueurs ont pensé que cette maison abandonnée dans GTA 5 était hantée. Cet article révèle sa vérité surprenante : c'est un Easter Egg astucieux basé sur un site historique réel.",
    "imageUrl": "/images/games/game-04.webp",
    "imageAlt": "Cette maison effrayante était un Easter Egg depuis le début...",
    "seo": {
      "title": "Cette maison effrayante était un Easter Egg depuis le début...",
      "description": "Pendant des années, cette maison abandonnée dans GTA 5 a été source de mythes effrayants. Cet article révèle la vérité étonnante : c'est un Easter Egg astucieux basé sur une ville fantôme réelle et l'histoire de la Route 66, une histoire bien plus captivante que n'importe quel récit de fantôme.",
      "keywords": "GTA 5, Grand Theft Auto, Easter Egg GTA 5, maison hantée, Route 66, ville fantôme, secrets GTA 5, Rockstar Games, histoire du jeu, lieux réels dans GTA, lore, mystère, maison abandonnée"
    },
    "classify": ["Action Aventure"],
    "tag": ["GTA 5", "Grand Theft Auto", "Easter Egg", "Jeux", "Maison hantée", "Rockstar Games"],
    "iframeUrl": "https://www.youtube.com/embed/QfFDHBbT5R4",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>Cette maison effrayante était un Easter Egg depuis le début...</h2>
  <p>Dans l'immense et détaillé monde de Grand Theft Auto V, chaque recoin semble cacher un secret. Une maison abandonnée particulière dans le désert a longtemps été réputée hantée, alimentant d'innombrables légendes urbaines. Cependant, l'histoire vraie derrière ce lieu est bien plus fascinante que tout récit de fantôme. C'est un hommage subtil et magistral à un morceau oublié de l'histoire californienne.</p>
  
  <h3>La légende de la maison hantée</h3>
  <p>Pendant des années, cette maison désolée a été un aimant à mythes. Sa façade inquiétante, son intérieur délabré et son emplacement isolé ont fourni le cadre parfait pour des histoires effrayantes. Les YouTubers et les joueurs ont créé des vidéos et des récits affirmant des activités paranormales, consolidant ainsi la réputation de "maison hantée" au sein de la communauté.</p>
  <p>Fait intéressant, Rockstar Games a exploité ce mythe lors de leur événement Halloween 2023, ajoutant deux fantômes temporaires au lieu. Cependant, c'était une plaisanterie saisonnière, et non l'intention originale du design. Le véritable but de la maison réside dans l'histoire, pas dans l'horreur.</p>
  
  <h3>L'inspiration réelle : la ville fantôme californienne</h3>
  <p>Le prototype réel de la maison est le <strong>Pentagast Hotel</strong>, un véritable bâtiment abandonné situé dans la ville fantôme de <strong>Lello, Californie</strong>. L'histoire de Lello est un récit classique de l'expansion vers l'ouest américain. Elle a commencé comme une ville ferroviaire prospère avant de se réinventer en tant que halte populaire sur la légendaire <strong>Route 66</strong>. Pendant l'âge d'or de la Route 66, Lello était un arrêt vital pour d'innombrables voyageurs traversant le pays, apportant prospérité et vie à la petite communauté.</p>
  
  <h3>Le déclin de la Route 66</h3>
  <p>Le destin de la ville a été scellé par l'avènement du <strong>Système autoroutier inter-États</strong>. La construction de l'<strong>Interstate 40</strong> a contourné la Route 66, provoquant la baisse du trafic et la faillite des commerces. Au fur et à mesure que les voyageurs partaient, les habitants quittaient également la ville. Lello a été lentement abandonnée, devenant la ville fantôme qu'elle est aujourd'hui — un témoignage silencieux d'une époque révolue.</p>
  
  <h3>La reconstitution méticuleuse par Rockstar</h3>
  <p>Les concepteurs de Rockstar ont porté une attention incroyable à cette histoire. Dans le jeu, la Route 66 est représentée par la <strong>Route 68</strong>, et l'emplacement de la maison abandonnée correspond parfaitement à son homologue réel — situé juste à côté de la ligne de chemin de fer. Ce n'est pas une simple copie ; c'est un hommage soigneusement élaboré qui ajoute une profondeur et un réalisme supplémentaires au monde du jeu.</p>
  
  <h3>Conclusion : un Easter Egg historique</h3>
  <p>La prochaine fois que vous passerez devant cette maison dans GTA 5, ne la considérez pas comme un lieu hanté. Appréciez-la plutôt comme un <strong>Easter Egg</strong> historique, un monument au passé californien et un témoignage de l'incroyable souci du détail de Rockstar. Cela nous rappelle que même dans un monde de chaos et de crime, il existe des histoires subtiles de notre monde réel qui n'attendent que d'être découvertes.</p>
      `
  },
  {
    "id": 5,
    "title": "Easter Egg de Battlefield 2042",
    "addressBar": "battlefield-2042-your-easter-egg",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Guide complet pour débloquer le tag joueur 'Your Excellency' dans Battlefield 2042, couvrant tous les Easter Eggs, codes Portal et récompenses.",
    "imageUrl": "/images/games/game-02.webp",
    "imageAlt": "Easter Egg Battlefield 2042",
    "seo": {
      "title": "Guide complet de l'Easter Egg 'Your Excellency' dans Battlefield 2042",
      "description": "Découvrez comment débloquer le tag joueur exclusif 'Your Excellency' dans Battlefield 2042 en complétant les quatre Easter Eggs. Guide étape par étape avec astuces, codes Portal et récompenses.",
      "keywords": "Battlefield 2042, Your Excellency, guide Easter Egg, recherche de peluches, Sacrifice, Shark NATO, Prototype, tag joueur, code Portal, walkthrough"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Battlefield 2042", "Easter Egg", "Your Excellency", "Chasse aux peluches"],
    "iframeUrl": "https://www.youtube.com/embed/Y9IUI3DBDI0",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>Recherche de peluches sur Redacted</h2>
  <p>Sur Redacted, il y a essentiellement quatre peluches cachées, et vous devez en récupérer une de chacune des quatre. Chaque peluche a 10 emplacements possibles, et une seule apparaît par partie. Pour accomplir cela, trouvez votre première peluche et interagissez avec elle. Certaines peuvent nécessiter de l'escalade avec McKay pour y accéder. Une animation se joue après interaction et un charme est débloqué. Redémarrez la carte via le menu admin pour rechercher la suivante.</p>
  <p>Après avoir trouvé la première peluche, il ne vous restera plus qu'à chercher dans 30 emplacements possibles pour la suivante, puis 20, et enfin 10 pour la dernière. Notez que des répétitions peuvent se produire. L'utilisation du code Portal AB6 NS1 augmente la vitesse de déplacement et facilite l'accès aux peluches difficiles à atteindre.</p>
  <p>Une fois les quatre peluches collectées, vous débloquez des charmes pour chacune et un arrière-plan spécial pour votre carte joueur. Ensuite, passez à la carte suivante.</p>
  
  <h2>Sacrifice sur Battle of the Bulge</h2>
  <p>Ce Easter Egg nécessite un ami. Sur la version nocturne de Battle of the Bulge, obtenez des éliminations gratuites dans un cercle en feu. Un joueur se fait exécuter à plusieurs reprises tandis que l'autre effectue des éliminations. En complétant cela, vous débloquez la <strong>carte joueur Sacrifice</strong>.</p>
  <p>De plus, vous pouvez collecter une carte clé nécessaire pour l'Easter Egg Prototype. À l'objectif D, en tant qu'Engineer, tirez sur les ailes et la tête des statues, puis utilisez de la dynamite sur la statue de droite. Au cimetière E1, détruisez la tête de la statue du milieu et interagissez pour récupérer la carte clé.</p>
  
  <h2>Shark NATO sur Orbital</h2>
  <p>Ce Easter Egg nécessite deux joueurs et la version orageuse de la carte Orbital. Vérifiez la plage pour un panneau “no swimming” afin de confirmer la carte. Interagissez avec un talkie-walkie dans l'entrepôt B1 près de la fusée. Placez-le au panneau de la plage pour jouer le code Morse.</p>
  <p>Ensuite, interagissez avec quatre ordinateurs portables cachés autour de la carte : un sur la plate-forme de lancement sous les escaliers, un dans un container bureau près du bâtiment d'assemblage de véhicules, un au drapeau B2 dans le bâtiment K3, et un dans le grand bâtiment d'assemblage sur le sol R1. Après avoir interagi avec tous, retournez au panneau de la plage et entrez le code <strong>1 3 2 3 1 3</strong> via les ordinateurs.</p>
  <p>Un joueur effectue trois éliminations dans l'eau avec l'arme charme <strong>Frankie the Shark</strong>. Seul le joueur tué reçoit la complétion et le <strong>badge Shark Bait</strong>. Un effet tornade de requin apparaît une fois terminé. Si fait à deux, répétez pour le second joueur.</p>
  
  <h2>Récupération du Prototype</h2>
  <p>Si vous possédez déjà Prototype, vous débloquez automatiquement le <strong>tag joueur Excellency</strong>. Sinon, débloquez d'abord un skin de support Phantom Program sur Exposure. Avec Fal (soigneur support), infligez-vous et soignez-vous 10 fois à chaque objectif : A1, B1, B2, D et C. Puis, appelez un véhicule et montez dedans pour débloquer tous les skins de support.</p>
  <p>Sur Iroima, portez un skin de support et allez à l'objectif C1 près d'une machine de minage. Entrez les codes du clavier : <strong>2550146, 613251, 51576, 441806</strong>. Cela ouvre une sortie de secours avec un ascenseur. Vous pouvez descendre en toute sécurité avec quatre joueurs ayant les tags Phantom ou vous mettre à plat ventre immédiatement si vous êtes seul.</p>
  <p>En bas, interagissez avec le lecteur de carte clé (collecté depuis Battle of the Bulge) pour entrer dans un couloir avec des lasers. Porter le skin de support correct permet de passer en toute sécurité. À la fin, interagissez avec la vitrine pour récupérer l'arme Prototype et débloquer le <strong>tag joueur Excellency</strong>. Des skins Prototype supplémentaires peuvent être collectés sur les étagères.</p>
      `
  },

  {
    "id": 6,
    "title": "Les plus grands Easter Eggs de GTA V : un hommage à l'univers Rockstar",
    "addressBar": "gta5-rockstar-universe-easter-eggs",
    "publishDate": "2025-09-02T16:00:00.000Z",
    "description": "Découvrez les innombrables Easter Eggs dans GTA V qui rendent hommage aux autres jeux Rockstar, de Red Dead Redemption à Max Payne 3.",
    "imageUrl": "/images/games/game-05.webp",
    "imageAlt": "Les plus grands Easter Eggs de GTA V : un hommage à l'univers Rockstar",
    "seo": {
      "title": "Les plus grands Easter Eggs de GTA V : un hommage à l'univers Rockstar",
      "description": "GTA V regorge de plus de 50 références cachées aux autres titres de Rockstar. Plongez dans un monde de lore interconnecté en découvrant les Easter Eggs pour GTA IV, San Andreas, Red Dead Redemption, Max Payne 3 et plus encore.",
      "keywords": "GTA 5, Grand Theft Auto, Rockstar Games, Easter Eggs, lore du jeu, secrets GTA V, Red Dead Redemption, Max Payne 3, LA Noire, Bully, Manhunt, San Andreas, GTA IV, histoire du jeu"
    },
    "classify": ["Action Aventure"],
    "tag": ["GTA 5", "Grand Theft Auto", "Rockstar Games", "Easter Eggs", "Lore du jeu", "GTA V", "Secrets"],
    "iframeUrl": "https://www.youtube.com/embed/Z1IT7YX9rQI",
    "detailsHtml": `
      <h2>Grand Theft Auto V : un hommage magistral à l'univers des jeux Rockstar</h2>
  <p>Grand Theft Auto V est plus qu'un simple jeu ; c'est une lettre d'amour aux fans dévoués de Rockstar Games. Avec plus de 50 Easter Eggs subtils ou évidents, le vaste monde de Los Santos est méticuleusement tissé dans l'univers entier de Rockstar. Des rues de Liberty City aux plaines désertiques du Far West, ces références ingénieuses créent un monde connecté qui récompense les joueurs pour leur fidélité au fil des années.</p>
  
  <h3>Échos de Liberty City : l'héritage de Niko Bellic</h3>
  <p>Les clins d'œil à GTA IV sont impossibles à manquer, notamment les nombreuses allusions à son protagoniste, <strong>Niko Bellic</strong>. Lors d'une session de planification de braquage, le mentor de Franklin, Lester, précise qu'il ne voudrait pas travailler avec un "gars d'Europe de l'Est", un clin d'œil clair au passé de Niko. De plus, dans le désert désolé, un avis de recherche ou une photo de Niko peut être trouvé à l'<strong>Yellow Jack Inn</strong>, suggérant que sa notoriété a atteint même les paysages ensoleillés du comté de Blaine. Le jeu fait également référence au gang de motards "Lost MC" de l'extension <em>Lost and Damned</em> et au club <strong>Honkers</strong>, montrant que les mondes criminels de Liberty City et Los Santos sont plus connectés qu'il n'y paraît. Peut-être que la référence la plus célèbre est le message vocal que l'on peut parfois entendre, avec une voix disant : "Hey Niko ! C'est Roman ! Allons faire du bowling !" — une ligne devenue iconique dans la communauté GTA.</p>
  
  <h3>Retour à San Andreas : nostalgie de l'âge d'or</h3>
  <p>Pour les joueurs ayant grandi avec GTA : San Andreas, GTA V est un véritable trésor de moments nostalgiques. Près de l'aéroport international de Los Santos, une grande fresque indique clairement <strong>"Welcome Back"</strong>, un hommage direct au retour dans l'État de San Andreas. Cet hommage s'étend même aux détails les plus minutieux : l'école de pilotage du jeu a été créée en 2004, la même année que la sortie de <em>San Andreas</em>. Le jeu propose également un défi de mission appelé <strong>"Better Than CJ"</strong>, une taquinerie humoristique et directe envers son prédécesseur emblématique. Au-delà de ces références évidentes, des détails cachés font allusion à des personnages classiques comme <strong>Big Smoke</strong>, <strong>OG Loc</strong> et <strong>Madd Dogg</strong>, récompensant les fans de longue date par un clin d'œil complice à leur histoire partagée.</p>
  
  <h3>L'univers partagé de Rockstar : des connexions au-delà de GTA</h3>
  <p>L'interconnexion de l'univers Rockstar va bien au-delà de la série GTA. Les développeurs ont habilement intégré des références à leurs autres titres phares.</p>
  
  <h4>Red Dead Redemption</h4>
  <p>Dans le monde de GTA V, l'histoire du Far West perdure. On peut trouver un bouclier du monde <em>Red Dead</em> à l'Yellow Jack Inn. L'appartement de Franklin contient un livre intitulé <strong>"Red Dead"</strong> écrit par <strong>J. Marsden</strong>, un clin d'œil évident au protagoniste John Marston. De plus, un café nommé <strong>Cafe Redemption</strong> se trouve à Los Santos, consolidant le lien entre ces deux franchises épiques.</p>
  
  <h4>Max Payne 3</h4>
  <p>Le jeu rend hommage à l'univers sombre de Max Payne. Un super-yacht nommé "Dignity" fait référence à un navire de <em>Max Payne 3</em>. De plus, une réplique de Michael disant "Honey, I'm home" partage un ton mélancolique similaire à une ligne courante de Max Payne, reliant les natures épuisées des deux protagonistes.</p>
  
  <h4>Autres classiques</h4>
  <p>Les références continuent. Une publicité TV en jeu fait allusion aux enquêtes de <strong>L.A. Noire</strong>. Un PNJ porte un maillot avec le nom <strong>"Hopkins"</strong>, un hommage à Jimmy Hopkins, le personnage principal de <em>Bully</em>. Et pour les fans vraiment morbides, le jeu fait référence au monde violent de <em>Manhunt</em>, avec des mentions de <strong>"Carcer City"</strong>, le lieu du jeu, et un masque ressemblant à l'horrifiant <strong>"Pigsy"</strong>.</p>
  <p>Ces Easter Eggs placés avec minutie sont plus que de simples objets cachés ; ce sont les fils qui relient les vastes mondes de Rockstar, récompensant les joueurs présents depuis le début. Ils transforment GTA V d'une expérience autonome en un hommage définitif à un héritage de jeux révolutionnaires.</p>
      `
  },


  {
    "id": 7,
    "title": "Guide des Easter Eggs BO6 Reckoning – Walkthrough Complet par Ruffwaffles",
    "addressBar": "bo6-reckoning-easter-egg-guide",
    "publishDate": "2025-08-30T16:00:00.000Z",
    "description": "Guide étape par étape des Easter Eggs BO6 Reckoning par Ruffwaffles. Découvrez les conseils pour la mission Black Armor, la collecte du corps de Klaus, l'activation du Pack a Punch et les stratégies pour les boss pour réussir l'easter egg.",
    "imageUrl": "/images/games/game-01.webp",
    "imageAlt": "guide easter egg bo6 reckoning",
    "seo": {
      "title": "Guide des Easter Eggs BO6 Reckoning – Walkthrough Complet par Ruffwaffles",
      "description": "Suivez le guide complet de Ruffwaffles pour BO6 Reckoning, couvrant la mission Black Armor, la collecte du corps de Klaus, l'activation du Pack a Punch et les stratégies pour les boss. Walkthrough étape par étape pour compléter efficacement l'easter egg.",
      "keywords": "BO6 Reckoning, Easter Egg BO6 Reckoning, Guide Easter Egg BO6, Ruffwaffles, mission Black Armor, Klaus, Pack a Punch, stratégies de boss, walkthrough Easter Egg"
    },
    "classify": ["FPS/TPS"],
    "tag": ["Guide de Jeu", "FPS", "Easter Egg", "Combat de Boss"],
    "iframeUrl": "https://www.youtube.com/embed/DjaCGge3Mzk",
    "isHome": true,
    "isLatest": true,
    "detailsHtml": `
      <h2>Guide des Easter Eggs BO6 Reckoning</h2>
  
  <h3>Introduction</h3>
  <p>Bonjour à tous, je suis Ruffwaffles. Voici votre guide clair pour compléter l'Easter Egg BO6 Reckoning.</p>
  
  <h3>Easter Egg de la Mission Black Armor</h3>
  <p>Avant d'entrer dans le jeu, vous rencontrerez six zombies. Voici quelques conseils rapides :</p>
  <ul>
    <li>Le Whirlwind Gun est très efficace contre les petits ennemis.</li>
    <li>Améliorer les boucliers est une bonne compétence sur cette carte.</li>
    <li>Privilégiez l'utilisation de Berserk Soldiers.</li>
  </ul>
  
  <h3>Recommandations pour le Whirlwind Gun</h3>
  <p>Si vous voulez connaître mon équipement pour le Whirlwind Gun :</p>
  <ul>
    <li>Bouche à bloc complet</li>
    <li>Un Ranger</li>
    <li>Poignée quatre doigts sous le canon</li>
    <li>Chargeur étendu, deux segments</li>
    <li>Poignée ergonomique</li>
    <li>Module laser pour viser</li>
    <li>Accessoire Dragon Breath pour flammes</li>
  </ul>
  
  <h3>Étapes après l'entrée dans le jeu</h3>
  <p>Lorsque vous avez des coéquipiers, laissez tout le monde immobile quelques secondes. Priorité : frapper le seau à vadrouille jusqu'à ce qu'il soit sous l'arroseur. La position n'a pas besoin d'être parfaite. Si immobile, allez en position couchée pour frapper, essayez différents angles, puis informez vos coéquipiers d'agir et traversez le détecteur de métaux pour déclencher le système d'arrosage.</p>
  <p>Ensuite, le seau à vadrouille se remplira et le match commencera normalement. Priorisez la zone de recherche des mutants pour optimiser. Ouvrez la porte, utilisez l'ascenseur et cherchez le grand conteneur bleu. Sur le côté droit du conteneur, appuyez sur la touche d'action pour ramasser le composant de seringue. Maintenez la touche jusqu'à réussite, puis suivez le marqueur orange vers le 10ème niveau souterrain.</p>
  
  <h3>Zone de Mise à Niveau des Armes</h3>
  <p>Cette zone nécessite une activation. Tirez sur tous les cristaux violets indiqués par les symboles orange pour activer le Pack-a-Punch. Un faisceau lumineux géant apparaît au centre ; marchez le long du passage latéral et sautez dans le faisceau pour vous transformer en petite boule. Évitez les obstacles mobiles, frappez le corps de la cible, interagissez pour mettre à jour l'objectif, puis quittez la forme boule et utilisez la seringue sur le corps cible.</p>
  <p>Si vous ne pouvez pas entrer dans le faisceau au début, approchez par l'autre côté et sautez dedans.</p>
  
  <h3>Restauration des Bras de Klaus</h3>
  <p>Concentrez-vous sur la restauration des membres manquants de Klaus. Les bras apparaissent lors de tours spéciaux tous les 5–6 tours, correspondant aux tours de swarms. Tirez sur plusieurs Assault Klaus pour faire tomber les bras, ramassez-les et attendez le prochain tour spécial pour le second bras. Utilisez les tours intermédiaires pour d'autres tâches. Retournez à la T1 Mutant Research Test Area et au laboratoire pour trouver des généticiens (zombies en blouse verte) tous les 5–6 tours ; tuez-les pour obtenir une carte clé dorée.</p>
  
  <h3>Collecte de Fioles</h3>
  <p>Allez dans la salle du réfrigérateur avec la femme et l'enfant dans les incubateurs. Maintenez la touche d'action sur le frigo pour collecter la fiole pour usage ultérieur.</p>
  
  <h3>Collecte des Jambes de Klaus</h3>
  <p>Les jambes se trouvent dans la salle T2 Bionic Assembly. Les points de spawn incluent :</p>
  <ul>
    <li>Première jambe : au-dessus de l'étagère</li>
    <li>Deuxième jambe : à côté de la porte cassée</li>
    <li>Troisième jambe : à côté de la TV cassée</li>
    <li>Quatrième jambe : zone de la boîte de flammes</li>
  </ul>
  <p>Ramassez les jambes à ces points. Consultez les sources communautaires pour d'autres emplacements si nécessaire.</p>
  
  <h3>Création de l'Arme Free Gorg</h3>
  <p>Dans le laboratoire de recherche sur les mutants, trouvez deux écrans d'ordinateur affichant du texte vert. Notez les premières lettres des mots. Utilisez le tableau périodique pour convertir les lettres en numéros atomiques (complétez les chiffres uniques avec des zéros). Entrez le code pour déverrouiller le laboratoire biologique secret. Attaquez les zombies pour faire apparaître des parasites, collectez les vésicules, puis allez au laboratoire de calcul quantique pour absorber la vie des Ether Plants. Complétez trois plantes, puis quittez le labo.</p>
  
  <h3>Salle de Contention de l'Entité Sombre</h3>
  <p>Dans la Zone 2, entrez dans la salle de contention, interagissez avec quatre ordinateurs pour activer l'énergie et invoquer Super Klaus. Cassez les épaules, retirez les protections, guidez vers le panneau électrique pour choc. Le Forsaken entre dans Klaus, créant une cible de haute valeur (HVT). Tuez HVT, combinez le matériel de fusion sanguine avec les vésicules pour invoquer Free Gofrex.</p>
  
  <h3>Assemblage de Klaus</h3>
  <p>Allez dans la zone Android Assembly, maintenez la touche d'action pour assembler Klaus. Complétez les étapes de la seringue, injectez le sang pour créer la seringue de mutation Flawler, tuez Manler et ses disciples. Transportez la seringue de mutation Corruption à la Dark Energy Containment Room, utilisez le scanner rétinien pour ouvrir la petite porte et activer le téléporteur.</p>
  
  <h3>Préparation au Boss</h3>
  <p>Avant le combat contre le boss : confirmez munitions triples, stratégie d'attaque, accessoires de munitions, killstreaks, objets de soin, équipement régulier et choix de faction (support Retan ou Max). Maintenez la touche d'action pour activer le portail vers la salle du boss.</p>
  
  <h3>Choix de Faction</h3>
  <p>Au Sentinel Relic, maintenez la touche d'action pour voter :</p>
  <ul>
    <li>Choisir Retan : affronter Max (plus difficile)</li>
    <li>Choisir Max : affronter Retan (plus facile)</li>
  </ul>
  <p>Prenez l'ascenseur vers la zone du conteneur violet, remplissez les conteneurs, tuez les ennemis à proximité, revenez après avoir rempli tous les conteneurs.</p>
  
  <h3>Frappes sur Cristaux Violets</h3>
  <p>Entrez dans le Dark Element Vault, frappez tous les cristaux violets brillants. Cela déclenche l'ascenseur vers la salle du boss.</p>
  
  <h3>Combat contre Samantha Max</h3>
  <p>Évitez les projectiles violets tournants. À 75%, 50%, 25% PV, Sam Trials ou zombies apparaissent. Compléter les épreuves accorde des buffs. Visez le point faible sphère rouge avec des armes à longue portée et transportez le Doctor’s Tribologist pour améliorer la mobilité.</p>
  
  <h3>Combat contre Reckton</h3>
  <p>Phase 1 : Super Principal avec plongeons aériens et projections. Soyez patient. Phase 2 : Klaus version mobile Retan avec Universal Dafa, concentrez-vous sur le mouvement et le rôle de soigneur pour gérer les dégâts.</p>
  
  <h3>Conseils pour les Boss</h3>
  <p>Priorisez la mobilité du soigneur, affaiblissez progressivement le boss, ne vous précipitez pas. Tuez le boss pour compléter l'Easter Egg.</p>
  
  <h3>Laboratoire Quantique & Soul Box</h3>
  <p>Après le combat contre le boss, placez tête de champignon ou objets clés dans la Soul Box, tuez ~30 zombies pour charger. Écoutez les lignes vocales de la tête, puis allez dans la zone Fowler, placez la tête sur le téléporteur.</p>
  
  <h3>Étapes de Sceau sous Vide</h3>
  <p>À la Tower 1, ramassez les appareils de scellage sous vide. Utilisez quatre appareils pour absorber différentes pièces violettes, répétez quatre fois. Insérez les appareils dans la machine et maintenez la touche d'action pour démarrer le programme de verrouillage.</p>
  
  <h3>Verrou Final & Salle du Boss</h3>
  <p>Activez les interrupteurs rouges sur les murs. Attendez 5–10 secondes pour les indices audio. Une fois tous les interrupteurs activés, l'écran devient blanc, indiquant le verrouillage terminé. Combat final prêt.</p>
  
  <h3>Conclusion</h3>
  <p>Suivez ce guide pour maîtriser l'Easter Egg BO6 Reckoning, y compris la restauration des membres de Klaus, l'activation du Pack-a-Punch, la création de l'arme Free Gorg, les opérations du laboratoire quantique, le chargement de la Soul Box, le scellage sous vide et les stratégies pour le combat contre le boss. Une exécution minutieuse garantit le succès.</p>
  
  <h3>Récompenses et Finalisation de l'Easter Egg</h3>
  
  <h4>Confirmer les Membres de Klaus</h4>
  <p>Assurez-vous que les bras et jambes sont assemblés sur la tête de Klaus. Vérifiez les effets de l'arme Gorg et les buffs pour les opérations finales.</p>
  
  <h4>Dernière Opération de la Seringue</h4>
  <p>Retournez à l'emplacement initial de la seringue, insérez la fiole de sang, maintenez la touche d'action pour commencer l'injection. Déclenchez l'injection de mutation Manler, tuez Manler et ses disciples, récupérez la fiole verte pour compléter l'étape spéciale de la seringue.</p>
  
  <h4>Opération Dark Energy Containment Room</h4>
  <p>Entrez dans la salle, utilisez la seringue de mutation Corruption avec le scanner rétinien pour déverrouiller la petite porte. Assurez-vous que les jambes de Klaus et l'effet Gorg sont prêts.</p>
  
  <h4>Super Klaus & HVT</h4>
  <p>Au tour ~16, Super Klaus apparaît. Attachez tous les membres, activez, guidez pour attaque électrique ou à distance, déclenchez la transformation HVT. Tuez HVT, combinez le matériel de fusion sanguine avec les vésicules pour invoquer Free Gofrex.</p>
  
  <h4>Chargement de la Soul Box & Scellage sous Vide</h4>
  <p>Placez les objets clés dans la Soul Box, tuez ~30 zombies pour charger. Utilisez quatre appareils de vide pour absorber les pièces violettes, répétez quatre fois. Insérez les appareils dans la machine, démarrez le programme de verrouillage, activez les interrupteurs rouges, verrou final terminé.</p>
  
  <h4>Boss Final & Finalisation de l'Easter Egg</h4>
  <p>Entrez dans la salle du boss final, suivez les stratégies pour vaincre Samantha Max ou Reckton. Concentrez-vous sur la mobilité des soigneurs, les attaques à distance et les points faibles. À la défaite, l'Easter Egg caché est terminé. Récupérez les récompenses et déclenchez les dialogues ou animations cachés.</p>
  
  <h3>Résumé & Conseils</h3>
  <p>Ce guide couvre la restauration des membres de Klaus, l'activation du Pack-a-Punch, la création de l'arme Free Gorg, les opérations du laboratoire quantique, le chargement de la Soul Box, le scellage sous vide, les stratégies contre le boss et la finalisation de l'Easter Egg caché. Suivez les indications à l'écran, les codes de texte vert et les mots de passe du tableau périodique pour garantir le succès.</p>
      `
  },
  {
    "id": 8,
    "title": "Monster Hunter Wilds : Guide Complet de la Quête de l'Œuf de Wyverne",
    "addressBar": "monster-hunter-wilds-wyvern-egg-guide",
    "publishDate": "2025-08-28T16:00:00.000Z",
    "description": "Apprenez comment livrer en toute sécurité l'œuf de Wyverne dans Monster Hunter Wilds. Ce guide couvre la préparation, la gestion des ennemis et le meilleur itinéraire pour réussir.",
    "imageUrl": "/images/games/game-06.webp",
    "imageAlt": "Monster Hunter Wilds : Guide complet de la livraison de l'œuf",
    "seo": {
      "title": "Monster Hunter Wilds : Guide Complet de la Quête de l'Œuf de Wyverne",
      "description": "Ne laissez pas l'œuf de Wyverne se casser ! Suivez notre guide complet pour Monster Hunter Wilds, détaillant chaque étape de la quête, de la préparation et de la collecte de l'œuf à la livraison en toute sécurité.",
      "keywords": "Monster Hunter Wilds, Œuf de Wyverne, guide, walkthrough, quête, comment faire, livraison Œuf de Wyverne, conseils de gameplay, MH Wilds, Monster Hunter, stratégie, astuces"
    },
    "classify": ["RPG"],
    "tag": ["Monster Hunter Wilds", "Œuf de Wyverne", "Guide", "Walkthrough", "Quête", "Conseils Gameplay"],
    "iframeUrl": "https://www.youtube.com/embed/MiCW1s_UB3c",
    "isHome": true,
    "isLatest": false,
    "detailsHtml": `
      <h2>Monster Hunter Wilds : Guide pour Livrer en Toute Sécurité l'Œuf de Wyverne</h2>
  
  <p>Dans <em>Monster Hunter Wilds</em>, la quête de livraison de l'Œuf de Wyverne est un défi palpitant qui demande plus que des compétences de combat. Elle exige une planification minutieuse, une exécution parfaite et un peu de chance. Ce guide, basé sur un walkthrough vidéo détaillé, fournit une décomposition étape par étape pour assurer le transport réussi du précieux œuf jusqu'au camp.</p>
  <h3>Étape 1 : Préparer votre Voyage</h3>
<p>Avant d'approcher du nid, la préparation est essentielle. Reposez-vous dans votre tente jusqu'à ce que vous rencontriez un groupe de créatures appelées « Yin c c ». Ces monstres aident à limiter le nombre d'autres créatures agressives dans la zone, créant un chemin plus sûr pour votre mission. De plus, assurez-vous que le camp dans la zone 7 est débloqué, car son emplacement favorable offre le point de dépôt le plus facile pour cet objectif.</p>

<h3>Étape 2 : Entrer dans le Nid et Sécuriser l'Œuf</h3>
<p>L'Œuf de Wyverne se trouve dans la zone 11, un nid dangereux généralement gardé par un Rathalos ou un Rathian. En approchant du nid, ces monstres peuvent devenir agressifs. Le guide suggère d'utiliser une bouse normale ou grande : toucher le Wyverne avec elle le fera partir temporairement, vous offrant une fenêtre cruciale pour récupérer l'œuf.</p>

<h3>Étape 3 : Le Périlleux Retour</h3>
<p>Une fois l'œuf en main, le véritable défi commence. L'œuf est extrêmement fragile, et toute chute importante le fera se casser, entraînant l'échec de la quête. Utilisez des lianes spécifiques pour descendre lentement des falaises et suivez le chemin exact montré dans le walkthrough. Une approche lente et régulière est la clé du succès.</p>

<h3>Étape 4 : Naviguer parmi les Obstacles</h3>
<p>Votre retour au camp comprendra probablement des interruptions. Si vous êtes attaqué par une faune agressive plus petite, posez temporairement l'œuf pour vous en occuper. Éliminez rapidement les créatures et reprenez l'œuf pour continuer. Si le Rathalos ou le Rathian revient, utilisez une autre bouse pour le faire reculer à nouveau. En approchant du camp, surveillez les guêpes. Utiliser une arme à distance depuis un endroit sûr aide à éviter que l'œuf ne soit endommagé.</p>

<h3>Étape 5 : Livraison Réussie</h3>
<p>Après avoir surmonté tous les obstacles et atteint le camp, la dernière étape est simple. L'œuf de Wyverne sera automatiquement pris par le camp, complétant la livraison. Cette quête exige patience, planification et vigilance. En suivant ce guide, vous augmentez considérablement vos chances de réussite et pouvez profiter de la satisfaction d'un travail bien fait.</p>
`
  }

]

