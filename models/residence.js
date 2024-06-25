
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Residence extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				denomination: { type:Sequelize.STRING   },
				dt_mise_service: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				adresse: { type:Sequelize.STRING   },
				tel1: { type:Sequelize.STRING   },
				tel2: { type:Sequelize.STRING   },
				tel3: { type:Sequelize.STRING   },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "residence",
				modelName: "residence",
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'denomination', 
			'dt_mise_service', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			Sequelize.literal('`responsable`.`nom_prenom` AS `responsable_nom_prenom`'), 
			'id_responsable', 
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'denomination', 
			'dt_mise_service', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			Sequelize.literal('`responsable`.`nom_prenom` AS `responsable_nom_prenom`'), 
			'id_responsable', 
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			'id'
		];
	}

	static viewFields() {
		return [
			'code', 
			'denomination', 
			'dt_mise_service', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'id_responsable', 
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			'id'
		];
	}

	static exportViewFields() {
		return [
			'code', 
			'denomination', 
			'dt_mise_service', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'id_responsable', 
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			'id'
		];
	}

	static editFields() {
		return [
			'code', 
			'denomination', 
			'dt_mise_service', 
			'adresse', 
			'tel1', 
			'tel2', 
			'tel3', 
			'id_responsable', 
			'id_proprietaire', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("adresse LIKE :search"), 
			Sequelize.literal("tel1 LIKE :search"), 
			Sequelize.literal("tel2 LIKE :search"), 
			Sequelize.literal("tel3 LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Residence.init();
export default Residence;
