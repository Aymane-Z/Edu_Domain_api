
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Responsable extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				nom_prenom: { type:Sequelize.STRING   },
				cin: { type:Sequelize.STRING   },
				adresse: { type:Sequelize.STRING   },
				tel1: { type:Sequelize.STRING   },
				tel2: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "responsable",
				modelName: "responsable",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'nom_prenom', 
			'cin', 
			'adresse', 
			'tel1', 
			'tel2'
		];
	}

	static editFields() {
		return [
			'code', 
			'nom_prenom', 
			'cin', 
			'adresse', 
			'tel1', 
			'tel2', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("nom_prenom LIKE :search"), 
			Sequelize.literal("cin LIKE :search"), 
			Sequelize.literal("adresse LIKE :search"), 
			Sequelize.literal("tel1 LIKE :search"), 
			Sequelize.literal("tel2 LIKE :search"),
		];
	}

	
	
}
Responsable.init();
export default Responsable;
