import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/permissionsnode_list.js';
import exportViewPage from '../exports/permissionsnode_view.js';


const router = Router();




/**
 * Route to list permissionsnode records
 * @GET /permissionsnode/index/{fieldname}/{fieldvalue}
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
			model: DB.Roles,
			required: true,
			as: 'roles',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Permissionsnode.searchFields();
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
			query.attributes = DB.Permissionsnode.exportListFields();
			let records = await DB.Permissionsnode.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Permissionsnode.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Permissionsnode.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Permissionsnode records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /permissionsnode/importdata
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
							permission: data['permission'],
							page_name: data['page_name'],
							action_name: data['action_name'],
							role_id: data['role_id']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Permissionsnode.bulkCreate(records);
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
 * Route to view Permissionsnode record
 * @GET /permissionsnode/view/{recid}
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
			query.attributes = DB.Permissionsnode.exportViewFields();
			let records = await DB.Permissionsnode.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Permissionsnode.viewFields();
		let record = await DB.Permissionsnode.findOne(query);
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
 * Route to insert Permissionsnode record
 * @POST /permissionsnode/add
 */
router.post('/add/', 
	[
		body('role_id').optional({nullable: true, checkFalsy: true}),
		body('page_name').not().isEmpty(),
		body('action_name').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Permissionsnode record
		let record = await DB.Permissionsnode.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Permissionsnode record for edit
 * @GET /permissionsnode/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Permissionsnode.editFields();
		let record = await DB.Permissionsnode.findOne(query);
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
 * Route to update  Permissionsnode record
 * @POST /permissionsnode/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('role_id').optional({nullable: true, checkFalsy: true}),
		body('page_name').optional({nullable: true}).not().isEmpty(),
		body('action_name').optional({nullable: true}).not().isEmpty(),
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
		query.attributes = DB.Permissionsnode.editFields();
		let record = await DB.Permissionsnode.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Permissionsnode.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Permissionsnode record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /permissionsnode/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Permissionsnode.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Permissionsnode.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert Permissionsnode record
 * @POST /permissionsnode/add
 */
router.post('/assign/', 
	[
		body('role_id').optional({nullable: true, checkFalsy: true}),
		body('page_name').not().isEmpty(),
		body('action_name').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Permissionsnode record
		let record = await DB.Permissionsnode.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});
export default router;
