
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Etage extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				code: { type:Sequelize.STRING   },
				denomination: { type:Sequelize.STRING   },
				description: { type:Sequelize.STRING   },
				nombre_chambres: { type:Sequelize.INTEGER   },
				acces_handicape: { type:Sequelize.INTEGER   },
				amenagements_speciaux: { type:Sequelize.STRING   },
				id_pavillon: { type:Sequelize.INTEGER   },
				date_created: { type:Sequelize.DATE   },
				date_updated: { type:Sequelize.DATE   }
			}, 
			{ 
				sequelize,
				
				tableName: "etage",
				modelName: "etage",timestamps:true,
				createdAt: 'date_updated',updatedAt: 'date_created',
				
			}
		);
	}
	
	static listFields() {
		return [
			'code', 
			'denomination', 
			'description', 
			'nombre_chambres', 
			'acces_handicape', 
			'amenagements_speciaux', 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			'id_pavillon', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static exportListFields() {
		return [
			'code', 
			'denomination', 
			'description', 
			'nombre_chambres', 
			'acces_handicape', 
			'amenagements_speciaux', 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			'id_pavillon', 
			'date_created', 
			'date_updated', 
			'id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'description', 
			'nombre_chambres', 
			'acces_handicape', 
			'amenagements_speciaux', 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			'id_pavillon', 
			'date_created', 
			'date_updated'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'code', 
			'denomination', 
			'description', 
			'nombre_chambres', 
			'acces_handicape', 
			'amenagements_speciaux', 
			Sequelize.literal('`pavillon`.`denomination` AS `pavillon_denomination`'), 
			'id_pavillon', 
			'date_created', 
			'date_updated'
		];
	}

	static editFields() {
		return [
			'code', 
			'denomination', 
			'description', 
			'nombre_chambres', 
			'acces_handicape', 
			'amenagements_speciaux', 
			'id_pavillon', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("code LIKE :search"), 
			Sequelize.literal("denomination LIKE :search"), 
			Sequelize.literal("description LIKE :search"), 
			Sequelize.literal("acces_handicape LIKE :search"), 
			Sequelize.literal("amenagements_speciaux LIKE :search"), 
			Sequelize.literal("id_pavillon LIKE :search"), 
			Sequelize.literal("id LIKE :search"),
		];
	}

	
	
}
Etage.init();
export default Etage;
