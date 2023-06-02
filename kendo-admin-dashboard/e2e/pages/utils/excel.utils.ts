
import {CellValue, Workbook, Worksheet} from 'exceljs';

const Excel = require('exceljs');

export class ExcelFileSystemUtils {

   /**
    * Checking whether column exist in Excel file.
    * @param workbook
    * @param columnName
    * @param row
    * @param sheetName
    */
    static isColumnExisting(workbook: Workbook, columnName: string, row: number, sheetName: string): boolean {
        let exists = false;
        const sheet: Worksheet = workbook.getWorksheet(sheetName);
        const columnNum = sheet.columns.length;
        for (let i = 1; i <= columnNum; i++) {
            if (sheet.getRow(row).getCell(i).value === columnName) {
                exists = true;
                break;
            }
        }
        return exists;
    }

   /**
    * Get row index for cell by value
    * @params {Workbook} workbook
    * @params {number} startRow
    * @params {string} searchedValue
    * @params {string} sheetName
    */
    static findRowIndexByValue(workbook: Workbook, startRow: number, col: number, searchedValue: string, sheetName: string): number {
        const sheet: Worksheet = workbook.getWorksheet(sheetName);
        for (let row = startRow; row <= sheet.rowCount; row++) {
            const currentValue: CellValue = this.getSheetValueAtCell(sheet, row, col);
            if (typeof currentValue === "string" && (currentValue.toString().trim() === searchedValue)) {
                return row;
            }
        }
        return -1;
    }

   /**
    * Get row and column indexes for cell by value
    * @params {Workbook} workbook
    * @params {number} startRow
    * @params {number} startCol
    * @params {string} searchedValue
    * @params {string} sheetName
    */
    static findRowAndColumnIndexesByValue(workbook: Workbook, startRow: number, startCol: number, searchedValue: string, sheetName: string): Map<number, number> {
        const result: Map<number, number> = new Map<number, number>();
        const sheet: Worksheet = workbook.getWorksheet(sheetName);
        for (let row = startRow; row <= sheet.rowCount; row++) {
            for (let col = startCol; col <= sheet.columnCount; col++) {
                const currentValue: CellValue = this.getSheetValueAtCell(sheet, row, col);
                if ((<string>currentValue).trim() === searchedValue) {
                return result.set(row, col);
                }
            }
        }
        return result.set(-1, -1);
    }

   /**
    * Get workbook
    * @params {any} download
    */
    static async getWorkbook(download: any): Promise<Workbook> {
        return new Excel.Workbook().xlsx.read(await download.createReadStream());
    }

   /**
    * Get row and column indexes for cell by value
    * @params {Workbook} workbook
    * @params {number} row
    * @params {number} startCol
    * @params {string} searchedValue
    * @params {string} sheetName
    */
    static findColumnIndexesByRowAndValue(workbook: Workbook, row: number, startCol: number, searchedValue: string, sheetName: string): number {
        const sheet: Worksheet = workbook.getWorksheet(sheetName);
        for (let column = startCol; column <= sheet.columnCount; column++) {
            const currentValue: CellValue = this.getSheetValueAtCell(sheet, row, column);
            if ((<string>currentValue).trim() === searchedValue) {
                return column;
            }
        }
        return -1;
    }

   /**
    * Get sheet value at sell
    * @params {Worksheet} sheet
    * @params {number} row
    * @params {number} col
    */
    private static getSheetValueAtCell(sheet: Worksheet, row: number, col: number): CellValue {
        return sheet.getRow(row).getCell(col).value;
    }

   /**
    * Get sheet
    * @params {Workbook} workbook
    * @params {string} sheetName
    */
    static getSheet(workbook: Workbook, sheetName: string): Worksheet {
        return workbook.getWorksheet(sheetName);
    }

   /**
    * Get value at cell
    * @params {Workbook} workbook
    * @params {number} row
    * @params {number} col
    * @params {string} sheetName
    */
    static getValueAtCell(workbook: Workbook, row: number, col: number, sheetName: string): CellValue {
        if (row === -1 || col === -1) {
            return null;
        }
        const sheet = workbook.getWorksheet(sheetName);
        return sheet.getRow(row).getCell(col).value;
    }

   /**
    * Get values from a row
    * @params {Workbook} workbook
    * @params {number} row
    * @params {number} startCol
    * @params {string} sheetName
    */
    static getValuesFromRow(workbook: Workbook, row: number, startCol: number, sheetName: string): Array<CellValue> {
        const sheet = workbook.getWorksheet(sheetName);
        const values: Array<CellValue> = [];
        let value: CellValue = sheet.getRow(row).getCell(startCol++).value;
        while (value) {
            values.push(value);
            value = sheet.getRow(row).getCell(startCol++).value;
        }
        return values;
    }

   /**
    * Check if value exists in a specific column
    * @params {Workbook} workbook
    * @params {number} column
    * @params {number} startRow
    * @params {string} sheetName
    * @params {string} searchedValue
    */
    static isValueFromColumnExisting(workbook: Workbook, column: number, startRow: number, sheetName: string, searchedValue: string): boolean {
        const sheet: Worksheet = workbook.getWorksheet(sheetName);
        let value: CellValue = sheet.getRow(startRow++).getCell(column).value;
        while (value) {
            if (value === searchedValue) {
                return true;
            }
            value = sheet.getRow(startRow++).getCell(column).value;
        }
        return false;
    }
}
