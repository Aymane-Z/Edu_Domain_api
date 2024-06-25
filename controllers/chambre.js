import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/chambre_list.js';
import exportViewPage from '../exports/chambre_view.js';


const router = Router();




/**
 * Route to list chambre records
 * @GET /chambre/index/{fieldname}/{fieldvalue}
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
			model: DB.Couloir,
			required: true,
			as: 'couloir',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.FamilleUnite,
			required: true,
			as: 'famille_unite',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Chambredetails,
			required: true,
			as: 'chambredetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Chambre.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.id_residence){
			let vals = req.query.id_residence
			queryFilters.push(DB.filterBy("chambredetails.id_residence", { [DB.op.in]: vals }))
		}
		if(req.query.id_batiment){
			let vals = req.query.id_batiment
			queryFilters.push(DB.filterBy("chambredetails.id_batiment", { [DB.op.in]: vals }))
		}
		if(req.query.id_pavillon){
			let vals = req.query.id_pavillon
			queryFilters.push(DB.filterBy("chambredetails.id_pavillon", { [DB.op.in]: vals }))
		}
		if(req.query.id_couloir){
			let vals = req.query.id_couloir
			queryFilters.push(DB.filterBy("chambredetails.id_couloir", { [DB.op.in]: vals }))
		}
		if(req.query.id_type){
			let vals = req.query.id_type
			queryFilters.push(DB.filterBy("chambre.id_type", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Chambre.exportListFields();
			let records = await DB.Chambre.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Chambre.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Chambre.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Chambre records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /chambre/importdata
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
							type: data['type'],
							description: data['description'],
							observation: data['observation'],
							id_couloir: data['id_couloir'],
							id_type: data['id_type']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Chambre.bulkCreate(records);
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
 * Route to view Chambre record
 * @GET /chambre/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Couloir,
			required: true,
			as: 'couloir',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.FamilleUnite,
			required: true,
			as: 'famille_unite',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Chambredetails,
			required: true,
			as: 'chambredetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where[DB.op.and] = DB.raw('chambre.id = :recid');
		query.replacements = {
			recid
		}
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Chambre.exportViewFields();
			let records = await DB.Chambre.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Chambre.viewFields();
		let record = await DB.Chambre.findOne(query);
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
 * Route to insert Chambre record
 * @POST /chambre/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_couloir').optional({nullable: true, checkFalsy: true}),
		body('id_type').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Chambre record
		let record = await DB.Chambre.create(modeldata);
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
 * Route to get  Chambre record for edit
 * @GET /chambre/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Chambre.editFields();
		let record = await DB.Chambre.findOne(query);
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
 * Route to update  Chambre record
 * @POST /chambre/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_couloir').optional({nullable: true, checkFalsy: true}),
		body('id_type').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Chambre.editFields();
		let record = await DB.Chambre.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Chambre.update(modeldata, {where: where});
		record = await DB.Chambre.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Chambre record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /chambre/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Chambre.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Chambre.destroy(query);
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
	let record = await DB.Chambre.findOne(query);
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
	let record = await DB.Chambre.findOne(query);
	return (record ? record.id : null);
}
export default router;
