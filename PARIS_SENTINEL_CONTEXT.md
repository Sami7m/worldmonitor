# PARIS_SENTINEL_CONTEXT.md
**Contexte complet pour GitHub Copilot – Paris Sentinel Edition**
Dernière mise à jour : 21 février 2026
Auteur : Manus

## 1. Objectif global du projet
Transformer le fork de `koala73/worldmonitor` en **Paris Sentinel Edition** :
- Focus principal : Île-de-France / Paris (Périphérique, autoroutes, RATP, SNCF, cams DiRIF).
- Thème : Spy dark 2026 ultra-moderne (glassmorphism, cyan glow).
- Map : Passer en 3D renforcée (deck.gl).
- Intégration via flag d'environnement : `VITE_FOCUS_PARIS=true`.

## 2. Architecture Implémentée
- **Configuration** : `src/config/geo-paris.ts` (Couleurs, Coordonnées).
- **Thème** : `src/styles/theme-paris.css` (Glassmorphism).
- **Layers** : `src/components/Layers/Paris3DLayers.ts` (3D Buildings).
- **Services** : 
  - `src/services/paris-loader.ts` (Gestionnaire de données).
  - `src/services/paris-roads.ts` (Trafic routier).
  - `src/services/paris-metro.ts` (Infrastructures ferrées).
- **Données** : `public/data/paris/` (GeoJSON et JSON locaux).

## 3. Contraintes techniques respectées
- **Vanilla TypeScript** : Pas de frameworks React/Vue.
- **deck.gl** : Utilisation intensive pour la performance.
- **Zéro Régression** : Les modes World/Tech/Finance restent intacts.
- **Performance** : Optimisé pour 60fps avec Tile3DLayer.

## 4. Prochaines étapes suggérées pour Copilot
- **Amélioration du trafic** : Connecter `paris-roads.ts` à l'API temps réel de la DiRIF.
- **Temps réel Transports** : Implémenter le flux Navitia dans `paris-metro.ts` pour animer les `TripsLayer`.
- **Caméras Réelles** : Remplacer les mocks par les flux MJPEG officiels de Sytadin.
- **Effets Shaders** : Ajouter des effets de "scanline" ou "pulse" sur les bâtiments 3D.
