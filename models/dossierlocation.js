
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class DossierLocation extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				dt_effet: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_client: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_contrat: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "dossier_location",
				modelName: "dossier_location",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'dt_effet', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			'id_unite_location', 
			Sequelize.literal('`contrat`.`ref_contrat` AS `contrat_ref_contrat`'), 
			'id_contrat', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'dt_effet', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			'id_unite_location', 
			Sequelize.literal('`contrat`.`ref_contrat` AS `contrat_ref_contrat`'), 
			'id_contrat', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'dt_effet', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			'id_unite_location', 
			Sequelize.literal('`contrat`.`ref_contrat` AS `contrat_ref_contrat`'), 
			'id_contrat', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'dt_effet', 
			Sequelize.literal('`client`.`nom_prenom` AS `client_nom_prenom`'), 
			'id_client', 
			'id_unite_location', 
			Sequelize.literal('`contrat`.`ref_contrat` AS `contrat_ref_contrat`'), 
			'id_contrat', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'dt_effet', 
			'id_client', 
			'id_unite_location', 
			'id_contrat', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
DossierLocation.init();
export default DossierLocation;
