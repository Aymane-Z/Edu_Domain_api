import express from 'express';
import compression from 'compression';
import cors from 'cors';
import ejs from 'ejs';
import config from './config.js';
import extendExpressMiddleware from './helpers/express_middleware.js';
import { passportJwtLogin, authMiddleware } from './helpers/auth_middleware.js';
import AuthController from './controllers/auth.js';
import AccountController from './controllers/account.js';
import HomeController from './controllers/home.js';
import ComponentsDataController from './controllers/components_data.js';
import FileUploaderController from './controllers/fileuploader.js';
import S3UploaderController from './controllers/s3uploader.js';
import ApplogsController from  './controllers/applogs.js';
import BaseTarificationController from  './controllers/basetarification.js';
import BatimentController from  './controllers/batiment.js';
import BatimentdetailsController from  './controllers/batimentdetails.js';
import ChambreController from  './controllers/chambre.js';
import ChambredetailsController from  './controllers/chambredetails.js';
import ClientController from  './controllers/client.js';
import ContratController from  './controllers/contrat.js';
import CouloirController from  './controllers/couloir.js';
import CouloirdetailsController from  './controllers/couloirdetails.js';
import DemandeLogementController from  './controllers/demandelogement.js';
import DossierLocationController from  './controllers/dossierlocation.js';
import EncaissementController from  './controllers/encaissement.js';
import EncaissementdetailsController from  './controllers/encaissementdetails.js';
import EncaissementExterneController from  './controllers/encaissementexterne.js';
import EquipementController from  './controllers/equipement.js';
import EtageController from  './controllers/etage.js';
import EtatUniteController from  './controllers/etatunite.js';
import FacturationController from  './controllers/facturation.js';
import FactureController from  './controllers/facture.js';
import FamilleEquipementController from  './controllers/familleequipement.js';
import FamilleUniteController from  './controllers/familleunite.js';
import FreerentalunitsController from  './controllers/freerentalunits.js';
import GarantController from  './controllers/garant.js';
import GarantieController from  './controllers/garantie.js';
import InfosCompDemandeController from  './controllers/infoscompdemande.js';
import LectureDesIndexController from  './controllers/lecturedesindex.js';
import LignesFactureController from  './controllers/lignesfacture.js';
import ListmenusController from  './controllers/listmenus.js';
import PavillonController from  './controllers/pavillon.js';
import PavillondetailsController from  './controllers/pavillondetails.js';
import PermissionsnodeController from  './controllers/permissionsnode.js';
import ProprietaireController from  './controllers/proprietaire.js';
import ReclamationController from  './controllers/reclamation.js';
import ResidenceController from  './controllers/residence.js';
import ResponsableController from  './controllers/responsable.js';
import RolesController from  './controllers/roles.js';
import TarificationController from  './controllers/tarification.js';
import UniteLocationController from  './controllers/unitelocation.js';
import UnitelocationdetailsController from  './controllers/unitelocationdetails.js';
import UsersnodeController from  './controllers/usersnode.js';
import Stripe from 'stripe';

const stripe = Stripe('sk_test_VePHdqKTYQjKNInc7u56JBrQ');

const app = express();

const YOUR_DOMAIN = 'http://localhost:8050/index';


//set view engine use to return Html
app.set('views', 'views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
// compress all responses
app.use(compression({ threshold: 0 }));
//allow cors on localhost
app.use(cors()); // disable when deploy to production
app.use(express.static(config.app.publicDir))
app.use(express.json()) // Parses json, multi-part (file), url-encoded
app.use(express.urlencoded({ extended:true, limit:'50mb' }));
extendExpressMiddleware(app);
app.use(passportJwtLogin);
app.use('/api/', authMiddleware);

//bind page route to the controllers
app.use('/api/', HomeController);
app.use('/api/auth', AuthController);
app.use('/api/account', AccountController);
app.use('/api/applogs', ApplogsController);
app.use('/api/basetarification', BaseTarificationController);
app.use('/api/batiment', BatimentController);
app.use('/api/batimentdetails', BatimentdetailsController);
app.use('/api/chambre', ChambreController);
app.use('/api/chambredetails', ChambredetailsController);
app.use('/api/client', ClientController);
app.use('/api/contrat', ContratController);
app.use('/api/couloir', CouloirController);
app.use('/api/couloirdetails', CouloirdetailsController);
app.use('/api/demandelogement', DemandeLogementController);
app.use('/api/dossierlocation', DossierLocationController);
app.use('/api/encaissement', EncaissementController);
app.use('/api/encaissementdetails', EncaissementdetailsController);
app.use('/api/encaissementexterne', EncaissementExterneController);
app.use('/api/equipement', EquipementController);
app.use('/api/etage', EtageController);
app.use('/api/etatunite', EtatUniteController);
app.use('/api/facturation', FacturationController);
app.use('/api/facture', FactureController);
app.use('/api/familleequipement', FamilleEquipementController);
app.use('/api/familleunite', FamilleUniteController);
app.use('/api/freerentalunits', FreerentalunitsController);
app.use('/api/garant', GarantController);
app.use('/api/garantie', GarantieController);
app.use('/api/infoscompdemande', InfosCompDemandeController);
app.use('/api/lecturedesindex', LectureDesIndexController);
app.use('/api/lignesfacture', LignesFactureController);
app.use('/api/listmenus', ListmenusController);
app.use('/api/pavillon', PavillonController);
app.use('/api/pavillondetails', PavillondetailsController);
app.use('/api/permissionsnode', PermissionsnodeController);
app.use('/api/proprietaire', ProprietaireController);
app.use('/api/reclamation', ReclamationController);
app.use('/api/residence', ResidenceController);
app.use('/api/responsable', ResponsableController);
app.use('/api/roles', RolesController);
app.use('/api/tarification', TarificationController);
app.use('/api/unitelocation', UniteLocationController);
app.use('/api/unitelocationdetails', UnitelocationdetailsController);
app.use('/api/usersnode', UsersnodeController);
app.use('/api/components_data', ComponentsDataController);
app.use('/api/fileuploader', FileUploaderController);
app.use('/api/s3uploader', S3UploaderController);
app.get('*', function(req, res){
    res.status(404).json("Page not found");
});





app.post('/create-checkout-session', async (req, res) => {
    const nexturl=req.query.next;
    console.log("HHHHEEEEEERREEE ISS THE URL ------------------------------ §§§§§§§§§§§§§§§§§§§§§§§§ ", nexturl);
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity 
          quantity: 1,
  
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/paymentsuccess?success=true&session_id={CHECKOUT_SESSION_ID}&next=${nexturl}`,
      cancel_url: `${YOUR_DOMAIN}/paymentcancelled?canceled=true`,
    });
  
    res.redirect(303, session.url);
  });
  
  app.post('/create-portal-session', async (req, res) => {
    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database. 
    const { session_id } = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
  
    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = YOUR_DOMAIN;
  
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: returnUrl,
    });
  
    res.redirect(303, portalSession.url);
  });
  
  app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (request, response) => {
      let event = request.body;
      // Replace this endpoint secret with your endpoint's unique secret
      // If you are testing with the CLI, find the secret by running 'stripe listen'
      // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
      // at https://dashboard.stripe.com/webhooks
      const endpointSecret = 'whsec_12345';
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
          event = stripe.webhooks.constructEvent(
            request.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
      }
      let subscription;
      let status;
      // Handle the event
      switch (event.type) {
        case 'customer.subscription.trial_will_end':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription trial ending.
          // handleSubscriptionTrialEnding(subscription);
          break;
        case 'customer.subscription.deleted':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription deleted.
          // handleSubscriptionDeleted(subscriptionDeleted);
          break;
        case 'customer.subscription.created':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription created.
          // handleSubscriptionCreated(subscription);
          break;
        case 'customer.subscription.updated':
          subscription = event.data.object;
          status = subscription.status;
          console.log(`Subscription status is ${status}.`);
          // Then define and call a method to handle the subscription update.
          // handleSubscriptionUpdated(subscription);
          break;
        case 'entitlements.active_entitlement_summary.updated':
          subscription = event.data.object;
          console.log(`Active entitlement summary updated for ${subscription}.`);
          // Then define and call a method to handle active entitlement summary updated
          // handleEntitlementUpdated(subscription);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
      // Return a 200 response to acknowledge receipt of the event
      response.send();
    }
  );





let port = 8060;
//start app
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port);
});