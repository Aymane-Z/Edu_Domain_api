
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class InfosCompDemande extends BaseModel {
	static init() {
		return super.init(
			{
				
				id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				id_demande_logement: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				ancienne_cite: { type:Sequelize.STRING   },
				periode_ancienne_cite: { type:Sequelize.STRING   },
				source_decouverte: { type:Sequelize.STRING   },
				annee_residence_precedente: { type:Sequelize.STRING   },
				type_chambre: { type:Sequelize.STRING   },
				numero_chambre: { type:Sequelize.STRING   },
				groupe_sanguin: { type:Sequelize.STRING   },
				maladies_allergies: { type:Sequelize.STRING   },
				nom_contact_personne: { type:Sequelize.STRING   },
				tel_contact_personne: { type:Sequelize.STRING   },
				date: { type:Sequelize.DATEONLY  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "infos_comp_demande",
				modelName: "infos_comp_demande",
			}
		);
	}
	
	static listFields() {
		return [
			'id', 
			Sequelize.literal('`demande_logement`.`code_demande` AS `demandelogement_code_demande`'), 
			'id_demande_logement', 
			'ancienne_cite', 
			'periode_ancienne_cite', 
			'source_decouverte', 
			'annee_residence_precedente', 
			'type_chambre', 
			'numero_chambre', 
			'groupe_sanguin', 
			'maladies_allergies', 
			'nom_contact_personne', 
			'tel_contact_personne', 
			'date'
		];
	}

	static exportListFields() {
		return [
			'id', 
			Sequelize.literal('`demande_logement`.`code_demande` AS `demandelogement_code_demande`'), 
			'id_demande_logement', 
			'ancienne_cite', 
			'periode_ancienne_cite', 
			'source_decouverte', 
			'annee_residence_precedente', 
			'type_chambre', 
			'numero_chambre', 
			'groupe_sanguin', 
			'maladies_allergies', 
			'nom_contact_personne', 
			'tel_contact_personne', 
			'date'
		];
	}

	static viewFields() {
		return [
			'id', 
			'id_demande_logement', 
			'ancienne_cite', 
			'periode_ancienne_cite', 
			'source_decouverte', 
			'annee_residence_precedente', 
			'type_chambre', 
			'numero_chambre', 
			'groupe_sanguin', 
			'maladies_allergies', 
			'nom_contact_personne', 
			'tel_contact_personne', 
			'date'
		];
	}

	static exportViewFields() {
		return [
			'id', 
			'id_demande_logement', 
			'ancienne_cite', 
			'periode_ancienne_cite', 
			'source_decouverte', 
			'annee_residence_precedente', 
			'type_chambre', 
			'numero_chambre', 
			'groupe_sanguin', 
			'maladies_allergies', 
			'nom_contact_personne', 
			'tel_contact_personne', 
			'date'
		];
	}

	static editFields() {
		return [
			'ancienne_cite', 
			'periode_ancienne_cite', 
			'source_decouverte', 
			'annee_residence_precedente', 
			'type_chambre', 
			'numero_chambre', 
			'groupe_sanguin', 
			'maladies_allergies', 
			'nom_contact_personne', 
			'tel_contact_personne', 
			'id_demande_logement', 
			'id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("id LIKE :search"), 
			Sequelize.literal("ancienne_cite LIKE :search"), 
			Sequelize.literal("periode_ancienne_cite LIKE :search"), 
			Sequelize.literal("source_decouverte LIKE :search"), 
			Sequelize.literal("type_chambre LIKE :search"), 
			Sequelize.literal("numero_chambre LIKE :search"), 
			Sequelize.literal("groupe_sanguin LIKE :search"), 
			Sequelize.literal("maladies_allergies LIKE :search"), 
			Sequelize.literal("nom_contact_personne LIKE :search"), 
			Sequelize.literal("tel_contact_personne LIKE :search"),
		];
	}

	
	
}
InfosCompDemande.init();
export default InfosCompDemande;
