# ⚡ IdleProgress

**IdleProgress** to wieloplatformowa aplikacja mobilna typu „clicker”, zbudowana w oparciu o framework React Native. Projekt służy jako środowisko eksperymentalne do badania różnych matematycznych modeli progresji (liniowych i wykładniczych) w mechanikach gier typu idle.

## 🚀 Kluczowe funkcjonalności

* **Mechanika Clicker:** Generowanie energii poprzez interakcję z użytkownikiem.
* **System Statystyk:** Wizualizacja siły kliknięcia (Click Power) oraz pasywnego dochodu na sekundę (CPS) w czasie rzeczywistym.
* **Zaawansowana Persystencja Danych:** Automatyczny zapis postępów w pamięci lokalnej urządzenia (`AsyncStorage`) z wykorzystaniem logiki typu debounce w celu optymalizacji wydajności.
* **Zarządzanie Stanem:** Możliwość całkowitego resetowania danych (funkcjonalność dostosowana do specyfiki systemów Mobile oraz Web).
* **Multiplatformowość:** Pełna kompatybilność z przeglądarkami internetowymi oraz systemami iOS/Android dzięki środowisku Expo.

## 🛠 Stos technologiczny

* **Framework:** [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
* **State Management:** React Context API (zarządzanie globalnym stanem gry).
* **Storage:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
* **Navigation:** [React Navigation](https://reactnavigation.org/)
* **UI:** Custom StyleSheet components z dbałością o responsywność.
