import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/etage_list.js';
import exportViewPage from '../exports/etage_view.js';


const router = Router();




/**
 * Route to list etage records
 * @GET /etage/index/{fieldname}/{fieldvalue}
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
			model: DB.Pavillon,
			required: true,
			as: 'pavillon',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Etage.searchFields();
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
			query.attributes = DB.Etage.exportListFields();
			let records = await DB.Etage.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Etage.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Etage.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import Etage records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /etage/importdata
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
							description: data['description'],
							nombre_chambres: data['nombre_chambres'],
							acces_handicape: data['acces_handicape'],
							amenagements_speciaux: data['amenagements_speciaux'],
							id_pavillon: data['id_pavillon'],
							date_created: data['date_created'],
							date_updated: data['date_updated']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.Etage.bulkCreate(records);
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
 * Route to view Etage record
 * @GET /etage/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		const joinTables = []; // hold list of join tables
		joinTables.push({
			model: DB.Pavillon,
			required: true,
			as: 'pavillon',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		if(req.query.export){
			query.attributes = DB.Etage.exportViewFields();
			let records = await DB.Etage.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.Etage.viewFields();
		let record = await DB.Etage.findOne(query);
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
 * Route to insert Etage record
 * @POST /etage/add
 */
router.post('/add/', 
	[
		body('code').optional({nullable: true, checkFalsy: true}),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('nombre_chambres').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('acces_handicape').optional({nullable: true, checkFalsy: true}),
		body('amenagements_speciaux').optional({nullable: true, checkFalsy: true}),
		body('id_pavillon').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save Etage record
		let record = await DB.Etage.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Etage record for edit
 * @GET /etage/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Etage.editFields();
		let record = await DB.Etage.findOne(query);
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
 * Route to update  Etage record
 * @POST /etage/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('code').optional({nullable: true, checkFalsy: true}),
		body('denomination').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('nombre_chambres').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('acces_handicape').optional({nullable: true, checkFalsy: true}),
		body('amenagements_speciaux').optional({nullable: true, checkFalsy: true}),
		body('id_pavillon').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.Etage.editFields();
		let record = await DB.Etage.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Etage.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Etage record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /etage/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Etage.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Etage.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
