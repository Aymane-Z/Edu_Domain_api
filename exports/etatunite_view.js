
import excel from 'exceljs';
import ejs from 'ejs';
import utils from '../helpers/utils.js';
import config from '../config.js';
async function exportViewPage(records, req, res) {
	try{
		let format = req.query.export.toLowerCase();
		let columns =  [
				{ header: "Id", key: "id" },
				{ header: "Etat", key: "etat" },
				{ header: "Description", key: "description" },
				{ header: "Observation", key: "observation" },
				{ header: "Dt Debut Etat", key: "dt_debut_etat" },
				{ header: "Dt Fin Etat", key: "dt_fin_etat" },
				{ header: "Ouvert Location", key: "ouvert_location" },
				{ header: "Id Unitelocation", key: "id_unitelocation" },
				{ header: "Date Created", key: "date_created" },
				{ header: "Date Updated", key: "date_updated" }
		]
		let filename = utils.dateNow() + "etatuniteview-report";
		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Etat Unite Details");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "csv"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Etat Unite Details");
			worksheet.columns = columns;
			worksheet.addRows(records);

			// set all columns to autowidth
			utils.excelAutoWidth(worksheet);

			const headerRow = worksheet.getRow(1);
			headerRow.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'f5b914' } }
			//headerRow.font = { name: 'Arial', size: 12 }


			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format === "pdf" || format === "print"){
			let page = "etatuniteview.ejs";
			let record = records[0];
			let html = await ejs.renderFile("views/layouts/report.ejs", { record, page, config, utils });

			if (format == "pdf") {
				const pdfConfig = {
					margin: { top: '0', right: '0', bottom: '0', left: '0' },
					printBackground: true,
					format: 'A4',
					//landscape: true,
				}
				return res.generatePdf(html, filename, pdfConfig, 'screen');
			}
			else {
				return res.ok(html);
			}
		}
	}
	catch(err){
		return res.serverError(err);
	}
}
export default exportViewPage
