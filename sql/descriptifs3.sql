-- Mallette LUX
UPDATE products SET description_longue = '<p><strong>Kit complet de scellement professionnel.</strong> L’alliance du savoir-faire traditionnel et de la technologie flash : rapide, propre et nomade.</p>
<p>Idéale pour les professionnels recherchant rapidité et efficacité, cette mallette tout-en-un regroupe l’essentiel pour réaliser des scellés propres et sécurisés, sans cire à fondre.</p>
<h3>Le contenu de la mallette</h3>
<ul>
<li><strong>1 cachet en laiton personnalisé :</strong> gravé sur mesure à votre effigie, vos initiales ou votre logo, pour un rendu net et professionnel.</li>
<li><strong>1 tube de 30 pastilles Scellés Flash :</strong> la solution moderne et rapide, prête à coller sans contrainte de fusion.</li>
<li><strong>1 briquet chalumeau métal LUX :</strong> élégant et ergonomique, pour une chauffe précise.</li>
<li><strong>1 recharge de gaz 120 ml :</strong> l’assurance d’une autonomie optimale de votre chalumeau sur le terrain.</li>
</ul>'
WHERE slug = 'malette-intervention-lux';

-- Mallette ECO
UPDATE products SET description_longue = '<p><strong>L’essentiel du scellement nomade.</strong></p>
<p>Idéale pour équiper vos équipes avec un matériel fiable et économique, cette mallette regroupe tout le nécessaire pour des interventions rapides et propres, sans cire à fondre.</p>
<h3>Le contenu de la mallette</h3>
<ul>
<li><strong>1 cachet en laiton personnalisé :</strong> gravé sur mesure avec votre logo, vos initiales ou votre texte, pour un marquage net.</li>
<li><strong>1 tube de 30 pastilles Scellés Flash :</strong> la solution moderne, rapide et prête à l’emploi.</li>
<li><strong>1 briquet chalumeau ECO :</strong> un outil léger, fonctionnel et parfaitement adapté à un usage régulier sur le terrain.</li>
<li><strong>1 recharge de gaz 120 ml :</strong> pour assurer une autonomie immédiate à votre chalumeau.</li>
</ul>'
WHERE slug = 'malette-intervention-eco';

-- Briquet chalumeau LUX
UPDATE products SET description_longue = '<p><strong>La puissance d’un chalumeau, l’élégance en plus.</strong></p>
<p>À la fois raffiné et robuste, le briquet chalumeau LUX en métal est l’outil indispensable des professionnels exigeants en intervention. Son design soigné en fait également un cadeau d’affaires d’exception, ou une attention haut de gamme pour les amateurs de beaux objets.</p>
<h3>Ses atouts principaux</h3>
<ul>
<li><strong>Conception tout en métal :</strong> une finition élégante, une prise en main agréable et une réelle durabilité.</li>
<li><strong>Flamme ajustable :</strong> permet de régler l’intensité de la chauffe selon vos besoins précis sur le terrain.</li>
<li><strong>Entièrement rechargeable :</strong> conçu pour durer, il se recharge facilement avec une recharge de gaz standard (gaz BELFLAM recommandé).</li>
<li><strong>Idée cadeau idéale :</strong> son design soigné et sa présentation élégante en font un présent parfait et original.</li>
</ul>'
WHERE slug = 'briquet-chalumeau-metal-lux';

-- Chalumeau JET (fiche "format stylo")
UPDATE products SET description_longue = '<p><strong>Alliant l’élégance d’un stylo à la puissance d’un chalumeau</strong>, cet outil compact et très maniable offre un contrôle optimal de la chauffe. C’est l’allié parfait pour un travail net, précis et répétitif.</p>
<h3>Points forts</h3>
<ul>
<li><strong>Design format stylo :</strong> une prise en main naturelle et une excellente précision de geste, idéale pour cibler exactement la zone à chauffer.</li>
<li><strong>Haute qualité et durabilité :</strong> conçu avec des matériaux robustes pour un usage professionnel ou quotidien prolongé.</li>
<li><strong>Flamme réglable et rechargeable :</strong> maîtrisez facilement l’intensité de la flamme selon la matière, et rechargez-le en toute simplicité.</li>
<li><strong>Idéal pour scellés et plus :</strong> parfaitement adapté à la pose de scellés de sécurité, cire ou plastiques, tout en restant polyvalent pour divers petits travaux de précision.</li>
</ul>'
WHERE slug = 'chalumeau-jet';

-- Cachet officiel (Marianne)
UPDATE products SET description_longue = '<p><strong>Exclusivement réservé aux administrations et professions réglementées autorisées :</strong> commissaires de justice (ex-huissiers), police nationale, gendarmerie, douanes, mairies et collectivités territoriales, préfectures et ministères.</p>
<h3>Caractéristiques techniques</h3>
<ul>
<li><strong>Matériau de la matrice :</strong> laiton massif, pour une excellente restitution des détails lors du pressage.</li>
<li><strong>Gravure :</strong> gravure mécanique de précision (Marianne, armoiries, texte réglementaire officiel).</li>
<li><strong>Manche :</strong> bois verni ergonomique, pour une prise en main stable et confortable lors de l’application.</li>
</ul>
<h3>Conditions de commande et pièces obligatoires</h3>
<p>Conformément aux réglementations relatives à la reproduction des symboles officiels de la République française (Marianne, armes de l’État), toute commande de ce type est strictement contrôlée. Vous devrez fournir :</p>
<ul>
<li><strong>Une autorisation signée :</strong> attestation officielle sur papier en-tête de l’organisme ou de l’étude.</li>
<li><strong>L’identité du commanditaire :</strong> justificatif d’identité et preuve de fonction ou d’habilitation du signataire.</li>
<li><strong>Un bon de commande officiel</strong> émis par l’administration ou la charge professionnelle concernée.</li>
</ul>
<h3>Paiement par mandat administratif</h3>
<p>Réservé aux administrations et établissements publics français (mairies, préfectures, commissariats, gendarmerie, douanes, écoles et universités publiques). Documents requis :</p>
<ul>
<li>Le bon de commande officiel portant l’en-tête de l’administration, le numéro de SIRET, le code APE et le visa de l’ordonnateur.</li>
<li>Les identifiants Chorus Pro (numéro d’engagement, code service) pour la transmission de la facture électronique.</li>
</ul>'
WHERE slug IN ('sceau-marianne-30mm', 'sceau-marianne-25mm');

-- Cachet funéraire
UPDATE products SET description_longue = '<p><strong>Cachet laiton pour services funéraires</strong> — pompes funèbres, mises en bière, scellés.</p>
<p>Téléchargez votre propre logo, ou choisissez parmi nos propositions : FUNECAP, ROC ECLERC, ARBRE DE VIE, COLOMBES.</p>
<h3>Caractéristiques techniques</h3>
<ul>
<li><strong>Matériau de la matrice :</strong> laiton massif, pour une excellente restitution des détails lors du pressage.</li>
<li><strong>Gravure :</strong> gravure mécanique de précision, restitution parfaite de votre logo.</li>
<li><strong>Manche :</strong> bois verni ergonomique, pour une prise en main stable et confortable lors de l’application.</li>
</ul>'
WHERE slug IN ('sceau-funeraire-30mm', 'sceau-funeraire-25mm');

-- Boite de 10 batons de cire
UPDATE products SET description_longue = '<p><strong>Boîte de 10 bâtons de cire officielle à scellés.</strong></p>
<h3>Caractéristiques principales</h3>
<ul>
<li><strong>Contenu :</strong> boîte de 10 bâtons de cire à cacheter.</li>
<li><strong>Mode d’utilisation :</strong> nécessite un briquet chalumeau pour une chauffe homogène et instantanée.</li>
<li><strong>Rendu visuel :</strong> finition brillante, lisse et raffinée.</li>
</ul>
<h3>Conseil d’utilisation</h3>
<ol>
<li>Allumez votre briquet chalumeau et maintenez la flamme à faible distance de l’extrémité du bâton de cire, en l’inclinant légèrement.</li>
<li>Laissez tomber les gouttes de cire fondue sur le support, à l’endroit souhaité.</li>
<li>Appliquez fermement votre sceau en métal dans la cire encore chaude.</li>
<li>Patientez 5 à 10 secondes, puis retirez délicatement le sceau d’un mouvement vertical.</li>
</ol>'
WHERE slug = 'batons-cire-cacheter';

SELECT slug, CASE WHEN description_longue IS NULL THEN 'MANQUANT' ELSE 'OK' END AS descriptif FROM products ORDER BY descriptif DESC, slug;
