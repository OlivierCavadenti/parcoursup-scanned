/**
 * Registre documentaire du site — source unique de vérité.
 *
 * Statut de vérification :
 *  - "verifie"     : document lu intégralement pendant la recherche (date de consultation indiquée) ;
 *  - "cite"        : référence citée par un document vérifié, non consultée directement ;
 *  - "a-verifier"  : référence repérée (moteur de recherche, index) mais non lue — ne sert
 *                    jamais de fondement unique à une affirmation du site.
 * Ne jamais ajouter de référence inventée. Une URL non vérifiée doit porter le statut adéquat.
 */
import { z } from "zod";

export const NatureSource = z.enum([
  "code-source",
  "documentation-institutionnelle",
  "texte-juridique",
  "jeu-de-donnees",
  "decision-de-justice",
  "rapport-public",
  "publication-scientifique",
  "presse",
]);

export const SourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titre: z.string().min(3),
  organisation: z.string(),
  url: z.string().url(),
  nature: NatureSource,
  datePublication: z.string().optional(),
  dateConsultation: z.string().optional(),
  campagne: z.string().optional(),
  version: z.string().optional(),
  statut: z.enum(["verifie", "cite", "a-verifier"]),
  licence: z.string().optional(),
  note: z.string().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

export const OFFICIAL_REPO_GITLAB = "https://gitlab.mim-libre.fr/parcoursup/algorithmes-de-parcoursup";
export const OFFICIAL_REPO_MIRROR = "https://github.com/flyingtof/algorithmes-de-parcoursup";
export const REFERENCE_COMMIT = "8c406bfdd561ebda827a7746e031964356ca9941";
export const REFERENCE_VERSION = "2024-2";
export const REFERENCE_DATE = "2024-06-12";
export const DATE_ETUDE = "2026-10-14";

const sources: Source[] = [
  {
    id: "code-gitlab",
    titre: "Algorithmes de Parcoursup — dépôt officiel",
    organisation: "Ministère de l'Enseignement supérieur et de la Recherche (forge MIM-Libre)",
    url: OFFICIAL_REPO_GITLAB,
    nature: "code-source",
    statut: "cite",
    licence: "AGPL-3.0",
    note: "Dépôt de publication officiel référencé par l'index code.gouv.fr. Non joignable depuis l'environnement de développement le 14/10/2026 : le contenu a été étudié via le miroir public ci-dessous. Le cahier des charges du projet mentionne aussi l'adresse …/parcour-sup/algorithmes-de-parcoursup.",
  },
  {
    id: "code-miroir",
    titre: "Miroir public du dépôt algorithmes-de-parcoursup",
    organisation: "Miroir GitHub (flyingtof)",
    url: OFFICIAL_REPO_MIRROR,
    nature: "code-source",
    dateConsultation: DATE_ETUDE,
    datePublication: REFERENCE_DATE,
    version: `${REFERENCE_VERSION} (commit ${REFERENCE_COMMIT.slice(0, 7)})`,
    campagne: "2024",
    statut: "verifie",
    licence: "AGPL-3.0",
    note: "Code compilé et exécuté (Maven, Java 21) pour produire les jeux de référence des tests de conformité.",
  },
  {
    id: "presentation-2023",
    titre: "Document de présentation des algorithmes de Parcoursup (mise à jour mai 2023)",
    organisation: "MESR",
    url: `${OFFICIAL_REPO_MIRROR}/blob/${REFERENCE_COMMIT}/doc/presentation_algorithmes_parcoursup_2023.pdf`,
    nature: "documentation-institutionnelle",
    datePublication: "2023-05",
    dateConsultation: DATE_ETUDE,
    campagne: "2023",
    statut: "verifie",
    note: "Fichier doc/presentation_algorithmes_parcoursup_2023.pdf du dépôt officiel. Contient les exemples chiffrés repris dans les tests.",
  },
  {
    id: "implementation-txt",
    titre: "Implémentation des algorithmes de Parcoursup (doc/implementation.txt)",
    organisation: "MESR — H. Gimbert",
    url: `${OFFICIAL_REPO_MIRROR}/blob/${REFERENCE_COMMIT}/doc/implementation.txt`,
    nature: "documentation-institutionnelle",
    dateConsultation: DATE_ETUDE,
    version: REFERENCE_VERSION,
    statut: "verifie",
  },
  {
    id: "presentations-anterieures",
    titre: "Documents de présentation des algorithmes 2018 à 2022",
    organisation: "MESR",
    url: `${OFFICIAL_REPO_MIRROR}/tree/${REFERENCE_COMMIT}/doc`,
    nature: "documentation-institutionnelle",
    dateConsultation: DATE_ETUDE,
    statut: "cite",
    note: "Présents dans le dépôt ; seule la version 2023 a été lue intégralement.",
  },
  {
    id: "loi-ore",
    titre: "Loi n° 2018-166 du 8 mars 2018 relative à l'orientation et à la réussite des étudiants",
    organisation: "Légifrance",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000036683777",
    nature: "texte-juridique",
    datePublication: "2018-03-08",
    statut: "cite",
    note: "Citée par la présentation officielle 2023 (§1 et §2.2).",
  },
  {
    id: "code-education",
    titre: "Code de l'éducation — art. L. 612-3 et D. 612-1-1 et suivants",
    organisation: "Légifrance",
    url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006071191",
    nature: "texte-juridique",
    statut: "cite",
    note: "Articles cités en notes par la présentation officielle 2023 : L. 612-3 (taux, priorités), D. 612-1-4 (capacités), D. 612-1-11 (sous-vœux, regroupements), D. 612-1-13 (formations non sélectives non tenues d'ordonner), D. 612-1-14 (délais de réponse), D. 612-1-15 (groupes), D. 612-1-16 (internats).",
  },
  {
    id: "arrete-calendrier-2023",
    titre: "Arrêté fixant le calendrier de la procédure nationale de préinscription (campagne 2023)",
    organisation: "Légifrance",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000047246973/",
    nature: "texte-juridique",
    campagne: "2023",
    statut: "cite",
    note: "Cité par la présentation officielle 2023 (§6, ordonnancement des vœux et répondeur automatique).",
  },
  {
    id: "loi-2020-1674",
    titre: "Loi n° 2020-1674 du 24 décembre 2020 de programmation de la recherche, art. 37",
    organisation: "Légifrance",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000042738027",
    nature: "texte-juridique",
    datePublication: "2020-12-24",
    statut: "cite",
    note: "Abrogation du dispositif « meilleurs bacheliers », selon doc/implementation.txt du dépôt officiel.",
  },
  {
    id: "dgesip-algorithme",
    titre: "Algorithme national de Parcoursup (page de l'offre de services DGESIP)",
    organisation: "DGESIP",
    url: "https://services.dgesip.fr/T454/S764/algorithme_national_de_parcoursup",
    nature: "documentation-institutionnelle",
    statut: "cite",
    note: "Citée en note 3 de la présentation officielle 2023.",
  },
  {
    id: "cesp",
    titre: "Comité éthique et scientifique de Parcoursup (CESP) — rapports annuels",
    organisation: "DGESIP",
    url: "https://services.dgesip.fr/T454/S949/comite_ethique_et_scientifique_parcoursup",
    nature: "rapport-public",
    statut: "cite",
    note: "Citée en note 2 de la présentation officielle 2023.",
  },
  {
    id: "dgesip-cadre-legal",
    titre: "Cadre législatif et réglementaire de Parcoursup",
    organisation: "DGESIP",
    url: "https://services.dgesip.fr/T454/S584/cadre_legislatif_et_reglementaire",
    nature: "documentation-institutionnelle",
    statut: "cite",
    note: "Citée en note 1 de la présentation officielle 2023.",
  },
  {
    id: "dgesip-examen-voeux",
    titre: "Fiche de cadrage : taux de mobilité sociale et territoriale (examen des vœux)",
    organisation: "DGESIP",
    url: "https://services.dgesip.fr/T454/S322/examen_des_voeux",
    nature: "documentation-institutionnelle",
    statut: "cite",
    note: "Citée en note 9 de la présentation officielle 2023.",
  },
  {
    id: "parcoursup-site",
    titre: "Parcoursup — site officiel",
    organisation: "MESR",
    url: "https://www.parcoursup.gouv.fr/",
    nature: "documentation-institutionnelle",
    statut: "a-verifier",
    note: "Non joignable depuis l'environnement de développement. Seule source faisant foi pour les candidats.",
  },
  {
    id: "data-parcoursup",
    titre: "Parcoursup — vœux de poursuite d'études et de réorientation (fr-esr-parcoursup)",
    organisation: "MESR — SIES (data.enseignementsup-recherche.gouv.fr)",
    url: "https://data.enseignementsup-recherche.gouv.fr/explore/dataset/fr-esr-parcoursup/",
    nature: "jeu-de-donnees",
    statut: "cite",
    licence: "Licence Ouverte / Open Licence",
    note: "Importé par la chaîne de données lors du déploiement (voir docs/research/data-sources.md). Les noms de colonnes sont validés à l'import.",
  },
  {
    id: "data-cartographie",
    titre: "Cartographie des formations Parcoursup",
    organisation: "MESR (data.gouv.fr / data.enseignementsup-recherche.gouv.fr)",
    url: "https://www.data.gouv.fr/fr/datasets/cartographie-des-formations-parcoursup/",
    nature: "jeu-de-donnees",
    statut: "a-verifier",
    note: "Repéré par recherche ; fichier CSV d'environ 85 Mo couvrant les campagnes 2020 à 2026 selon la page du jeu de données.",
  },
  {
    id: "methodo-2020",
    titre: "Méthodologie des données Parcoursup 2020 (définition du taux d'accès)",
    organisation: "MESR — SIES",
    url: "https://data.enseignementsup-recherche.gouv.fr/api/datasets/1.0/fr-esr-parcoursup_2020/attachments/methodologie_opendata_2020_pdf",
    nature: "documentation-institutionnelle",
    campagne: "2020",
    statut: "a-verifier",
    note: "Selon le résumé du moteur de recherche : le taux d'accès rapporte le nombre de candidats classés jusqu'au rang du dernier appelé de leur groupe au nombre de candidats ayant confirmé un vœu en phase principale.",
  },
  {
    id: "cc-2020-834",
    titre: "Conseil constitutionnel, décision n° 2020-834 QPC du 3 avril 2020 (UNEF)",
    organisation: "Conseil constitutionnel",
    url: "https://www.conseil-constitutionnel.fr/decision/2020/2020834QPC.htm",
    nature: "decision-de-justice",
    datePublication: "2020-04-03",
    statut: "a-verifier",
    note: "Décision relative à la communication des traitements algorithmiques locaux. Non consultée pendant cette session : citée uniquement comme piste, sans en résumer la portée.",
  },
  {
    id: "next-algos-locaux",
    titre: "Le gouvernement ouvre le code source de Parcoursup, mais pas ses algorithmes locaux",
    organisation: "Next (ex-Next INpact)",
    url: "https://next.ink/7867/106617-le-gouvernement-ouvre-code-source-parcoursup-mais-pas-ses-algorithmes-locaux/",
    nature: "presse",
    datePublication: "2018-05",
    statut: "a-verifier",
    note: "Article de presse repéré par recherche (accès premium).",
  },
  {
    id: "next-vulnerabilites",
    titre: "Parcoursup : les vulnérabilités dans le code source ne permettent pas de le publier",
    organisation: "Next",
    url: "https://next.ink/126635/parcoursup-les-vulnerabilites-dans-le-code-source-ne-permettent-pas-de-le-publier/",
    nature: "presse",
    datePublication: "2023",
    statut: "a-verifier",
    note: "Selon le résumé du moteur de recherche : rejet par le tribunal administratif de Paris d'une demande de communication de l'intégralité du code source de la plateforme.",
  },
  {
    id: "why3-parcoursup",
    titre: "why3/parcoursup — vérification formelle d'algorithmes de Parcoursup",
    organisation: "Inria (gitlab.inria.fr)",
    url: "https://gitlab.inria.fr/why3/parcoursup",
    nature: "publication-scientifique",
    statut: "a-verifier",
    note: "Repéré via l'index code.gouv.fr ; contenu non consulté.",
  },
  {
    id: "ministere-github",
    titre: "MinistereSupRecherche/parcoursup (GitHub)",
    organisation: "MESR",
    url: "https://github.com/MinistereSupRecherche/parcoursup",
    nature: "code-source",
    dateConsultation: DATE_ETUDE,
    statut: "verifie",
    note: "Dépôt cloné le 14/10/2026 : il ne contient qu'un fichier README (commit du 17/05/2018), sans code.",
  },
];

export const SOURCES: ReadonlyMap<string, Source> = new Map(
  sources.map((s) => [s.id, SourceSchema.parse(s)] as const),
);

export function source(id: string): Source {
  const s = SOURCES.get(id);
  if (!s) throw new Error(`Source inconnue : ${id}`);
  return s;
}

export const LIBELLES_STATUT: Record<Source["statut"], string> = {
  verifie: "Lu et vérifié",
  cite: "Cité par une source vérifiée",
  "a-verifier": "Repéré, à vérifier",
};
