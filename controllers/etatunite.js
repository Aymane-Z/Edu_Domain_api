import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/etatunite_list.js';
import exportViewPage from '../exports/etatunite_view.js';


const router = Router();




/**
 * Route to list etatunite records
 * @GET /etatunite/index/{fieldname}/{fieldvalue}
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
			model: DB.UniteLocation,
			required: true,
			as: 'unite_location',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.EtatUnite.searchFields();
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
			query.attributes = DB.EtatUnite.exportListFields();
			let records = await DB.EtatUnite.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.EtatUnite.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.EtatUnite.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import EtatUnite records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /etatunite/importdata
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
							etat: data['etat'],
							description: data['description'],
							observation: data['observation'],
							dt_debut_etat: data['dt_debut_etat'],
							dt_fin_etat: data['dt_fin_etat'],
							ouvert_location: data['ouvert_location'],
							id_unitelocation: data['id_unitelocation'],
							date_created: data['date_created'],
							date_updated: data['date_updated']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.EtatUnite.bulkCreate(records);
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
 * Route to view EtatUnite record
 * @GET /etatunite/view/{recid}
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
			query.attributes = DB.EtatUnite.exportViewFields();
			let records = await DB.EtatUnite.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.EtatUnite.viewFields();
		let record = await DB.EtatUnite.findOne(query);
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
 * Route to insert EtatUnite record
 * @POST /etatunite/add
 */
router.post('/add/', 
	[
		body('id_unitelocation').optional({nullable: true, checkFalsy: true}),
		body('etat').not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('dt_debut_etat').optional({nullable: true, checkFalsy: true}),
		body('dt_fin_etat').optional({nullable: true, checkFalsy: true}),
		body('ouvert_location').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save EtatUnite record
		let record = await DB.EtatUnite.create(modeldata);
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
 * Route to get  EtatUnite record for edit
 * @GET /etatunite/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.EtatUnite.editFields();
		let record = await DB.EtatUnite.findOne(query);
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
 * Route to update  EtatUnite record
 * @POST /etatunite/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('id_unitelocation').optional({nullable: true, checkFalsy: true}),
		body('etat').optional({nullable: true}).not().isEmpty(),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('observation').optional({nullable: true, checkFalsy: true}),
		body('dt_debut_etat').optional({nullable: true, checkFalsy: true}),
		body('dt_fin_etat').optional({nullable: true, checkFalsy: true}),
		body('ouvert_location').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.EtatUnite.editFields();
		let record = await DB.EtatUnite.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.EtatUnite.update(modeldata, {where: where});
		record = await DB.EtatUnite.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete EtatUnite record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /etatunite/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.EtatUnite.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.EtatUnite.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});

router.post('/updatestate', async (req, res) => {
    try {
        const { etat, description, observation, id_unitelocation } = req.body;
        
        let sqltext = `CALL InsertAndUpdateEtatUnite(:etat, :description, :observation, :id_unitelocation)`;
        let queryParams = {
            etat: etat, 
            description: description, 
            observation: observation,  
            id_unitelocation: id_unitelocation
        };
		//console.log('///////////////////////////////////////////////etat :',params[0]);
        let result = await DB.rawQuery(sqltext, { replacements: queryParams });

        res.ok(result);
    } catch (err) {
        console.error('Error executing the stored procedure:', err);
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
	let record = await DB.EtatUnite.findOne(query);
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
	let record = await DB.EtatUnite.findOne(query);
	return (record ? record.id : null);
}
export default router;
