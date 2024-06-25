
import excel from 'exceljs';
import ejs from 'ejs';
import utils from '../helpers/utils.js';
import config from '../config.js';

async function exportListPage(records, req, res) {
		try{
			let format = req.query.export.toLowerCase();
			let columns =  [
				{ header: "Id", key: "id" },
				{ header: "Code", key: "code" },
				{ header: "Type", key: "type" },
				{ header: "Denomination", key: "denomination" },
				{ header: "Description", key: "description" },
				{ header: "Nombre Niveaux", key: "nombre_niveaux" },
				{ header: "Nombre", key: "nombre" },
				{ header: "Id Residence", key: "id_residence" },
				{ header: "Res Denomination", key: "res_denomination" },
				{ header: "Id Responsable", key: "id_responsable" },
				{ header: "Id Proprietaire", key: "id_proprietaire" },
				{ header: "Nom Prenom", key: "nom_prenom" },
				{ header: "Prop Denomination", key: "prop_denomination" }
		]
		let filename = "batimentdetailslist-report";

		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Batimentdetails");
			worksheet.columns = columns;
			worksheet.addRows(records);

			// set all columns to autowidth
			utils.excelAutoWidth(worksheet);

			const headerRow = worksheet.getRow(1);
			headerRow.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb:'f5b914' } }
			//headerRow.font = { name: 'Arial', size: 12 }

			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "csv"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Batimentdetails");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			});
		}
		else if (format == "pdf" || format == "print") {
			let page = "batimentdetailslist.ejs";
			
			//pass data to views
			const viewData = {
				records, 
				page, 
				config, 
				utils
			}
			
			let html = await ejs.renderFile("views/layouts/report.ejs", viewData);
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
export default exportListPage;
