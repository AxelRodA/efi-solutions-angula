import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { combineLatest, of, defer, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root',
})
export class EfisolutionsService {
  import: any;
  constructor(private afs: AngularFirestore) {}

  groupBy(arr: any[], key: string, qty: string) {
    const result = [];
    arr.reduce(function (acc, cur) {
      if (!acc[cur[key]]) {
        acc[cur[key]] = { Id: cur[key], qty: 0 };
        result.push(acc[cur[key]]);
      }
      acc[cur[key]].qty += cur[key];
      return acc;
    }, {});
  }

  downloadPDF(data: any, docName: string) {
    // Extraemos el

    const doc = new jsPDF('p', 'pt', 'a4', true);
    const options = {
      background: 'white',
      scale: 3,
    
    };
    html2canvas(data, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/JPEG');

        // Add image Canvas to PDF
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'JPG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          1,
          0, 
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`${docName}.pdf`);
      });
  }

  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows
        .map((row) => {
          return keys
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  importExcel(event: any) {
    const file = event.target.files[0];
    let workBook = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      this.import = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
    };
    reader.readAsBinaryString(file);
  }

  docJoin(paths: { [key: string]: string }) {
    return (source: any): Observable<any> =>
      defer(() => {
        let parent;
        let collectionData: any[];
        const keys = Object.keys(paths);
        return source.pipe(
          switchMap((data: any) => {
            if (data.length > 1) {
              // save the parent data state
              collectionData = data as any[];
            } else {
              let arr = [];
              arr.push(data);
              // save the parent data state
              collectionData = arr;
            }
            const reads$ = [];
            // map each path to an Observable
            collectionData.map((doc) => {
              parent = doc;
              keys.map((k) => {
                if (parent[k]) {
                  const fullpath = `${paths[k]}/${parent[k]}`;
                  reads$.push(this.afs.doc(fullpath).valueChanges());
                }
              });
            });

            // return combineLatest, it waits for all reads to finish
            return combineLatest(reads$);
          }),
          map((arr: any[]) => {
            arr.map((el, index) => {
              if (el == undefined) {
                arr.splice(index);
              }
            });
            // we now have all the associated documents
            // Reduce them to a single object based on parent`s keys
            const res = [];
            collectionData.map((doc) => {
              parent = doc;
              const joins = keys.reduce((acc, cur, idx) => {
                let data = arr.filter(
                  (v) => v.key == doc[cur] || v.uid == doc[cur]
                )[0];

                return { ...acc, [cur]: data };
              }, {});
              let data = { ...parent, ...joins };
              res.push(data);
            });

            // Return the parent doc with the joined objects
            if (res.length == 1) {
              return res[0];
            } else {
              return res;
            }
          })
        );
      });
  }

  getJsDateFromExcel(excelDate) {
    if (!Number(excelDate)) {
      throw new Error('wrong input format');
    }

    const secondsInDay = 24 * 60 * 60;
    const missingLeapYearDay = secondsInDay * 1000;
    const delta = excelDate - (25567 + 1);
    const parsed = delta * missingLeapYearDay;
    const date = new Date(parsed);

    if (Object.prototype.toString.call(date) === '[object Date]') {
      if (isNaN(date.getTime())) {
        throw new Error('wrong excel date input');
      } else {
        return date;
      }
    }
  }

  leftJoin(
    afs: AngularFirestore,
    field: string,
    collection: string,
    limit = 100
  ) {
    return (source) =>
      defer(() => {
        // Operator state
        let collectionData;

        // Track total num of joined doc reads
        let totalJoins = 0;
        return source.pipe(
          switchMap((data: any) => {
            // Clear mapping on each emitted val;

            // Save the parent data state
            if (data.length > 1) {
              // save the parent data state
              collectionData = data as any[];
            } else {
              let arr = [];
              arr.push(data);
              // save the parent data state
              collectionData = arr;
            }

            const reads$ = [];
            for (const doc of collectionData) {
              if (doc[field]) {
                let test = doc[field];
                // perform query on join key, qith optional limit
                const q = (ref) =>
                  ref.where('key', '==', doc[field]).limit(limit);
                reads$.push(afs.collection(collection, q).valueChanges());
              } else {
                reads$.push(of([]));
              }
            }
            return combineLatest(reads$);
          }),
          map((joins) => {
            return collectionData.map((v, i) => {
              totalJoins += joins[i].length;
              return { ...v, [collection]: joins[i] };
            });
          }),
          tap((final) => {
            console.log(
              `Queried ${(final as any).length}, joined ${totalJoins} docs`
            );
            totalJoins = 0;
          })
        );
      });
  }
}
