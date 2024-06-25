
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Contrat extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				ref_contrat: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				date: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				observation: { type:Sequelize.STRING   },
				remise: { type:Sequelize.STRING   },
				franchize: { type:Sequelize.STRING   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "contrat",
				modelName: "contrat",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'ref_contrat', 
			'date', 
			'observation', 
			'remise', 
			'franchize', 
			'date_created', 
			'date_updated'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'ref_contrat', 
			'date', 
			'observation', 
			'remise', 
			'franchize', 
			'date_created', 
			'date_updated'
		];
	}

	static viewFields() {
		return [
			'id', 
			'ref_contrat', 
			'date', 
			'observation', 
			'remise', 
			'franchize', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'ref_contrat', 
			'date', 
			'observation', 
			'remise', 
			'franchize', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'ref_contrat', 
			'date', 
			'observation', 
			'remise', 
			'franchize', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("ref_contrat LIKE :search"), 
			Sequelize.literal("observation LIKE :search"), 
			Sequelize.literal("remise LIKE :search"), 
			Sequelize.literal("franchize LIKE :search"),
		];
	}

	
	
}
Contrat.init();
export default Contrat;
