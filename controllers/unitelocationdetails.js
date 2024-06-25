import { Router } from 'express';
import DB from '../models/db.js';
import exportListPage from '../exports/unitelocationdetails_list.js';
import exportViewPage from '../exports/unitelocationdetails_view.js';
import exportFreeunitsPage from '../exports/unitelocationdetails_freeunits.js';


const router = Router();




/**
 * Route to list unitelocationdetails records
 * @GET /unitelocationdetails/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Unitelocationdetails.searchFields();
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
			query.attributes = DB.Unitelocationdetails.exportListFields();
			let records = await DB.Unitelocationdetails.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Unitelocationdetails.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Unitelocationdetails.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to list unitelocationdetails records
 * @GET /unitelocationdetails/index/{fieldname}/{fieldvalue}
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
			model: DB.EtatUnite,
			required: true,
			as: 'etat_unite',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.FamilleUnite,
			required: true,
			as: 'famille_unite',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Unitelocationdetails.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		
		if(req.query.id_residence){
			queryFilters.push(DB.filterBy("unitelocationdetails.id_residence", req.query.id_residence))
		}
		if(req.query.type){
			queryFilters.push(DB.filterBy("famille_unite.type", req.query.type))
		}
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'id', 'desc');
		if(req.query.export){
			query.attributes = DB.Unitelocationdetails.exportFreeunitsFields();
			let records = await DB.Unitelocationdetails.findAll(query);
			return exportFreeunitsPage(records, req, res)
		}
		query.attributes = DB.Unitelocationdetails.freeunitsFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Unitelocationdetails.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
