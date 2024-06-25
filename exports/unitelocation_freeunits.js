
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
				{ header: "Designation", key: "designation" },
				{ header: "Type", key: "type" },
				{ header: "Description", key: "description" },
				{ header: "Etat Physique", key: "etat_physique" },
				{ header: "Observation", key: "observation" },
				{ header: "Id Chambre", key: "id_chambre" },
				{ header: "Photo", key: "photo" },
				{ header: "Freerentalunits Id", key: "freerentalunits_id" },
				{ header: "Freerentalunits Code", key: "freerentalunits_code" },
				{ header: "Freerentalunits Designation", key: "freerentalunits_designation" },
				{ header: "Freerentalunits Typeunit", key: "freerentalunits_typeunit" },
				{ header: "Freerentalunits Description", key: "freerentalunits_description" },
				{ header: "Freerentalunits Etat Physique", key: "freerentalunits_etat_physique" },
				{ header: "Freerentalunits Observation", key: "freerentalunits_observation" },
				{ header: "Freerentalunits Id Residence", key: "freerentalunits_id_residence" },
				{ header: "Freerentalunits Etat", key: "freerentalunits_etat" },
				{ header: "Freerentalunits Type", key: "freerentalunits_type" },
				{ header: "Freerentalunits Id Typech", key: "freerentalunits_id_typech" },
				{ header: "Freerentalunits Prix", key: "freerentalunits_prix" },
				{ header: "Freerentalunits Photo", key: "freerentalunits_photo" },
				{ header: "Freerentalunits Categoriechambre", key: "freerentalunits_categoriechambre" }
		]
		let filename = "unitelocationfreeunits-report";

		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Unite Location");
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
			let worksheet = workbook.addWorksheet("Unite Location");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			});
		}
		else if (format == "pdf" || format == "print") {
			let page = "unitelocationfreeunits.ejs";
			
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
