import * as XLSX from 'xlsx';
import prisma from '../utils/prisma';

interface ExcelRoomRow {
  Zone?: string;
  'Zonennr.'?: number;
  Raumcode?: string;
  'Raumnr.'?: number;
  Raum?: string;
  'Gesamtnr.'?: number;
  Bezeichnung?: string;
  'Geräte/Gewerke'?: string;
  Kategorie?: string;
  Verbindung?: string;
  Leitungsart?: string;
  Ziel?: string;
  Code?: string;
  Gesamtcode?: string;
  'Leitung Code'?: string;
  Installationszone?: string;
}

export class ExcelImportService {
  /**
   * Import Excel file and create project with zones, rooms, and devices
   */
  async importExcel(
    buffer: Buffer,
    projectName: string,
    description?: string
  ): Promise<{ projectId: string; stats: any }> {
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get Raumbuch worksheet
    const raumbuchSheet = workbook.Sheets['Raumbuch'];
    if (!raumbuchSheet) {
      throw new Error('Worksheet "Raumbuch" not found in Excel file');
    }

    // Convert to JSON (skip first 2 rows, use row 3 as header)
    const rows: ExcelRoomRow[] = XLSX.utils.sheet_to_json(raumbuchSheet, { range: 2 });

    // Create project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: description || `Imported from Excel: ${new Date().toISOString()}`,
      },
    });

    const stats = {
      zones: 0,
      rooms: 0,
      devices: 0,
      trades: 0,
      categories: 0,
      connections: 0,
      installZones: 0,
    };

    // Create metadata first (Gewerke, Kategorien, Verbindungen, Installationszonen)
    const tradeMap = new Map<string, string>();
    const categoryMap = new Map<string, string>();
    const connectionMap = new Map<string, string>();
    const installZoneMap = new Map<string, string>();

    // Collect unique values
    const uniqueTrades = new Set<string>();
    const uniqueCategories = new Set<string>();
    const uniqueConnections = new Set<string>();
    const uniqueInstallZones = new Set<string>();

    rows.forEach((row) => {
      // Extract trade from "Geräte/Gewerke" column
      if (row['Geräte/Gewerke']) {
        uniqueTrades.add(row['Geräte/Gewerke']);
      }
      if (row.Kategorie) uniqueCategories.add(row.Kategorie);
      if (row.Verbindung) uniqueConnections.add(row.Verbindung);
      if (row.Installationszone) uniqueInstallZones.add(row.Installationszone);
    });

    // Create Trades
    let order = 1;
    const usedTradeCodes = new Set<string>();
    
    for (const tradeName of uniqueTrades) {
      // Generate unique code
      let code = tradeName.substring(0, 3).toUpperCase();
      let counter = 1;
      while (usedTradeCodes.has(code)) {
        code = tradeName.substring(0, 2).toUpperCase() + counter;
        counter++;
      }
      usedTradeCodes.add(code);
      
      const trade = await prisma.trade.create({
        data: {
          projectId: project.id,
          name: tradeName,
          code: code,
          order: order++,
        },
      });
      tradeMap.set(tradeName, trade.id);
      stats.trades++;
    }

    // Create Categories (we'll assign them to the first trade for now)
    order = 1;
    const firstTradeId = Array.from(tradeMap.values())[0];
    const usedCategoryCodes = new Set<string>();
    
    for (const categoryName of uniqueCategories) {
      if (!firstTradeId) continue;
      
      // Generate unique code
      let code = categoryName.substring(0, 3).toUpperCase();
      let counter = 1;
      while (usedCategoryCodes.has(code)) {
        code = categoryName.substring(0, 2).toUpperCase() + counter;
        counter++;
      }
      usedCategoryCodes.add(code);
      
      const category = await prisma.category.create({
        data: {
          tradeId: firstTradeId,
          name: categoryName,
          code: code,
          order: order++,
        },
      });
      categoryMap.set(categoryName, category.id);
      stats.categories++;
    }

    // Create Connections
    const usedConnectionCodes = new Set<string>();
    
    for (const connectionName of uniqueConnections) {
      // Generate unique code
      let code = connectionName.substring(0, 3).toUpperCase();
      let counter = 1;
      while (usedConnectionCodes.has(code)) {
        code = connectionName.substring(0, 2).toUpperCase() + counter;
        counter++;
      }
      usedConnectionCodes.add(code);
      
      const connection = await prisma.connection.create({
        data: {
          projectId: project.id,
          name: connectionName,
          code: code,
        },
      });
      connectionMap.set(connectionName, connection.id);
      stats.connections++;
    }

    // Create InstallZones
    order = 1;
    const usedInstallZoneCodes = new Set<string>();
    
    for (const installZoneName of uniqueInstallZones) {
      // Generate unique code
      let code = installZoneName.substring(0, 3).toUpperCase();
      let counter = 1;
      while (usedInstallZoneCodes.has(code)) {
        code = installZoneName.substring(0, 2).toUpperCase() + counter;
        counter++;
      }
      usedInstallZoneCodes.add(code);
      
      const installZone = await prisma.installZone.create({
        data: {
          projectId: project.id,
          name: installZoneName,
          code: code,
          order: order++,
        },
      });
      installZoneMap.set(installZoneName, installZone.id);
      stats.installZones++;
    }

    // Create zones, rooms, and devices
    const zoneMap = new Map<string, string>();
    const roomMap = new Map<string, string>();
    const deviceMap = new Map<string, string>();

    let zoneOrder = 1;
    let roomOrder = 1;
    
    for (const row of rows) {
      // Skip empty rows
      if (!row.Zone || !row.Raum) continue;

      // Create or get zone
      if (!zoneMap.has(row.Zone)) {
        const zoneCode = row['Zonennr.'] ? String(row['Zonennr.']) : row.Zone.substring(0, 3).toUpperCase();
        const zone = await prisma.zone.create({
          data: {
            projectId: project.id,
            code: zoneCode,
            name: row.Zone,
            order: zoneOrder++,
          },
        });
        zoneMap.set(row.Zone, zone.id);
        stats.zones++;
      }

      // Create or get room
      const roomKey = `${row.Zone}:${row.Raumcode || row.Raum}`;
      if (!roomMap.has(roomKey)) {
        const roomCode = row.Raumcode || row.Raum.substring(0, 3).toUpperCase();
        const roomNumber = row['Raumnr.'] || roomOrder;
        const room = await prisma.room.create({
          data: {
            zoneId: zoneMap.get(row.Zone)!,
            code: roomCode,
            number: roomNumber,
            name: row.Raum,
            order: roomOrder++,
          },
        });
        roomMap.set(roomKey, room.id);
        stats.rooms++;
      }

      // Create device if not exists
      if (row.Bezeichnung && row['Geräte/Gewerke']) {
        const deviceKey = row.Bezeichnung;
        
        if (!deviceMap.has(deviceKey)) {
          const tradeName = row['Geräte/Gewerke'];
          
          const device = await prisma.device.create({
            data: {
              projectId: project.id,
              name: row.Bezeichnung,
              code: row.Code || row.Bezeichnung.substring(0, 5).toUpperCase(),
              tradeId: tradeName ? tradeMap.get(tradeName) : undefined,
              categoryId: row.Kategorie ? categoryMap.get(row.Kategorie) : undefined,
            },
          });
          deviceMap.set(deviceKey, device.id);
          stats.devices++;
        }

        // Create RoomDevice (assignment of device to room)
        const tradeName = row['Geräte/Gewerke'];

        await prisma.roomDevice.create({
          data: {
            roomId: roomMap.get(roomKey)!,
            deviceId: deviceMap.get(deviceKey)!,
            designation: row.Bezeichnung,
            code: row.Code || '',
            totalCode: row.Gesamtcode || '',
            tradeId: tradeName ? tradeMap.get(tradeName) : undefined,
            categoryId: row.Kategorie ? categoryMap.get(row.Kategorie) : undefined,
            connectionId: row.Verbindung ? connectionMap.get(row.Verbindung) : undefined,
            installZoneId: row.Installationszone ? installZoneMap.get(row.Installationszone) : undefined,
            cableType: row.Leitungsart || undefined,
            target: row.Ziel || undefined,
            quantity: 1,
            order: roomOrder++,
          },
        });
      }
    }

    return { projectId: project.id, stats };
  }
}
