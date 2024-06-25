import { Router } from 'express';
import DB from '../models/db.js';
import exportListPage from '../exports/freerentalunits_list.js';


const router = Router();




/**
 * Route to list records based on custom sql query
 * @GET /freerentalunits
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'],  async (req, res) => {
	try{
		let sqltext = `SELECT  unitelocationdetails.id, unitelocationdetails.code, unitelocationdetails.designation, unitelocationdetails.type as typeunit, unitelocationdetails.description, unitelocationdetails.etat_physique, unitelocationdetails.observation, unitelocationdetails.id_residence, etat_unite.etat, famille_unite.type, famille_unite.id as id_typech, famille_unite.prix, famille_unite.photo, famille_unite.designation as categoriechambre FROM etat_unite JOIN unitelocationdetails ON etat_unite.id_unitelocation=unitelocationdetails.id  JOIN famille_unite ON unitelocationdetails.id_typechambre=famille_unite.id where etat_unite.etat='Libre' ` ;
		let records = await DB.rawQueryList(sqltext);
		let recordCount = records.length;
		let totalRecords = recordCount;
		let totalPages = 1;
		let data = {
			totalRecords,
			recordCount,
			totalPages,
			records
		}
		return res.ok(data);
	}
	catch(err){
		return res.serverError(err);
	}
});

router.get(['/', '/list/:fieldname?/:fieldvalue?'], async (req, res) => {
    try {

        let sqltext = `SELECT unitelocationdetails.id, unitelocationdetails.code, unitelocationdetails.designation, unitelocationdetails.type as typeunit, unitelocationdetails.description, unitelocationdetails.etat_physique, unitelocationdetails.observation, etat_unite.etat, famille_unite.type, famille_unite.id as id_typech, famille_unite.prix, famille_unite.photo, famille_unite.designation as categoriechambre FROM etat_unite JOIN unitelocationdetails ON etat_unite.id_unitelocation=unitelocationdetails.id JOIN famille_unite ON unitelocationdetails.id_typechambre=famille_unite.id WHERE etat_unite.etat='Libre'`;

        
        const { fieldname, fieldvalue } = req.params;

        
        if (fieldname && fieldvalue) {
            
            sqltext += ` AND ${fieldname} = ?`;

            
            let records = await DB.rawQueryList(sqltext, [fieldvalue]);
            let recordCount = records.length;
            let totalRecords = recordCount;
            let totalPages = 1;
            let data = {
                totalRecords,
                recordCount,
                totalPages,
                records
            };
            return res.ok(data);
        } else {
            
            let records = await DB.rawQueryList(sqltext);
            let recordCount = records.length;
            let totalRecords = recordCount;
            let totalPages = 1;
            let data = {
                totalRecords,
                recordCount,
                totalPages,
                records
            };
            return res.ok(data);
        }
    } catch (err) {
        return res.serverError(err);
    }
});
export default router;


