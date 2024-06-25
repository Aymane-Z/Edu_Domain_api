
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Batimentdetails extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				type: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_niveaux: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				nombre: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				res_denomination: { type:Sequelize.STRING   },
				id_responsable: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_proprietaire: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				nom_prenom: { type:Sequelize.STRING   },
				prop_denomination: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "batimentdetails",
				modelName: "batimentdetails",
			}
		);
	}
	
	static listFields() {
		return [
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			Sequelize.literal('`responsable`.`nom_prenom` AS `responsable_nom_prenom`'), 
			'id_responsable', 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			'id_residence'
		];
	}

	static exportListFields() {
		return [
			Sequelize.literal('`proprietaire`.`denomination` AS `proprietaire_denomination`'), 
			'id_proprietaire', 
			Sequelize.literal('`responsable`.`nom_prenom` AS `responsable_nom_prenom`'), 
			'id_responsable', 
			Sequelize.literal('`residence`.`denomination` AS `residence_denomination`'), 
			'id_residence'
		];
	}

	static exportViewFields() {
		return [
			
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("type LIKE :search"), 
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("Res_denomination LIKE :search"), 
			Sequelize.literal("nom_prenom LIKE :search"), 
			Sequelize.literal("Prop_denomination LIKE :search"),
		];
	}

	
	
}
Batimentdetails.init();
export default Batimentdetails;
