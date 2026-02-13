# Elektro-Raumbuch

Webbasiertes Planungstool für Elektroinstallationen mit Fokus auf KNX-Smart-Home-Systeme.

## Übersicht

Elektro-Raumbuch ist eine moderne Web-Anwendung zur Planung und Verwaltung von Elektroinstallationen. Die Anwendung digitalisiert den Planungsprozess von der Raum- und Geräteverwaltung bis zur Generierung von KNX-Gruppenadressen und Verteilerschrankplänen.

### Hauptfunktionen

- **Raumbuch-Management**: Zonen, Räume und Geräte verwalten
- **Item-/Geräteliste**: Master-Liste aller verfügbaren Gerätetypen
- **Metadaten-Verwaltung**: Konfigurierbare Gewerke, Verbindungen, Installationszonen
- **Export-Funktionen**: PDF und Excel-Export für Dokumentation
- **KNX-Gruppenadressen** (Phase 2): Automatische Generierung hierarchischer GA-Strukturen
- **Verteilerschrank-Planer** (Phase 2): Aktoren, Sicherungen, Kanalzuordnung
- **Jetplan-Import** (Phase 3): Import von Jetplan-Excel-Exporten

## Technologie-Stack

### Frontend
- React 18+ mit TypeScript
- Vite (Build Tool)
- Ant Design (UI Framework)
- React Router, React Query

### Backend
- Node.js 20+ mit TypeScript
- Express.js (REST API)
- SQLite (Datenbank)
- Prisma (ORM)

### Deployment
- Docker Container
- Ubuntu VM
- Nginx (Reverse Proxy)

## Projekt-Struktur

```
elektro-raumbuch/
├── frontend/              # React Frontend
├── backend/               # Express Backend
├── config/                # Konfigurationsdateien
│   └── mapping.yaml       # Jetplan-Import-Mapping
├── docs/                  # Dokumentation
├── data/                  # SQLite-Datenbank (ignored)
├── uploads/               # Upload-Verzeichnis (ignored)
├── references/            # Referenz-Dateien
│   └── Elektro_Planung_Tool_v2.xlsm
│   └── 2026-02-13_Projektdatei_Casa-Singer_EG.xlsx
├── SPECS.md               # Detaillierte Spezifikation
└── README.md              # Diese Datei
```

## Schnellstart

### Voraussetzungen

- Node.js 20+ 
- npm oder yarn
- Git

### Installation

```bash
# Repository klonen
git clone https://github.com/antonraptor/elektro-raumbuch.git
cd elektro-raumbuch

# Backend-Dependencies installieren
cd backend
npm install

# Frontend-Dependencies installieren
cd ../frontend
npm install
```

### Development

```bash
# Backend starten (Port 3000)
cd backend
npm run dev

# Frontend starten (Port 5173)
cd frontend
npm run dev
```

### Produktion (Docker)

```bash
# Docker-Image bauen
docker build -t elektro-raumbuch .

# Container starten
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  --name elektro-raumbuch \
  elektro-raumbuch
```

## Dokumentation

- **[SPECS.md](./SPECS.md)**: Detaillierte technische Spezifikation
- **[config/mapping.yaml](./config/mapping.yaml)**: Jetplan-Import-Mapping-Konfiguration
- **API-Dokumentation**: (wird erstellt)

## Entwicklungs-Roadmap

### Phase 1: MVP - v1.0 (Woche 1-6)
- ✅ Projekt-Setup & Repository
- ⏳ Backend: API-Endpunkte (Projekte, Zonen, Räume, Geräte)
- ⏳ Frontend: Basis-UI mit Ant Design
- ⏳ Raumbuch-Management
- ⏳ Item-Liste & Metadaten-Verwaltung
- ⏳ Export-Funktionen (PDF, Excel)

### Phase 2: Advanced Features - v2.0 (Woche 7-10)
- ⏳ KNX-Gruppenadressen-Management
- ⏳ Verteilerschrank-Planer
- ⏳ ETS-CSV-Export

### Phase 3: Enhanced Features - v3.0 (Woche 11-14)
- ⏳ Jetplan-Import
- ⏳ Erweiterte Berichte
- ⏳ Templates & Duplikation
- ⏳ Versionierung & History

## Mitwirken

Dieses Projekt ist ein privates Tool zur Elektroplanung. Contributions sind derzeit nicht vorgesehen.

## Lizenz

Privates Projekt - Alle Rechte vorbehalten

## Autor

Anton Raptor

## Changelog

### v0.1.0 - 2026-02-13
- Initial project setup
- Repository structure created
- Specifications and mapping configuration added
- Excel analysis completed (Elektro_Planung_Tool_v2.xlsm)
- Jetplan reference file analyzed

---

**Status**: 🚧 In aktiver Entwicklung - Phase 1 (MVP)

**Nächste Schritte**: 
1. Backend-Setup (Express + Prisma + SQLite)
2. Datenbank-Schema implementieren
3. Frontend-Setup (React + Vite + Ant Design)
