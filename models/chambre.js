
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Chambre extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				observation: { type:Sequelize.STRING   },
				id_couloir: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_type: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "chambre",
				modelName: "chambre",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('chambre.code AS code'), 
			Sequelize.literal('chambre.type AS type'), 
			Sequelize.literal('chambre.description AS description'), 
			Sequelize.literal('chambre.observation AS observation'), 
			Sequelize.literal('`couloir`.`code` AS `couloir_code`'), 
			Sequelize.literal('chambre.id_couloir AS id_couloir'), 
			Sequelize.literal('`famille_unite`.`type` AS `familleunite_type`'), 
			Sequelize.literal('chambre.id_type AS id_type'), 
			Sequelize.literal('chambre.id AS id')
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('chambre.code AS code'), 
			Sequelize.literal('chambre.type AS type'), 
			Sequelize.literal('chambre.description AS description'), 
			Sequelize.literal('chambre.observation AS observation'), 
			Sequelize.literal('`couloir`.`code` AS `couloir_code`'), 
			Sequelize.literal('chambre.id_couloir AS id_couloir'), 
			Sequelize.literal('`famille_unite`.`type` AS `familleunite_type`'), 
			Sequelize.literal('chambre.id_type AS id_type'), 
			Sequelize.literal('chambre.id AS id')
		];
	}

	static viewFields() {
		return [
			Sequelize.literal('chambre.code AS code'), 
			Sequelize.literal('chambre.type AS type'), 
			Sequelize.literal('chambre.description AS description'), 
			Sequelize.literal('chambre.observation AS observation'), 
			Sequelize.literal('`couloir`.`denomination` AS `couloir_denomination`'), 
			Sequelize.literal('chambre.id_couloir AS id_couloir'), 
			Sequelize.literal('`famille_unite`.`type` AS `familleunite_type`'), 
			Sequelize.literal('chambre.id_type AS id_type'), 
			Sequelize.literal('chambre.id AS id')
		];
	}

	static exportViewFields() {
		return [
			Sequelize.literal('chambre.code AS code'), 
			Sequelize.literal('chambre.type AS type'), 
			Sequelize.literal('chambre.description AS description'), 
			Sequelize.literal('chambre.observation AS observation'), 
			Sequelize.literal('`couloir`.`denomination` AS `couloir_denomination`'), 
			Sequelize.literal('chambre.id_couloir AS id_couloir'), 
			Sequelize.literal('`famille_unite`.`type` AS `familleunite_type`'), 
			Sequelize.literal('chambre.id_type AS id_type'), 
			Sequelize.literal('chambre.id AS id')
		];
	}

	static editFields() {
		return [
			'code', 
			'type', 
			'description', 
			'observation', 
			'id_couloir', 
			'id_type', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("chambre.code LIKE :search"), 
			Sequelize.literal("chambre.type LIKE :search"), 
			Sequelize.literal("chambre.description LIKE :search"), 
			Sequelize.literal("chambre.observation LIKE :search"), 
			Sequelize.literal("chambredetails.id LIKE :search"), 
			Sequelize.literal("chambredetails.code LIKE :search"), 
			Sequelize.literal("chambredetails.type LIKE :search"), 
			Sequelize.literal("chambredetails.description LIKE :search"), 
			Sequelize.literal("chambredetails.observation LIKE :search"), 
			Sequelize.literal("chambre.id LIKE :search"),
		];
	}

	
	
}
Chambre.init();
export default Chambre;
