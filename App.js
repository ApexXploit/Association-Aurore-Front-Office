import React, { useEffect, useState } from "react";
import {
  AppState,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import UpdateScreen from "./src/UpdateScreen";
import { checkForUpdate } from "./src/updateService";

const ORANGE = "#FF5A0A",
  RED = "#F23B26",
  INK = "#17181B",
  MUTED = "#74777D",
  LINE = "#E8E8E8",
  SOFT = "#F7F7F7";
const ACTIVITY_IMAGES = [
  require("./assets/activity-hiking.png"),
  require("./assets/activity-museum.png"),
];
const tabs = [
  ["home", "Accueil", "home-outline"],
  ["map", "Carte", "map-outline"],
  ["messages", "Messages", "chatbubble-outline"],
  ["activities", "Activités", "calendar-outline"],
  ["profile", "Profil", "person-outline"],
];
const services = [
  ["translation", "Traduction", "language-outline", "#9C43EB"],
  ["voice", "Assistant vocal", "mic-outline", "#55C982"],
  ["procedures", "Démarches", "book-outline", "#5680ED"],
  ["messages", "Messagerie", "chatbubble-outline", "#F6A20A"],
  ["activities", "Activités", "calendar-outline", "#E33D8B"],
  ["transport", "Transport", "bus-outline", "#43B5D5"],
  ["emergency", "Urgences", "shield-outline", "#F0584B"],
];
const procedures = [
  [
    "Obtenir la carte Vitale",
    "Santé",
    "20 min",
    "4 étapes",
    "heart-outline",
    "#E3F4ED",
  ],
  [
    "Ouvrir un compte bancaire",
    "Maison",
    "1 h",
    "5 étapes",
    "business-outline",
    "#F0EAFE",
  ],
  [
    "Inscrire son enfant à l'école",
    "Facile",
    "30 min",
    "4 étapes",
    "school-outline",
    "#E8F2E9",
  ],
  [
    "S'inscrire à Pôle Emploi",
    "Facile",
    "30 min",
    "4 étapes",
    "briefcase-outline",
    "#E6F4EB",
  ],
  [
    "Obtenir une carte d'identité",
    "Facile",
    "30 min",
    "5 étapes",
    "card-outline",
    "#ECEAFF",
  ],
  [
    "Trouver un logement",
    "Complexe",
    "Variable",
    "6 étapes",
    "home-outline",
    "#FFF0E7",
  ],
  [
    "Demander les aides de la CAF",
    "Finance",
    "25 min",
    "5 étapes",
    "wallet-outline",
    "#FFF3D8",
  ],
  [
    "Renouveler un titre de séjour",
    "Identité",
    "45 min",
    "6 étapes",
    "document-text-outline",
    "#EAF0FF",
  ],
  [
    "Demander la complémentaire santé solidaire",
    "Santé",
    "30 min",
    "5 étapes",
    "medkit-outline",
    "#E4F6EA",
  ],
  [
    "Inscrire un enfant à la cantine",
    "Éducation",
    "20 min",
    "4 étapes",
    "restaurant-outline",
    "#F3EAFE",
  ],
];

function Logo() {
  return (
    <View style={s.logoWrap}>
      <Text style={s.stars}>✦ ✦ ✦</Text>
      <Text style={s.logo}>Aurore</Text>
      <Text style={s.logoSub}>A S S O C I A T I O N</Text>
    </View>
  );
}
function Button({ children, onPress, outline = false, danger = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        s.button,
        outline && s.buttonOutline,
        danger && { backgroundColor: RED },
      ]}
    >
      <Text style={[s.buttonText, outline && { color: ORANGE }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}
function Sos({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.sos}>
      <Ionicons name="alert-circle-outline" size={14} color="white" />
      <Text style={s.sosText}>SOS</Text>
    </TouchableOpacity>
  );
}
function ScreenHeader({ title, back, onBack, sos = true, onSos }) {
  return (
    <View style={s.header}>
      {back ? (
        <TouchableOpacity onPress={onBack} style={s.headerBack}>
          <Ionicons name="arrow-back" size={20} />
          <Text style={s.backText}>Retour</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <Text style={s.headerTitle}>{title}</Text>
      {sos ? <Sos onPress={onSos} /> : <View style={{ width: 45 }} />}
    </View>
  );
}
function BottomNav({ active, go }) {
  return (
    <View style={s.bottom}>
      {tabs.map((t) => (
        <TouchableOpacity key={t[0]} style={s.tab} onPress={() => go(t[0])}>
          <Ionicons
            name={active === t[0] ? t[2].replace("-outline", "") : t[2]}
            size={21}
            color={active === t[0] ? ORANGE : "#555"}
          />
          <Text style={[s.tabText, active === t[0] && { color: ORANGE }]}>
            {t[1]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
function Mic({ go }) {
  return (
    <TouchableOpacity style={s.floatingMic} onPress={() => go("voice")}>
      <Ionicons name="mic" color="white" size={22} />
    </TouchableOpacity>
  );
}
function Field({ icon, placeholder, value, secure, multiline, onChangeText }) {
  return (
    <View
      style={[s.field, multiline && { height: 170, alignItems: "flex-start" }]}
    >
      {icon && <Ionicons name={icon} size={17} color={MUTED} />}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={MUTED}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        multiline={multiline}
        style={[s.fieldInput, multiline && { textAlignVertical: "top" }]}
      />
    </View>
  );
}

function Splash({ go }) {
  return (
    <View style={s.splash}>
      <Logo />
      <View style={{ marginTop: 28, alignItems: "center" }}>
        <Text style={s.carre}>
          Le Carré <Text style={{ color: ORANGE }}>Connect</Text>
        </Text>
        <Text style={s.subline}>Votre assistant quotidien</Text>
      </View>
      <View style={s.bottomButtons}>
        <Button onPress={() => go("login")}>Se connecter</Button>
        <Button outline onPress={() => go("signup")}>
          Créer un compte
        </Button>
      </View>
    </View>
  );
}
function Language({ go }) {
  const [lang, setLang] = useState("Français");
  return (
    <ScrollView contentContainerStyle={s.centerPage}>
      <View style={s.roundIcon}>
        <Ionicons name="globe-outline" size={49} color={ORANGE} />
      </View>
      <Text style={s.bigTitle}>Choisissez votre langue</Text>
      <Text style={s.subtitle}>Vous pourrez la changer plus tard</Text>
      <View style={s.langList}>
        {["Français", "English", "العربية", "Español", "中文"].map((x) => (
          <TouchableOpacity
            key={x}
            style={s.langRow}
            onPress={() => setLang(x)}
          >
            <Text style={s.rowTitle}>{x}</Text>
            <View style={[s.radio, lang === x && s.radioOn]}>
              {lang === x && <View style={s.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Button onPress={() => go("home")}>Continuer</Button>
    </ScrollView>
  );
}
function Signup({ go }) {
  return (
    <ScrollView contentContainerStyle={s.centerPage}>
      <View style={s.roundIconSmall}>
        <Ionicons name="person-outline" size={29} color="white" />
      </View>
      <Text style={s.bigTitle}>Créer votre compte</Text>
      <Text style={s.subtitle}>Inscrivez-vous pour commencer</Text>
      <TouchableOpacity style={s.google}>
        <Text style={s.googleG}>G</Text>
        <Text style={s.rowTitle}>Continuer avec Google</Text>
      </TouchableOpacity>
      <View style={s.or}>
        <View style={s.line} />
        <Text style={s.subtitle}>OU</Text>
        <View style={s.line} />
      </View>
      <Text style={s.label}>Email</Text>
      <Field icon="mail-outline" value="exemple@email.com" />
      <Text style={s.label}>Mot de passe</Text>
      <Field icon="lock-closed-outline" value="motdepasse" secure />
      <Text style={s.label}>Confirmer le mot de passe</Text>
      <Field icon="lock-closed-outline" value="motdepasse" secure />
      <View style={s.consent}>
        <View style={s.square} />
        <Text style={s.consentText}>
          J’accepte les <Text style={s.under}>Conditions d’utilisation</Text>
          {"\n"}et la <Text style={s.under}>Politique de confidentialité</Text>
        </Text>
      </View>
      <Button onPress={() => go("language")}>Créer un compte</Button>
      <Text style={s.loginHint}>
        Vous avez déjà un compte ?{" "}
        <Text style={{ color: ORANGE }} onPress={() => go("login")}>
          Se connecter
        </Text>
      </Text>
    </ScrollView>
  );
}
function Login({ go }) {
  return (
    <ScrollView contentContainerStyle={s.centerPage}>
      <View style={s.roundIconSmall}>
        <Ionicons name="finger-print-outline" size={28} color="white" />
      </View>
      <Text style={s.bigTitle}>Bon retour</Text>
      <Text style={s.subtitle}>Connectez-vous à votre compte</Text>
      <TouchableOpacity style={s.google}>
        <Text style={s.googleG}>G</Text>
        <Text style={s.rowTitle}>Continuer avec Google</Text>
      </TouchableOpacity>
      <View style={s.or}>
        <View style={s.line} />
        <Text style={s.subtitle}>OU</Text>
        <View style={s.line} />
      </View>
      <Text style={s.label}>Email</Text>
      <Field icon="mail-outline" value="exemple@email.com" />
      <Text style={s.label}>Mot de passe</Text>
      <Field icon="lock-closed-outline" value="motdepasse" secure />
      <Text style={s.forgot}>Mot de passe oublié ?</Text>
      <Button onPress={() => go("home")}>Se connecter</Button>
      <Text style={s.loginHint}>
        Pas encore de compte ?{" "}
        <Text style={{ color: ORANGE }} onPress={() => go("signup")}>
          Créer un compte
        </Text>
      </Text>
    </ScrollView>
  );
}

function Home({ go }) {
  return (
    <ScrollView contentContainerStyle={s.page}>
      <View style={s.homeTop}>
        <View>
          <Text style={s.hello}>Bienvenue, shnaa05 👋</Text>
          <Text style={s.subtitle}>Comment puis-je vous aider ?</Text>
        </View>
        <Sos onPress={() => go("emergency")} />
      </View>
      <View style={s.serviceGrid}>
        {services.map((x) => (
          <TouchableOpacity
            style={s.service}
            key={x[0]}
            onPress={() => go(x[0])}
          >
            <View style={[s.serviceIcon, { backgroundColor: x[3] }]}>
              <Ionicons name={x[2]} size={26} color="white" />
            </View>
            <Text style={s.serviceText}>{x[1]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
function Emergency({ go }) {
  const rows = [
    ["Police", "17", "shield-outline", "#4D7CF5"],
    ["Pompiers", "18", "flame-outline", "#FF6A17"],
    ["SAMU", "15", "heart-outline", "#F04732"],
    ["Urgence générale", "112", "call-outline", "#30B96B"],
    ["Violences", "3919", "warning-outline", "#A044DF"],
    ["Enfance en danger", "119", "help-buoy-outline", "#E23A91"],
  ];
  const call = (n) => Linking.openURL(`tel:${n}`);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader
        title=""
        back
        onBack={() => go("home")}
        onSos={() => call("112")}
      />
      <View style={s.pageTitleRow}>
        <View style={[s.miniIcon, { backgroundColor: "#F0EAFE" }]}>
          <Ionicons name="shield-outline" size={20} color="#6A48CF" />
        </View>
        <View>
          <Text style={s.bigTitleLeft}>Numéros d’urgence</Text>
          <Text style={s.subtitle}>Appuyez pour appeler</Text>
        </View>
      </View>
      <Button danger onPress={() => call("112")}>
        ⚠ Je suis en danger
      </Button>
      {rows.map((r) => (
        <TouchableOpacity
          key={r[0]}
          style={s.emergencyRow}
          onPress={() => call(r[1])}
        >
          <View style={[s.emergencyIcon, { backgroundColor: r[3] }]}>
            <Ionicons name={r[2]} color="white" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{r[0]}</Text>
            <Text style={s.number}>{r[1]}</Text>
          </View>
          <Ionicons name="call-outline" size={21} color={MUTED} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
function Transport({ go }) {
  const rows = [
    ["Gare Centrale", "350m", "5 min", "A  B"],
    ["Place de la République", "800m", "8 min", "12   27"],
    ["Mairie", "480m", "8 min", "5   14   27"],
    ["Hôpital Nord", "650m", "12 min", "3"],
    ["Université", "800m", "2 min", "T1"],
  ];
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader title="Transport" onSos={() => go("emergency")} />
      <Text style={s.subtitle}>À proximité</Text>
      <View style={s.warning}>
        <Ionicons name="warning-outline" color={ORANGE} />
        <Text style={s.warningText}>
          Ligne 12 — Travaux : arrêt Liberté non desservi
        </Text>
      </View>
      {rows.map((r) => (
        <View style={s.transportRow} key={r[0]}>
          <View style={[s.emergencyIcon, { backgroundColor: "#6B3CED" }]}>
            <Ionicons name="bus-outline" size={21} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{r[0]}</Text>
            <Text style={s.subtitle}>
              ⌖ {r[1]} ◷ <Text style={{ color: "#33A864" }}>{r[2]}</Text>
            </Text>
            <Text style={s.routes}>{r[3]}</Text>
          </View>
          <Ionicons name="navigate-outline" color="#4C76D9" size={18} />
        </View>
      ))}
      <Button outline>⌖ Carte</Button>
    </ScrollView>
  );
}
function Procedures({ go }) {
  const [filter, setFilter] = useState("Tout"),
    [query, setQuery] = useState("");
  const filters = [
    "Tout",
    "Identité",
    "Logement",
    "Santé",
    "Emploi",
    "Éducation",
    "Finance",
  ];
  const visible = procedures.filter(
    (x) =>
      (filter === "Tout" ||
        x[1] === filter ||
        (filter === "Logement" && x[0].includes("logement")) ||
        (filter === "Emploi" && x[0].includes("Emploi"))) &&
      x[0].toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader
        title="Démarches administratives"
        back
        onBack={() => go("home")}
        onSos={() => go("emergency")}
      />
      <Text style={s.subtitle}>Guides pas à pas</Text>
      <View style={s.search}>
        <Ionicons name="search-outline" color={MUTED} />
        <TextInput
          placeholder="Rechercher une démarche..."
          placeholderTextColor={MUTED}
          value={query}
          onChangeText={setQuery}
          style={{ flex: 1, fontSize: 12, color: INK }}
        />
      </View>
      <View style={s.pills}>
        {filters.map((x) => (
          <TouchableOpacity
            key={x}
            onPress={() => setFilter(x)}
            style={[s.pill, filter === x && s.pillOn]}
          >
            <Text style={[s.pillText, filter === x && { color: "white" }]}>
              {x}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {visible.map((x) => (
        <TouchableOpacity
          key={x[0]}
          style={s.procedure}
          onPress={() => go("procedureDetail", x)}
        >
          <View style={[s.miniIcon, { backgroundColor: x[6] }]}>
            <Ionicons name={x[4]} size={20} color={x[5]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{x[0]}</Text>
            <Text style={s.subtitle}>
              <Text style={s.tagText}>{x[1]}</Text> ◷ {x[2]} {x[3]}
            </Text>
          </View>
          <Ionicons name="chevron-forward" color={MUTED} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ProcedureDetail({ go, item = procedures[0] }) {
  const [step, setStep] = useState(1);
  const steps = [
    [
      "Vérifier votre situation",
      "Assurez-vous d’avoir un numéro de sécurité sociale et une adresse postale valide.",
    ],
    [
      "Préparer les documents",
      "Rassemblez une pièce d’identité, une photo récente et votre attestation de droits.",
    ],
    [
      "Faire la demande",
      "Connectez-vous à votre compte Ameli ou envoyez le formulaire accompagné des justificatifs.",
    ],
    [
      "Suivre la réception",
      "Votre carte sera envoyée à domicile sous deux à trois semaines.",
    ],
  ];
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader
        title={item[1]}
        back
        onBack={() => go("procedures")}
        onSos={() => go("emergency")}
      />
      <View style={d.hero}>
        <View style={[d.heroIcon, { backgroundColor: item[6] }]}>
          <Ionicons name={item[4]} size={29} color={item[5]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={d.heroTitle}>{item[0]}</Text>
          <Text style={s.subtitle}>{item[1]} · Environ {item[2]}</Text>
        </View>
        <View style={d.easy}>
          <Text style={d.easyText}>Facile</Text>
        </View>
      </View>
      <View style={d.progressTop}>
        <Text style={s.rowTitle}>Votre progression</Text>
        <Text style={d.progressText}>{step}/4 étapes</Text>
      </View>
      <View style={d.progressTrack}>
        <View style={[d.progressFill, { width: `${step * 25}%` }]} />
      </View>
      <View style={d.notice}>
        <Ionicons name="information-circle-outline" size={21} color="#2979D8" />
        <Text style={d.noticeText}>
          Cette démarche est gratuite. Ne communiquez jamais vos coordonnées
          bancaires à un intermédiaire.
        </Text>
      </View>
      <Text style={d.sectionTitle}>Documents nécessaires</Text>
      <View style={d.docs}>
        {[
          ["card-outline", "Pièce d’identité"],
          ["camera-outline", "Photo d’identité"],
          ["document-text-outline", "Attestation de droits"],
        ].map((x) => (
          <View key={x[1]} style={d.doc}>
            <Ionicons name={x[0]} color={ORANGE} size={20} />
            <Text style={d.docText}>{x[1]}</Text>
            <Ionicons name="checkmark-circle" color="#32B36A" size={18} />
          </View>
        ))}
      </View>
      <Text style={d.sectionTitle}>Les étapes</Text>
      {steps.map((x, i) => {
        const n = i + 1,
          active = n === step,
          done = n < step;
        return (
          <TouchableOpacity
            key={x[0]}
            style={[d.step, active && d.stepActive]}
            onPress={() => setStep(n)}
          >
            <View
              style={[
                d.stepNumber,
                active && d.stepNumberActive,
                done && d.stepDone,
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" color="white" size={16} />
              ) : (
                <Text style={[d.stepNumberText, active && { color: "white" }]}>
                  {n}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={d.stepTitle}>{x[0]}</Text>
              {active && <Text style={d.stepBody}>{x[1]}</Text>}
            </View>
            <Ionicons
              name={active ? "chevron-up" : "chevron-down"}
              color={MUTED}
            />
          </TouchableOpacity>
        );
      })}
      <View style={d.help}>
        <Ionicons name="headset-outline" size={23} color={ORANGE} />
        <View style={{ flex: 1 }}>
          <Text style={s.rowTitle}>Besoin d’aide ?</Text>
          <Text style={s.subtitle}>Un conseiller peut vous accompagner.</Text>
        </View>
        <TouchableOpacity>
          <Text style={d.helpLink}>Nous contacter</Text>
        </TouchableOpacity>
      </View>
      <Button onPress={() => setStep(Math.min(4, step + 1))}>
        {step === 4 ? "Terminer la démarche" : "Continuer"}
      </Button>
      <Button outline onPress={() => go("procedures")}>
        Enregistrer et quitter
      </Button>
    </ScrollView>
  );
}
function Voice({ go }) {
  const [listening, setListening] = useState(false);
  return (
    <View style={s.pageFill}>
      <ScreenHeader
        title="Assistant vocal"
        back
        onBack={() => go("home")}
        onSos={() => go("emergency")}
      />
      <View style={s.voiceCenter}>
        <TouchableOpacity
          onPress={() => setListening(!listening)}
          style={[s.voiceHalo, listening && { backgroundColor: "#FFE1D0" }]}
        >
          <View style={s.voiceButton}>
            <Ionicons
              name={listening ? "stop" : "mic-outline"}
              size={45}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <View style={s.speak}>
          <Ionicons name="mic-outline" color={MUTED} />
          <Text style={s.subtitle}>
            {listening ? "Je vous écoute…" : "Appuyez pour parler"}
          </Text>
        </View>
      </View>
      <Mic go={go} />
    </View>
  );
}
function Translation({ go }) {
  const [done, setDone] = useState(false);
  return (
    <View style={s.pageFill}>
      <ScreenHeader title="Traduction" onSos={() => go("emergency")} />
      <Text style={s.subtitle}>Traduire un texte</Text>
      <View style={s.languagePickers}>
        <View style={s.picker}>
          <Text>Français</Text>
          <Ionicons name="chevron-down" />
        </View>
        <Ionicons name="swap-horizontal" color={MUTED} />
        <View style={s.picker}>
          <Text>English</Text>
          <Ionicons name="chevron-down" />
        </View>
      </View>
      <Field multiline placeholder="Entrez ou collez du texte ici..." />
      {done && (
        <View style={s.translationResult}>
          <Text style={s.label}>Traduction</Text>
          <Text>Your translated text will appear here.</Text>
        </View>
      )}
      <Button onPress={() => setDone(true)}>⌘ Traduire</Button>
    </View>
  );
}
function Activities({ go }) {
  const cards = [
    ["Sortie randonnée en groupe", "Forêt de Fontainebleau", "08:03   09h00"],
    ["Visite d’un musée gratuite", "Musée d’Art Moderne", "02:03   10h00"],
  ];
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader title="Activités" onSos={() => go("emergency")} />
      <Text style={s.subtitle}>À proximité</Text>
      <View style={s.search}>
        <Ionicons name="search-outline" color={MUTED} />
        <Text style={s.subtitle}>Rechercher...</Text>
      </View>
      <View style={s.pills}>
        {["Tout", "Culture", "Sport", "Social", "Éducation"].map((x, i) => (
          <View key={x} style={[s.pill, i === 0 && s.pillOn]}>
            <Text style={[s.pillText, i === 0 && { color: "white" }]}>{x}</Text>
          </View>
        ))}
      </View>
      {cards.map((c, i) => (
        <View style={s.activityCard} key={c[0]}>
          <View style={s.activityImage}>
            <Image source={ACTIVITY_IMAGES[i]} style={s.activityPhoto} />
            <View style={s.imageShade} />
            <Text style={s.activityImageText}>
              {i ? "CULTURE • GRATUIT" : "NATURE • ENSEMBLE"}
            </Text>
          </View>
          <View style={s.activityBody}>
            <View style={s.activityTitleRow}>
              <Text style={s.rowTitle}>{c[0]}</Text>
              <View style={s.infoBadge}>
                <Text style={s.infoBadgeText}>i</Text>
              </View>
            </View>
            <Text style={s.tagText}>
              {i ? "Culture" : "Loisirs"}{" "}
              <Text style={s.subtitle}>Gratuit</Text>
            </Text>
            <Text style={s.activityDesc}>
              {i
                ? "Premier dimanche du mois : entrée gratuite. Places limitées, inscription recommandée."
                : "Randonnée facile de 8 km en forêt. Débutants bienvenus, chaussures confortables conseillées."}
            </Text>
            <Text style={s.subtitle}>
              ⌖ {c[1]} ◷ {c[2]}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
function Messages({ go }) {
  const rows = [
    [
      "Question sur les aides au logement",
      "Merci pour votre patience, un conseiller vous répondra bientôt.",
      "10:28",
    ],
    [
      "Aide pour ma carte de séjour",
      "Bonjour, j’ai bien reçu vos documents, je reviens vers vous rapidement.",
      "",
    ],
  ];
  return (
    <ScrollView contentContainerStyle={s.page}>
      <ScreenHeader
        title="Messagerie"
        back
        onBack={() => go("home")}
        onSos={() => go("emergency")}
      />
      {rows.map((r, i) => (
        <TouchableOpacity
          key={r[0]}
          style={s.messageCard}
          onPress={() => go("conversation")}
        >
          <View style={s.messageAvatar}>
            <Ionicons name="person-outline" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rowTitle}>{r[0]}</Text>
            <Text numberOfLines={2} style={s.subtitle}>
              {r[1]}
            </Text>
          </View>
          {i === 1 && (
            <View style={s.unread}>
              <Text style={s.unreadText}>1</Text>
            </View>
          )}
          <Text style={s.time}>{r[2]}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
function Conversation({ go }) {
  return (
    <View style={s.pageFill}>
      <ScreenHeader
        title="Messagerie"
        back
        onBack={() => go("messages")}
        onSos={() => go("emergency")}
      />
      <Text style={s.chatTitle}>Question sur les aides au logement</Text>
      <Text style={s.subtitle}>Thomas B.</Text>
      <View style={s.chatArea}>
        <View style={s.bubble}>
          <Text>Demande de rappel téléphonique</Text>
          <Text style={s.time}>10:26</Text>
        </View>
        <View
          style={[
            s.bubble,
            { alignSelf: "flex-end", backgroundColor: "#FFF0DA" },
          ]}
        >
          <Text>Salut</Text>
          <Text style={s.time}>10:28</Text>
        </View>
      </View>
      <View style={s.chatInput}>
        <TextInput placeholder="Écrivez votre message..." style={{ flex: 1 }} />
        <TouchableOpacity style={s.send}>
          <Ionicons name="send" color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
function MapScreen({ go }) {
  return (
    <View style={s.pageFill}>
      <ScreenHeader title="Carte" onSos={() => go("emergency")} />
      <View style={s.search}>
        <Ionicons name="search-outline" color={MUTED} />
        <Text style={s.subtitle}>Rechercher...</Text>
      </View>
      <View style={s.pills}>
        {["Tout", "Admin", "Santé", "Transport", "Emploi"].map((x, i) => (
          <View key={x} style={[s.pill, i === 0 && s.pillOn]}>
            <Text style={[s.pillText, i === 0 && { color: "white" }]}>{x}</Text>
          </View>
        ))}
      </View>
      <View style={s.map}>
        <View style={[s.road, { transform: [{ rotate: "15deg" }], top: 90 }]} />
        <View
          style={[s.road, { transform: [{ rotate: "-30deg" }], top: 230 }]}
        />
        <View
          style={[s.road, { transform: [{ rotate: "70deg" }], top: 320 }]}
        />
        {[
          [80, 130, "#F5A623"],
          [240, 200, "#32B584"],
          [160, 330, "#7357D9"],
          [300, 420, "#2F87E8"],
        ].map((p, i) => (
          <View
            key={i}
            style={[s.mapPin, { left: p[0], top: p[1], backgroundColor: p[2] }]}
          >
            <Ionicons name="location" color="white" />
          </View>
        ))}
        <View style={s.legend}>
          {[
            ["Admin", "#F5A623"],
            ["Santé", "#32B584"],
            ["Transport", "#2F87E8"],
            ["Emploi", "#7357D9"],
          ].map((x) => (
            <Text key={x[0]} style={s.legendText}>
              <Text style={{ color: x[1] }}>●</Text> {x[0]}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
function Profile({ go }) {
  const [dark, setDark] = useState(false),
    [notif, setNotif] = useState(true);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <View style={s.homeTop}>
        <View />
        <Sos onPress={() => go("emergency")} />
      </View>
      <View style={s.profileHero}>
        <View style={s.profileAvatar}>
          <Ionicons name="person-outline" size={34} />
        </View>
        <Text style={s.bigTitle}>shnaa05</Text>
        <Text style={s.subtitle}>shnaa05@gmail.com</Text>
      </View>
      {[
        ["Langue", "🇫🇷 Français", "globe-outline"],
        ["Mode sombre", "switch", "moon-outline"],
        ["Notifications", "notif", "notifications-outline"],
        ["Ma progression", "", "book-outline"],
        ["Mes favoris", "", "heart-outline"],
        ["Mise à jour", "", "cloud-download-outline"],
        ["Urgences", "", "shield-outline"],
      ].map((r) => (
        <TouchableOpacity
          key={r[0]}
          style={s.setting}
          onPress={() =>
            r[0] === "Urgences"
              ? go("emergency")
              : r[0] === "Mise à jour" && go("update")
          }
        >
          <Ionicons name={r[2]} size={21} />
          <Text style={[s.rowTitle, { flex: 1 }]}>{r[0]}</Text>
          {r[1] === "switch" ? (
            <Switch
              value={dark}
              onValueChange={setDark}
              trackColor={{ true: ORANGE }}
            />
          ) : r[1] === "notif" ? (
            <Switch
              value={notif}
              onValueChange={setNotif}
              trackColor={{ true: ORANGE }}
            />
          ) : (
            <Text style={s.subtitle}>{r[1]} ›</Text>
          )}
        </TouchableOpacity>
      ))}
      <Button outline onPress={() => go("login")}>
        Déconnexion
      </Button>
    </ScrollView>
  );
}

export default function App() {
  const preview =
    Platform.OS === "web" && typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("screen")
      : null;
  const [screen, setScreen] = useState(preview || "splash");
  const [selectedProcedure, setSelectedProcedure] = useState(procedures[0]);
  const go = (x, data) => {
    if (x === "procedureDetail" && data) setSelectedProcedure(data);
    setScreen(x);
  };
  useEffect(() => {
    let mounted = true;
    const safeCheck = () =>
      checkForUpdate()
        .then((result) => {
          if (mounted && result?.status === "available" && !result.dismissed)
            setScreen("update");
        })
        .catch(() => null);
    const timer = setTimeout(safeCheck, 2500);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") safeCheck();
    });
    return () => {
      mounted = false;
      clearTimeout(timer);
      sub.remove();
    };
  }, []);
  const content = {
    splash: <Splash go={go} />,
    language: <Language go={go} />,
    signup: <Signup go={go} />,
    login: <Login go={go} />,
    home: <Home go={go} />,
    emergency: <Emergency go={go} />,
    transport: <Transport go={go} />,
    procedures: <Procedures go={go} />,
    procedureDetail: <ProcedureDetail go={go} item={selectedProcedure} />,
    voice: <Voice go={go} />,
    translation: <Translation go={go} />,
    activities: <Activities go={go} />,
    messages: <Messages go={go} />,
    conversation: <Conversation go={go} />,
    map: <MapScreen go={go} />,
    profile: <Profile go={go} />,
    update: <UpdateScreen onBack={() => go("profile")} />,
  }[screen] || <Home go={go} />;
  const tabScreens = ["home", "map", "messages", "activities", "profile"];
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{content}</View>
      {tabScreens.includes(screen) && <BottomNav active={screen} go={go} />}
      {![
        "splash",
        "language",
        "signup",
        "login",
        "voice",
        "conversation",
        "update",
      ].includes(screen) && <Mic go={go} />}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? NativeStatusBar.currentHeight : 0,
    paddingBottom: Platform.OS === "android" ? 20 : 0,
  },
  page: { padding: 18, paddingBottom: 90 },
  pageFill: { flex: 1, padding: 18, paddingBottom: 76 },
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  logoWrap: { alignItems: "center" },
  stars: { fontSize: 24, color: ORANGE, fontWeight: "900", marginBottom: -9 },
  logo: { fontSize: 47, color: ORANGE, fontWeight: "900", letterSpacing: -2 },
  logoSub: { fontSize: 9, color: ORANGE, letterSpacing: 5 },
  carre: { fontSize: 20, fontWeight: "800", color: INK },
  subline: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 5 },
  bottomButtons: { position: "absolute", left: 28, right: 28, bottom: 36 },
  button: {
    minHeight: 50,
    backgroundColor: ORANGE,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  buttonText: { color: "white", fontWeight: "800", fontSize: 13 },
  centerPage: { flexGrow: 1, padding: 28, justifyContent: "center" },
  roundIcon: { alignSelf: "center", marginBottom: 22 },
  roundIconSmall: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: ORANGE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bigTitle: {
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    color: INK,
  },
  bigTitleLeft: { fontSize: 19, fontWeight: "900", color: INK },
  subtitle: { fontSize: 11, color: MUTED, marginTop: 4 },
  langList: { marginVertical: 24, borderTopWidth: 1, borderColor: LINE },
  langRow: {
    height: 57,
    borderBottomWidth: 1,
    borderColor: LINE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTitle: { fontSize: 13, fontWeight: "800", color: INK },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#BBB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: ORANGE },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: ORANGE },
  google: {
    height: 49,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  googleG: { fontWeight: "900", color: "#4285F4" },
  or: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 17,
  },
  line: { height: 1, backgroundColor: LINE, flex: 1 },
  label: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 11,
    marginBottom: 6,
    color: INK,
  },
  field: {
    height: 48,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  fieldInput: { flex: 1, fontSize: 12, color: INK },
  consent: { flexDirection: "row", gap: 9, marginTop: 14 },
  square: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BBB",
  },
  consentText: { fontSize: 9, color: MUTED, lineHeight: 14 },
  under: { textDecorationLine: "underline" },
  loginHint: { textAlign: "center", fontSize: 10, color: MUTED, marginTop: 24 },
  forgot: { fontSize: 10, color: MUTED, textAlign: "right", marginTop: 12 },
  header: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBack: { flexDirection: "row", alignItems: "center", gap: 5 },
  backText: { fontSize: 10, color: INK },
  headerTitle: { fontWeight: "900", fontSize: 16, color: INK },
  sos: {
    backgroundColor: RED,
    borderRadius: 13,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  sosText: { color: "white", fontWeight: "900", fontSize: 10 },
  homeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  hello: { fontSize: 22, fontWeight: "900", color: INK },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  service: {
    width: "48.5%",
    height: 135,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  serviceIcon: {
    width: 53,
    height: 53,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: { fontSize: 13, fontWeight: "800", marginTop: 12, color: INK },
  bottom: {
    height: 66,
    borderTopWidth: 1,
    borderColor: LINE,
    flexDirection: "row",
    backgroundColor: "white",
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 8, marginTop: 3, color: INK },
  floatingMic: {
    position: "absolute",
    right: 18,
    bottom: 78,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  pageTitleRow: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
    marginVertical: 10,
  },
  miniIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyRow: {
    minHeight: 75,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 11,
    padding: 12,
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emergencyIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  number: { fontSize: 20, fontWeight: "900", color: INK },
  warning: {
    borderWidth: 1,
    borderColor: "#FFD6B9",
    backgroundColor: "#FFF7F1",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    gap: 8,
    marginVertical: 14,
  },
  warningText: { fontSize: 10, color: "#8A4A24" },
  transportRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  routes: { fontSize: 9, fontWeight: "900", color: "#315987", marginTop: 7 },
  search: {
    height: 44,
    backgroundColor: SOFT,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    marginVertical: 14,
  },
  pills: { flexDirection: "row", gap: 6, marginBottom: 10, flexWrap: "wrap" },
  pill: {
    backgroundColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillOn: { backgroundColor: ORANGE },
  pillText: { fontSize: 9, color: INK },
  procedure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 70,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
  },
  tagText: { color: "#34A45B", fontWeight: "800", fontSize: 9 },
  voiceCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  voiceHalo: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#FFF0E7",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceButton: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },
  speak: { flexDirection: "row", gap: 8, marginTop: 25, alignItems: "center" },
  languagePickers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    gap: 25,
  },
  translationResult: {
    backgroundColor: "#FFF7F1",
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
  },
  activityCard: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 11,
    overflow: "hidden",
    marginTop: 12,
  },
  activityImage: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activityPhoto: { width: "100%", height: "100%" },
  imageShade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#0002",
  },
  activityImageText: {
    position: "absolute",
    left: 12,
    bottom: 10,
    color: "white",
    fontWeight: "900",
    letterSpacing: 2,
  },
  activityBody: { padding: 12 },
  activityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoBadge: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBadgeText: { color: "white", fontSize: 10, fontWeight: "900" },
  activityDesc: {
    fontSize: 11,
    color: "#555",
    lineHeight: 17,
    marginVertical: 8,
  },
  messageCard: {
    minHeight: 105,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 11,
    padding: 13,
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  messageAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  unread: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "white", fontSize: 9, fontWeight: "900" },
  time: { fontSize: 8, color: MUTED, marginTop: 4 },
  chatTitle: { fontSize: 12, fontWeight: "800", marginTop: 10, color: INK },
  chatArea: { flex: 1, paddingTop: 25 },
  bubble: {
    backgroundColor: "#FFE3C0",
    borderRadius: 10,
    padding: 14,
    alignSelf: "flex-start",
    maxWidth: "75%",
    marginBottom: 10,
  },
  chatInput: {
    height: 50,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    backgroundColor: "#E8E7D8",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  road: {
    position: "absolute",
    left: -100,
    width: 700,
    height: 14,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#D1B09B",
  },
  mapPin: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    position: "absolute",
    left: 14,
    bottom: 14,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  legendText: { fontSize: 10, marginVertical: 2, color: INK },
  profileHero: { alignItems: "center", marginBottom: 24 },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  setting: {
    height: 61,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
});

const d = StyleSheet.create({
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 13,
    marginTop: 12,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: "#E6F7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 16, fontWeight: "900", color: INK },
  easy: {
    backgroundColor: "#E4F6EA",
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  easyText: { fontSize: 9, color: "#23864C", fontWeight: "900" },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  progressText: { fontSize: 11, color: ORANGE, fontWeight: "800" },
  progressTrack: {
    height: 7,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 9,
  },
  progressFill: { height: "100%", backgroundColor: ORANGE, borderRadius: 4 },
  notice: {
    flexDirection: "row",
    gap: 9,
    backgroundColor: "#EEF6FF",
    borderRadius: 10,
    padding: 12,
    marginTop: 17,
  },
  noticeText: { flex: 1, fontSize: 10, lineHeight: 15, color: "#315D89" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 10,
  },
  docs: { gap: 8 },
  doc: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 9,
    paddingHorizontal: 12,
  },
  docText: { flex: 1, fontSize: 11, fontWeight: "700" },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  stepActive: { borderColor: "#FFB38A", backgroundColor: "#FFF8F4" },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberActive: { backgroundColor: ORANGE },
  stepDone: { backgroundColor: "#32B36A" },
  stepNumberText: { fontSize: 11, fontWeight: "900" },
  stepTitle: { fontSize: 12, fontWeight: "800" },
  stepBody: { fontSize: 10, lineHeight: 16, color: MUTED, marginTop: 7 },
  help: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF5EE",
    borderRadius: 10,
    padding: 13,
    marginTop: 10,
  },
  helpLink: { fontSize: 10, color: ORANGE, fontWeight: "800" },
});
