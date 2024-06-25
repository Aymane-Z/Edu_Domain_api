
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Applogs extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				old_values: { type:Sequelize.STRING   },
				new_values: { type:Sequelize.STRING   },
				event: { type:Sequelize.STRING   },
				auditable_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				auditable_type: { type:Sequelize.STRING   },
				user_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_type: { type:Sequelize.STRING   },
				tags: { type:Sequelize.STRING   },
				ip_address: { type:Sequelize.STRING   },
				user_agent: { type:Sequelize.STRING   },
				url: { type:Sequelize.STRING   },
				updated_at: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				created_at: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "applogs",
				modelName: "applogs",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'old_values', 
			'new_values', 
			'event', 
			'auditable_id', 
			'auditable_type', 
			'user_id', 
			'user_type', 
			'tags', 
			'ip_address', 
			'user_agent', 
			'url', 
			'updated_at', 
			'created_at'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'old_values', 
			'new_values', 
			'event', 
			'auditable_id', 
			'auditable_type', 
			'user_id', 
			'user_type', 
			'tags', 
			'ip_address', 
			'user_agent', 
			'url', 
			'updated_at', 
			'created_at'
		];
	}

	static viewFields() {
		return [
			'id', 
			'old_values', 
			'new_values', 
			'event', 
			'auditable_id', 
			'auditable_type', 
			'user_id', 
			'user_type', 
			'tags', 
			'ip_address', 
			'user_agent', 
			'url', 
			'updated_at', 
			'created_at'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'old_values', 
			'new_values', 
			'event', 
			'auditable_id', 
			'auditable_type', 
			'user_id', 
			'user_type', 
			'tags', 
			'ip_address', 
			'user_agent', 
			'url', 
			'updated_at', 
			'created_at'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("old_values LIKE :search"), 
			Sequelize.literal("new_values LIKE :search"), 
			Sequelize.literal("event LIKE :search"), 
			Sequelize.literal("auditable_type LIKE :search"), 
			Sequelize.literal("user_type LIKE :search"), 
			Sequelize.literal("tags LIKE :search"), 
			Sequelize.literal("ip_address LIKE :search"), 
			Sequelize.literal("user_agent LIKE :search"), 
			Sequelize.literal("url LIKE :search"),
		];
	}

	
	
}
Applogs.init();
export default Applogs;
