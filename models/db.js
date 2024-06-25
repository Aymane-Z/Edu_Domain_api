
import { Sequelize, sequelize } from './basemodel.js';

// Override timezone formatting
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss');
};

import Applogs from './applogs.js';
import BaseTarification from './basetarification.js';
import Batiment from './batiment.js';
import Batimentdetails from './batimentdetails.js';
import Chambre from './chambre.js';
import Chambredetails from './chambredetails.js';
import Client from './client.js';
import Contrat from './contrat.js';
import Couloir from './couloir.js';
import Couloirdetails from './couloirdetails.js';
import DemandeLogement from './demandelogement.js';
import DossierLocation from './dossierlocation.js';
import Encaissement from './encaissement.js';
import Encaissementdetails from './encaissementdetails.js';
import EncaissementExterne from './encaissementexterne.js';
import Equipement from './equipement.js';
import Etage from './etage.js';
import EtatUnite from './etatunite.js';
import Facturation from './facturation.js';
import Facture from './facture.js';
import FamilleEquipement from './familleequipement.js';
import FamilleUnite from './familleunite.js';
import Freerentalunits from './freerentalunits.js';
import Garant from './garant.js';
import Garantie from './garantie.js';
import InfosCompDemande from './infoscompdemande.js';
import LectureDesIndex from './lecturedesindex.js';
import LignesFacture from './lignesfacture.js';
import Listmenus from './listmenus.js';
import Pavillon from './pavillon.js';
import Pavillondetails from './pavillondetails.js';
import Permissionsnode from './permissionsnode.js';
import Proprietaire from './proprietaire.js';
import Reclamation from './reclamation.js';
import Residence from './residence.js';
import Responsable from './responsable.js';
import Roles from './roles.js';
import Tarification from './tarification.js';
import UniteLocation from './unitelocation.js';
import Unitelocationdetails from './unitelocationdetails.js';
import Usersnode from './usersnode.js';


Batiment.belongsTo(Batimentdetails, { foreignKey: 'id', as: 'batimentdetails' });

Batiment.belongsTo(Residence, { foreignKey: 'id_residence', as: 'residence' });

Batiment.belongsTo(Batimentdetails, { foreignKey: 'id', as: 'batimentdetails2' });

Batiment.belongsTo(Residence, { foreignKey: 'id_residence', as: 'residence2' });

Batimentdetails.belongsTo(Proprietaire, { foreignKey: 'id_proprietaire', as: 'proprietaire' });

Batimentdetails.belongsTo(Responsable, { foreignKey: 'id_responsable', as: 'responsable' });

Batimentdetails.belongsTo(Residence, { foreignKey: 'id_residence', as: 'residence' });

Chambre.belongsTo(Chambredetails, { foreignKey: 'id', as: 'chambredetails' });

Chambre.belongsTo(Couloir, { foreignKey: 'id_couloir', as: 'couloir' });

Chambre.belongsTo(FamilleUnite, { foreignKey: 'id_type', as: 'famille_unite' });

Chambre.belongsTo(Chambredetails, { foreignKey: 'id', as: 'chambredetails2' });

Chambre.belongsTo(Couloir, { foreignKey: 'id_couloir', as: 'couloir2' });

Chambre.belongsTo(FamilleUnite, { foreignKey: 'id_type', as: 'famille_unite2' });

Couloir.belongsTo(Couloirdetails, { foreignKey: 'id', as: 'couloirdetails' });

Couloir.belongsTo(Pavillon, { foreignKey: 'id_pavillon', as: 'pavillon' });

Couloir.belongsTo(Couloirdetails, { foreignKey: 'id', as: 'couloirdetails2' });

Couloir.belongsTo(Pavillon, { foreignKey: 'id_pavillon', as: 'pavillon2' });

DemandeLogement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

DossierLocation.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

DossierLocation.belongsTo(Contrat, { foreignKey: 'id_contrat', as: 'contrat' });

DossierLocation.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

DossierLocation.belongsTo(Contrat, { foreignKey: 'id_contrat', as: 'contrat2' });

Encaissement.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

Encaissement.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode2' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture2' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

Encaissement.belongsTo(Encaissementdetails, { foreignKey: 'id', as: 'encaissementdetails' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode3' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture3' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location3' });

Encaissement.belongsTo(Encaissementdetails, { foreignKey: 'id', as: 'encaissementdetails2' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode4' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture4' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location4' });

Encaissement.belongsTo(Encaissementdetails, { foreignKey: 'id', as: 'encaissementdetails3' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode5' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture5' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location5' });

Encaissement.belongsTo(Encaissementdetails, { foreignKey: 'id', as: 'encaissementdetails4' });

Encaissement.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode6' });

Encaissement.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture6' });

Encaissement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location6' });

Equipement.belongsTo(FamilleEquipement, { foreignKey: 'id_famille_equipement', as: 'famille_equipement' });

Equipement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

Equipement.belongsTo(FamilleEquipement, { foreignKey: 'id_famille_equipement', as: 'famille_equipement2' });

Equipement.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

Etage.belongsTo(Pavillon, { foreignKey: 'id_pavillon', as: 'pavillon' });

Etage.belongsTo(Pavillon, { foreignKey: 'id_pavillon', as: 'pavillon2' });

EtatUnite.belongsTo(UniteLocation, { foreignKey: 'id_unitelocation', as: 'unite_location' });

Facture.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

Facture.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

Facture.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

Facture.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

Garantie.belongsTo(Garant, { foreignKey: 'id_garant', as: 'garant' });

Garantie.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

Garantie.belongsTo(Garant, { foreignKey: 'id_garant', as: 'garant2' });

Garantie.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

InfosCompDemande.belongsTo(DemandeLogement, { foreignKey: 'id_demande_logement', as: 'demande_logement' });

LectureDesIndex.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

LectureDesIndex.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

LectureDesIndex.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

LectureDesIndex.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

LignesFacture.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture' });

LignesFacture.belongsTo(BaseTarification, { foreignKey: 'id_base_tarif', as: 'base_tarification' });

LignesFacture.belongsTo(Facture, { foreignKey: 'id_facture', as: 'facture2' });

LignesFacture.belongsTo(BaseTarification, { foreignKey: 'id_base_tarif', as: 'base_tarification2' });

Pavillon.belongsTo(Pavillondetails, { foreignKey: 'id', as: 'pavillondetails' });

Pavillon.belongsTo(Batiment, { foreignKey: 'id_batiment', as: 'batiment' });

Pavillon.belongsTo(Pavillondetails, { foreignKey: 'id', as: 'pavillondetails2' });

Pavillon.belongsTo(Batiment, { foreignKey: 'id_batiment', as: 'batiment2' });

Permissionsnode.belongsTo(Roles, { foreignKey: 'role_id', as: 'roles' });

Reclamation.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });

Reclamation.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

Reclamation.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode' });

Reclamation.belongsTo(Client, { foreignKey: 'id_client', as: 'client2' });

Reclamation.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

Reclamation.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode2' });

Reclamation.belongsTo(Client, { foreignKey: 'id_client', as: 'client3' });

Reclamation.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location3' });

Reclamation.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode3' });

Reclamation.belongsTo(Client, { foreignKey: 'id_client', as: 'client4' });

Reclamation.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location4' });

Reclamation.belongsTo(Usersnode, { foreignKey: 'user_id', as: 'usersnode4' });

Residence.belongsTo(Responsable, { foreignKey: 'id_responsable', as: 'responsable' });

Residence.belongsTo(Proprietaire, { foreignKey: 'id_proprietaire', as: 'proprietaire' });

Residence.belongsTo(Proprietaire, { foreignKey: 'id_proprietaire', as: 'proprietaire2' });

Tarification.belongsTo(BaseTarification, { foreignKey: 'id_base_tarif', as: 'base_tarification' });

Tarification.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location' });

Tarification.belongsTo(BaseTarification, { foreignKey: 'id_base_tarif', as: 'base_tarification2' });

Tarification.belongsTo(UniteLocation, { foreignKey: 'id_unite_location', as: 'unite_location2' });

UniteLocation.belongsTo(Unitelocationdetails, { foreignKey: 'id', as: 'unitelocationdetails' });

UniteLocation.belongsTo(Chambre, { foreignKey: 'id_chambre', as: 'chambre' });

UniteLocation.belongsTo(Unitelocationdetails, { foreignKey: 'id', as: 'unitelocationdetails2' });

UniteLocation.belongsTo(Chambre, { foreignKey: 'id_chambre', as: 'chambre2' });

UniteLocation.belongsTo(Freerentalunits, { foreignKey: 'id', as: 'freerentalunits' });

Unitelocationdetails.belongsTo(FamilleUnite, { foreignKey: 'id_typechambre', as: 'famille_unite' });

Unitelocationdetails.belongsTo(EtatUnite, { foreignKey: 'id', as: 'etat_unite' });

Unitelocationdetails.belongsTo(FamilleUnite, { foreignKey: 'id_typechambre', as: 'famille_unite2' });

Usersnode.belongsTo(Roles, { foreignKey: 'user_role_id', as: 'roles' });

Usersnode.belongsTo(Roles, { foreignKey: 'user_role_id', as: 'roles2' });


const op = Sequelize.Op;
const raw = Sequelize.literal; // use to include raw expression

const filterBy = function(expression, value){
	return sequelize.where(raw(expression), value);
}

// convinient functions for performing raw queries 
// return different value types

function rawQuery(queryText, options){
	return sequelize.query(queryText, options);
}

async function rawQueryList(queryText, queryParams){
	const records = await rawQuery(queryText, { replacements: queryParams, type: Sequelize.QueryTypes.SELECT });
	return records;
}

async function rawQueryOne(queryText, queryParams){
	const records = await rawQueryList(queryText, queryParams);
	return records[0] || null;
}

async function rawQueryValue(queryText, queryParams){
	const record = await rawQueryOne(queryText, queryParams);
	if(record){
		return Object.values(record)[0];
	}
	return null;
}

function getOrderBy(req, sortField = null, sortType = 'desc'){
	const orderBy = req.query.orderby || sortField;
	const orderType = req.query.ordertype || sortType;
	if (orderBy) {
		let order = raw(`${orderBy} ${orderType}`);
		return [[order]];
	}
	return null;
}

export default {
	sequelize,
	op,
	filterBy,
	raw,
	rawQuery,
	rawQueryList,
	rawQueryOne,
	rawQueryValue,
	getOrderBy,
	Applogs,
	BaseTarification,
	Batiment,
	Batimentdetails,
	Chambre,
	Chambredetails,
	Client,
	Contrat,
	Couloir,
	Couloirdetails,
	DemandeLogement,
	DossierLocation,
	Encaissement,
	Encaissementdetails,
	EncaissementExterne,
	Equipement,
	Etage,
	EtatUnite,
	Facturation,
	Facture,
	FamilleEquipement,
	FamilleUnite,
	Freerentalunits,
	Garant,
	Garantie,
	InfosCompDemande,
	LectureDesIndex,
	LignesFacture,
	Listmenus,
	Pavillon,
	Pavillondetails,
	Permissionsnode,
	Proprietaire,
	Reclamation,
	Residence,
	Responsable,
	Roles,
	Tarification,
	UniteLocation,
	Unitelocationdetails,
	Usersnode
}
