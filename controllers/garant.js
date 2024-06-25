import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/garant_list.js';
import exportViewPage from '../exports/garant_view.js';


const router = Router();




/**
 * Route to list garant records
 * @GET /garant/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Garant.searchFields();
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
			query.attributes = DB.Garant.exportListFields();
			let records = await DB.Garant.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Garant.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Garant.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Garant records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /garant/importdata
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
							denomination: data['denomination'],
							gerant: data['gerant'],
							cin: data['cin'],
							adresse: data['adresse'],
							rc: data['rc'],
							patente: data['patente'],
							tel1: data['tel1'],
							tel2: data['tel2'],
							tel3: data['tel3'],
							mail: data['mail'],
							compte_bancaire: data['compte_bancaire'],
							profession: data['profession'],
							revenus_mensuels: data['revenus_mensuels'],
							date_created: data['date_created'],
							date_updated: data['date_updated']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Garant.bulkCreate(records);
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
 * Route to view Garant record
 * @GET /garant/view/{recid}
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
			query.attributes = DB.Garant.exportViewFields();
			let records = await DB.Garant.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Garant.viewFields();
		let record = await DB.Garant.findOne(query);
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
 * Route to insert Garant record
 * @POST /garant/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('gerant').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('rc').optional({nullable: true, checkFalsy: true}),
		body('patente').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('mail').optional({nullable: true, checkFalsy: true}),
		body('compte_bancaire').optional({nullable: true, checkFalsy: true}),
		body('profession').optional({nullable: true, checkFalsy: true}),
		body('revenus_mensuels').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Garant record
		let record = await DB.Garant.create(modeldata);
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
 * Route to get  Garant record for edit
 * @GET /garant/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Garant.editFields();
		let record = await DB.Garant.findOne(query);
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
 * Route to update  Garant record
 * @POST /garant/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('gerant').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('rc').optional({nullable: true, checkFalsy: true}),
		body('patente').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('mail').optional({nullable: true, checkFalsy: true}),
		body('compte_bancaire').optional({nullable: true, checkFalsy: true}),
		body('profession').optional({nullable: true, checkFalsy: true}),
		body('revenus_mensuels').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Garant.editFields();
		let record = await DB.Garant.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Garant.update(modeldata, {where: where});
		record = await DB.Garant.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Garant record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /garant/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Garant.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Garant.destroy(query);
		return res.ok(recid);
	}
	catch(err){
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
	let record = await DB.Garant.findOne(query);
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
	let record = await DB.Garant.findOne(query);
	return (record ? record.id : null);
}
export default router;
