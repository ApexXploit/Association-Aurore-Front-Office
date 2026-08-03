import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  checkForUpdate,
  currentVersion,
  dismissVersion,
  openUpdate,
} from "./updateService";

const ORANGE = "#FF5A0A";
const INK = "#17181B";
const MUTED = "#74777D";
const LINE = "#E8E8E8";

export default function UpdateScreen({ onBack }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    setLoading(true);
    setResult(await checkForUpdate({ force: true }));
    setLoading(false);
  };

  useEffect(() => {
    check();
  }, []);

  const available = result?.status === "available";
  const icon =
    available ? "cloud-download-outline" :
    result?.status === "error" ? "cloud-offline-outline" :
    result?.status === "unconfigured" ? "construct-outline" :
    "checkmark-circle-outline";

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Ionicons name="arrow-back" size={21} color={INK} />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mise à jour</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={[styles.hero, available && styles.heroAvailable]}>
        <View style={[styles.icon, available && styles.iconAvailable]}>
          {loading ? (
            <ActivityIndicator color={ORANGE} />
          ) : (
            <Ionicons name={icon} size={38} color={available ? "#FFF" : ORANGE} />
          )}
        </View>
        <Text style={styles.title}>
          {loading
            ? "Recherche en cours…"
            : available
              ? "Une mise à jour est disponible"
              : result?.status === "current"
                ? "Votre application est à jour"
                : result?.status === "unconfigured"
                  ? "Serveur de mise à jour à connecter"
                  : "Vérification impossible"}
        </Text>
        <Text style={styles.subtitle}>
          Version installée : {currentVersion()}
          {result?.latestVersion ? `  •  Dernière : ${result.latestVersion}` : ""}
        </Text>
      </View>

      {available && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{result.title}</Text>
          <Text style={styles.notes} numberOfLines={10}>{result.notes}</Text>
          {result.size && (
            <Text style={styles.meta}>
              Téléchargement : {(result.size / 1024 / 1024).toFixed(1)} Mo
            </Text>
          )}
          <TouchableOpacity style={styles.primary} onPress={() => openUpdate(result)}>
            <Ionicons name="download-outline" size={19} color="#FFF" />
            <Text style={styles.primaryText}>Télécharger et installer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondary}
            onPress={async () => {
              await dismissVersion(result.latestVersion);
              setResult({ ...result, dismissed: true });
            }}
          >
            <Text style={styles.secondaryText}>
              {result.dismissed ? "Rappel déjà reporté" : "Me le rappeler plus tard"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {result?.status === "error" && (
        <View style={styles.info}>
          <Ionicons name="information-circle-outline" color="#2979D8" size={21} />
          <Text style={styles.infoText}>{result.message}</Text>
        </View>
      )}

      {result?.status === "unconfigured" && (
        <View style={styles.info}>
          <Ionicons name="logo-github" color={INK} size={21} />
          <Text style={styles.infoText}>
            Le système est prêt. Il commencera à proposer les nouvelles versions
            dès que le dépôt GitHub Aurore et sa première Release APK seront publiés.
          </Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.detailsTitle}>Vérification automatique</Text>
        <View style={styles.detailRow}>
          <Ionicons name="power-outline" size={19} color={ORANGE} />
          <Text style={styles.detailText}>Au démarrage de l’application</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="phone-portrait-outline" size={19} color={ORANGE} />
          <Text style={styles.detailText}>Au retour dans l’application</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="shield-checkmark-outline" size={19} color={ORANGE} />
          <Text style={styles.detailText}>Une seule vérification simultanée</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.checkButton} onPress={check} disabled={loading}>
        <Ionicons name="refresh-outline" size={18} color={ORANGE} />
        <Text style={styles.checkText}>Vérifier maintenant</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, padding: 18, paddingBottom: 40, backgroundColor: "#FFF" },
  header: { height: 48, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { flexDirection: "row", alignItems: "center", gap: 5, width: 50 },
  backText: { fontSize: 10 },
  headerTitle: { fontSize: 16, fontWeight: "900", color: INK },
  hero: { alignItems: "center", paddingVertical: 28, borderRadius: 16, backgroundColor: "#FFF5EE", marginTop: 10 },
  heroAvailable: { backgroundColor: "#FFF0E5" },
  icon: { width: 74, height: 74, borderRadius: 37, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  iconAvailable: { backgroundColor: ORANGE },
  title: { fontSize: 18, fontWeight: "900", color: INK, textAlign: "center" },
  subtitle: { fontSize: 11, color: MUTED, marginTop: 6 },
  card: { borderWidth: 1, borderColor: LINE, borderRadius: 13, padding: 15, marginTop: 16 },
  cardTitle: { fontSize: 15, fontWeight: "900", color: INK },
  notes: { fontSize: 11, lineHeight: 17, color: "#555", marginTop: 8 },
  meta: { fontSize: 10, color: MUTED, marginTop: 10 },
  primary: { height: 49, borderRadius: 11, backgroundColor: ORANGE, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 16 },
  primaryText: { color: "#FFF", fontSize: 12, fontWeight: "900" },
  secondary: { height: 46, borderRadius: 11, borderWidth: 1, borderColor: ORANGE, alignItems: "center", justifyContent: "center", marginTop: 9 },
  secondaryText: { color: ORANGE, fontSize: 11, fontWeight: "800" },
  info: { flexDirection: "row", gap: 9, padding: 13, borderRadius: 10, backgroundColor: "#EEF6FF", marginTop: 16 },
  infoText: { flex: 1, fontSize: 10, lineHeight: 15, color: "#315D89" },
  details: { borderWidth: 1, borderColor: LINE, borderRadius: 13, padding: 15, marginTop: 16 },
  detailsTitle: { fontSize: 13, fontWeight: "900", marginBottom: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#F1F1F1" },
  detailText: { fontSize: 11, fontWeight: "700" },
  checkButton: { height: 48, borderRadius: 11, borderWidth: 1, borderColor: LINE, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 16 },
  checkText: { color: ORANGE, fontSize: 11, fontWeight: "800" },
});

