// const { Tests } = model("");
// const { Lessons } = model("");
// const { testSchema } = validate("TestValidator");
// const { checkCourse } = helper("CourseHelpers");
// const Razorpay = require('razorpay');
// const { Op } = require('sequelize');
// const crypto = require('crypto');



// module.exports = class PaymentController {




    // GET RAZORPAY SECRET KEY //

    // async getSecretKey(req, res) {

    //     try {
    //         return res.json({ 'status': 'success', 'key': env('RAZORPAY_KEY_ID') });
    //     } catch (err) {
    //         return res.status(500).json({ 'status': 'failed', 'message': err.message })
    //     };
    // };




    // PAYMENT FOR STUDENT ENROLLMENT //

    // async setPayment(req, res) {
    //     try {
    //         const hmac = crypto.createHmac('sha256', req.body.order_id);
    //         hmac.update(req.body.order_id);
    //         const digest = hmac.digest('hex');
    //         const razorpay_signature = Buffer.from(digest).toString('base64');
    //         return res.json({ 'status': 'success', 'razorpay_signature': razorpay_signature });
    //     } catch (err) {
    //         return res.status(500).json({ 'status': 'failed', 'message': err.message })
    //     };
    // };





// };