import { format, parse, isValid } from 'date-fns';

declare global {
  interface Window {
    gapi: any;
  }
}

export interface DayData {
  date: string;
  todos: TodoItem[];
  notes: Note[];
  analysis: AnalysisData | null;
  mood: string;
  efficiency: number;
  transcriptions: string[];
  lastUpdated: string;
}

export interface TodoItem {
  id: string;
  text: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  source: 'audio' | 'manual';
  createdAt: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface AnalysisData {
  workDone: string;
  progress: string;
  special: string;
  todos: string[];
  efficiency: number;
  efficiencyReason: string;
  transcription: string;
  feedback: string;
  improvement: string;
}

const SHEET_NAME = 'LifeVibe_Data';
const HEADER_ROW = ['date', 'todos', 'notes', 'analysis', 'mood', 'efficiency', 'transcriptions', 'lastUpdated'];

class GoogleSheetsService {
  private sheetId: string | null = null;
  private isReady = false;

  setSheetId(id: string) {
    this.sheetId = id;
    this.isReady = true;
  }

  getSheetId() {
    return this.sheetId;
  }

  async createHiddenSheet(accessToken: string): Promise<string> {
    try {
      // Create the spreadsheet
      const createResponse = await window.gapi.client.sheets.spreadsheets.create({
        resource: {
          properties: {
            title: '.LifeVibe_Database', // Dot prefix makes it less visible
          },
          sheets: [{
            properties: {
              title: SHEET_NAME,
              gridProperties: {
                rowCount: 1000,
                columnCount: HEADER_ROW.length,
              },
            },
          }],
        },
      });

      const spreadsheetId = createResponse.result.spreadsheetId;

      // Add headers
      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:H1`,
        valueInputOption: 'RAW',
        resource: {
          values: [HEADER_ROW],
        },
      });

      // Make the file hidden (not in root folder visible list)
      await window.gapi.client.drive.files.update({
        fileId: spreadsheetId,
        resource: {
          properties: {
            hidden: 'true',
            appDataFolder: 'true',
          },
        },
      });

      this.sheetId = spreadsheetId;
      this.isReady = true;
      return spreadsheetId;
    } catch (error) {
      console.error('Error creating sheet:', error);
      throw error;
    }
  }

  async findExistingSheet(): Promise<string | null> {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: "name='.LifeVibe_Database' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
        fields: 'files(id, name)',
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        this.sheetId = files[0].id;
        this.isReady = true;
        return files[0].id;
      }
      return null;
    } catch (error) {
      console.error('Error finding sheet:', error);
      return null;
    }
  }

  async initializeSheet(accessToken: string, existingSheetId?: string): Promise<string> {
    window.gapi.client.setToken({ access_token: accessToken });

    if (existingSheetId) {
      this.sheetId = existingSheetId;
      this.isReady = true;
      return existingSheetId;
    }

    // Try to find existing sheet
    const foundSheetId = await this.findExistingSheet();
    if (foundSheetId) {
      return foundSheetId;
    }

    // Create new sheet if not found
    return this.createHiddenSheet(accessToken);
  }

  async getDayData(date: Date): Promise<DayData | null> {
    if (!this.isReady || !this.sheetId) {
      console.error('Sheet not initialized');
      return null;
    }

    const dateString = format(date, 'yyyy-MM-dd');

    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `${SHEET_NAME}!A:H`,
      });

      const rows = response.result.values || [];
      
      // Find row with matching date (skip header)
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === dateString) {
          return this.parseRowToData(rows[i]);
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting day data:', error);
      return null;
    }
  }

  async saveDayData(date: Date, data: Partial<DayData>): Promise<boolean> {
    if (!this.isReady || !this.sheetId) {
      console.error('Sheet not initialized');
      return false;
    }

    const dateString = format(date, 'yyyy-MM-dd');

    try {
      // Get all data to find or create row
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `${SHEET_NAME}!A:H`,
      });

      const rows = response.result.values || [HEADER_ROW];
      let rowIndex = -1;

      // Find existing row
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] === dateString) {
          rowIndex = i;
          break;
        }
      }

      // Merge with existing data
      let existingData: DayData = {
        date: dateString,
        todos: [],
        notes: [],
        analysis: null,
        mood: '',
        efficiency: 0,
        transcriptions: [],
        lastUpdated: new Date().toISOString(),
      };

      if (rowIndex !== -1) {
        existingData = this.parseRowToData(rows[rowIndex]) || existingData;
      }

      const mergedData: DayData = {
        ...existingData,
        ...data,
        date: dateString,
        lastUpdated: new Date().toISOString(),
      };

      const rowData = this.dataToRow(mergedData);

      if (rowIndex === -1) {
        // Append new row
        await window.gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: this.sheetId,
          range: `${SHEET_NAME}!A:H`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [rowData],
          },
        });
      } else {
        // Update existing row
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: `${SHEET_NAME}!A${rowIndex + 1}:H${rowIndex + 1}`,
          valueInputOption: 'RAW',
          resource: {
            values: [rowData],
          },
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving day data:', error);
      return false;
    }
  }

  async getAllDaysWithData(): Promise<string[]> {
    if (!this.isReady || !this.sheetId) {
      return [];
    }

    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: `${SHEET_NAME}!A:A`,
      });

      const rows = response.result.values || [];
      const dates: string[] = [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0]) {
          dates.push(rows[i][0]);
        }
      }

      return dates;
    } catch (error) {
      console.error('Error getting all days:', error);
      return [];
    }
  }

  private parseRowToData(row: string[]): DayData | null {
    try {
      return {
        date: row[0] || '',
        todos: JSON.parse(row[1] || '[]'),
        notes: JSON.parse(row[2] || '[]'),
        analysis: row[3] ? JSON.parse(row[3]) : null,
        mood: row[4] || '',
        efficiency: parseInt(row[5] || '0', 10),
        transcriptions: JSON.parse(row[6] || '[]'),
        lastUpdated: row[7] || '',
      };
    } catch (error) {
      console.error('Error parsing row:', error);
      return null;
    }
  }

  private dataToRow(data: DayData): string[] {
    return [
      data.date,
      JSON.stringify(data.todos),
      JSON.stringify(data.notes),
      data.analysis ? JSON.stringify(data.analysis) : '',
      data.mood,
      data.efficiency.toString(),
      JSON.stringify(data.transcriptions),
      data.lastUpdated,
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
