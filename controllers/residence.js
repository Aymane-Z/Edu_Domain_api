import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/residence_list.js';
import exportViewPage from '../exports/residence_view.js';


const router = Router();




/**
 * Route to list residence records
 * @GET /residence/index/{fieldname}/{fieldvalue}
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
			model: DB.Responsable,
			required: true,
			as: 'responsable',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Proprietaire,
			required: true,
			as: 'proprietaire',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Residence.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.dt_mise_service){
			let fromDate = req.query.dt_mise_service.from || null;
			let toDate = req.query.dt_mise_service.to || null;
			if (fromDate && toDate){
				queryFilters.push(DB.filterBy("residence.dt_mise_service", {[DB.op.between]: [fromDate, toDate]}));
			}
		}
		if(req.query.id_responsable){
			let vals = req.query.id_responsable
			queryFilters.push(DB.filterBy("residence.id_responsable", { [DB.op.in]: vals }))
		}
		if(req.query.id_proprietaire){
			let vals = req.query.id_proprietaire
			queryFilters.push(DB.filterBy("residence.id_proprietaire", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Residence.exportListFields();
			let records = await DB.Residence.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Residence.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Residence.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Residence records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /residence/importdata
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
							dt_mise_service: data['dt_mise_service'],
							adresse: data['adresse'],
							tel1: data['tel1'],
							tel2: data['tel2'],
							tel3: data['tel3'],
							id_responsable: data['id_responsable'],
							id_proprietaire: data['id_proprietaire']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Residence.bulkCreate(records);
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
 * Route to view Residence record
 * @GET /residence/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Proprietaire,
			required: true,
			as: 'proprietaire',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Residence.exportViewFields();
			let records = await DB.Residence.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Residence.viewFields();
		let record = await DB.Residence.findOne(query);
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
 * Route to insert Residence record
 * @POST /residence/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('dt_mise_service').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('id_responsable').optional({nullable: true, checkFalsy: true}),
		body('id_proprietaire').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Residence record
		let record = await DB.Residence.create(modeldata);
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
 * Route to get  Residence record for edit
 * @GET /residence/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Residence.editFields();
		let record = await DB.Residence.findOne(query);
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
 * Route to update  Residence record
 * @POST /residence/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('dt_mise_service').optional({nullable: true, checkFalsy: true}),
		body('adresse').optional({nullable: true, checkFalsy: true}),
		body('tel1').optional({nullable: true, checkFalsy: true}),
		body('tel2').optional({nullable: true, checkFalsy: true}),
		body('tel3').optional({nullable: true, checkFalsy: true}),
		body('id_responsable').optional({nullable: true, checkFalsy: true}),
		body('id_proprietaire').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Residence.editFields();
		let record = await DB.Residence.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.Residence.update(modeldata, {where: where});
		record = await DB.Residence.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Residence record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /residence/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Residence.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.Residence.destroy(query);
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
	let record = await DB.Residence.findOne(query);
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
	let record = await DB.Residence.findOne(query);
	return (record ? record.id : null);
}
export default router;
