import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/permissions_list.js';
import exportViewPage from '../exports/permissions_view.js';


const router = Router();




/**
 * Route to list permissions records
 * @GET /permissions/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Permissions.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'permission_id', 'desc');
		if(req.query.export){
			query.attributes = DB.Permissions.exportListFields();
			let records = await DB.Permissions.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Permissions.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Permissions.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Permissions records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /permissions/importdata
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
							role_id: data['role_id'],
							page_name: data['page_name'],
							action_name: data['action_name'],
							permission: data['permission']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Permissions.bulkCreate(records);
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
 * Route to view Permissions record
 * @GET /permissions/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['permission_id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Permissions.exportViewFields();
			let records = await DB.Permissions.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Permissions.viewFields();
		let record = await DB.Permissions.findOne(query);
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
 * Route to insert Permissions record
 * @POST /permissions/add
 */
router.post('/add/', 
	[
		body('role_id').optional({nullable: true, checkFalsy: true}),
		body('page_name').optional({nullable: true, checkFalsy: true}),
		body('action_name').optional({nullable: true, checkFalsy: true}),
		body('permission').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Permissions record
		let record = await DB.Permissions.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['permission_id'];
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues: null, newValues });
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Permissions record for edit
 * @GET /permissions/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['permission_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Permissions.editFields();
		let record = await DB.Permissions.findOne(query);
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
 * Route to update  Permissions record
 * @POST /permissions/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('role_id').optional({nullable: true, checkFalsy: true}),
		body('page_name').optional({nullable: true, checkFalsy: true}),
		body('action_name').optional({nullable: true, checkFalsy: true}),
		body('permission').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['permission_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Permissions.editFields();
		let record = await DB.Permissions.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Permissions.update(modeldata, {where: where});
		record = await DB.Permissions.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Permissions record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /permissions/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['permission_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Permissions.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['permission_id'], oldValues });
		});
		await DB.Permissions.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
async function getNextRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'permission_id';
	where[keyField] = { [DB.op.gt]: recid };
	query.where = where;
	query.order = [[ keyField, 'ASC' ]];
	query.attributes = [keyField];
	let record = await DB.Permissions.findOne(query);
	return (record ? record.permission_id : null);
}
async function getPreviousRecordId(recid){
	let query = {};
	let where = {};
	let keyField = 'permission_id';
	where[keyField] = { [DB.op.lt]: recid };
	query.where = where;
	query.order = [[ keyField, 'DESC' ]];
	query.attributes = [keyField];
	let record = await DB.Permissions.findOne(query);
	return (record ? record.permission_id : null);
}
export default router;
