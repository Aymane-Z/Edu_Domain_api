
import excel from 'exceljs';
import ejs from 'ejs';
import utils from '../helpers/utils.js';
import config from '../config.js';

async function exportListPage(records, req, res) {
		try{
			let format = req.query.export.toLowerCase();
			let columns =  [
				{ header: "Id", key: "id" },
				{ header: "Nom", key: "nom" },
				{ header: "Prenom", key: "prenom" },
				{ header: "Cin Client", key: "cin_client" },
				{ header: "Date Naissance", key: "date_naissance" },
				{ header: "Lieu Naissance", key: "lieu_naissance" },
				{ header: "Situation Familiale", key: "situation_familiale" },
				{ header: "Adresse Client", key: "adresse_client" },
				{ header: "Code Postal Client", key: "code_postal_client" },
				{ header: "Ville Client", key: "ville_client" },
				{ header: "Pays Client", key: "pays_client" },
				{ header: "Tel 1 Client", key: "tel_1_client" },
				{ header: "Tel 2 Client", key: "tel_2_client" },
				{ header: "Email Client", key: "email_client" },
				{ header: "Etablissement", key: "etablissement" },
				{ header: "Cycle Etudes", key: "cycle_etudes" },
				{ header: "Nom Garant", key: "nom_garant" },
				{ header: "Prenom Garant", key: "prenom_garant" },
				{ header: "Cin Garant", key: "cin_garant" },
				{ header: "Date Naissance Garant", key: "date_naissance_garant" },
				{ header: "Lieu Naissance Garant", key: "lieu_naissance_garant" },
				{ header: "Situation Familiale Garant", key: "situation_familiale_garant" },
				{ header: "Lien Garant Client", key: "lien_garant_client" },
				{ header: "Adresse Garant", key: "adresse_garant" },
				{ header: "Code Postal Garant", key: "code_postal_garant" },
				{ header: "Ville Garant", key: "ville_garant" },
				{ header: "Pays Garant", key: "pays_garant" },
				{ header: "Tel1 Garant", key: "tel1_garant" },
				{ header: "Tel2 Garant", key: "tel2_garant" },
				{ header: "Email Garant", key: "email_garant" },
				{ header: "Profession", key: "profession" },
				{ header: "Tel Bureau", key: "tel_bureau" },
				{ header: "Fax", key: "fax" },
				{ header: "Revenus Mensuels", key: "revenus_mensuels" },
				{ header: "Id Unite Location", key: "id_unite_location" },
				{ header: "Etat Demande", key: "etat_demande" },
				{ header: "Code Demande", key: "code_demande" },
				{ header: "Id Dossier", key: "id_dossier" },
				{ header: "Id User", key: "id_user" },
				{ header: "Id Client", key: "id_client" },
				{ header: "Id Garant", key: "id_garant" },
				{ header: "Type Chambre", key: "type_chambre" },
				{ header: "Binome Souhaite", key: "binome_souhaite" },
				{ header: "Cin Binome", key: "cin_binome" },
				{ header: "Date Created", key: "date_created" },
				{ header: "Date Updated", key: "date_updated" },
				{ header: "Id Type Chambre", key: "id_type_chambre" }
		]
		let filename = "demandelogementlist-report";

		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Demande Logement");
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
			let worksheet = workbook.addWorksheet("Demande Logement");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
			return workbook.csv.write(res).then(function () {
				res.status(200).end();
			});
		}
		else if (format == "pdf" || format == "print") {
			let page = "demandelogementlist.ejs";
			
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
