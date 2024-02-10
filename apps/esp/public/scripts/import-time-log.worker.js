// import { ITemplateValidation } from '@esp/apis/file-management';

/* load standalone script from CDN */
self.importScripts('https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js');

// type ErrorType = 'error_checking_value' | 'error_checking_header';

self.addEventListener(
  'message',

  // type IMessageEvent = : MessageEvent<{ file: File; template: ITemplateValidation[] }>
  (e) => {
    const { file, template, maximum_records = 10000 } = e.data;

    const reader = new FileReader();
    const timeoutMs = 150;

    // type IEvent =  ProgressEvent<FileReader>
    reader.onload = async function (event) {
      if (event.target) {
        // interface IParams {
        // columnName: string,
        // errorType: ErrorType,
        // invalidRow?: number
        // }
        const handleError = async (columnName, errorType, invalidRow) => {
          self.postMessage({
            type: errorType || 'error_checking_value',
            error: columnName,
            name: columnName,
            invalidRow,
          });

          await new Promise((resolve) => setTimeout(resolve, timeoutMs));

          self.postMessage({
            type: 'update_state',
            data: {
              [columnName]: {
                name: columnName,
                status: 'invalid',
              },
            },
          });
        };

        const wb = self.XLSX.read(event.target.result, {
          dateNF: 'MM/DD/YYYY',
        });

        const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet

        const rows = self.XLSX.utils
          .sheet_to_json(ws, {
            header: 1,
            skipHidden: true,
            blankrows: true,
            raw: false,
          })
          .filter((row) => row.length);

        const [fileHeaders, ...data] = rows;

        let hasError = false;

        // interface IDataByColumn {
        //  { [key: string]: string[] }
        // }
        const dataByColumn = {};

        fileHeaders.forEach((header, index) => {
          const dataInColumn = data.reduce((acc, cur) => [...acc, cur[index]], []);
          dataByColumn[header] = dataInColumn;
        });

        // Checking header
        for (let index = 0; index < template.length; index++) {
          const { header, position } = template[index];

          if (fileHeaders[index] !== header || index !== position) {
            hasError = true;
            handleError(header, 'error_checking_header');
            return;
          }
        }

        if (rows.length < 2) {
          return self.postMessage({
            type: 'error_checking_data',
            error: `File doesn't have any data`,
          });
        }

        if (rows.length > maximum_records) {
          return self.postMessage({
            type: 'error_checking_maximum_records',
          });
        }

        self.postMessage({
          type: 'success_checking_maximum_records',
        });

        for (let index = 0; index < template.length; index++) {
          const { header, regexValidation } = template[index];

          const checkColumnValue = dataByColumn[header];

          const invalidRow = checkColumnValue.findIndex((value) => {
            const valid = new RegExp(regexValidation).test(value);
            return !valid;
          });

          const missingRow = checkColumnValue.findIndex((value) => {
            return value === null || value === undefined;
          });

          if (regexValidation && missingRow !== -1) {
            hasError = true;
            // why is +1, bc exclude the header, and index start from 0
            handleError(header, 'error_missing_value', missingRow + 1);
            return;
          }

          if (regexValidation && invalidRow !== -1) {
            hasError = true;
            // why is +1, bc exclude the header, and index start from 0
            handleError(header, 'error_checking_value', invalidRow + 1);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, timeoutMs));

          self.postMessage({
            type: 'update_state',
            data: {
              [header]: {
                name: header,
                status: 'valid',
                isColumn: true,
              },
            },
          });
        }

        if (!hasError) {
          await new Promise((resolve) => setTimeout(resolve, timeoutMs));
          self.postMessage({ type: 'success' });
        }
      }
    };

    reader.readAsArrayBuffer(file);
  },
  false
);
