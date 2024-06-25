import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/equipement_list.js';
import exportViewPage from '../exports/equipement_view.js';


const router = Router();




/**
 * Route to list equipement records
 * @GET /equipement/index/{fieldname}/{fieldvalue}
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
			model: DB.FamilleEquipement,
			required: true,
			as: 'famille_equipement',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Equipement.searchFields();
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
			query.attributes = DB.Equipement.exportListFields();
			let records = await DB.Equipement.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Equipement.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Equipement.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Equipement records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /equipement/importdata
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
							type: data['type'],
							description: data['description'],
							dt_acquisition: data['dt_acquisition'],
							valeur: data['valeur'],
							etat_physique: data['etat_physique'],
							observation: data['observation'],
							id_famille_equipement: data['id_famille_equipement'],
							id_unite_location: data['id_unite_location']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Equipement.bulkCreate(records);
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
 * Route to view Equipement record
 * @GET /equipement/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.FamilleEquipement,
			required: true,
			as: 'famille_equipement',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Equipement.exportViewFields();
			let records = await DB.Equipement.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Equipement.viewFields();
		let record = await DB.Equipement.findOne(query);
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
 * Route to insert Equipement record
 * @POST /equipement/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('dt_acquisition').optional({nullable: true, checkFalsy: true}),
		body('valeur').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('etat_physique').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_famille_equipement').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Equipement record
		let record = await DB.Equipement.create(modeldata);
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
 * Route to get  Equipement record for edit
 * @GET /equipement/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Equipement.editFields();
		let record = await DB.Equipement.findOne(query);
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
 * Route to update  Equipement record
 * @POST /equipement/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('dt_acquisition').optional({nullable: true, checkFalsy: true}),
		body('valeur').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('etat_physique').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_famille_equipement').optional({nullable: true, checkFalsy: true}),
		body('id_unite_location').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Equipement.editFields();
		let record = await DB.Equipement.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Equipement.update(modeldata, {where: where});
		record = await DB.Equipement.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Equipement record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /equipement/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Equipement.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Equipement.destroy(query);
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
	let record = await DB.Equipement.findOne(query);
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
	let record = await DB.Equipement.findOne(query);
	return (record ? record.id : null);
}
export default router;
