import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { Linking, Platform } from "react-native";
import { UPDATE_CONFIG } from "./updateConfig";

const LAST_CHECK_KEY = "aurore_update_last_check";
const DISMISSED_VERSION_KEY = "aurore_update_dismissed_version";
let runningCheck = null;

export function currentVersion() {
  return Application.nativeApplicationVersion || "2.0.0";
}

export function compareVersions(left, right) {
  const normalize = (value) =>
    String(value || "0")
      .replace(/^[vV]/, "")
      .split(/[.+-]/)
      .slice(0, 4)
      .map((part) => Number.parseInt(part, 10) || 0);
  const a = normalize(left);
  const b = normalize(right);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if ((a[index] || 0) > (b[index] || 0)) return 1;
    if ((a[index] || 0) < (b[index] || 0)) return -1;
  }
  return 0;
}

function androidAsset(release) {
  return (
    release.assets?.find((asset) => /\.apk$/i.test(asset.name)) ||
    release.assets?.find((asset) => /android/i.test(asset.name))
  );
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPDATE_CONFIG.requestTimeoutMs);
  try {
    return await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkForUpdate({ force = false } = {}) {
  if (runningCheck) return runningCheck;
  runningCheck = (async () => {
    const now = Date.now();
    const lastCheck = Number(await AsyncStorage.getItem(LAST_CHECK_KEY)) || 0;
    if (!force && now - lastCheck < UPDATE_CONFIG.checkIntervalMs) {
      return { status: "skipped", checkedAt: lastCheck };
    }
    await AsyncStorage.setItem(LAST_CHECK_KEY, String(now));
    const endpoint = `https://api.github.com/repos/${UPDATE_CONFIG.owner}/${UPDATE_CONFIG.repository}/releases/latest`;
    try {
      const response = await fetchWithTimeout(endpoint);
      if (response.status === 404) {
        return { status: "unconfigured", checkedAt: now };
      }
      if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`);
      const release = await response.json();
      const latestVersion = release.tag_name?.replace(/^[vV]/, "") || "0";
      const asset = Platform.OS === "android" ? androidAsset(release) : null;
      const dismissed = await AsyncStorage.getItem(DISMISSED_VERSION_KEY);
      const available = compareVersions(latestVersion, currentVersion()) > 0;
      return {
        status: available ? "available" : "current",
        checkedAt: now,
        currentVersion: currentVersion(),
        latestVersion,
        title: release.name || `Version ${latestVersion}`,
        notes: release.body || "Une nouvelle version de l’application est disponible.",
        downloadUrl: asset?.browser_download_url || release.html_url,
        releaseUrl: release.html_url,
        size: asset?.size || null,
        dismissed: dismissed === latestVersion,
      };
    } catch (error) {
      return {
        status: "error",
        checkedAt: now,
        message:
          error?.name === "AbortError"
            ? "La vérification a expiré. Réessayez avec une connexion stable."
            : "Impossible de contacter le serveur de mise à jour.",
      };
    } finally {
      runningCheck = null;
    }
  })();
  return runningCheck;
}

export async function dismissVersion(version) {
  await AsyncStorage.setItem(DISMISSED_VERSION_KEY, String(version));
}

export async function openUpdate(result) {
  const url = result?.downloadUrl || UPDATE_CONFIG.releasesUrl;
  if (!url || !(await Linking.canOpenURL(url))) return false;
  await Linking.openURL(url);
  return true;
}

