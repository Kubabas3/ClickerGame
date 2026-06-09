# ⚡ IdleProgress

**IdleProgress** to wieloplatformowa mobilna gra typu idle (clicker), zbudowana w React Native + Expo. Projekt pełni rolę **środowiska eksperymentalnego do analizy i porównania czterech matematycznych modeli progresji** oraz ich wpływu na dynamikę rozgrywki.

> Projekt dyplomowy — Nikita Kononov, nr albumu 47014  
> Uniwersytet Vizja, Warszawa 2026  
> Promotor: dr inż. Marcin Kacprowicz

---

## 🎯 Cel projektu

Celem nie jest sama mechanika gry, lecz ocena wpływu modeli matematycznych na tempo rozgrywki i zachowanie użytkownika. Gracz może przełączać modele w czasie rzeczywistym i obserwować efekty na ekranie statystyk.

---

## 🧮 Modele progresji — `calculateCost(baseCost, level, model)`

| Model | Formuła | Charakterystyka |
|-------|---------|----------------|
| Liniowy | `base + base × level × 0.5` | Stały przyrost, najłagodniejsza krzywa |
| Wykładniczy | `base × 1.15^level` | Klasyczny Cookie Clicker, silne napięcie |
| Logarytmiczny | `base × (1 + ln(level+1))` | Wolny wzrost, sprzyja masowym zakupom |
| Hybrydowy | `base × 1.07^level × (1 + ln(level+1))` | Kompromis exp + log, najlepszy balans |

---

## 🚀 Funkcjonalności

- **Mechanika clicker** — klikanie generuje energię, animacja `+N` przy każdym kliknięciu
- **Sklep z ulepszeniami** — 10 ulepszeń kliknięcia + 4 auto (CPS), ceny dynamiczne wg modelu
- **Płynny CPS** — 20 taktów/sekundę zamiast skokowego przyrostu
- **StatsScreen** — obserwowalne parametry: kliki, przychód, wydatki, czas sesji, `Income/sec (live)`
- **SettingsScreen** — wybór modelu progresji z formulami, przełącznik animacji
- **Persystencja** — AsyncStorage, zapis co 5 sekund

---

## 🛠 Stos technologiczny

- **React Native** + **Expo SDK 54** — Android, iOS, Web z jednej bazy kodu
- **React Context API** — centralny store stanu gry
- **AsyncStorage** — lokalny trwały zapis, offline
- **Animated API** (`useNativeDriver: true`) — animacje na wątku natywnym

---

## 📁 Struktura projektu

```
ClickerGame/
├── App.js                  # Główny komponent, własny tab-navigator
├── context/
│   └── GameContext.js      # Store stanu, calculateCost(), buyUpgrade()
└── screens/
    ├── HomeScreen.js       # Klikanie + animacja +N
    ├── ShopScreen.js       # Sklep z ulepszeniami
    ├── StatsScreen.js      # Statystyki i obserwacja
    └── SettingsScreen.js   # Wybór modelu progresji
```

---

## ▶️ Uruchomienie

```bash
npm install
npx expo start
```

Następnie zeskanuj kod QR aplikacją **Expo Go** lub otwórz w przeglądarce wciskając `w`.