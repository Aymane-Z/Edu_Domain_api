import { Router } from 'express';
import DB from '../models/db.js';
import exportListPage from '../exports/batimentdetails_list.js';
import exportViewPage from '../exports/batimentdetails_view.js';


const router = Router();




/**
 * Route to list batimentdetails records
 * @GET /batimentdetails/index/{fieldname}/{fieldvalue}
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
			model: DB.Proprietaire,
			required: true,
			as: 'proprietaire',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Responsable,
			required: true,
			as: 'responsable',
			attributes: [], //already set via model class
		})
		joinTables.push({
			model: DB.Residence,
			required: true,
			as: 'residence',
			attributes: [], //already set via model class
		})
		query.include = joinTables;
		let search = req.query.search;
		if(search){
			let searchFields = DB.Batimentdetails.searchFields();
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
			query.attributes = DB.Batimentdetails.exportListFields();
			let records = await DB.Batimentdetails.findAll(query);
			return exportListPage(records, req, res)
		}
		query.attributes = DB.Batimentdetails.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Batimentdetails.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});
export default router;
