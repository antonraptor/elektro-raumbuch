import * as XLSX from 'xlsx';
import { prisma } from '../utils/prisma';

interface ExcelRoomRow {
  Zone?: string;
  Raum?: string;
  'Raum-Code'?: string;
  Geraet?: string;
  Kategorie?: string;
  Verbindung?: string;
  Installationszone?: string;
  Anzahl?: number;
  Position?: string;
  Notizen?: string;
}

export class ExcelImportService {
  /**
   * Import Excel file and create project with zones, rooms, and devices
   */
  async importExcel(
    buffer: Buffer,
    projectName: string,
    description?: string
  ): Promise<{ projectId: number; stats: any }> {
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get Raumbuch worksheet
    const raumbuchSheet = workbook.Sheets['Raumbuch'];
    if (!raumbuchSheet) {
      throw new Error('Worksheet "Raumbuch" not found in Excel file');
    }

    // Convert to JSON
    const rows: ExcelRoomRow[] = XLSX.utils.sheet_to_json(raumbuchSheet);

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
    const tradeMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const connectionMap = new Map<string, number>();
    const installZoneMap = new Map<string, number>();

    // Collect unique values
    const uniqueTrades = new Set<string>();
    const uniqueCategories = new Set<string>();
    const uniqueConnections = new Set<string>();
    const uniqueInstallZones = new Set<string>();

    rows.forEach((row) => {
      if (row.Geraet && row.Geraet.includes('-')) {
        const trade = row.Geraet.split('-')[0].trim();
        if (trade) uniqueTrades.add(trade);
      }
      if (row.Kategorie) uniqueCategories.add(row.Kategorie);
      if (row.Verbindung) uniqueConnections.add(row.Verbindung);
      if (row.Installationszone) uniqueInstallZones.add(row.Installationszone);
    });

    // Create Trades
    let sortOrder = 1;
    for (const tradeName of uniqueTrades) {
      const trade = await prisma.trade.create({
        data: {
          projectId: project.id,
          name: tradeName,
          sortOrder: sortOrder++,
        },
      });
      tradeMap.set(tradeName, trade.id);
      stats.trades++;
    }

    // Create Categories
    sortOrder = 1;
    for (const categoryName of uniqueCategories) {
      const category = await prisma.category.create({
        data: {
          projectId: project.id,
          name: categoryName,
          sortOrder: sortOrder++,
        },
      });
      categoryMap.set(categoryName, category.id);
      stats.categories++;
    }

    // Create Connections
    sortOrder = 1;
    for (const connectionName of uniqueConnections) {
      const connection = await prisma.connection.create({
        data: {
          projectId: project.id,
          name: connectionName,
          sortOrder: sortOrder++,
        },
      });
      connectionMap.set(connectionName, connection.id);
      stats.connections++;
    }

    // Create InstallZones
    sortOrder = 1;
    for (const installZoneName of uniqueInstallZones) {
      const installZone = await prisma.installZone.create({
        data: {
          projectId: project.id,
          name: installZoneName,
          sortOrder: sortOrder++,
        },
      });
      installZoneMap.set(installZoneName, installZone.id);
      stats.installZones++;
    }

    // Create zones, rooms, and devices
    const zoneMap = new Map<string, number>();
    const roomMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();

    let zoneSortOrder = 1;
    for (const row of rows) {
      if (!row.Zone || !row.Raum) continue;

      // Create or get zone
      if (!zoneMap.has(row.Zone)) {
        const zone = await prisma.zone.create({
          data: {
            projectId: project.id,
            name: row.Zone,
            sortOrder: zoneSortOrder++,
          },
        });
        zoneMap.set(row.Zone, zone.id);
        stats.zones++;
      }

      // Create or get room
      const roomKey = `${row.Zone}:${row['Raum-Code'] || row.Raum}`;
      if (!roomMap.has(roomKey)) {
        const room = await prisma.room.create({
          data: {
            projectId: project.id,
            zoneId: zoneMap.get(row.Zone)!,
            roomNumber: row['Raum-Code'] || '',
            name: row.Raum,
          },
        });
        roomMap.set(roomKey, room.id);
        stats.rooms++;
      }

      // Create device if not exists
      if (row.Geraet) {
        const deviceKey = row.Geraet;
        
        if (!deviceMap.has(deviceKey)) {
          const tradeName = row.Geraet.includes('-') 
            ? row.Geraet.split('-')[0].trim() 
            : undefined;
          
          const device = await prisma.device.create({
            data: {
              projectId: project.id,
              name: row.Geraet,
              tradeId: tradeName ? tradeMap.get(tradeName) : undefined,
              categoryId: row.Kategorie ? categoryMap.get(row.Kategorie) : undefined,
              connectionId: row.Verbindung ? connectionMap.get(row.Verbindung) : undefined,
              installZoneId: row.Installationszone ? installZoneMap.get(row.Installationszone) : undefined,
              isActive: true,
            },
          });
          deviceMap.set(deviceKey, device.id);
          stats.devices++;
        }

        // Create RoomDevice (assignment of device to room)
        await prisma.roomDevice.create({
          data: {
            roomId: roomMap.get(roomKey)!,
            deviceId: deviceMap.get(deviceKey)!,
            quantity: row.Anzahl || 1,
            position: row.Position,
            notes: row.Notizen,
          },
        });
      }
    }

    return { projectId: project.id, stats };
  }
}
