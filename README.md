# Climate Analyzer Card

Dies ist die offizielle Begleit-Karte für die [Climate Analyzer](https://github.com/jannick02/climate_analyzer) Integration. Sie zeigt den Klima-Score, den berechneten Status und detaillierte Infos auf einen Blick – ohne dass zusätzliche Custom-Cards wie `button-card` benötigt werden.

## Installation über HACS

1. Öffne HACS in Home Assistant.
2. Gehe zu **Frontend**.
3. Klicke auf das 3-Punkte-Menü oben rechts und wähle **Benutzerdefinierte Repositories**.
4. Füge die URL dieses Repositories ein und wähle als Kategorie **Lovelace**.
5. Klicke auf **Herunterladen**.
6. Lade dein Dashboard neu.

## Konfiguration

Du kannst die Karte einfach über das UI ("Karte hinzufügen") hinzufügen oder in YAML nutzen:

```yaml
type: custom:climate-analyzer-card
entity: sensor.klima_analyse_wohnzimmer_status
name: Wohnzimmer  # (Optional) Überschreibt den Standard-Namen
