-- Pack complet : 3 tubes + briquet + gaz
UPDATE products SET description_longue = '<p><strong>Le kit complet pour démarrer.</strong> Ce pack réunit tout le nécessaire pour réaliser vos scellés immédiatement, sans rien avoir à commander en plus.</p>
<h3>Le contenu du pack</h3>
<ul>
<li><strong>3 tubes de 30 pastilles Scellés Flash</strong> — soit 90 pastilles adhésives prêtes à l’emploi, avec leur bouchon applicateur contenant l’agent démoulant.</li>
<li><strong>1 briquet chalumeau</strong> — la source de chaleur indispensable pour faire fondre la pastille en quelques secondes.</li>
<li><strong>1 recharge de gaz 120 ml</strong> — pour assurer l’autonomie de votre chalumeau sur le terrain.</li>
</ul>
<h3>Pourquoi ce pack</h3>
<ul>
<li><strong>Autonomie immédiate :</strong> 90 scellés réalisables dès réception.</li>
<li><strong>Économique :</strong> plus avantageux que l’achat des éléments séparément.</li>
<li><strong>Idéal pour équiper un poste</strong> ou constituer un stock de départ.</li>
</ul>
<p><em>Le cachet en laiton n’est pas inclus dans ce pack. Retrouvez nos cachets personnalisables dans le catalogue.</em></p>'
WHERE slug = 'pack-scelles-flash-complet';

-- Lot de 5 tubes
UPDATE products SET description_longue = '<p><strong>Lot de 5 tubes de Scellés Flash</strong>, soit 150 pastilles adhésives prêtes à l’emploi.</p>
<p>Format pensé pour les structures qui scellent régulièrement : études, mairies, services funéraires. Chaque tube conserve les pastilles à l’abri de la poussière et intègre le bouchon applicateur contenant l’agent démoulant, qui empêche le cachet de coller à la cire.</p>
<h3>Le contenu</h3>
<ul>
<li><strong>5 tubes de 30 pastilles</strong> — 150 scellés au total.</li>
<li><strong>Diamètre adapté</strong> aux sceaux standards de 25 à 30 mm, sans surplus de cire.</li>
<li><strong>Pose horizontale ou verticale</strong> — documents, cercueils, montants de porte.</li>
</ul>
<h3>Rappel du principe</h3>
<p>Collez la pastille à l’endroit voulu, chauffez 4 à 5 secondes au briquet chalumeau, pressez votre cachet et démoulez. Le sceau est figé, brillant et régulier.</p>
<p><em>Nécessite un briquet chalumeau et un cachet en laiton, vendus séparément.</em></p>'
WHERE slug = 'scelles-flash-5-tubes';

SELECT slug, CASE WHEN description_longue IS NULL THEN 'MANQUANT' ELSE 'OK' END AS descriptif FROM products ORDER BY descriptif DESC, slug;
