
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class EncaissementExterne extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				banque: { type:Sequelize.STRING   },
				reference: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				nom: { type:Sequelize.STRING   },
				prenom: { type:Sequelize.STRING   },
				recu: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				id_encaissement: { type:Sequelize.INTEGER   }
			}, 
			{ 
				sequelize,
				
				tableName: "encaissement_externe",
				modelName: "encaissement_externe",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement'
		];
	}

	static viewFields() {
		return [
			'id', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id_encaissement'
		];
	}

	static editFields() {
		return [
			'banque', 
			'reference', 
			'nom', 
			'prenom', 
			'recu', 
			'id', 
			'id_encaissement'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("banque LIKE :search"), 
			Sequelize.literal("reference LIKE :search"), 
			Sequelize.literal("nom LIKE :search"), 
			Sequelize.literal("prenom LIKE :search"), 
			Sequelize.literal("recu LIKE :search"),
		];
	}

	
	
}
EncaissementExterne.init();
export default EncaissementExterne;
