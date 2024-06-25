
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class UniteLocation extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING   },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				etat_physique: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				id_chambre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				photo: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "unite_location",
				modelName: "unite_location",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.type AS type'), 
			Sequelize.literal('unite_location.description AS description'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal('unite_location.observation AS observation'), 
			Sequelize.literal('`chambre`.`code` AS `chambre_code`'), 
			Sequelize.literal('unite_location.id_chambre AS id_chambre'), 
			Sequelize.literal('unite_location.photo AS photo'), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.type AS type'), 
			Sequelize.literal('unite_location.description AS description'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal('unite_location.observation AS observation'), 
			Sequelize.literal('`chambre`.`code` AS `chambre_code`'), 
			Sequelize.literal('unite_location.id_chambre AS id_chambre'), 
			Sequelize.literal('unite_location.photo AS photo'), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	static viewFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.type AS type'), 
			Sequelize.literal('unite_location.description AS description'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal('unite_location.observation AS observation'), 
			Sequelize.literal('`chambre`.`code` AS `chambre_code`'), 
			Sequelize.literal('unite_location.id_chambre AS id_chambre'), 
			Sequelize.literal('unite_location.photo AS photo'), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	static exportViewFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.type AS type'), 
			Sequelize.literal('unite_location.description AS description'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal('unite_location.observation AS observation'), 
			Sequelize.literal('`chambre`.`code` AS `chambre_code`'), 
			Sequelize.literal('unite_location.id_chambre AS id_chambre'), 
			Sequelize.literal('unite_location.photo AS photo'), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'type', 
			'description', 
			'etat_physique', 
			'observation', 
			'id_chambre', 
			'photo', 
			'id'
		];
	}

	static freeunitsFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal("freerentalunits.id AS freerentalunits_id"), 
			Sequelize.literal("freerentalunits.code AS freerentalunits_code"), 
			Sequelize.literal("freerentalunits.designation AS freerentalunits_designation"), 
			Sequelize.literal("freerentalunits.typeunit AS freerentalunits_typeunit"), 
			Sequelize.literal("freerentalunits.description AS freerentalunits_description"), 
			Sequelize.literal("freerentalunits.etat_physique AS freerentalunits_etat_physique"), 
			Sequelize.literal("freerentalunits.observation AS freerentalunits_observation"), 
			Sequelize.literal("freerentalunits.id_residence AS freerentalunits_id_residence"), 
			Sequelize.literal("freerentalunits.etat AS freerentalunits_etat"), 
			Sequelize.literal("freerentalunits.type AS freerentalunits_type"), 
			Sequelize.literal("freerentalunits.id_typech AS freerentalunits_id_typech"), 
			Sequelize.literal("freerentalunits.prix AS freerentalunits_prix"), 
			Sequelize.literal("freerentalunits.photo AS freerentalunits_photo"), 
			Sequelize.literal("freerentalunits.categoriechambre AS freerentalunits_categoriechambre"), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	static exportFreeunitsFields() {
		return [
			Sequelize.literal('unite_location.code AS code'), 
			Sequelize.literal('unite_location.designation AS designation'), 
			Sequelize.literal('unite_location.etat_physique AS etat_physique'), 
			Sequelize.literal("freerentalunits.id AS freerentalunits_id"), 
			Sequelize.literal("freerentalunits.code AS freerentalunits_code"), 
			Sequelize.literal("freerentalunits.designation AS freerentalunits_designation"), 
			Sequelize.literal("freerentalunits.typeunit AS freerentalunits_typeunit"), 
			Sequelize.literal("freerentalunits.description AS freerentalunits_description"), 
			Sequelize.literal("freerentalunits.etat_physique AS freerentalunits_etat_physique"), 
			Sequelize.literal("freerentalunits.observation AS freerentalunits_observation"), 
			Sequelize.literal("freerentalunits.id_residence AS freerentalunits_id_residence"), 
			Sequelize.literal("freerentalunits.etat AS freerentalunits_etat"), 
			Sequelize.literal("freerentalunits.type AS freerentalunits_type"), 
			Sequelize.literal("freerentalunits.id_typech AS freerentalunits_id_typech"), 
			Sequelize.literal("freerentalunits.prix AS freerentalunits_prix"), 
			Sequelize.literal("freerentalunits.photo AS freerentalunits_photo"), 
			Sequelize.literal("freerentalunits.categoriechambre AS freerentalunits_categoriechambre"), 
			Sequelize.literal('unite_location.id AS id')
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("unite_location.code LIKE :search"), 
			Sequelize.literal("unite_location.designation LIKE :search"), 
			Sequelize.literal("unite_location.type LIKE :search"), 
			Sequelize.literal("unite_location.description LIKE :search"), 
			Sequelize.literal("unite_location.etat_physique LIKE :search"), 
			Sequelize.literal("unite_location.observation LIKE :search"), 
			Sequelize.literal("unitelocationdetails.id LIKE :search"), 
			Sequelize.literal("unitelocationdetails.code LIKE :search"), 
			Sequelize.literal("unitelocationdetails.designation LIKE :search"), 
			Sequelize.literal("unitelocationdetails.type LIKE :search"), 
			Sequelize.literal("unitelocationdetails.description LIKE :search"), 
			Sequelize.literal("unitelocationdetails.etat_physique LIKE :search"), 
			Sequelize.literal("unitelocationdetails.observation LIKE :search"), 
			Sequelize.literal("unite_location.id LIKE :search"),
		];
	}

	
	
}
UniteLocation.init();
export default UniteLocation;
