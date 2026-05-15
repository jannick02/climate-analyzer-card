class ClimateAnalyzerCard extends HTMLElement {
  // Wird aufgerufen, wenn die Karte zur Ansicht hinzugefügt wird
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      
      // CSS Styling - orientiert an deiner custom:button-card
      // Nutzt Home Assistant Theme Variablen für Dark-Mode Support!
      const style = document.createElement('style');
      style.textContent = `
        .container {
          display: grid;
          grid-template-areas: 
            "n n" 
            "i score" 
            "s s" 
            "info info";
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto 1fr;
          padding: 20px;
          color: var(--primary-text-color);
        }
        .name {
          grid-area: n;
          font-size: 16px;
          text-align: left;
          padding-bottom: 5px;
        }
        .icon-container {
          grid-area: i;
          display: flex;
          align-items: center;
          padding: 0 10px 5px 0;
        }
        .score {
          grid-area: score;
          justify-self: end;
          font-size: 35px;
          font-weight: 600;
          padding: 0 10px 5px 0;
        }
        .state {
          grid-area: s;
          font-size: 16px;
          font-weight: 500;
          padding: 0 0 5px 0;
          line-height: 1.2;
          word-break: break-word;
        }
        .info {
          grid-area: info;
          font-size: 12px;
          opacity: 0.8;
          line-height: 1.4;
        }
      `;
      card.appendChild(style);
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const stateObj = hass.states[entityId];

    if (!stateObj) {
      this.content.innerHTML = `
        <div class="container">
          <div class="name">Entität nicht gefunden</div>
          <div class="info">${entityId} existiert nicht.</div>
        </div>
      `;
      return;
    }

    const attrs = stateObj.attributes;
    
    // Fallback-Werte auslesen
    const name = this.config.name || stateObj.attributes.friendly_name || entityId;
    const stateStr = stateObj.state;
    const score = attrs.score !== undefined ? attrs.score : 'N/A';
    
    // Icon Farbe berechnen
    let iconColor = 'var(--primary-text-color)';
    if (score !== 'N/A') {
      if (score > 80) iconColor = '#35c759'; // Grün
      else if (score > 55) iconColor = '#fbc02d'; // Gelb
      else iconColor = '#b71c1c'; // Rot
    }

    // Info-Daten berechnen
    const abs_in = attrs.absolute_humidity_in || 0;
    const abs_out = attrs.absolute_humidity_out || 0;
    const delta = (abs_out - abs_in).toFixed(2);
    const t_delta = attrs.temp_delta || 0;
    
    const trend = delta < 0 ? '↓ Trockener' : '↑ Feuchter';
    const t_symbol = t_delta < 0 ? '↓' : '↑';

    // HTML Inhalt generieren
    this.content.innerHTML = `
      <div class="container">
        <div class="name">${name}</div>
        
        <div class="icon-container">
          <ha-icon icon="mdi:circle" style="color: ${iconColor}; height: 25px; width: 25px;"></ha-icon>
        </div>
        
        <div class="score">${score}</div>
        
        <div class="state">${stateStr}</div>
        
        <div class="info">
          <span>${trend} (${delta} g/m³)</span><br>
          <span>${t_symbol} Diff: ${t_delta} °C</span>
        </div>
      </div>
    `;
  }

  // Wird aufgerufen, wenn der Benutzer die Karte in Lovelace hinzufügt
  setConfig(config) {
    if (!config.entity) {
      throw new Error('Du musst eine Entität (entity) angeben.');
    }
    this.config = config;
  }

  // Sagt Home Assistant, wie groß die Karte ungefähr ist (fürs Layouting)
  getCardSize() {
    return 3;
  }
}

// Registriere das Element im Browser
customElements.define('climate-analyzer-card', ClimateAnalyzerCard);

// Füge die Karte zur Auswahl im Home Assistant UI-Editor hinzu
window.customCards = window.customCards || [];
window.customCards.push({
  type: "climate-analyzer-card",
  name: "Climate Analyzer Card",
  preview: true,
  description: "Eine maßgeschneiderte Karte für den Climate Analyzer Sensor."
});
