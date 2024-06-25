import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/basetarification_list.js';
import exportViewPage from '../exports/basetarification_view.js';


const router = Router();




/**
 * Route to list basetarification records
 * @GET /basetarification/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.BaseTarification.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.BaseTarification.exportListFields();
			let records = await DB.BaseTarification.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.BaseTarification.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.BaseTarification.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import BaseTarification records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /basetarification/importdata
 */
router.post('/importdata', fileUploadMiddleware('importdata'), async (req, res, next) => {
	if(req.files){	// files uploaded
		var uploadedPaths = req.files.map(function(v) {
			return v.path;
		});
		if(uploadedPaths.length){
			uploadedPaths.forEach(function (fpath){
				let records = [];
				csv.fromPath(fpath, {headers: true, ignoreEmpty: true}).on("data", function(data){
					if(data){
						const modeldata = {
							code: data['code'],
							designation: data['designation'],
							dt_application: data['dt_application'],
							periodicite: data['periodicite'],
							montant: data['montant'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							dt_fin: data['dt_fin'],
							id_residence: data['id_residence'],
							id_type_chambre: data['id_type_chambre']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.BaseTarification.bulkCreate(records);
						let numRows = affectedRows.length || 0;
						return res.ok(`${numRows} Records Imported`);
					}
					catch(err){
						return res.serverError(err);
					}
				});
			});
		}
	}
	else{
		return res.badRequest("Error uploading file")
	}
});


/**
 * Route to view BaseTarification record
 * @GET /basetarification/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.BaseTarification.exportViewFields();
			let records = await DB.BaseTarification.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.BaseTarification.viewFields();
		let record = await DB.BaseTarification.findOne(query);
		if(!record){
			return res.notFound();
		}
			record.nextRecordId = await getNextRecordId(recid);
			record.previousRecordId = await getPreviousRecordId(recid);
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert BaseTarification record
 * @POST /basetarification/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('dt_application').optional({nullable: true, checkFalsy: true}),
		body('dt_fin').optional({nullable: true, checkFalsy: true}),
		body('periodicite').optional({nullable: true, checkFalsy: true}),
		body('montant').optional({nullable: true, checkFalsy: true}),
		body('id_residence').optional({nullable: true, checkFalsy: true}),
		body('id_type_chambre').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save BaseTarification record
		let record = await DB.BaseTarification.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  BaseTarification record for edit
 * @GET /basetarification/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.BaseTarification.editFields();
		let record = await DB.BaseTarification.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to update  BaseTarification record
 * @POST /basetarification/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('dt_application').optional({nullable: true, checkFalsy: true}),
		body('dt_fin').optional({nullable: true, checkFalsy: true}),
		body('periodicite').optional({nullable: true, checkFalsy: true}),
		body('montant').optional({nullable: true, checkFalsy: true}),
		body('id_residence').optional({nullable: true, checkFalsy: true}),
		body('id_type_chambre').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.BaseTarification.editFields();
		let record = await DB.BaseTarification.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.BaseTarification.update(modeldata, {where: where});
		record = await DB.BaseTarification.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete BaseTarification record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /basetarification/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.BaseTarification.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.BaseTarification.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});

router.get('/fetch', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 10); // format as YYYY-MM-DD
        const query = {
            raw: true,
            where: {
                dt_application: {
                    [DB.op.lte]: currentDate // less than or equal to the current date
                },
                [DB.op.or]: [
                    {dt_fin: {[DB.op.gte]: currentDate}}, // dt_fin is greater than or equal to the current date
                    {dt_fin: null}// dt_fin is '0000-00-00' (if your DB allows this)
                ]
				
            }
        };
		console.log("HHHHHHHHHHHHEEEEEEEEEEERRRRRRRRRE   ", req.params.id_residence, req.params.codePrefix);

        // Check for code prefix
        if (req.query.codePrefix) {
            query.where.code = {
                [DB.op.like]: `${req.query.codePrefix}%`
            };
        }

        // Check for residence_id
        if (req.query.id_residence) {
            query.where.id_residence = req.query.id_residence;
        }

		if (req.query.id_type_chambre) {
            query.where.id_type_chambre = req.query.id_type_chambre;
        }

        let record = await DB.BaseTarification.findOne(query);
        if (record) {
            return res.ok(record);
        } else {
            return res.notFound('No matching record found.');
        }
    } catch (err) {
        return res.serverError(err);
    }
});

async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'id';
	where[keyField] = { [DB.op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await DB.BaseTarification.findOne(query);
	return (record ? record.id : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'id';
	where[keyField] = { [DB.op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await DB.BaseTarification.findOne(query);
	return (record ? record.id : null);
}
export default router;
