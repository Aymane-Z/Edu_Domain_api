
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Encaissementdetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				date: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				montant: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				observation: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_facture: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				status: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_updated: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				code_facture: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				description: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_base_tarif: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				code_base_tarification: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_application: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				periodicite: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_fin: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_type_chambre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				banque: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				reference: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				nom: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				prenom: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				recu: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_encaissement: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "encaissementdetails",
				modelName: "encaissementdetails",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'date', 
			'montant', 
			'observation', 
			'id_client', 
			'user_id', 
			'id_facture', 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'code_facture', 
			'description', 
			'id_base_tarif', 
			'code_base_tarification', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'dt_fin', 
			'id_residence', 
			'id_type_chambre', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement', 
			'status'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'date', 
			'montant', 
			'observation', 
			'id_client', 
			'user_id', 
			'id_facture', 
			'id_unite_location', 
			'date_created', 
			'date_updated', 
			'code_facture', 
			'description', 
			'id_base_tarif', 
			'code_base_tarification', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'dt_fin', 
			'id_residence', 
			'id_type_chambre', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement', 
			'status'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("code_facture LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("code_base_tarification LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("periodicite LIKE :search"), 
			Sequelize.literal("banque LIKE :search"), 
			Sequelize.literal("reference LIKE :search"), 
			Sequelize.literal("nom LIKE :search"), 
			Sequelize.literal("prenom LIKE :search"), 
			Sequelize.literal("recu LIKE :search"),
		];
	}

	
	
}
Encaissementdetails.init();
export default Encaissementdetails;
