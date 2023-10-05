// excelGenerator.js
const ExcelJS = require('exceljs');

function generateExcel(sheetsData) {
  const workbook = new ExcelJS.Workbook();

  const headerCellStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'CCCCCC' }, // Gray color for the header
    },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    alignment: {
      horizontal: 'center', // Center-align header text
      vertical: 'middle',  // Vertically center-align header text
      wrapText: true,      // Enable text wrapping
    },
  };

  const dataCellStyle = {
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    alignment: {
      horizontal: 'left', // Left-align data text
      vertical: 'middle', // Vertically center-align data text
      wrapText: true,     // Enable text wrapping
    },
  };

  for (const sheetName in sheetsData) {
    if (sheetsData.hasOwnProperty(sheetName)) {
      const sheetData = sheetsData[sheetName];
      const worksheet = workbook.addWorksheet(sheetName);

      // Add header row with gray background, borders, and text wrapping
      const headerRow = worksheet.addRow(sheetData[0]);
      headerRow.eachCell((cell) => {
        cell.fill = headerCellStyle.fill;
        cell.border = headerCellStyle.border;
        cell.alignment = headerCellStyle.alignment;
      });

      // Add data rows with borders and text wrapping
      for (let i = 1; i < sheetData.length; i++) {
        const dataRow = worksheet.addRow(sheetData[i]);
        dataRow.eachCell((cell) => {
          cell.border = dataCellStyle.border;
          cell.alignment = dataCellStyle.alignment;
        });

        // Conditional formatting for the last column
        const lastColumnCell = dataRow.getCell(dataRow.cellCount);
        const lastColumnValue = lastColumnCell.value;
        if (lastColumnValue === 'SUCCESS') {
          lastColumnCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '00FF00' }, // Green color for 'SUCCESS'
          };
        } else if (lastColumnValue === 'FAILURE') {
          lastColumnCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000' }, // Red color for 'FAILURE'
          };
        }
      }
    }
  }

  return workbook;
}

module.exports = generateExcel;
