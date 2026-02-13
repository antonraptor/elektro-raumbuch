# 📋 SPECS.md - Elektro-Raumbuch Web-Anwendung

## 1. Projekt-Übersicht

### 1.1 Projektname
**Elektro-Raumbuch** - Webbasiertes Planungstool für Elektroinstallationen

### 1.2 Beschreibung
Eine moderne Web-Anwendung zur Planung und Verwaltung von Elektroinstallationen mit Fokus auf KNX-Smart-Home-Systeme. Die Anwendung digitalisiert den Planungsprozess von der Raum- und Geräteverwaltung bis zur Generierung von KNX-Gruppenadressen und Verteilerschrankplänen.

### 1.3 Technologie-Stack

**Frontend:**
- React 18+ mit TypeScript
- Vite (Build Tool)
- Ant Design (UI Framework)
- React Router (Navigation)
- Zustand oder Redux Toolkit (State Management)
- React Query (API State Management)
- PDF: jsPDF oder react-pdf
- Excel: xlsx (SheetJS)

**Backend:**
- Node.js 20+ mit TypeScript
- Express.js (REST API)
- SQLite (Datenbank)
- Prisma (ORM)

**Development:**
- ESLint + Prettier
- Jest (Testing)
- Docker (Deployment)

**Deployment:**
- Docker Container
- Ubuntu VM
- Nginx (Reverse Proxy)

---

## 2. Feature-Übersicht & Priorisierung

### 2.1 Phase 1: MVP (Must-Have) - v1.0

#### ✅ Raumbuch-Management (PRIORITY: HIGH)
- Zonen erstellen, bearbeiten, löschen (z.B. EG, OG, UG)
- Räume pro Zone verwalten mit Code/Nummer
- Geräte zu Räumen zuordnen
- Geräte-Details erfassen:
  - Bezeichnung
  - Geräte/Gewerke
  - Kategorie
  - Verbindung
  - Installationszone
  - Code-Generierung

#### ✅ Item-/Geräteliste (PRIORITY: HIGH)
- Master-Liste aller verfügbaren Gerätetypen
- Kategorisierung nach Gewerken
- Code-System verwalten
- Geräte hinzufügen, bearbeiten, löschen

#### ✅ Metadaten-Verwaltung (PRIORITY: HIGH)
Alle Stammdaten sollen konfigurierbar sein:
- **Gewerke** (Trades): Zentral, Beleuchtung, Steckdosen, Beschattung, HeizungKlimaLüftung, Sensoren, Bewässerung, Zugriffskontrolle, Audio, MeldungenAlarm
- **Verbindungstypen** (Connections): 230V AC, 230V AC - Beschattung, 230V AC - Heizung, KNX, DALI, PoE, Telefon, 24V DC, DIGITAL (potentialfrei)
- **Installationszonen**: oben, Mitte, Steckdose, unten, fest, Decke, Boden, Ethernet
- **Kategorien**: Beleuchtung (dimmbar/nicht dimmbar), Steckdosen (mit/ohne Schaltaktor), Sensoren (BM, PM, Taster, etc.)
- **Ziel-Lokationen**: Verteilerschrank-Ziele für Leitungen
- **Abkürzungen**: Projekt-spezifische Codes und Kürzel

#### ✅ Export-Funktionen (PRIORITY: HIGH)
- **PDF-Export**: Raumbuch, Stücklisten, Reports
- **Excel-Export**: Raumbuch, Item-Liste, Zusammenfassungen

#### ✅ Basis-UI (PRIORITY: HIGH)
- Dashboard mit Projekt-Übersicht
- Responsive Layout (Desktop/Tablet)
- Ant Design Komponenten
- Navigation (Menü, Breadcrumbs)

### 2.2 Phase 2: Advanced Features - v2.0

#### 🔄 KNX-Gruppenadressen-Management (PRIORITY: MEDIUM)
- Hierarchische 3-stufige Struktur (HG/MG/UG)
- Automatische Generierung basierend auf Raumbuch
- Mapping: Gewerk → Hauptgruppe → Mittelgruppe → Untergruppe
- Manuelle Anpassung möglich
- Gruppenadressen-Übersicht

#### 🔄 Verteilerschrank-Planer (PRIORITY: MEDIUM)
- Aktoren verwalten (SA, JA, HA, Digital)
- Kanalzuordnung
- Reihenklemmen-Planung
- Sicherungen (RCD, LS)
- KNX-Komponenten (UKNX, IPKNX)
- Verteilerschrank-Schema

#### 🔄 ETS-Export (PRIORITY: MEDIUM)
- CSV-Export für ETS-Import
- Hierarchische GA-Struktur
- Format: Semikolon-separiert
- Kompatibilität mit ETS 5/6

### 2.3 Phase 3: Enhanced Features - v3.0

#### ⏳ Jetplan-Import (PRIORITY: LOW)
- Excel-Import von Jetplan-Exports
- Mapping-Konfiguration (YAML)
- Import-Preview & Validierung
- Intelligente Zuordnung

#### ⏳ Erweiterte Berichte (PRIORITY: LOW)
- Pivot-Tabellen
- Zusammenfassungen nach Zonen/Gewerken
- Custom Reports
- Charts & Visualisierungen

#### ⏳ Templates & Duplikation (PRIORITY: LOW)
- Raum-Templates (Standard-Küche, Standard-Bad, etc.)
- Räume duplizieren
- Projekt-Templates

#### ⏳ Versionierung & History (PRIORITY: LOW)
- Änderungshistorie
- Backup/Restore
- Vergleich zwischen Versionen

---

## 3. Datenmodell

### 3.1 ER-Diagramm (Textform)

```
┌─────────────┐
│   Project   │
├─────────────┤
│ id          │
│ name        │
│ description │
│ created_at  │
│ updated_at  │
└─────────────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│    Zone     │
├─────────────┤
│ id          │
│ project_id  │◄─────┐
│ code        │      │
│ name        │      │
│ order       │      │
└─────────────┘      │
       │             │
       │ 1:N         │
       ▼             │
┌─────────────┐      │
│    Room     │      │
├─────────────┤      │
│ id          │      │
│ zone_id     │      │
│ code        │      │
│ number      │      │
│ name        │      │
│ order       │      │
└─────────────┘      │
       │             │
       │ 1:N         │
       ▼             │
┌──────────────┐     │
│  RoomDevice  │     │
├──────────────┤     │
│ id           │     │
│ room_id      │     │
│ device_id    │────┐│
│ designation  │    ││
│ code         │    ││
│ total_code   │    ││
│ trade_id     │────┤│
│ category_id  │────┤│
│ connection_id│────┤│
│ install_zone │────┤│
│ cable_type   │    ││
│ target       │    ││
│ quantity     │    ││
│ order        │    ││
└──────────────┘    ││
                    ││
┌──────────────┐    ││
│    Device    │◄───┘│
├──────────────┤     │
│ id           │     │
│ name         │     │
│ description  │     │
│ code         │     │
│ trade_id     │     │
│ category_id  │     │
└──────────────┘     │
                     │
┌──────────────┐     │
│    Trade     │◄────┤ (Gewerke)
├──────────────┤     │
│ id           │     │
│ project_id   │─────┘
│ name         │
│ code         │
│ hg_number    │ (KNX Hauptgruppe)
│ order        │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Category   │
├──────────────┤
│ id           │
│ trade_id     │
│ name         │
│ code         │
│ order        │
└──────────────┘

┌──────────────┐
│  Connection  │ (Verbindungstypen)
├──────────────┤
│ id           │
│ project_id   │
│ name         │
│ code         │
│ voltage      │
└──────────────┘

┌──────────────┐
│ InstallZone  │ (Installationszonen)
├──────────────┤
│ id           │
│ project_id   │
│ name         │
│ code         │
│ order        │
└──────────────┘
```

### 3.2 Prisma Schema

Siehe `backend/prisma/schema.prisma` für vollständiges Schema.

---

## 4. API-Endpunkte (REST)

### 4.1 Project
- `GET /api/projects` - Liste aller Projekte
- `GET /api/projects/:id` - Projekt-Details
- `POST /api/projects` - Neues Projekt erstellen
- `PUT /api/projects/:id` - Projekt aktualisieren
- `DELETE /api/projects/:id` - Projekt löschen

### 4.2 Zone
- `GET /api/projects/:projectId/zones` - Alle Zonen
- `POST /api/projects/:projectId/zones` - Zone erstellen
- `PUT /api/zones/:id` - Zone aktualisieren
- `DELETE /api/zones/:id` - Zone löschen

### 4.3 Room
- `GET /api/zones/:zoneId/rooms` - Alle Räume einer Zone
- `GET /api/projects/:projectId/rooms` - Alle Räume eines Projekts
- `POST /api/zones/:zoneId/rooms` - Raum erstellen
- `PUT /api/rooms/:id` - Raum aktualisieren
- `DELETE /api/rooms/:id` - Raum löschen

### 4.4 Device (Item-Liste)
- `GET /api/devices` - Alle Geräte (Master-Liste)
- `POST /api/devices` - Gerät erstellen
- `PUT /api/devices/:id` - Gerät aktualisieren
- `DELETE /api/devices/:id` - Gerät löschen

### 4.5 RoomDevice
- `GET /api/rooms/:roomId/devices` - Alle Geräte eines Raums
- `POST /api/rooms/:roomId/devices` - Gerät zu Raum hinzufügen
- `PUT /api/room-devices/:id` - RoomDevice aktualisieren
- `DELETE /api/room-devices/:id` - RoomDevice entfernen

### 4.6 Metadata (Trades, Categories, Connections, InstallZones)
- `GET /api/projects/:projectId/trades` - Alle Gewerke
- `POST /api/projects/:projectId/trades` - Gewerk erstellen
- `PUT /api/trades/:id` - Gewerk aktualisieren
- `DELETE /api/trades/:id` - Gewerk löschen
- *(Analog für Categories, Connections, InstallZones)*

### 4.7 Export
- `GET /api/projects/:projectId/export/pdf` - PDF-Export (Raumbuch)
- `GET /api/projects/:projectId/export/excel` - Excel-Export

---

## 5. UI/UX Design

### 5.1 Layout-Struktur

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo | Projektnamen | Benutzer-Menu       │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  Sidebar │  Content Area                            │
│          │                                          │
│  - Dash  │  ┌────────────────────────────────────┐ │
│  - Raum  │  │  Breadcrumbs                       │ │
│  - Item  │  ├────────────────────────────────────┤ │
│  - Meta  │  │                                    │ │
│  - KNX   │  │  Page Content                      │ │
│  - Vert  │  │                                    │ │
│  - Report│  │                                    │ │
│  - Einst │  │                                    │ │
│          │  └────────────────────────────────────┘ │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 5.2 Hauptseiten

#### Dashboard
- Projekt-Übersicht
- Statistiken (Anzahl Zonen, Räume, Geräte)
- Quick Actions

#### Raumbuch
- Hierarchische Darstellung: Zone > Raum > Geräte
- Tree-Komponente
- Inline-Editing
- Drag & Drop

#### Item-Liste
- Tabelle mit allen Geräten
- Filter & Suche
- CRUD-Operationen

#### Metadaten-Verwaltung
- Tabs: Gewerke, Kategorien, Verbindungen, Installationszonen
- Edit-in-Place
- Drag & Drop Sortierung

---

## 6. Code-Generierungs-Logik

### 6.1 Raum-Code-Generierung
- **Zone-Code** + **Raum-Nummer** = Raumcode
- Beispiel: Zone "EG" → Raum 1 → Code "E1"

### 6.2 Geräte-Code-Generierung
- **Raumcode** + **Laufende Nummer** = Code
- Beispiel: Raum "E1" → 3. Gerät → Code "E1.3"

### 6.3 Gesamtcode-Generierung
- **Zone** + **Raum** + **Gewerk-Code** + **Laufnummer**
- Beispiel: "EG-Küche-BL-01"
- Template konfigurierbar

---

## 7. Jetplan-Import-Mapping (Phase 3)

Siehe `config/mapping.yaml` für detaillierte Mapping-Konfiguration.

---

## 8. Export-Formate

### 8.1 PDF-Export
- Raumbuch mit Deckblatt
- Geräte-Tabellen pro Raum
- Stücklisten-Zusammenfassung

### 8.2 Excel-Export
- Sheet 1: Raumbuch
- Sheet 2: Zusammenfassung
- Sheet 3: Item-Liste
- Sheet 4: Metadaten

---

## 9. Deployment

### Docker-Setup
- Multi-stage build
- Frontend + Backend in einem Container
- SQLite-DB persistence via Volume
- Nginx Reverse Proxy auf Ubuntu VM

---

## 10. Implementierungs-Phasen

### Phase 1: Projekt-Setup & Foundation (Woche 1-2)
- Git-Repository
- Monorepo-Struktur
- Frontend: Vite + React + TypeScript + Ant Design
- Backend: Express + TypeScript + Prisma + SQLite
- Datenbank-Schema
- Basis-API-Endpunkte
- Frontend-Layout
- Dashboard

### Phase 2: Raumbuch-Management (Woche 3-4)
- Zonen-Verwaltung
- Räume-Verwaltung
- RoomDevice-Verwaltung
- Hierarchische Darstellung
- Code-Generierung

### Phase 3: Item-Liste & Metadaten (Woche 5)
- Device-Master-Liste
- Metadaten-Verwaltung
- CRUD für alle Metadaten-Typen

### Phase 4: Export-Funktionen (Woche 6)
- PDF-Export
- Excel-Export

---

## 11. Anhang

### Referenz-Dateien
- `Elektro_Planung_Tool_v2.xlsm` - Original Excel-Tool
- `references/2026-02-13_Projektdatei_Casa-Singer_EG.xlsx` - Jetplan-Referenz
- `config/mapping.yaml` - Import-Mapping-Konfiguration

---

**Erstellt:** 2026-02-13  
**Version:** 1.0  
**Status:** Active Development
