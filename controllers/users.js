import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import utils from '../helpers/utils.js';
import uploader from '../helpers/uploader.js';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/users_list.js';
import exportViewPage from '../exports/users_view.js';


const router = Router();




/**
 * Route to list users records
 * @GET /users/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Users.searchFields();
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
			query.attributes = DB.Users.exportListFields();
			let records = await DB.Users.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Users.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Users.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Users records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /users/importdata
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
							user_id: data['user_id'],
							username: data['username'],
							email: data['email'],
							password: data['password'],
							date_registered: data['date_registered'],
							photo: data['photo'],
							user_role: data['user_role'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							user_role_id: data['user_role_id']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Users.bulkCreate(records);
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
 * Route to view Users record
 * @GET /users/view/{recid}
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
			query.attributes = DB.Users.exportViewFields();
			let records = await DB.Users.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Users.viewFields();
		let record = await DB.Users.findOne(query);
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
 * Route to insert Users record
 * @POST /users/add
 */
router.post('/add/', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('username').not().isEmpty(),
		body('email').not().isEmpty().isEmail(),
		body('password').optional({nullable: true, checkFalsy: true}),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('date_registered').not().isEmpty(),
		body('photo').optional({nullable: true, checkFalsy: true}),
		body('user_role').not().isEmpty(),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata.password = utils.passwordHash(modeldata.password);
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		
		//save Users record
		let record = await DB.Users.create(modeldata);
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
 * Route to get  Users record for edit
 * @GET /users/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.editFields();
		let record = await DB.Users.findOne(query);
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
 * Route to update  Users record
 * @POST /users/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('user_id').optional({nullable: true, checkFalsy: true}),
		body('username').optional({nullable: true}).not().isEmpty(),
		body('email').optional({nullable: true}).not().isEmpty().isEmail(),
		body('date_registered').optional({nullable: true}).not().isEmpty(),
		body('photo').optional({nullable: true, checkFalsy: true}),
		body('user_role').optional({nullable: true}).not().isEmpty(),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.editFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Users.update(modeldata, {where: where});
		record = await DB.Users.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Users record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /users/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Users.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Users.destroy(query);
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
	let record = await DB.Users.findOne(query);
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
	let record = await DB.Users.findOne(query);
	return (record ? record.id : null);
}
export default router;
