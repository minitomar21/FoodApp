const {SK} = require('../secret');
const userModel = require('../models/userModel');
const planModel = require("../models/planModel")
// SK is your test secret API key.
const stripe = require('stripe')(SK);


module.exports.createSession = async function createSession(){
    try {
        let userId = req.id;
        let planId = req.params.id;

        const user = await userModel.findById(userId)
        const plan = await planModel.findById(planId)

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            customer_email: user.email,
            client_refernce_id: plan.id,
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                name:plan.name,
                description: plan.description,
                amount:plan.price*100,
                currency: 'inr',
                quantity: 1,
              },
            ],
            success_url: `${req.protocol}://${req.get("host")}/profile`,
            cancel_url: `${req.protocol}://${req.get("host")}/profile`,
          });
        
          res.status(303).json({
              status: "success",
              session
          });
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
