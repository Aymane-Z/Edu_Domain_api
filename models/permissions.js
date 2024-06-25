
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Permissions extends BaseModel {
	static init() {
		return super.init(
			{
				
				permission_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				role_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				page_name: { type:Sequelize.STRING   },
				action_name: { type:Sequelize.STRING   },
				permission: { type:Sequelize.STRING   }
			}, 
			{ 
				sequelize,
				
				tableName: "permissions",
				modelName: "permissions",
			}
		);
	}
	
	static listFields() {
		return [
			'permission_id', 
			'role_id', 
			'page_name', 
			'action_name', 
			'permission'
		];
	}

	static exportListFields() {
		return [
			'permission_id', 
			'role_id', 
			'page_name', 
			'action_name', 
			'permission'
		];
	}

	static viewFields() {
		return [
			'permission_id', 
			'role_id', 
			'page_name', 
			'action_name', 
			'permission'
		];
	}

	static exportViewFields() {
		return [
			'permission_id', 
			'role_id', 
			'page_name', 
			'action_name', 
			'permission'
		];
	}

	static editFields() {
		return [
			'permission_id', 
			'role_id', 
			'page_name', 
			'action_name', 
			'permission'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("permission_id LIKE :search"), 
			Sequelize.literal("page_name LIKE :search"), 
			Sequelize.literal("action_name LIKE :search"), 
			Sequelize.literal("permission LIKE :search"),
		];
	}

	
	
}
Permissions.init();
export default Permissions;
