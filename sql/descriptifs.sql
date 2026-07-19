UPDATE products SET description_longue = '<p><strong>La révolution du sceau de cire : collez, chauffez, scellez !</strong></p>
<p>Oubliez la cire traditionnelle qui coule et les manipulations fastidieuses. Avec Scellés Flash, réalisez des sceaux parfaits, nets et réguliers en un temps record. Présentées sous forme de pastilles adhésives prêtes à l''emploi, elles se positionnent d''un geste et se liquéfient en quelques secondes pour accueillir votre cachet en laiton.</p>
<h3>Contenu du pack</h3>
<ul>
<li>30 pastilles de cire adhésives prêtes à l''emploi</li>
<li>1 tube de protection pratique et hermétique pour conserver vos pastilles à l''abri de la poussière</li>
<li>Bouchon applicateur intégré : contient l''agent démoulant, votre cachet en laiton ne colle jamais à la cire</li>
</ul>
<h3>Les points forts</h3>
<ul>
<li>Pose horizontale ou verticale (documents, cercueils, montants de porte)</li>
<li>Aucun gaspillage, dosage parfait : diamètre idéal pour un sceau standard de 25 à 30 mm</li>
<li>Ciblez avec précision grâce à la face adhésive : fini les coulures de travers</li>
<li>Rapidité extrême : 10 secondes de chauffe suffisent</li>
<li>Stockage nomade : le tube compact se glisse dans un tiroir ou une trousse</li>
</ul>
<h3>Mode d''emploi</h3>
<p>Assurez-vous d''avoir votre cachet en laiton et votre source de chaleur à portée de main.</p>
<ol>
<li>Pressez la tête en laiton de votre cachet dans le bouchon du tube pour l''imbiber d''agent démoulant.</li>
<li>Retirez la pellicule protectrice, collez la pastille à l''endroit désiré, présentez la flamme d''un mini-chalumeau au-dessus pendant 10 secondes pour la faire fondre superficiellement.</li>
<li>Pressez votre cachet sur la cire chaude. Retirez-le aussitôt : le sceau est figé, brillant et parfait.</li>
</ol>'
WHERE slug = 'scelles-flash-tube';

UPDATE products SET description_longue = '<h3>Caractéristiques techniques</h3>
<ul>
<li><strong>Matériaux :</strong> laiton de haute qualité (excellente conductivité thermique pour figer la cire rapidement et un démoulage propre), manche en bois naturel verni pour une prise en main confortable et stable</li>
<li><strong>Diamètre :</strong> 25 mm ou 30 mm (les standards les plus polyvalents)</li>
<li><strong>Longueur :</strong> environ 9 cm</li>
</ul>
<h3>Les points forts</h3>
<ul>
<li>Gravure de haute précision : reliefs nets, motifs détaillés, rendu final impeccable sur la cire</li>
</ul>
<h3>Conseils d''utilisation</h3>
<ol>
<li>Faites fondre quelques perles de cire à l''aide d''une cuillère à bougie.</li>
<li>Coulez délicatement la cire sur votre support (papier, carton, ruban).</li>
<li>Posez brièvement la tête en laiton sur un bloc de glace ou un chiffon humide très froid avant de l''appliquer : le choc thermique figera la cire instantanément pour un démoulage parfait.</li>
<li>Appliquez le cachet fermement sans écraser, patientez 10 à 15 secondes avant de retirer délicatement le sceau.</li>
</ol>
<p><strong>S''associe parfaitement à la technologie des Scellés Flash</strong> : collez, chauffez 10 secondes, appliquez, et votre empreinte est parfaite.</p>'
WHERE slug IN ('sceau-laiton-30mm', 'sceau-laiton-25mm');

UPDATE products SET description_longue = '<h3>Recharge universelle de gaz pour briquets</h3>
<ul>
<li><strong>Marque :</strong> BELFLAM</li>
<li><strong>Contenance :</strong> 120 ml</li>
<li><strong>5 embouts adaptatifs</strong> fournis</li>
<li>Gaz de qualité préservant vos briquets chalumeaux</li>
</ul>
<p>Recharge butane universelle, presque sans impuretés, idéale pour l''entretien et la longévité de vos briquets chalumeaux professionnels.</p>'
WHERE slug = 'belflam-gaz-120ml';

SELECT slug, LEFT(description_longue, 40) AS apercu FROM products WHERE description_longue IS NOT NULL;
