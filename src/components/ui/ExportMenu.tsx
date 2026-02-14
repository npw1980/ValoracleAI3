import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson } from 'lucide-react';
import { Button } from './Button';

interface ExportMenuProps {
  data: Record<string, unknown>[];
  filename?: string;
  columns?: { key: string; label: string }[];
}

export function ExportMenu({ data, filename = 'export', columns }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const getHeaders = () => {
    if (columns) return columns.map(c => c.label);
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getKeys = () => {
    if (columns) return columns.map(c => c.key);
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const exportToCSV = () => {
    const headers = getHeaders();
    const keys = getKeys();
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        keys.map(key => {
          const value = row[key];
          const stringValue = value === null || value === undefined ? '' : String(value);
          return stringValue.includes(',') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
    setIsOpen(false);
  };

  const exportToExcel = () => {
    // For Excel, we'll create a simple HTML table that Excel can open
    const headers = getHeaders();
    const keys = getKeys();

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Sheet1</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row =>
                `<tr>${keys.map(key => `<td>${row[key] ?? ''}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 min-w-[180px] animate-fade-in"
            style={{ top: position.top, right: position.right }}
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-800 dark:text-white">Export Data</p>
              <p className="text-xs text-slate-500">{data.length} rows</p>
            </div>
            <button
              onClick={exportToCSV}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportToExcel}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={exportToJSON}
              className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
