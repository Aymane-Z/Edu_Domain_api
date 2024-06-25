
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Tarification extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				dt_tarif: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_base_tarif: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_unite_location: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "tarification",
				modelName: "tarification",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'dt_tarif', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'dt_tarif', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'dt_tarif', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'dt_tarif', 
			Sequelize.literal('`base_tarification`.`code` AS `basetarification_code`'), 
			'id_base_tarif', 
			Sequelize.literal('`unite_location`.`code` AS `unitelocation_code`'), 
			'id_unite_location', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'dt_tarif', 
			'id_base_tarif', 
			'id_unite_location', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Tarification.init();
export default Tarification;
