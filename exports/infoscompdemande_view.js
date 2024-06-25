
import excel from 'exceljs';
import ejs from 'ejs';
import utils from '../helpers/utils.js';
import config from '../config.js';
async function exportViewPage(records, req, res) {
	try{
		let format = req.query.export.toLowerCase();
		let columns =  [
				{ header: "Id", key: "id" },
				{ header: "Id Demande Logement", key: "id_demande_logement" },
				{ header: "Ancienne Cite", key: "ancienne_cite" },
				{ header: "Periode Ancienne Cite", key: "periode_ancienne_cite" },
				{ header: "Source Decouverte", key: "source_decouverte" },
				{ header: "Annee Residence Precedente", key: "annee_residence_precedente" },
				{ header: "Type Chambre", key: "type_chambre" },
				{ header: "Numero Chambre", key: "numero_chambre" },
				{ header: "Groupe Sanguin", key: "groupe_sanguin" },
				{ header: "Maladies Allergies", key: "maladies_allergies" },
				{ header: "Nom Contact Personne", key: "nom_contact_personne" },
				{ header: "Tel Contact Personne", key: "tel_contact_personne" },
				{ header: "Date", key: "date" }
		]
		let filename = utils.dateNow() + "infoscompdemandeview-report";
		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Infos Comp Demande Details");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "csv"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Infos Comp Demande Details");
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
			let page = "infoscompdemandeview.ejs";
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
