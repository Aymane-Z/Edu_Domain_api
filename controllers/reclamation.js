import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/reclamation_list.js';
import exportViewPage from '../exports/reclamation_view.js';
import exportTraitementPage from '../exports/reclamation_traitement.js';
import exportResoluePage from '../exports/reclamation_resolue.js';


const router = Router();




/**
 * Route to list reclamation records
 * @GET /reclamation/index/{fieldname}/{fieldvalue}
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Reclamation.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		if(req.query.orderby){
			query.order = DB.getOrderBy(req, 'id', 'desc');
		}
		else{
			query.order = [];
			query.order.push(['date_created', 'DESC']);
		}
		if(req.query.export){
			query.attributes = DB.Reclamation.exportListFields();
			let records = await DB.Reclamation.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Reclamation.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Reclamation.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Reclamation records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /reclamation/importdata
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
							id_client: data['id_client'],
							id_unite_location: data['id_unite_location'],
							id_dossierlocation: data['id_dossierlocation'],
							user_id: data['user_id'],
							type: data['type'],
							description: data['description'],
							status: data['status'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							date_resolue: data['date_resolue']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Reclamation.bulkCreate(records);
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
 * Route to view Reclamation record
 * @GET /reclamation/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Reclamation.exportViewFields();
			let records = await DB.Reclamation.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Reclamation.viewFields();
		let record = await DB.Reclamation.findOne(query);
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
 * Route to insert Reclamation record
 * @POST /reclamation/add
 */
router.post('/add/', 
	[
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
		body('id_dossierlocation').optional({nullable: true, checkFalsy: true}),
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true, checkFalsy: true}),
		body('date_resolue').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Reclamation record
		let record = await DB.Reclamation.create(modeldata);
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
 * Route to get  Reclamation record for edit
 * @GET /reclamation/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Reclamation.editFields();
		let record = await DB.Reclamation.findOne(query);
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
 * Route to update  Reclamation record
 * @POST /reclamation/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('id_client').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
		body('id_dossierlocation').optional({nullable: true, checkFalsy: true}),
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('status').optional({nullable: true, checkFalsy: true}),
		body('date_resolue').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Reclamation.editFields();
		let record = await DB.Reclamation.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Reclamation.update(modeldata, {where: where});
		record = await DB.Reclamation.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Reclamation record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /reclamation/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Reclamation.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Reclamation.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to list reclamation records
 * @GET /reclamation/index/{fieldname}/{fieldvalue}
 */
router.get('/traitement/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Reclamation.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['status'] = "en cours";
where['status'] = "ouvert";
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		if(req.query.orderby){
			query.order = DB.getOrderBy(req, 'id', 'desc');
		}
		else{
			query.order = [];
			query.order.push(['date_created', 'DESC']);
		}
		if(req.query.export){
			query.attributes = DB.Reclamation.exportTraitementFields();
			let records = await DB.Reclamation.findAll(query);
			return exportTraitementPage(records, req, res)
		}
		query.attributes = DB.Reclamation.traitementFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Reclamation.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to list reclamation records
 * @GET /reclamation/index/{fieldname}/{fieldvalue}
 */
router.get('/resolue/:fieldname?/:fieldvalue?', async (req, res) => {  
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
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Client,
			required: true,
			as: 'client',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Usersnode,
			required: true,
			as: 'usersnode',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Reclamation.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['status'] = "resolue";
where['status'] = "fermee";
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		if(req.query.orderby){
			query.order = DB.getOrderBy(req, 'id', 'desc');
		}
		else{
			query.order = [];
			query.order.push(['date_created', 'DESC']);
		}
		if(req.query.export){
			query.attributes = DB.Reclamation.exportResolueFields();
			let records = await DB.Reclamation.findAll(query);
			return exportResoluePage(records, req, res)
		}
		query.attributes = DB.Reclamation.resolueFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Reclamation.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
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
	let record = await DB.Reclamation.findOne(query);
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
	let record = await DB.Reclamation.findOne(query);
	return (record ? record.id : null);
}
export default router;
