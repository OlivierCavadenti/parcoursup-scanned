/*
 * Harnais de référence — Parcoursup Décrypté.
 *
 * Exécute le code Java OFFICIEL des algorithmes de Parcoursup (dépôt
 * algorithmes-de-parcoursup, licence AGPL-3.0) sur des entrées fictives au
 * format JSON du projet, afin de produire des résultats de référence
 * (« fixtures ») utilisés par les tests de conformité du moteur TypeScript.
 *
 * Ce fichier n'embarque aucune ligne du code officiel : il l'appelle via le
 * jar compilé depuis les sources publiées.
 *
 * Usage :
 *   java -cp <jar>:build Harness gen-oa  <seed> <nb> <dossier>
 *   java -cp <jar>:build Harness gen-sim <seed> <nb> <dossier>
 */
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import fr.parcoursup.algos.ordreappel.algo.*;
import fr.parcoursup.algos.propositions.algo.*;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

public class Harness {

    static final Gson GSON = new GsonBuilder().disableHtmlEscaping().create();

    /* ---------------- formats d'échange ---------------- */

    static class OaVoeu { int candidat; int rang; boolean boursier; boolean duSecteur; }
    static class OaGroupe { int id; int tauxMinBoursiersPourcents; int tauxMinDuSecteurPourcents; List<OaVoeu> voeux = new ArrayList<>(); }
    static class OaResultat { int candidat; int rangAppel; }
    static class OaFixture { String nom; OaGroupe entree; List<OaResultat> attendu = new ArrayList<>(); String erreur; }

    static class PParametres { int nbJoursCampagne; int nbJoursCampagneDateFinReservationInternats; int nbJoursCampagneDateDebutGDD; int nbJoursCampagneDateFinOrdonnancementGDD; }
    static class PGroupe { int cGpCod; int gTiCod; int gTaCod; int nbRecrutementsSouhaite; int rangLimite; int rangDernierAppeleActuellement; int rangDernierAppeleReference; boolean finReservationInternats; boolean admStop; }
    static class PInternatId { int cGiCod; int gTiCod; int gTaCod; }
    static class PInternat { PInternatId id; int capacite; }
    static class PVoeu { int gCnCod; int cGpCod; int gTiCod; int gTaCod; boolean avecInternat; PInternatId internat; int ordreAppel; int rangInternat; int rangPreferences; String statut; boolean affecteHorsPP; }
    static class PEntree { PParametres parametres = new PParametres(); List<PGroupe> groupes = new ArrayList<>(); List<PInternat> internats = new ArrayList<>(); List<PVoeu> voeux = new ArrayList<>(); List<Integer> candidatsAvecRepondeurAutomatique = new ArrayList<>(); }
    static class PVoeuSortie { int gCnCod; int gTaCod; boolean avecInternat; String statut; }
    static class PInternatSortie { PInternatId id; int positionAdmission; int positionMaximaleAdmission; }
    static class PGroupeSortie { int cGpCod; int gTiCod; int gTaCod; int estimationRangDernierAppele; }
    static class PSortie { List<PVoeuSortie> voeux = new ArrayList<>(); List<PInternatSortie> internats = new ArrayList<>(); List<PGroupeSortie> groupes = new ArrayList<>(); boolean alerte; boolean avertissement; }
    static class PFixture { String nom; int jour; PEntree entree; PSortie attendu; String erreur; }

    /* ---------------- ordre d'appel ---------------- */

    static OaFixture executerOa(String nom, OaGroupe g) {
        OaFixture f = new OaFixture();
        f.nom = nom; f.entree = g;
        try {
            GroupeClassement gc = new GroupeClassement(g.id, g.tauxMinBoursiersPourcents, g.tauxMinDuSecteurPourcents);
            for (OaVoeu v : g.voeux) gc.ajouterVoeu(new VoeuClasse(v.candidat, v.rang, v.boursier, v.duSecteur));
            AlgoOrdreAppelEntree e = new AlgoOrdreAppelEntree();
            e.groupesClassements.add(gc);
            AlgoOrdreAppelSortie s = AlgoOrdreAppel.calculerOrdresAppels(e);
            for (CandidatClasse c : s.ordresAppel.get(g.id).candidats) {
                OaResultat r = new OaResultat(); r.candidat = c.gCnCod; r.rangAppel = c.rangAppel; f.attendu.add(r);
            }
        } catch (Exception ex) {
            f.erreur = ex.getClass().getSimpleName() + ": " + ex.getMessage();
        }
        return f;
    }

    static OaGroupe groupeOaAleatoire(Random r, int id) {
        OaGroupe g = new OaGroupe();
        g.id = id;
        int n = 1 + r.nextInt(r.nextInt(10) == 0 ? 400 : 60);
        int profil = r.nextInt(6);
        g.tauxMinBoursiersPourcents = profil == 0 ? 0 : (profil == 5 ? r.nextInt(101) : r.nextInt(50));
        boolean avecSecteur = r.nextBoolean();
        g.tauxMinDuSecteurPourcents = avecSecteur ? (r.nextInt(4) == 0 ? r.nextInt(101) : 50 + r.nextInt(50)) : 0;
        double pB = r.nextDouble() * 0.5, pS = r.nextDouble();
        List<Integer> rangs = new ArrayList<>();
        for (int i = 1; i <= n; i++) rangs.add(i * (1 + r.nextInt(3)) + i); // rangs non contigus mais distincts
        Set<Integer> uniques = new TreeSet<>(rangs);
        List<Integer> rs = new ArrayList<>(uniques);
        Collections.shuffle(rs, r);
        for (int i = 0; i < rs.size(); i++) {
            OaVoeu v = new OaVoeu();
            v.candidat = 1000 + i; v.rang = rs.get(i);
            v.boursier = r.nextDouble() < pB;
            v.duSecteur = avecSecteur ? r.nextDouble() < pS : r.nextBoolean();
            g.voeux.add(v);
        }
        return g;
    }

    /* ---------------- propositions ---------------- */

    static GroupeAffectationUID gid(int a, int b, int c) { return new GroupeAffectationUID(a, b, c); }
    static GroupeInternatUID iid(PInternatId i) { return new GroupeInternatUID(i.cGiCod, i.gTiCod, i.gTaCod); }

    static PSortie executerPropositions(PEntree in) throws Exception {
        Parametres p = new Parametres(in.parametres.nbJoursCampagne, in.parametres.nbJoursCampagneDateFinReservationInternats,
                in.parametres.nbJoursCampagneDateDebutGDD, in.parametres.nbJoursCampagneDateFinOrdonnancementGDD);
        AlgoPropositionsEntree e = new AlgoPropositionsEntree(p);
        for (PGroupe g : in.groupes) {
            GroupeAffectation ga = new GroupeAffectation(g.nbRecrutementsSouhaite, gid(g.cGpCod, g.gTiCod, g.gTaCod), g.rangLimite,
                    g.rangDernierAppeleActuellement, g.rangDernierAppeleReference, p);
            if (g.finReservationInternats) ga.setFinDeReservationPlacesInternats();
            ga.setA_rg_flg_adm_stop(g.admStop ? 1 : 0);
            e.ajouter(ga);
        }
        for (PInternat i : in.internats) e.ajouter(new GroupeInternat(iid(i.id), i.capacite));
        for (PVoeu v : in.voeux) {
            Voeu.StatutVoeu st = Voeu.StatutVoeu.valueOf(v.statut);
            Voeu voeu = (v.internat != null)
                    ? new Voeu(v.gCnCod, gid(v.cGpCod, v.gTiCod, v.gTaCod), v.ordreAppel, v.ordreAppel, iid(v.internat), v.rangInternat, v.rangPreferences, st, v.affecteHorsPP)
                    : new Voeu(v.gCnCod, v.avecInternat, gid(v.cGpCod, v.gTiCod, v.gTaCod), v.ordreAppel, v.ordreAppel, v.rangPreferences, st, v.affecteHorsPP);
            e.ajouter(voeu);
        }
        e.candidatsAvecRepondeurAutomatique.addAll(in.candidatsAvecRepondeurAutomatique);
        AlgoPropositionsSortie s = AlgoPropositions.calcule(e, true);
        PSortie out = new PSortie();
        out.alerte = s.getAlerte();
        out.avertissement = s.getAvertissement();
        for (Voeu v : s.voeux) {
            PVoeuSortie o = new PVoeuSortie();
            o.gCnCod = v.id.gCnCod; o.gTaCod = v.id.gTaCod; o.avecInternat = v.id.iRhCod; o.statut = v.getStatut().name();
            out.voeux.add(o);
        }
        out.voeux.sort(Comparator.comparingInt((PVoeuSortie o) -> o.gCnCod).thenComparingInt(o -> o.gTaCod).thenComparing(o -> o.avecInternat));
        for (GroupeInternat i : s.internats) {
            PInternatSortie o = new PInternatSortie();
            o.id = new PInternatId(); o.id.cGiCod = i.id.cGiCod; o.id.gTiCod = i.id.gTiCod; o.id.gTaCod = i.id.gTaCod;
            o.positionAdmission = i.getPositionAdmission(); o.positionMaximaleAdmission = i.getPositionMaximaleAdmission();
            out.internats.add(o);
        }
        out.internats.sort(Comparator.comparingInt((PInternatSortie o) -> o.id.cGiCod).thenComparingInt(o -> o.id.gTaCod));
        for (GroupeAffectation g : s.groupes) {
            PGroupeSortie o = new PGroupeSortie();
            o.cGpCod = g.id.cGpCod; o.gTiCod = g.id.gTiCod; o.gTaCod = g.id.gTaCod;
            o.estimationRangDernierAppele = g.getEstimationRangDernierAppeleADateFinReservationInternats();
            out.groupes.add(o);
        }
        out.groupes.sort(Comparator.comparingInt((PGroupeSortie o) -> o.cGpCod).thenComparingInt(o -> o.gTaCod));
        return out;
    }

    /** Génère un « monde » fictif : formations, groupes, internats, candidats et vœux. */
    static PEntree mondeAleatoire(Random r) {
        PEntree in = new PEntree();
        int nbEtab = 1 + r.nextInt(4);
        int cGp = 1, gTa = 1, cGi = 1;
        Map<Integer, List<PGroupe>> groupesParFormation = new LinkedHashMap<>();
        Map<Integer, PInternatId> internatParFormation = new HashMap<>();
        for (int e = 1; e <= nbEtab; e++) {
            int mode = r.nextInt(3); // 0 sans internat, 1 internat par formation, 2 internat commun
            PInternatId commun = null;
            if (mode == 2) {
                commun = new PInternatId(); commun.cGiCod = cGi++; commun.gTiCod = 0; commun.gTaCod = 0;
                PInternat pi = new PInternat(); pi.id = commun; pi.capacite = r.nextInt(12); in.internats.add(pi);
            }
            int nbF = 1 + r.nextInt(3);
            for (int f = 0; f < nbF; f++) {
                int ta = gTa++;
                List<PGroupe> gs = new ArrayList<>();
                int nbG = 1 + (r.nextInt(4) == 0 ? 1 : 0);
                for (int k = 0; k < nbG; k++) {
                    PGroupe g = new PGroupe();
                    g.cGpCod = cGp++; g.gTiCod = e; g.gTaCod = ta;
                    g.nbRecrutementsSouhaite = r.nextInt(15);
                    g.rangLimite = r.nextInt(3) == 0 ? r.nextInt(10) : 0;
                    g.admStop = r.nextInt(15) == 0;
                    g.finReservationInternats = r.nextInt(8) == 0;
                    gs.add(g); in.groupes.add(g);
                }
                groupesParFormation.put(ta, gs);
                if (mode == 1 && r.nextBoolean()) {
                    PInternatId id = new PInternatId(); id.cGiCod = cGi++; id.gTiCod = 0; id.gTaCod = ta;
                    PInternat pi = new PInternat(); pi.id = id; pi.capacite = r.nextInt(8); in.internats.add(pi);
                    internatParFormation.put(ta, id);
                } else if (mode == 2) {
                    internatParFormation.put(ta, commun);
                }
            }
        }
        int nbCandidats = 5 + r.nextInt(r.nextInt(5) == 0 ? 200 : 40);
        Map<Integer, Integer> prochainRangGroupe = new HashMap<>();
        Map<Integer, List<Integer>> permGroupe = new HashMap<>();
        for (PGroupe g : in.groupes) {
            List<Integer> l = new ArrayList<>();
            for (int i = 1; i <= nbCandidats; i++) l.add(i);
            Collections.shuffle(l, r);
            permGroupe.put(g.cGpCod, l);
            prochainRangGroupe.put(g.cGpCod, 0);
        }
        Map<Integer, List<Integer>> permInternat = new HashMap<>();
        for (PInternat i : in.internats) {
            List<Integer> l = new ArrayList<>();
            for (int k = 1; k <= nbCandidats; k++) l.add(k);
            Collections.shuffle(l, r);
            permInternat.put(i.id.cGiCod, l);
        }
        List<Integer> formations = new ArrayList<>(groupesParFormation.keySet());
        for (int c = 1; c <= nbCandidats; c++) {
            List<Integer> fs = new ArrayList<>(formations);
            Collections.shuffle(fs, r);
            int nbVoeux = 1 + r.nextInt(Math.min(fs.size(), 5));
            for (int k = 0; k < nbVoeux; k++) {
                int ta = fs.get(k);
                List<PGroupe> gs = groupesParFormation.get(ta);
                PGroupe g = gs.get(r.nextInt(gs.size()));
                int ordre = permGroupe.get(g.cGpCod).get(c - 1);
                PInternatId iid = internatParFormation.get(ta);
                boolean avecI = iid != null && r.nextInt(3) != 0;
                boolean sansI = !avecI || r.nextBoolean();
                if (avecI) in.voeux.add(voeu(c, g, ordre, iid, permInternat.get(iid.cGiCod).get(c - 1)));
                if (sansI) in.voeux.add(voeu(c, g, ordre, null, 0));
            }
        }
        return in;
    }

    static PVoeu voeu(int c, PGroupe g, int ordre, PInternatId i, int rangI) {
        PVoeu v = new PVoeu();
        v.gCnCod = c; v.cGpCod = g.cGpCod; v.gTiCod = g.gTiCod; v.gTaCod = g.gTaCod;
        v.avecInternat = i != null; v.internat = i; v.ordreAppel = ordre; v.rangInternat = rangI;
        v.statut = "EN_ATTENTE_DE_PROPOSITION";
        return v;
    }

    /** Simulation multi-journées : à chaque jour, enregistre l'entrée et la sortie de l'algorithme officiel. */
    static void genererSimulation(Random r, int idx, String dossier) throws Exception {
        PEntree in = mondeAleatoire(r);
        int nbJours = 2 + r.nextInt(8);
        boolean scenarioGdd = r.nextInt(3) == 0;
        int debutGdd = scenarioGdd ? 1 + r.nextInt(nbJours) : 90;
        in.parametres.nbJoursCampagne = 1;
        in.parametres.nbJoursCampagneDateFinReservationInternats = 1 + r.nextInt(6);
        in.parametres.nbJoursCampagneDateDebutGDD = debutGdd;
        in.parametres.nbJoursCampagneDateFinOrdonnancementGDD = debutGdd + r.nextInt(3);
        Map<Integer, Integer> dernierAppeleHier = new HashMap<>();
        for (int jour = 1; jour <= nbJours; jour++) {
            in.parametres.nbJoursCampagne = jour;
            // Ordonnancement des vœux : à partir de la GDD, certains candidats ordonnent leurs vœux et activent le répondeur.
            if (jour == debutGdd || (jour > debutGdd && r.nextInt(3) == 0)) ordonnerVoeux(r, in);
            for (PGroupe g : in.groupes) {
                int max = 0;
                for (PVoeu v : in.voeux) if (v.cGpCod == g.cGpCod && v.gTaCod == g.gTaCod && estPropositionStatut(v.statut)) max = Math.max(max, v.ordreAppel);
                g.rangDernierAppeleReference = Math.min(dernierAppeleHier.getOrDefault(g.cGpCod * 1000 + g.gTaCod, 0), max);
                g.rangDernierAppeleActuellement = max;
            }
            PFixture f = new PFixture();
            f.nom = "sim-" + idx + "-jour-" + jour; f.jour = jour;
            f.entree = GSON.fromJson(GSON.toJson(in), PEntree.class);
            try {
                f.attendu = executerPropositions(in);
            } catch (Exception ex) {
                f.erreur = ex.getClass().getSimpleName() + ": " + ex.getMessage();
                ecrire(dossier + "/" + f.nom + ".json", f);
                return;
            }
            ecrire(dossier + "/" + f.nom + ".json", f);
            for (PGroupe g : in.groupes) dernierAppeleHier.put(g.cGpCod * 1000 + g.gTaCod, g.rangDernierAppeleActuellement);
            // Application des statuts calculés puis réponses simulées des candidats.
            Map<String, String> statuts = new HashMap<>();
            for (PVoeuSortie o : f.attendu.voeux) statuts.put(o.gCnCod + ":" + o.gTaCod + ":" + o.avecInternat, o.statut);
            List<PVoeu> restants = new ArrayList<>();
            for (PVoeu v : in.voeux) {
                String st = statuts.get(v.gCnCod + ":" + v.gTaCod + ":" + v.avecInternat);
                v.statut = st;
                switch (st) {
                    case "REP_AUTO_DEMISSION_ATTENTE": case "REP_AUTO_REFUS_PROPOSITION":
                    case "DEMISSION_AUTO_VOEU_ORDONNE_EN_ATTENTE": case "DEMISSION_AUTO_VOEU_ORDONNE_PROPOSITION_EN_ATTENTE_REP":
                        continue; // démissions : le vœu disparaît
                    case "REP_AUTO_ACCEPTE": v.statut = "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE"; break;
                    case "PROPOSITION_DU_JOUR": {
                        int d = r.nextInt(3);
                        v.statut = d == 0 ? "PROPOSITION_JOURS_PRECEDENTS_REFUSEE" : (d == 1 ? "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE" : "PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT");
                        break;
                    }
                    case "EN_ATTENTE_DE_PROPOSITION":
                        if (r.nextInt(25) == 0 && !in.candidatsAvecRepondeurAutomatique.contains(v.gCnCod)) continue; // démission spontanée
                        break;
                    default: break;
                }
                if ("PROPOSITION_JOURS_PRECEDENTS_REFUSEE".equals(v.statut)) continue; // refus : place libérée, vœu retiré
                restants.add(v);
            }
            in.voeux = restants;
            // Un candidat ne conserve qu'une proposition acceptée : la plus récente l'emporte.
            Map<Integer, PVoeu> acceptee = new HashMap<>();
            List<PVoeu> apres = new ArrayList<>();
            for (PVoeu v : in.voeux) {
                if ("PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE".equals(v.statut)) {
                    PVoeu prec = acceptee.get(v.gCnCod);
                    if (prec != null && !(prec.gTaCod == v.gTaCod)) { apres.remove(prec); }
                    acceptee.put(v.gCnCod, v);
                }
                apres.add(v);
            }
            in.voeux = apres;
            // Cohérence répondeur automatique : au plus une proposition, conservée et acceptée.
            for (Integer c : new ArrayList<>(in.candidatsAvecRepondeurAutomatique)) {
                boolean dejaUne = false;
                List<PVoeu> garder = new ArrayList<>();
                for (PVoeu v : in.voeux) {
                    if (v.gCnCod == c && estPropositionStatut(v.statut)) {
                        if (dejaUne) continue;
                        dejaUne = true; v.statut = "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE";
                    }
                    garder.add(v);
                }
                in.voeux = garder;
            }
        }
    }

    static boolean estPropositionStatut(String s) {
        return s.equals("PROPOSITION_DU_JOUR") || s.equals("REP_AUTO_ACCEPTE")
                || s.equals("PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE") || s.equals("PROPOSITION_JOURS_PRECEDENTS_EN_ATTENTE_DE_REPONSE_DU_CANDIDAT");
    }

    /** Ordonne les vœux d'une partie des candidats (rang de préférence) ; un sur deux active le répondeur. */
    static void ordonnerVoeux(Random r, PEntree in) {
        Map<Integer, List<PVoeu>> parCandidat = new TreeMap<>();
        for (PVoeu v : in.voeux) parCandidat.computeIfAbsent(v.gCnCod, k -> new ArrayList<>()).add(v);
        for (Map.Entry<Integer, List<PVoeu>> e : parCandidat.entrySet()) {
            boolean dejaOrdonne = e.getValue().stream().anyMatch(v -> v.rangPreferences > 0);
            if (dejaOrdonne || r.nextInt(2) == 0) continue;
            // Avant d'ordonner : le candidat conserve au plus une proposition (acceptée).
            List<PVoeu> vs = e.getValue();
            boolean dejaUne = false;
            for (PVoeu v : vs) {
                if (estPropositionStatut(v.statut)) {
                    if (dejaUne) { in.voeux.remove(v); continue; }
                    dejaUne = true; v.statut = "PROPOSITION_JOURS_PRECEDENTS_ACCEPTEE";
                }
            }
            // Le candidat classe ses vœux en attente ; ceux qu'il place après sa proposition
            // conservée sont abandonnés (cf. présentation officielle 2023, section 6, exemple 1).
            PVoeu propositionGardee = null;
            List<PVoeu> enAttente = new ArrayList<>();
            for (PVoeu v : vs) {
                if (!in.voeux.contains(v)) continue;
                if (estPropositionStatut(v.statut)) propositionGardee = v; else enAttente.add(v);
            }
            Collections.shuffle(enAttente, r);
            List<PVoeu> ordre = new ArrayList<>(enAttente);
            if (propositionGardee != null) {
                int pos = r.nextInt(ordre.size() + 1);
                for (PVoeu v : new ArrayList<>(ordre.subList(pos, ordre.size()))) { in.voeux.remove(v); ordre.remove(v); }
                ordre.add(propositionGardee);
            }
            int rang = 1;
            for (PVoeu v : ordre) v.rangPreferences = rang++;
            if (r.nextBoolean()) in.candidatsAvecRepondeurAutomatique.add(e.getKey());
        }
    }

    static void ecrire(String chemin, Object o) throws IOException {
        try (FileWriter w = new FileWriter(chemin)) { GSON.toJson(o, w); }
    }

    public static void main(String[] args) throws Exception {
        java.util.logging.LogManager.getLogManager().reset();
        String mode = args[0];
        long seed = Long.parseLong(args[1]);
        int nb = Integer.parseInt(args[2]);
        String dossier = args[3];
        new File(dossier).mkdirs();
        Random r = new Random(seed);
        if (mode.equals("gen-oa")) {
            for (int i = 0; i < nb; i++) ecrire(dossier + "/oa-" + i + ".json", executerOa("oa-" + i, groupeOaAleatoire(r, i + 1)));
        } else if (mode.equals("gen-sim")) {
            for (int i = 0; i < nb; i++) genererSimulation(r, i, dossier);
        } else if (mode.equals("oa")) {
            OaGroupe g = GSON.fromJson(new java.io.FileReader(args[4]), OaGroupe.class);
            ecrire(dossier + "/" + args[5], executerOa(args[5], g));
        } else {
            throw new IllegalArgumentException("mode inconnu " + mode);
        }
    }
}
