
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Unitelocationdetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING   },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				etat_physique: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				id_chambre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_typechambre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_couloir: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_pavillon: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_batiment: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "unitelocationdetails",
				modelName: "unitelocationdetails",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'description', 
			'etat_physique', 
			'observation', 
			'id_chambre', 
			'id_typechambre', 
			'id_couloir', 
			'id_pavillon', 
			'id_batiment', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'type', 
			'description', 
			'etat_physique', 
			'observation', 
			'id_chambre', 
			'id_typechambre', 
			'id_couloir', 
			'id_pavillon', 
			'id_batiment', 
			'id_residence', 
			'id_responsable', 
			'id_proprietaire'
		];
	}

	static exportViewFields() {
		return [
			
		];
	}

	static freeunitsFields() {
		return [
			Sequelize.literal('unitelocationdetails.id AS id'), 
			Sequelize.literal('unitelocationdetails.code AS code'), 
			Sequelize.literal('unitelocationdetails.designation AS designation'), 
			Sequelize.literal('unitelocationdetails.etat_physique AS etat_physique'), 
			Sequelize.literal('unitelocationdetails.observation AS observation'), 
			Sequelize.literal('unitelocationdetails.id_typechambre AS id_typechambre'), 
			Sequelize.literal("famille_unite.photo AS familleunite_photo"), 
			Sequelize.literal("famille_unite.type AS familleunite_type"), 
			Sequelize.literal("etat_unite.id AS etatunite_id"), 
			Sequelize.literal("famille_unite.id AS familleunite_id")
		];
	}

	static exportFreeunitsFields() {
		return [
			Sequelize.literal('unitelocationdetails.id AS id'), 
			Sequelize.literal('unitelocationdetails.code AS code'), 
			Sequelize.literal('unitelocationdetails.designation AS designation'), 
			Sequelize.literal('unitelocationdetails.etat_physique AS etat_physique'), 
			Sequelize.literal('unitelocationdetails.observation AS observation'), 
			Sequelize.literal('unitelocationdetails.id_typechambre AS id_typechambre'), 
			Sequelize.literal("famille_unite.photo AS familleunite_photo"), 
			Sequelize.literal("famille_unite.type AS familleunite_type"), 
			Sequelize.literal("etat_unite.id AS etatunite_id"), 
			Sequelize.literal("famille_unite.id AS familleunite_id")
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("etat_physique LIKE :search"), 
			Sequelize.literal("observation LIKE :search"),
		];
	}

	
	
}
Unitelocationdetails.init();
export default Unitelocationdetails;
