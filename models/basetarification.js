
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class BaseTarification extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				designation: { type:Sequelize.STRING   },
				dt_application: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				periodicite: { type:Sequelize.STRING   },
				montant: { type:Sequelize.STRING   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   },
				dt_fin: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') },
				id_residence: { type:Sequelize.INTEGER   },
				id_type_chambre: { type:Sequelize.INTEGER   }
			}, 
			{ 
				sequelize,
				
				tableName: "base_tarification",
				modelName: "base_tarification",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'montant', 
			'date_created', 
			'date_updated', 
			'dt_fin', 
			'id_residence', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'montant', 
			'date_created', 
			'date_updated', 
			'dt_fin', 
			'id_residence', 
			'id'
		];
	}

	static viewFields() {
		return [
			'code', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'montant', 
			'date_created', 
			'date_updated', 
			'id', 
			'dt_fin', 
			'id_residence',
			'id_type_chambre'
		];
	}

	static exportViewFields() {
		return [
			'code', 
			'designation', 
			'dt_application', 
			'periodicite', 
			'montant', 
			'date_created', 
			'date_updated', 
			'id', 
			'dt_fin', 
			'id_residence',
			'id_type_chambre'
		];
	}

	static editFields() {
		return [
			'code', 
			'designation', 
			'dt_application', 
			'dt_fin', 
			'periodicite', 
			'montant', 
			'id_residence', 
			'id',
			'id_type_chambre'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("designation LIKE :search"), 
			Sequelize.literal("periodicite LIKE :search"), 
			Sequelize.literal("montant LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
BaseTarification.init();
export default BaseTarification;
