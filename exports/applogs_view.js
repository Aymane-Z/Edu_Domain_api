
import excel from 'exceljs';
import ejs from 'ejs';
import utils from '../helpers/utils.js';
import config from '../config.js';
async function exportViewPage(records, req, res) {
	try{
		let format = req.query.export.toLowerCase();
		let columns =  [
				{ header: "Id", key: "id" },
				{ header: "Old Values", key: "old_values" },
				{ header: "New Values", key: "new_values" },
				{ header: "Event", key: "event" },
				{ header: "Auditable Id", key: "auditable_id" },
				{ header: "Auditable Type", key: "auditable_type" },
				{ header: "User Id", key: "user_id" },
				{ header: "User Type", key: "user_type" },
				{ header: "Tags", key: "tags" },
				{ header: "Ip Address", key: "ip_address" },
				{ header: "User Agent", key: "user_agent" },
				{ header: "Url", key: "url" },
				{ header: "Updated At", key: "updated_at" },
				{ header: "Created At", key: "created_at" }
		]
		let filename = utils.dateNow() + "applogsview-report";
		if(format == "excel"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Applog Details");
			worksheet.columns = columns;
			worksheet.addRows(records);
			res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
			return workbook.xlsx.write(res).then(function () {
				res.status(200).end();
			})
		}
		else if(format == "csv"){
			let workbook = new excel.Workbook();
			let worksheet = workbook.addWorksheet("Applog Details");
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
			let page = "applogsview.ejs";
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
