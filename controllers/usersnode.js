import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import utils from '../helpers/utils.js';
import uploader from '../helpers/uploader.js';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/usersnode_list.js';
import exportViewPage from '../exports/usersnode_view.js';
import exportAccountviewPage from '../exports/usersnode_accountview.js';


const router = Router();




/**
 * Route to list usersnode records
 * @GET /usersnode/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Usersnode.searchFields();
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
			query.attributes = DB.Usersnode.exportListFields();
			let records = await DB.Usersnode.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Usersnode.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Usersnode.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Usersnode records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /usersnode/importdata
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
							username: data['username'],
							password: data['password'],
							email: data['email'],
							photo: data['photo'],
							user_role_id: data['user_role_id'],
							date_created: data['date_created'],
							date_updated: data['date_updated'],
							civilite: data['civilite'],
							nom: data['nom'],
							prenom: data['prenom'],
							cin: data['cin'],
							nationalite: data['nationalite'],
							telephone: data['telephone'],
							email_verified_at: data['email_verified_at']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Usersnode.bulkCreate(records);
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
 * Route to view Usersnode record
 * @GET /usersnode/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Roles,
			required: true,
			as: 'roles',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Usersnode.exportViewFields();
			let records = await DB.Usersnode.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Usersnode.viewFields();
		let record = await DB.Usersnode.findOne(query);
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
 * Route to insert Usersnode record
 * @POST /usersnode/add
 */
router.post('/add/', 
	[
		body('username').not().isEmpty(),
		body('password').not().isEmpty(),
		body('confirm_password', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
		body('email').not().isEmpty().isEmail(),
		body('telephone').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata.password = utils.passwordHash(modeldata.password);
		
		// set default role for user
		const roleId =  await DB.Roles.findValue('role_id', {role_name: 'Client_temp'});
		modeldata['user_role_id'] = roleId;
		
		// check if username already exist.
		let usernameCount = await DB.Usersnode.count({ where:{ 'username': modeldata.username } });
		if(usernameCount > 0){
			return res.badRequest(`${modeldata.username} already exist.`);
		}
		
		// check if email already exist.
		let emailCount = await DB.Usersnode.count({ where:{ 'email': modeldata.email } });
		if(emailCount > 0){
			return res.badRequest(`${modeldata.email} already exist.`);
		}
		
		//save Usersnode record
		let record = await DB.Usersnode.create(modeldata);
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
 * Route to get  Usersnode record for edit
 * @GET /usersnode/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Usersnode.editFields();
		let record = await DB.Usersnode.findOne(query);
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
 * Route to update  Usersnode record
 * @POST /usersnode/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('username').optional({nullable: true}).not().isEmpty(),
		body('photo').optional({nullable: true, checkFalsy: true}),
		body('user_role_id').optional({nullable: true, checkFalsy: true}),
		body('civilite').optional({nullable: true, checkFalsy: true}),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('cin').optional({nullable: true, checkFalsy: true}),
		body('nationalite').optional({nullable: true, checkFalsy: true}),
		body('telephone').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
		// check if username already exist.
		let usernameCount = await DB.Usersnode.count({where:{'username': modeldata.username, 'id': {[DB.op.ne]: recid} }});
		if(usernameCount > 0){
			return res.badRequest(`${modeldata.username} already exist.`);
		}
		
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
		query.attributes = DB.Usersnode.editFields();
		let record = await DB.Usersnode.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Usersnode.update(modeldata, {where: where});
		record = await DB.Usersnode.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Usersnode record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /usersnode/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Usersnode.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Usersnode.destroy(query);
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
	let record = await DB.Usersnode.findOne(query);
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
	let record = await DB.Usersnode.findOne(query);
	return (record ? record.id : null);
}
export default router;
