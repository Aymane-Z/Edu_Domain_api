import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import uploader from '../helpers/uploader.js';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/encaissementexterne_list.js';
import exportViewPage from '../exports/encaissementexterne_view.js';


const router = Router();




/**
 * Route to list encaissementexterne records
 * @GET /encaissementexterne/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.EncaissementExterne.searchFields();
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
			query.attributes = DB.EncaissementExterne.exportListFields();
			let records = await DB.EncaissementExterne.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.EncaissementExterne.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.EncaissementExterne.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import EncaissementExterne records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /encaissementexterne/importdata
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
							banque: data['banque'],
							reference: data['reference'],
							nom: data['nom'],
							prenom: data['prenom'],
							recu: data['recu'],
							id_encaissement: data['id_encaissement']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.EncaissementExterne.bulkCreate(records);
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
 * Route to view EncaissementExterne record
 * @GET /encaissementexterne/view/{recid}
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
			query.attributes = DB.EncaissementExterne.exportViewFields();
			let records = await DB.EncaissementExterne.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.EncaissementExterne.viewFields();
		let record = await DB.EncaissementExterne.findOne(query);
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
 * Route to insert EncaissementExterne record
 * @POST /encaissementexterne/add
 */
router.post('/add/', 
	[
		body('banque').optional({nullable: true, checkFalsy: true}),
		body('reference').not().isEmpty(),
		body('id_encaissement').optional({nullable: true, checkFalsy: true}),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('recu').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.recu !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.recu, 'recu');
			modeldata.recu = fileInfo.filepath;
		}
		
		//save EncaissementExterne record
		let record = await DB.EncaissementExterne.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  EncaissementExterne record for edit
 * @GET /encaissementexterne/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.EncaissementExterne.editFields();
		let record = await DB.EncaissementExterne.findOne(query);
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
 * Route to update  EncaissementExterne record
 * @POST /encaissementexterne/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('banque').optional({nullable: true, checkFalsy: true}),
		body('reference').optional({nullable: true}).not().isEmpty(),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('recu').optional({nullable: true}).not().isEmpty(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		
        // move uploaded file from temp directory to destination directory
		if(modeldata.recu !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.recu, 'recu');
			modeldata.recu = fileInfo.filepath;
		}
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.EncaissementExterne.editFields();
		let record = await DB.EncaissementExterne.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.EncaissementExterne.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete EncaissementExterne record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /encaissementexterne/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.EncaissementExterne.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.EncaissementExterne.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to insert EncaissementExterne record
 * @POST /encaissementexterne/add
 */
router.post('/saisie/', 
	[
		body('banque').optional({nullable: true, checkFalsy: true}),
		body('reference').not().isEmpty(),
		body('nom').optional({nullable: true, checkFalsy: true}),
		body('prenom').optional({nullable: true, checkFalsy: true}),
		body('id_encaissement').optional({nullable: true, checkFalsy: true}),
		body('recu').not().isEmpty(),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		console.log("HERRE IS THE ID ENCAISSEMENT : ",modeldata.id_encaissement);
        // move uploaded file from temp directory to destination directory
		if(modeldata.recu !== undefined) {
			const fileInfo = uploader.moveUploadedFiles(modeldata.recu, 'recu');
			modeldata.recu = fileInfo.filepath;
		}
		
		//save EncaissementExterne record
		let record = await DB.EncaissementExterne.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});
export default router;
