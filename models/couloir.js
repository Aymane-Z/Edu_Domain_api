
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Couloir extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_entrees: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				dt_mise_service: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_pavillon: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_etage: { type:Sequelize.INTEGER   }
			}, 
			{ 
				sequelize,
				
				tableName: "couloir",
				modelName: "couloir",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('couloir.code AS code'), 
			Sequelize.literal('couloir.type AS type'), 
			Sequelize.literal('couloir.denomination AS denomination'), 
			Sequelize.literal('couloir.description AS description'), 
			Sequelize.literal('couloir.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('couloir.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			Sequelize.literal('couloir.id_pavillon AS id_pavillon'), 
			Sequelize.literal('couloir.id_etage AS id_etage'), 
			Sequelize.literal('couloir.id AS id')
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('couloir.code AS code'), 
			Sequelize.literal('couloir.type AS type'), 
			Sequelize.literal('couloir.denomination AS denomination'), 
			Sequelize.literal('couloir.description AS description'), 
			Sequelize.literal('couloir.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('couloir.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			Sequelize.literal('couloir.id_pavillon AS id_pavillon'), 
			Sequelize.literal('couloir.id_etage AS id_etage'), 
			Sequelize.literal('couloir.id AS id')
		];
	}

	static viewFields() {
		return [
			Sequelize.literal('couloir.code AS code'), 
			Sequelize.literal('couloir.type AS type'), 
			Sequelize.literal('couloir.denomination AS denomination'), 
			Sequelize.literal('couloir.description AS description'), 
			Sequelize.literal('couloir.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('couloir.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			Sequelize.literal('couloir.id_pavillon AS id_pavillon'), 
			Sequelize.literal('couloir.id AS id'), 
			Sequelize.literal('couloir.id_etage AS id_etage')
		];
	}

	static exportViewFields() {
		return [
			Sequelize.literal('couloir.code AS code'), 
			Sequelize.literal('couloir.type AS type'), 
			Sequelize.literal('couloir.denomination AS denomination'), 
			Sequelize.literal('couloir.description AS description'), 
			Sequelize.literal('couloir.nombre_entrees AS nombre_entrees'), 
			Sequelize.literal('couloir.dt_mise_service AS dt_mise_service'), 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			Sequelize.literal('couloir.id_pavillon AS id_pavillon'), 
			Sequelize.literal('couloir.id AS id'), 
			Sequelize.literal('couloir.id_etage AS id_etage')
		];
	}

	static editFields() {
		return [
			'code', 
			'type', 
			'denomination', 
			'description', 
			'nombre_entrees', 
			'dt_mise_service', 
			'id_pavillon', 
			'id', 
			'id_etage'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("couloir.code LIKE :search"), 
			Sequelize.literal("couloir.type LIKE :search"), 
			Sequelize.literal("couloir.denomination LIKE :search"), 
			Sequelize.literal("couloir.description LIKE :search"), 
			Sequelize.literal("couloirdetails.id LIKE :search"), 
			Sequelize.literal("couloirdetails.code LIKE :search"), 
			Sequelize.literal("couloirdetails.type LIKE :search"), 
			Sequelize.literal("couloirdetails.denomination LIKE :search"), 
			Sequelize.literal("couloirdetails.description LIKE :search"), 
			Sequelize.literal("couloir.id LIKE :search"),
		];
	}

	
	
}
Couloir.init();
export default Couloir;
