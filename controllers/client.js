import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/client_list.js';
import exportViewPage from '../exports/client_view.js';


const router = Router();




/**
 * Route to list client records
 * @GET /client/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Client.searchFields();
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
			query.attributes = DB.Client.exportListFields();
			let records = await DB.Client.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Client.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Client.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Client records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /client/importdata
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
							nom_prenom: data['nom_prenom'],
							cin: data['cin'],
							date_naissance: data['date_naissance'],
							lieu_naissance: data['lieu_naissance'],
							situation_familiale: data['situation_familiale'],
							adresse: data['adresse'],
							tel1: data['tel1'],
							tel2: data['tel2'],
							tel3: data['tel3'],
							mail: data['mail'],
							etablissement: data['etablissement'],
							cycle_etudes: data['cycle_etudes'],
							date_created: data['date_created'],
							date_updated: data['date_updated']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Client.bulkCreate(records);
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
 * Route to view Client record
 * @GET /client/view/{recid}
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
			query.attributes = DB.Client.exportViewFields();
			let records = await DB.Client.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Client.viewFields();
		let record = await DB.Client.findOne(query);
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
 * Route to insert Client record
 * @POST /client/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('nom_prenom').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('date_naissance').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('mail').optional({nullable: true, checkFalsy: true}),
		body('etablissement').optional({nullable: true, checkFalsy: true}),
		body('cycle_etudes').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Client record
		let record = await DB.Client.create(modeldata);
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
 * Route to get  Client record for edit
 * @GET /client/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Client.editFields();
		let record = await DB.Client.findOne(query);
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
 * Route to update  Client record
 * @POST /client/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('nom_prenom').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('date_naissance').optional({nullable: true, checkFalsy: true}),
		body('lieu_naissance').optional({nullable: true, checkFalsy: true}),
		body('situation_familiale').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('mail').optional({nullable: true, checkFalsy: true}),
		body('etablissement').optional({nullable: true, checkFalsy: true}),
		body('cycle_etudes').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Client.editFields();
		let record = await DB.Client.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Client.update(modeldata, {where: where});
		record = await DB.Client.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Client record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /client/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Client.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Client.destroy(query);
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
	let record = await DB.Client.findOne(query);
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
	let record = await DB.Client.findOne(query);
	return (record ? record.id : null);
}
export default router;
