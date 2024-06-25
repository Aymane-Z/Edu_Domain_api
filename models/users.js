
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Users extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				user_id: { type:Sequelize.STRING   },
				username: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				email: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				password: { type:Sequelize.STRING   },
				date_registered: { type:Sequelize.DATEONLY , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				photo: { type:Sequelize.STRING   },
				user_role: { type:Sequelize.STRING , allowNull: false ,defaultValue: Sequelize.literal('DEFAULT') },
				date_created: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				date_updated: { type:Sequelize.DATE  ,defaultValue: Sequelize.literal('DEFAULT') },
				user_role_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "users",
				modelName: "users",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			'user_id', 
			'username', 
			'email', 
			'date_registered', 
			'photo', 
			'user_role', 
			'date_created', 
			'date_updated', 
			'user_role_id'
		];
	}

	static exportListFields() {
		return [
			'id', 
			'user_id', 
			'username', 
			'email', 
			'date_registered', 
			'photo', 
			'user_role', 
			'date_created', 
			'date_updated', 
			'user_role_id'
		];
	}

	static viewFields() {
		return [
			'id', 
			'user_id', 
			'username', 
			'email', 
			'date_registered', 
			'photo', 
			'user_role', 
			'date_created', 
			'date_updated', 
			'user_role_id'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'user_id', 
			'username', 
			'email', 
			'date_registered', 
			'photo', 
			'user_role', 
			'date_created', 
			'date_updated', 
			'user_role_id'
		];
	}

	static editFields() {
		return [
			'id', 
			'user_id', 
			'username', 
			'email', 
			'date_registered', 
			'photo', 
			'user_role', 
			'user_role_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("user_id LIKE :search"), 
			Sequelize.literal("username LIKE :search"), 
			Sequelize.literal("email LIKE :search"), 
			Sequelize.literal("user_role LIKE :search"), 
			Sequelize.literal("password LIKE :search"),
		];
	}

	
	
}
Users.init();
export default Users;
