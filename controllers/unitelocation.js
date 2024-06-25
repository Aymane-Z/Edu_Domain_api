import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import uploader from '../helpers/uploader.js';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/unitelocation_list.js';
import exportViewPage from '../exports/unitelocation_view.js';
import exportFreeunitsPage from '../exports/unitelocation_freeunits.js';



const router = Router();




/**
 * Route to list unitelocation records
 * @GET /unitelocation/index/{fieldname}/{fieldvalue}
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
			model: DB.Chambre,
			required: true,
			as: 'chambre',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Unitelocationdetails,
			required: true,
			as: 'unitelocationdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.UniteLocation.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.id_residence){
			let vals = req.query.id_residence
			queryFilters.push(DB.filterBy("unitelocationdetails.id_residence", { [DB.op.in]: vals }))
		}
		if(req.query.id_batiment){
			let vals = req.query.id_batiment
			queryFilters.push(DB.filterBy("unitelocationdetails.id_batiment", { [DB.op.in]: vals }))
		}
		if(req.query.id_pavillon){
			let vals = req.query.id_pavillon
			queryFilters.push(DB.filterBy("unitelocationdetails.id_pavillon", { [DB.op.in]: vals }))
		}
		if(req.query.id_couloir){
			let vals = req.query.id_couloir
			queryFilters.push(DB.filterBy("unitelocationdetails.id_couloir", { [DB.op.in]: vals }))
		}
		if(req.query.id_chambre){
			let vals = req.query.id_chambre
			queryFilters.push(DB.filterBy("unite_location.id_chambre", { [DB.op.in]: vals }))
		}
		if(req.query.id_typechambre){
			let vals = req.query.id_typechambre
			queryFilters.push(DB.filterBy("unitelocationdetails.id_typechambre", { [DB.op.in]: vals }))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.UniteLocation.exportListFields();
			let records = await DB.UniteLocation.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.UniteLocation.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.UniteLocation.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import UniteLocation records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /unitelocation/importdata
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
							etat_physique: data['etat_physique'],
							observation: data['observation'],
							id_chambre: data['id_chambre'],
							photo: data['photo']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.UniteLocation.bulkCreate(records);
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
 * Route to view UniteLocation record
 * @GET /unitelocation/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Chambre,
			required: true,
			as: 'chambre',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Unitelocationdetails,
			required: true,
			as: 'unitelocationdetails',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where[DB.op.and] = DB.raw('unite_location.id = :recid');
		query.replacements = {
			recid
		}
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.UniteLocation.exportViewFields();
			let records = await DB.UniteLocation.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.UniteLocation.viewFields();
		let record = await DB.UniteLocation.findOne(query);
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
 * Route to insert UniteLocation record
 * @POST /unitelocation/add
 */
router.post('/add/', 
	[
		body('code').not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('etat_physique').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_chambre').optional({nullable: true, checkFalsy: true}),
		body('photo').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.photo !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.photo, 'photo');
			modeldata.photo = fileInfo.filepath;
		}
		
		//save UniteLocation record
		let record = await DB.UniteLocation.create(modeldata);
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
 * Route to get  UniteLocation record for edit
 * @GET /unitelocation/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.UniteLocation.editFields();
		let record = await DB.UniteLocation.findOne(query);
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
 * Route to update  UniteLocation record
 * @POST /unitelocation/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true}).not().isEmpty(),
		body('designation').optional({nullable: true, checkFalsy: true}),
		body('type').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('etat_physique').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('id_chambre').optional({nullable: true, checkFalsy: true}),
		body('photo').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.UniteLocation.editFields();
		let record = await DB.UniteLocation.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.UniteLocation.update(modeldata, {where: where});
		record = await DB.UniteLocation.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete UniteLocation record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /unitelocation/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.UniteLocation.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.UniteLocation.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to list unitelocation records
 * @GET /unitelocation/index/{fieldname}/{fieldvalue}
 */
router.get('/freeunits/:fieldname?/:fieldvalue?', async (req, res) => {  
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
			model: DB.Freerentalunits,
			required: true,
			as: 'freerentalunits',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.UniteLocation.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.id_residence){
			queryFilters.push(DB.filterBy("freerentalunits.id_residence", req.query.id_residence))
		}
		if(req.query.type){
			queryFilters.push(DB.filterBy("freerentalunits.type", req.query.type))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		
		if(req.query.export){
			query.attributes = DB.UniteLocation.exportFreeunitsFields();
			let records = await DB.UniteLocation.findAll(query);
			return exportFreeunitsPage(records, req, res)
		}
		query.attributes = DB.UniteLocation.freeunitsFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.UniteLocation.findAll(query);

		//const groupedData = records.reduce((acc,row))=> {
		//	const key=row[freerentalunits_prix];
		//	if (!acc[key]){
		//		acc[key]=[];
		//	}
		//	acc[key].push(row);
		//	return acc;
		//};
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
	let record = await DB.UniteLocation.findOne(query);
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
	let record = await DB.UniteLocation.findOne(query);
	return (record ? record.id : null);
}
export default router;
