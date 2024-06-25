import { Router } from 'express';
import DB from '../models/db.js';
import exportListPage from '../exports/encaissementdetails_list.js';


const router = Router();




/**
 * Route to list records based on custom sql query
 * @GET /encaissementdetails
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'],  async (req, res) => {
	try{
		let sqltext = `SELECT  patrimoine.encaissement.id AS id,         patrimoine.encaissement.date AS date,         patrimoine.encaissement.montant AS montant,         patrimoine.encaissement.observation AS observation,         patrimoine.encaissement.id_client AS id_client,         patrimoine.encaissement.user_id AS user_id,         patrimoine.encaissement.id_facture AS id_facture,         patrimoine.encaissement.id_unite_location AS id_unite_location,         patrimoine.encaissement.status AS status,         patrimoine.encaissement.date_created AS date_created,         patrimoine.encaissement.date_updated AS date_updated,         patrimoine.lignes_facture.code AS code_facture,         patrimoine.lignes_facture.description AS description,         patrimoine.lignes_facture.id_base_tarif AS id_base_tarif,         patrimoine.base_tarification.code AS code_base_tarification,         patrimoine.base_tarification.designation AS designation,         patrimoine.base_tarification.dt_application AS dt_application,         patrimoine.base_tarification.periodicite AS periodicite,         patrimoine.base_tarification.dt_fin AS dt_fin,         patrimoine.base_tarification.id_residence AS id_residence,         patrimoine.base_tarification.id_type_chambre AS id_type_chambre,         patrimoine.encaissement_externe.banque AS banque,         patrimoine.encaissement_externe.reference AS reference,         patrimoine.encaissement_externe.nom AS nom,         patrimoine.encaissement_externe.prenom AS prenom,         patrimoine.encaissement_externe.recu AS recu,         patrimoine.encaissement_externe.id_encaissement AS id_encaissement     FROM         (((patrimoine.lignes_facture         JOIN patrimoine.base_tarification ON (patrimoine.lignes_facture.id_base_tarif = patrimoine.base_tarification.id))         JOIN patrimoine.encaissement ON (patrimoine.lignes_facture.id_facture = patrimoine.encaissement.id_facture))         JOIN patrimoine.encaissement_externe ON (patrimoine.encaissement_externe.id_encaissement = patrimoine.encaissement.id)) ` ;
		let records = await DB.rawQueryList(sqltext);
		let recordCount = records.length;
		let totalRecords = record_count;
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
export default router;
