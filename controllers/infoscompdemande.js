import { Router } from 'express';
import csv from 'fast-csv';
import { body } from 'express-validator';
import { fileUploadMiddleware } from '../helpers/upload_middleware.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
import exportListPage from '../exports/infoscompdemande_list.js';
import exportViewPage from '../exports/infoscompdemande_view.js';


const router = Router();




/**
 * Route to list infoscompdemande records
 * @GET /infoscompdemande/index/{fieldname}/{fieldvalue}
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
			model: DB.DemandeLogement,
			required: true,
			as: 'demande_logement',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.InfosCompDemande.searchFields();
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
			query.attributes = DB.InfosCompDemande.exportListFields();
			let records = await DB.InfosCompDemande.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.InfosCompDemande.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.InfosCompDemande.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to import InfosCompDemande records
 * support multi import of csv data files
 * csv file must contain table header on the first line.
 * @GET /infoscompdemande/importdata
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
							id_demande_logement: data['id_demande_logement'],
							ancienne_cite: data['ancienne_cite'],
							periode_ancienne_cite: data['periode_ancienne_cite'],
							source_decouverte: data['source_decouverte'],
							annee_residence_precedente: data['annee_residence_precedente'],
							type_chambre: data['type_chambre'],
							numero_chambre: data['numero_chambre'],
							groupe_sanguin: data['groupe_sanguin'],
							maladies_allergies: data['maladies_allergies'],
							nom_contact_personne: data['nom_contact_personne'],
							tel_contact_personne: data['tel_contact_personne'],
							date: data['date']
						}
						records.push(modeldata);
					}
				}).on("end", async() => {
					try{
						let affectedRows = await DB.InfosCompDemande.bulkCreate(records);
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
 * Route to view InfosCompDemande record
 * @GET /infoscompdemande/view/{recid}
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
			query.attributes = DB.InfosCompDemande.exportViewFields();
			let records = await DB.InfosCompDemande.findAll(query);
			return exportViewPage(records, req, res)
		}
		query.attributes = DB.InfosCompDemande.viewFields();
		let record = await DB.InfosCompDemande.findOne(query);
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
 * Route to insert InfosCompDemande record
 * @POST /infoscompdemande/add
 */
router.post('/add/', 
	[
		body('ancienne_cite').optional({nullable: true, checkFalsy: true}),
		body('periode_ancienne_cite').optional({nullable: true, checkFalsy: true}),
		body('source_decouverte').optional({nullable: true, checkFalsy: true}),
		body('annee_residence_precedente').optional({nullable: true, checkFalsy: true}),
		body('type_chambre').optional({nullable: true, checkFalsy: true}),
		body('numero_chambre').optional({nullable: true, checkFalsy: true}),
		body('groupe_sanguin').optional({nullable: true, checkFalsy: true}),
		body('maladies_allergies').optional({nullable: true, checkFalsy: true}),
		body('nom_contact_personne').optional({nullable: true, checkFalsy: true}),
		body('tel_contact_personne').optional({nullable: true, checkFalsy: true}),
		body('id_demande_logement').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		
		//save InfosCompDemande record
		let record = await DB.InfosCompDemande.create(modeldata);
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
 * Route to get  InfosCompDemande record for edit
 * @GET /infoscompdemande/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.InfosCompDemande.editFields();
		let record = await DB.InfosCompDemande.findOne(query);
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
 * Route to update  InfosCompDemande record
 * @POST /infoscompdemande/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('ancienne_cite').optional({nullable: true, checkFalsy: true}),
		body('periode_ancienne_cite').optional({nullable: true, checkFalsy: true}),
		body('source_decouverte').optional({nullable: true, checkFalsy: true}),
		body('annee_residence_precedente').optional({nullable: true, checkFalsy: true}),
		body('type_chambre').optional({nullable: true, checkFalsy: true}),
		body('numero_chambre').optional({nullable: true, checkFalsy: true}),
		body('groupe_sanguin').optional({nullable: true, checkFalsy: true}),
		body('maladies_allergies').optional({nullable: true, checkFalsy: true}),
		body('nom_contact_personne').optional({nullable: true, checkFalsy: true}),
		body('tel_contact_personne').optional({nullable: true, checkFalsy: true}),
		body('id_demande_logement').optional({nullable: true, checkFalsy: true}),
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
		query.attributes = DB.InfosCompDemande.editFields();
		let record = await DB.InfosCompDemande.findOne(query);
		if(!record){
			return res.notFound();
		}
		const oldValues = JSON.stringify(record); //for audit trail
		await DB.InfosCompDemande.update(modeldata, {where: where});
		record = await DB.InfosCompDemande.findOne(query);//for audit trail
		const newValues = JSON.stringify(record); 
		req.writeToAuditLog({ recid, oldValues, newValues });
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete InfosCompDemande record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /infoscompdemande/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.InfosCompDemande.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
			const oldValues = JSON.stringify(record); //for audit trail
			req.writeToAuditLog({ recid: record['id'], oldValues });
		});
		await DB.InfosCompDemande.destroy(query);
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
	let record = await DB.InfosCompDemande.findOne(query);
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
	let record = await DB.InfosCompDemande.findOne(query);
	return (record ? record.id : null);
}
export default router;
