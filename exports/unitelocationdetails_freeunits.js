
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
				{ header: "Id Typechambre", key: "id_typechambre" },
				{ header: "Id Couloir", key: "id_couloir" },
				{ header: "Id Pavillon", key: "id_pavillon" },
				{ header: "Id Batiment", key: "id_batiment" },
				{ header: "Id Residence", key: "id_residence" },
				{ header: "Id Responsable", key: "id_responsable" },
				{ header: "Id Proprietaire", key: "id_proprietaire" },
				{ header: "Etatunite Id", key: "etatunite_id" },
				{ header: "Etatunite Etat", key: "etatunite_etat" },
				{ header: "Etatunite Description", key: "etatunite_description" },
				{ header: "Etatunite Observation", key: "etatunite_observation" },
				{ header: "Etatunite Dt Debut Etat", key: "etatunite_dt_debut_etat" },
				{ header: "Etatunite Dt Fin Etat", key: "etatunite_dt_fin_etat" },
				{ header: "Etatunite Ouvert Location", key: "etatunite_ouvert_location" },
				{ header: "Etatunite Id Unitelocation", key: "etatunite_id_unitelocation" },
				{ header: "Etatunite Date Created", key: "etatunite_date_created" },
				{ header: "Etatunite Date Updated", key: "etatunite_date_updated" },
				{ header: "Familleunite Photo", key: "familleunite_photo" }
		]
		let filename = "unitelocationdetailsfreeunits-report";

		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Unitelocationdetails");
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
			let worksheet = workbook.addWorksheet("Unitelocationdetails");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			});
		}
		else if (format == "pdf" || format == "print") {
			let page = "unitelocationdetailsfreeunits.ejs";
			
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
