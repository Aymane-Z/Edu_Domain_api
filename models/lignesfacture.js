
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class LignesFacture extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING   },
				designation: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				montant: { type:Sequelize.NUMBER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_facture: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_base_tarif: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "lignes_facture",
				modelName: "lignes_facture",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'description', 
			'montant', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'description', 
			'montant', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'description', 
			'montant', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'designation', 
			'description', 
			'montant', 
			Sequelize.literal('`facture`.`code` AS `facture_code`'), 
			'id_facture', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'description', 
			'montant', 
			'id_facture', 
			'id_base_tarif', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("description LIKE :search"),
		];
	}

	
	
}
LignesFacture.init();
export default LignesFacture;
