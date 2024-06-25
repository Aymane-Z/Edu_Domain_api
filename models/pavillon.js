
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Pavillon extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_niveaux: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				nombre_entrees: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_mise_service: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_batiment: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "pavillon",
				modelName: "pavillon",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('pavillon.code AS code'), 
			Sequelize.literal('pavillon.type AS type'), 
			Sequelize.literal('pavillon.denomination AS denomination'), 
			Sequelize.literal('pavillon.description AS description'), 
			Sequelize.literal('pavillon.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('pavillon.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('pavillon.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`batiment`.`code` AS `batiment_code`'), 
			Sequelize.literal('pavillon.id_batiment AS id_batiment'), 
			Sequelize.literal('pavillon.id AS id')
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('pavillon.code AS code'), 
			Sequelize.literal('pavillon.type AS type'), 
			Sequelize.literal('pavillon.denomination AS denomination'), 
			Sequelize.literal('pavillon.description AS description'), 
			Sequelize.literal('pavillon.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('pavillon.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('pavillon.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`batiment`.`code` AS `batiment_code`'), 
			Sequelize.literal('pavillon.id_batiment AS id_batiment'), 
			Sequelize.literal('pavillon.id AS id')
		];
	}

	static viewFields() {
		return [
			Sequelize.literal('pavillon.code AS code'), 
			Sequelize.literal('pavillon.type AS type'), 
			Sequelize.literal('pavillon.denomination AS denomination'), 
			Sequelize.literal('pavillon.description AS description'), 
			Sequelize.literal('pavillon.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('pavillon.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('pavillon.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`batiment`.`code` AS `batiment_code`'), 
			Sequelize.literal('pavillon.id_batiment AS id_batiment'), 
			Sequelize.literal('pavillon.id AS id')
		];
	}

	static exportViewFields() {
		return [
			Sequelize.literal('pavillon.code AS code'), 
			Sequelize.literal('pavillon.type AS type'), 
			Sequelize.literal('pavillon.denomination AS denomination'), 
			Sequelize.literal('pavillon.description AS description'), 
			Sequelize.literal('pavillon.nombre_niveaux AS nombre_niveaux'), 
			Sequelize.literal('pavillon.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('pavillon.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`batiment`.`code` AS `batiment_code`'), 
			Sequelize.literal('pavillon.id_batiment AS id_batiment'), 
			Sequelize.literal('pavillon.id AS id')
		];
	}

	static editFields() {
		return [
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_niveaux', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_batiment', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("pavillon.code LIKE :search"), 
			Sequelize.literal("pavillon.type LIKE :search"), 
			Sequelize.literal("pavillon.denomination LIKE :search"), 
			Sequelize.literal("pavillon.description LIKE :search"), 
			Sequelize.literal("pavillondetails.id LIKE :search"), 
			Sequelize.literal("pavillondetails.code LIKE :search"), 
			Sequelize.literal("pavillondetails.type LIKE :search"), 
			Sequelize.literal("pavillondetails.denomination LIKE :search"), 
			Sequelize.literal("pavillondetails.description LIKE :search"), 
			Sequelize.literal("pavillondetails.B_denomination LIKE :search"), 
			Sequelize.literal("pavillondetails.R_denomination LIKE :search"), 
			Sequelize.literal("pavillondetails.P_denomination LIKE :search"), 
			Sequelize.literal("pavillondetails.nom_prenom LIKE :search"), 
			Sequelize.literal("pavillon.id LIKE :search"),
		];
	}

	
	
}
Pavillon.init();
export default Pavillon;
